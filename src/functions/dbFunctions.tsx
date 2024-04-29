import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "../firebase"

const addTodo = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      todo: data,
    })
    // console.log("Document written with ID: ", docRef.id)
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}
const updateTodo = async (fbid, name, date) => {
  const docRef = doc(db, "todos", fbid)
  await updateDoc(docRef, {
    todo: [name, date],
  })
}
const deleteTask = async (fbid) => {
  const docRef = doc(db, "todos", fbid)
  await deleteDoc(docRef)
}
export { addTodo, updateTodo, deleteTask }
