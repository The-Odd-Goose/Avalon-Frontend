import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyB-0O4MKOLCzVqgHWg1Ho93D4JvaVO6uRw",
  authDomain: "the-odd-goose.firebaseapp.com",
  databaseURL: "https://the-odd-goose.firebaseio.com",
  projectId: "the-odd-goose",
  storageBucket: "the-odd-goose.appspot.com",
  messagingSenderId: "487313202863",
  appId: "1:487313202863:web:5f793d2cdc66c1bdd07e5a",
  measurementId: "G-KHHZH32NDE"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

export {firebase, auth, firestore};