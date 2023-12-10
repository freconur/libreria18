import { initializeApp } from "firebase/app";

const firebaseConfig = {
  // apiKey: "AIzaSyBCZF_QCYGHZI_CH50iHcXrKdeHaadcRUA",
  // authDomain: "larys-df83c.firebaseapp.com",
  // projectId: "larys-df83c",
  // storageBucket: "larys-df83c.appspot.com",
  // messagingSenderId: "105762594261",
  // appId: "1:105762594261:web:a4793aad53caf08a93715c",
  // measurementId: "G-MDECSTVDF7"
  apiKey: "AIzaSyD4bWJZfvkhZ-MmLmQJEJwdWOk1SCQKu1w",
    authDomain: "library-18-7da22.firebaseapp.com",
    projectId: "library-18-7da22",
    storageBucket: "library-18-7da22.appspot.com",
    messagingSenderId: "747937806837",
    appId: "1:747937806837:web:dd7513679a670b904f48bc",
    measurementId: "G-H6YBVXFDL8"
};

export const app = initializeApp(firebaseConfig);
export const authApp = initializeApp(firebaseConfig);