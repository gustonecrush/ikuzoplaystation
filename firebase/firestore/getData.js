import { doc, getDoc, getFirestore } from 'firebase/firestore'
import firebaseApp from '../config'

const db = getFirestore(firebaseApp)

export default async function getDocument(collection, id) {
  let docRef = doc(db, collection, id)

  let data = null
  let error = null

  try {
    const result = await getDoc(docRef)
    if (result.exists()) {
      data = result.data()
    }
  } catch (e) {
    error = e
  }

  return { data, error }
}
