import {getDoc, getDocs} from 'firebase/firestore'

export async function resultOf (query) {
  return (await getDocs(query)).docs
      .map(contentOf)
}

export function contentOf (doc) {
  return doc.data()
}

export async function docContentOf (docRef) {
  return contentOf(await getDoc(docRef))
}

