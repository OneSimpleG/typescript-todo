// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr9Ou_gUV0Fn-Dv8kcVSEMHKKnm3QLg0w",
  authDomain: "typescripttodo-a7800.firebaseapp.com",
  projectId: "typescripttodo-a7800",
  storageBucket: "typescripttodo-a7800.appspot.com",
  messagingSenderId: "360867333546",
  appId: "1:360867333546:web:e151fee2c8f2d032e557d3",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
