import {collection, deleteDoc, doc, query, serverTimestamp, setDoc, where} from "firebase/firestore";
import {GlobalDB} from "@/plugins/google-fire-base";
import {docContentOf, resultOf} from "@/dataLayer/service/firebase/queryUtils";

/**
 * 添加item
 * @param itemName
 * @param desc
 * @param imageUrl
 * @param tagIds
 * @return
 */
export async function addItem(itemName, desc, imageUrl, tagIds) {
    try {
        const newItemId = doc(collection(GlobalDB, "item"));

        await setDoc(newItemId, {
            item_id: newItemId.id,
            item_name: itemName,
            description: desc,
            imageUrl: imageUrl,
            tag_id: tagIds,
            timestamp: serverTimestamp(),
        });
        console.log("Document written with ID: ", newItemId.id);
        return newItemId.id
    } catch (e) {
        console.error("Error adding document: ", e);
        return null
    }
}

/**
 * 删除item
 * @param itemId
 * @return
 */
export async function removeItem(itemId) {

    await deleteDoc(doc(GlobalDB, "item", itemId));

}

/**
 * 查询items list
 * @return {Promise<void>}
 */
export async function getItems() {
    return await resultOf(collection(GlobalDB, "item"));
}

/**
 * 查询单个item
 * @param itemId
 * @return {Promise<void>}
 */
export async function getOneItem(itemId) {
    return await docContentOf(doc(GlobalDB, "item", itemId));
}

/**
 * 查询单个item by tag
 * @param tagId
 * @return {Promise<void>}
 */
export async function getItemsByTag(tagId) {

    return await resultOf(query(collection(GlobalDB, "item"), where("tag_id", "==", tagId)));

}


