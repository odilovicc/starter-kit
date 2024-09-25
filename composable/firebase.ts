import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBP2XsO9N0b_a0KkQSc8aUqVjRfHQc30LQ",
    authDomain: "online-lessons-nuxt.firebaseapp.com",
    projectId: "online-lessons-nuxt",
    storageBucket: "online-lessons-nuxt.appspot.com",
    messagingSenderId: "685151768163",
    appId: "1:685151768163:web:b73eb73afd93c190803256",
    measurementId: "G-5GLSHEQJG9"
};
const app = initializeApp(firebaseConfig);

export default function useFirebaseClient() {
    const auth = getAuth(app);
    const db = getFirestore(app)
    return { app, auth, db }
}