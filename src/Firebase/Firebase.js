// src/Firebase/Firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  Timestamp,
  collection,
  doc,
  addDoc,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Firebase configuration (from .env)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

// Storage
const storage = getStorage(app);

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  Timestamp,
  collection,
  doc,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL
};
