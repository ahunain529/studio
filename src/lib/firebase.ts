// src/lib/firebase.ts
import { initializeApp, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBj2Y8hDqyN8gZzl4LZK6Zqb4SncRHDUgI",
  authDomain: "talcfactory.firebaseapp.com",
  databaseURL: "https://talcfactory-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "talcfactory",
  storageBucket: "talcfactory.appspot.com",
  messagingSenderId: "84539341704",
  appId: "1:84539341704:web:e921a35dacd30d2768983d"
};

let app: FirebaseApp;

// HMR can cause multiple initializations, so we check if an app already exists.
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

const database = getDatabase(app);

export { database };
