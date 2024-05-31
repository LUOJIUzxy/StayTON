import {collection, deleteDoc, doc, query, setDoc, where} from "firebase/firestore";
import {GlobalDB} from "@/plugins/google-fire-base";
import {docContentOf, resultOf} from "@/dataLayer/service/firebase/queryUtils";
import {getCurrentUserId} from "@/dataLayer/service/firebase/user";
import {orderBy} from "lodash-es";

/**
 * 添加transaction
 * @param userSellId
 * @param userBuyId
 * @param itemId
 * @param price
 * @param quantity
 * @return
 */
export async function addTran(userBuyId, userSellId, itemId, price, quantity) {
    try {
        const newTranId = doc(collection(GlobalDB, "transaction"));

        await setDoc(newTranId, {
            transaction_id: newTranId.id,
            user_sell_id: userSellId,
            user_buy_id: userBuyId,
            item_id: itemId,
            price: price,
            quantity: quantity,
            status: 1,
            payment: 1,
            timestamp: Date.now(),
        });
        console.log("Document written with ID: ", newTranId);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

/**
 * 删除transaction
 * @param tranId
 * @return
 */
export async function removeTran(tranId) {

    await deleteDoc(doc(GlobalDB, "transaction", tranId));

}

/**
 * 根据transaction_id查询一个transaction
 * @param tranId
 * @return {Promise<void>}
 */
export async function getTranOne(tranId) {
    // const docRef = doc(GlobalDB, "transaction", tranId);
    // const docSnap = await getDoc(docRef);
    //
    // if (docSnap.exists()) {
    //     console.log("Document data:", docSnap.data());
    // } else {
    //     // doc.data() will be undefined in this case
    //     console.log("No such document!");
    // }
    // return docSnap;
    return await docContentOf(doc(GlobalDB, "transaction", tranId));
}

/**
 * 根据item_id查询transactions list
 * @param itemId
 * @param side
 * @return {orders}
 */
export async function getTransByItem(itemId) {
    //const q = query(collection(GlobalDB, "transaction"), where("item_id", "==", itemId));
    //
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     console.log(doc.id, " => ", doc.data());
    // });
    // return querySnapshot;
    return await resultOf(query(collection(GlobalDB, "transaction"), where("item_id", "==", itemId)));
}

/**
 * 查询用户的多个transactions
 * @param userId
 * @return {Promise<void>}
 */
export async function getTransByUser() {
    const userId = getCurrentUserId()
    const result1 = await resultOf(query(collection(GlobalDB, "transaction"),
        where("user_sell_id", "==", userId)))
    const result2 = await resultOf(query(collection(GlobalDB, "transaction"),
        where("user_buy_id", "==", userId)))
    const res = [...result1, ...result2]
    orderBy(res, [(it) => it.timestamp.seconds], ['desc'])
    return res


}
