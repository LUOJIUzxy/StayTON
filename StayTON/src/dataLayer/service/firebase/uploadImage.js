import {FireBaseStorageRef} from "@/plugins/google-fire-base";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4 as uuidv4} from 'uuid';

export function nextImageRef(extensionName) {
    return ref(FireBaseStorageRef, 'images/' + uuidv4() + '.' + extensionName)
}

/**
 *
 * @param file {File}
 * @returns {Promise<void>}
 */
export async function uploadImage(file) {
    const res = (await uploadBytes(nextImageRef(
            file.name.split('.').pop()),
        file
    ))
    console.log(res)
    return await getDownloadURL(res.ref)
}
