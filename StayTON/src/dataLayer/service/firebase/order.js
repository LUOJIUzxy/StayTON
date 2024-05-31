import {collection, deleteDoc, doc, query, serverTimestamp, setDoc, where} from "firebase/firestore"
import {docContentOf, resultOf} from "@/dataLayer/service/firebase/queryUtils"
import {getCurrentUserId} from "@/dataLayer/service/firebase/user"
import {getOneItem} from "@/dataLayer/service/firebase/item"
import {groupBy, orderBy, sortBy} from "lodash-es"
import {GlobalDB} from "@/plugins/google-fire-base"
import {addTran} from "@/dataLayer/service/firebase/transaction"

export async function addOrderInternal(itemId, price, quantity, side,
                                       type = OperationType.Add,
                                       userId = getCurrentUserId()) {
    const newOrderId = doc(collection(GlobalDB, "order"))
    await setDoc(newOrderId, {
        order_id: newOrderId.id,
        item_id: itemId,
        price: price,
        quantity: quantity,
        side: side,
        type: type,
        user_id: userId,
        timestamp: serverTimestamp(),
    })

}

export async function reduceOrder(itemId, price, quantity, side) {
    return addOrderInternal(itemId, price, quantity, side, OperationType.Del)
}

/**
 * 添加order
 * @param itemId
 * @param price
 * @param quantity
 * @param side
 * @return
 */
export async function addOrder(itemId, price, quantity, side) {

    addOrderInternal(itemId, price, quantity, side)
    const isBuy = side === 'buy'
    const sideReverse = (side === 'buy') ? 'sell' : 'buy'

    const q = query(collection(GlobalDB, "order"), where("item_id", "==", itemId))
    const items = (await resultOf(q)).filter(it => {
        return it.side === sideReverse && (isBuy ? it.price <= price : it.price >= price)
    })
    orderBy(items, ['price'], [isBuy ? 'asc' : 'desc'])

    const group = Object.values(groupBy(items, (it) => it.user_id + '!!!' + it.price)).map(it => {
        return it.reduce((obj, i) => {
            return {
                ...i, quantity: parseInt(obj?.quantity ?? 0) + parseInt(i.quantity)
            }
        }, null)
    }).filter(it => it.quantity > 0)

    let requiredQuantity = quantity

    for (const record of group) {
        const [buyer, seller] = isBuy ? [getCurrentUserId(), record.user_id] : [record.user_id, getCurrentUserId()]
        const insertQuantity = Math.min(requiredQuantity, record.quantity)
        const checkOutPrice = isBuy ? Math.min(record.price, price) : Math.max(record.price, price)
        await addTran(buyer, seller, itemId, checkOutPrice, insertQuantity)
        await addOrderInternal(
            itemId,
            record.price,
            -insertQuantity,
            sideReverse,
            OperationType.FullFilled,
            record.user_id)
        await addOrderInternal(itemId, price, -insertQuantity, side, OperationType.FullFilled)
        requiredQuantity -= insertQuantity
        if (requiredQuantity === 0) {
            break
        }
    }


}

export const SideOption = {
    Buy: 'buy', Sell: 'sell'
}

export const OperationType = {
    Add: 'Add', Del: 'Del', FullFilled: 'FullFilled'
}

/**
 * 删除order
 * @param orderId
 * @return
 */
export async function removeOrder(orderId) {
    await deleteDoc(doc(GlobalDB, "order", orderId))
}

/**
 * 查询orders list
 * @return {Promise<void>}
 */
export async function getUserOrderList() {
    return await resultOf(query(collection(GlobalDB, "order")
        , where("user_id",
            "==", getCurrentUserId())))
}


/**
 * 查询orders list
 * @return {Promise<void>}
 */
export async function getOrderList() {
    return await resultOf(collection(GlobalDB, "order"))
}

export async function getUserActiveOrderList() {
    const orderList = await getUserOrderList()
    return Object.values(groupBy(
        orderList,
        (it) => it.item_id + '!!!' + it.side + '!!!' + it.user_id + '!!!' + it.price)).map(it => {

        return it.reduce((obj, i) => {
            console.log(it.quantity)
            return {
                ...i, quantity: parseInt(obj?.quantity ?? 0) + parseInt(i.quantity)
            }
        }, null)
    }).filter(it => it.quantity > 0)
}

export function getOrderByList(orderList) {
    const list = Object.values(groupBy(orderList, (it) => it.item_id + '!!!' +
        it.side + '!!!' + it.user_id + '!!!' + it.price)).map(it => {

        return it.reduce((obj, i) => {
            return {
                ...i, quantity: parseInt(obj?.quantity ?? 0) + parseInt(i.quantity)
            }
        }, null)
    }).filter(it => it.quantity > 0)
    return sortBy(list, (it) => -it.timestamp.seconds)
}

export async function getActiveOrder() {
    const orderList = await getOrderList()
    return getOrderByList(orderList)

}


/**
 * 根据order_id查询一个order
 * @param orderId
 * @return {Promise<void>}
 */
export async function getOrderOne(orderId) {

    return await docContentOf(doc(GlobalDB, "order", orderId))

}

/**
 * 根据item_id，side(需要相反)查询order list，match用
 * @param itemId
 * @param side
 * @return {orders}
 */
export async function getItemDetail(itemId, side) {
    //array
    const orderList = await resultOf(query(
        collection(GlobalDB, "order"),
        where("item_id", "==", itemId),
        where('side', '==', side)))
    if (orderList.length === 0) {
        return {
            ...(await getOneItem(itemId)),
            orderList,
            totalStock: 0,
            minPrice: 0,
            maxPrice: 0,
            avgPrice: 0,
            minCount: 0
        }
    } else {
        const minPrice = Math.min(...orderList.map(it => it.price))
        return {
            ...(await getOneItem(itemId)),
            orderList,
            totalStock: orderList.reduce((sum, i) => sum + parseInt(i.quantity), 0),
            minPrice,
            maxPrice: Math.max(...orderList.map(it => it.price)),
            avgPrice: orderList.reduce((sum, i) => sum + parseFloat(i.price), 0) / parseFloat(orderList.length),
            minCount: orderList.filter(it => parseFloat(it.price) === parseFloat(minPrice)).reduce((sum,
                                                                                                    i) => sum + parseInt(
                i.quantity), 0)
        }
    }
}

/**
 * 买家给固定的quantity， 想要知道花最少钱的能买到这个固定数量的东西, 根据item_id，
 * @param itemId
 * @param quantity
 * @return price, quantity(不一定可以买完）
 */
export async function getMinPrice(itemId, quantity) {
    const itemDetail = await getItemDetail(itemId, "sell")

    let price = 0
    let count = 0

    if (itemDetail.totalStock <= quantity) {
        count = itemDetail.totalStock
        price = itemDetail.maxPrice
    } else {
        const arr = itemDetail.orderList
        sortBy(arr, 'price')

        for (const order of arr) {
            if (count < quantity) {
                count += order.quantity
            } else {
                price = order.price
                count = -1
                break
            }
        }

    }
    return {
        count, price
    }


}


/**
 * 查询一个用户的多个 未完成的(true) 已完成的(false) orders
 * @param userId
 * @param status
 * @return {Promise<void>}
 */
export async function getCombinedOrdersByUser(userId) {
    const orderSellList = await resultOf(
        collection(GlobalDB, "order"),
        where("user_id", "==", userId),
        where("side", "==", "sell"))
    //const orderBuyList = await resultOf(collection(GlobalDB, "order"), where("user_id", "==", userId), where("side", "==", "Buy"));

    console.log(orderSellList.filter((item) => orderSellList.includes(item.item_id)).reduce(
        (sum, i) => sum + i.quantity,
        0))
    //group by item_id and combine data
}
