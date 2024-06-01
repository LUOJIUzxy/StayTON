import {collection, deleteDoc, doc, query, serverTimestamp, setDoc, where} from "firebase/firestore"
import {GlobalDB} from "@/plugins/google-fire-base"
import {docContentOf, resultOf} from "@/dataLayer/service/firebase/queryUtils"
import {getCurrentUserId} from "@/dataLayer/service/firebase/user"
import {getMyPayments} from "@/dataLayer/service/firebase/payment"
import dayjs from "dayjs"

export const pickupOrderPath = "pickupOrder"

const defaultPickupOrder = {
    nft_addr: "",
    flyToChina: true,
    takeoffDate: "",
    checkoutDate: "",
    takeoffCity: "",
    landingCity: "",
    smallPackagePrice: 0,
    filePrice: 0,
    appendInfo: "",
    contactInfo: "",
    authed: true,
    deleteAt: "",
    ticketUrl: "",
    arriveCity: "",
    leavingCity: "",
    idCardUrl: "",
    canTakeMedicine: false,
    canTakeLuxury: false
}

export async function addPickupOrder(flyToChina, takeoffDate, checkoutDate, takeoffCity, nft_addr,
                                     landingCity, smallPackagePrice, filePrice,
                                     appendInfo, contactInfo, ticketUrl, idCardUrl, arriveCity, leavingCity,
                                     canTakeMedicine, canTakeLuxury) {
    try {
        const newItemId = doc(collection(GlobalDB, pickupOrderPath))
        const newItem = Object.assign({
            id: newItemId.id, timestamp: serverTimestamp(), userId: getCurrentUserId(),
        }, defaultPickupOrder, {
            nft_addr,
            flyToChina,
            takeoffDate,
            checkoutDate,
            takeoffCity,
            landingCity,
            smallPackagePrice,
            filePrice,
            appendInfo,
            contactInfo,
            ticketUrl,
            idCardUrl, arriveCity, leavingCity,
            canTakeMedicine, canTakeLuxury
        })
        await setDoc(newItemId, newItem)
        console.log("ok")
        return newItemId.id
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function withdrawOrder(oldItem) {
    await setDoc(
        doc(GlobalDB, pickupOrderPath, oldItem.id),
        Object.assign(
            {},
            oldItem,
            {
                deleteAt: dayjs().toISOString()
            }))
}

export async function updatePickupOrder(oldItem, filePrice = null, smallPackagePrice = null) {
    await setDoc(
        doc(GlobalDB, pickupOrderPath, oldItem.id),
        Object.assign(
            {},
            oldItem,
            {
                filePrice: filePrice ?? oldItem.filePrice,
                smallPackagePrice: smallPackagePrice ?? oldItem.smallPackagePrice
            }))
}

export async function getMyOrders() {
    return await resultOf(query(
        collection(GlobalDB, pickupOrderPath),
        where("userId", "==", getCurrentUserId())))
}

export async function getMyPurchasedOrders() {
    const payments = await getMyPayments()
    return (await Promise.allSettled(payments.map(async it =>
        ({...await docContentOf(doc(GlobalDB, pickupOrderPath, it.pickupOrderId)), withInsurance: it.withInsurance}))))
        .map(that => that.value)

}


export async function removePickupOrder(itemId) {
    await deleteDoc(doc(GlobalDB, pickupOrderPath, itemId))
}


export async function getPickupOrder() {
    return await resultOf(collection(GlobalDB, pickupOrderPath))
}



