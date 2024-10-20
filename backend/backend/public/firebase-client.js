// public/firebase-client.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAijNZE3JxcQjRkrrqL0dZucErt3SRkR3M",
  authDomain: "mercarihackd.firebaseapp.com",
  projectId: "mercarihackd",
  storageBucket: "mercarihackd.appspot.com",
  messagingSenderId: "903785449164",
  appId: "1:903785449164:web:eb4e107f6d093a0745a469",
  measurementId: "G-ZVFHS4XS63",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
