// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDemFlWxVbNDjrwz-dGVyrCkBAtctTnC1E",
  authDomain: "simple-forum-274d4.firebaseapp.com",
  projectId: "simple-forum-274d4",
  storageBucket: "simple-forum-274d4.appspot.com",
  messagingSenderId: "793960962049",
  appId: "1:793960962049:web:99608d941d1edd07f4c800",
  // measurementId: "${config.measurementId}"
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
const Auth = getAuth(fireApp);
const Storage = getStorage(fireApp);
const Firestore = getFirestore(fireApp);

export { Auth, Firestore, Storage };
export default fireApp;
// const analytics = getAnalytics(fireApp);