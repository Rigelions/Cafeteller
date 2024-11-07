import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore
} from 'firebase/firestore'
import { DocumentReference } from '@firebase/firestore'

export const getReviewsByIDRepo = async (
  id: string
): Promise<DocumentSnapshot<DocumentData, DocumentData>> => {
  const db = getFirestore()

  // Fetch the review document
  const reviewDocRef = doc(db, 'reviews', id)
  return await getDoc(reviewDocRef)
}

export const getCafeByRefRepo = async (
  cafeRef: DocumentReference
): Promise<DocumentSnapshot<DocumentData, DocumentData>> => {
  return await getDoc(cafeRef)
}
