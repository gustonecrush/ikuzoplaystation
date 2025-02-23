import firebaseApp from '../config'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export default async function updateData(collection, id, data) {
  let result = null
  let error = null

  try {
    const docRef = doc(db, collection, id)
    result = await updateDoc(docRef, data)
  } catch (e) {
    error = e
  }

  return { result, error }
}
