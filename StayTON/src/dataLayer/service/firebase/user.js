import {collection, deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore'
import {FireBaseAuth, FireBaseStore} from '@/plugins/google-fire-base'
import {getDatabase, ref, set} from "firebase/database";
import {GlobalDB} from "@/plugins/google-fire-base";

const userDBPath = 'user'

/**
 * 注意！！请只在FireBase提供的Hook中调用本函数
 * @param id
 * @param displayName
 * @return {Promise<void>}
 */
export async function login(id, displayName) {
    await setDoc(doc(FireBaseStore, userDBPath, id), {id, displayName})
}


export function getCurrentUserId() {
    return FireBaseAuth.currentUser?.uid
}
 
export function getCurrentUser() {
    return FireBaseAuth.currentUser
}

/**
 * 添加用户
 * @param name
 * @param email
 * @param psw
 * @param balance
 * @return
 */
export function writeUserData(name, email, psw, balance) {
    try {
        const newUserId = doc(collection(GlobalDB, "user"));

        const db = getDatabase();
        set(ref(db, 'user/' + newUserId), {
            user_id: newUserId.id,
            displayName: name,
            email: email,
            password: psw,
            balance: balance,
            timestamp: Date.now(),
        });
        console.log("Document written with ID: ", newUserId);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

/**
 * 删除user
 * @param userId
 * @return
 */
export async function removeItem(userId) {

    await deleteDoc(doc(GlobalDB, "user", userId));

}

/**
 * 查询用户
 * @return {Promise<void>}
 * ???auth
 * @param userId
 */
export async function getLoggedInUser(userId) {
    const docRef = doc(GlobalDB, "user", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    return docSnap;
}

/**
 * 更新用户余额
 * @param userId
 * @param balance
 * @return
 */
export async function updateUserBalance(userId, balance) {

    const docRef = doc(GlobalDB, "user", userId);
    const updates = {
        user_id: userId,
        email: docRef.email,
        password: docRef.password,
        displayName: docRef.displayName,
        timestamp: docRef.timestamp,
        balance: balance,
    }
    await setDoc(docRef, updates)

}


