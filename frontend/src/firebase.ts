import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";
export type { User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNM1LyxV0xsG9i9hJO6m24CnFVmP8YsGU",
  authDomain: "afripredict.firebaseapp.com",
  projectId: "afripredict",
  storageBucket: "afripredict.firebasestorage.app",
  messagingSenderId: "883976486054",
  appId: "1:883976486054:web:c427db7f1a3436672d8867",
  measurementId: "G-4LWFZ4JTVX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const onAuthStateChanged = _onAuthStateChanged;
