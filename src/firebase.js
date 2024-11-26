// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB258R6QiG_LjZ_wgQNqcDuPjck_H1awzc",
  authDomain: "papalotemuseo-c3465.firebaseapp.com",
  projectId: "papalotemuseo-c3465",
  storageBucket: "papalotemuseo-c3465.appspot.com",
  messagingSenderId: "748642302019",
  appId: "1:748642302019:web:103cda6409bc683d3f3cf6",
  measurementId: "G-5EF4PPJ5FL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, signInAnonymously };