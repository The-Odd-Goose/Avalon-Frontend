import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
var firebaseConfig = {
  apiKey: "AIzaSyB-0O4MKOLCzVqgHWg1Ho93D4JvaVO6uRw",
  authDomain: "the-odd-goose.firebaseapp.com",
  databaseURL: "https://the-odd-goose.firebaseio.com",
  projectId: "the-odd-goose",
  storageBucket: "the-odd-goose.appspot.com",
  messagingSenderId: "487313202863",
  appId: "1:487313202863:web:b211a402a629a6b7d07e5a",
  measurementId: "G-MWQQ6LZRSS"
};

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebase, auth, firestore };