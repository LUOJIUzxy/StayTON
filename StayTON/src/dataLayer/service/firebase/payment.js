import {collection, doc, query, serverTimestamp, setDoc, where} from "firebase/firestore"
import {GlobalDB} from "@/plugins/google-fire-base"
import {getCurrentUserId} from "@/dataLayer/service/firebase/user"
import {resultOf} from "@/dataLayer/service/firebase/queryUtils"

export const paymentPath = "paymentPath"

const defaultPayment = {
    pickupOrderId: '',
    withInsurance: false

}

export async function addPayment(pickupOrderId) {
    try {
        const newItemId = doc(collection(GlobalDB, paymentPath))
        const newItem = Object.assign({
            id: newItemId.id, timestamp: serverTimestamp(), userId: getCurrentUserId(),
        }, defaultPayment, {
            pickupOrderId
        })
        await setDoc(newItemId, newItem)
        console.log("Document written with ID: ", newItemId.id)
        return newItemId.id
    } catch (e) {
        console.error("Error adding document: ", e)
        return null
    }
}


export async function getMyPayments() {
    return await resultOf(query(
        collection(GlobalDB, paymentPath),
        where("userId", "==", getCurrentUserId())))
}





