import {collection, deleteDoc, doc, setDoc} from "firebase/firestore";
import {GlobalDB} from "@/plugins/google-fire-base";

/**
 * 添加tag
 * @param tagName
 * @return
 */
export async function addTag(tagName) {
    try {
        const newTagId = doc(collection(GlobalDB, "tag"));
        await setDoc(newTagId, {
            tag_id: newTagId.id,
            tag_name: tagName,
            timestamp: Date.now(),
        });
        console.log("Document written with ID: ", newTagId);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

/**
 * 删除tag
 * @param tagId
 * @return
 */
export async function removeTag(tagId) {

    await deleteDoc(doc(GlobalDB, "tag", tagId));

}

  
