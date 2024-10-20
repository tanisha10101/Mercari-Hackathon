// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAijNZE3JxcQjRkrrqL0dZucErt3SRkR3M",
  authDomain: "mercarihackd.firebaseapp.com",
  projectId: "mercarihackd",
  storageBucket: "mercarihackd.appspot.com",
  messagingSenderId: "903785449164",
  appId: "1:903785449164:web:eb4e107f6d093a0745a469",
  measurementId: "G-ZVFHS4XS63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);