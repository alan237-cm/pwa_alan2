import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUXRByMs6VqhpBvvhzi3ZkcfU-bHLWw-k",
  authDomain: "proyecto-1b517.firebaseapp.com",
  projectId: "proyecto-1b517",
  storageBucket: "proyecto-1b517.firebasestorage.app",
  messagingSenderId: "1045947830465",
  appId: "1:1045947830465:web:5b764870010a5faa18c440"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;