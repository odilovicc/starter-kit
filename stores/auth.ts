import { useStorageAsync } from "@vueuse/core";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, type User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import useFirebaseClient from "~/composable/firebase";


const auth = useFirebaseClient().auth
export const useAuthStore = defineStore('auth', () => {
    const client = ref<User | null>(null)
    const error = ref<any>()


    async function onUserRegister(fields: any) {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(auth, fields.email, fields.password)
                .then((userCredential) => {
                    const user = userCredential.user
                    client.value = user

                    updateProfile(user, {
                        displayName: fields.login
                    })

                    setDoc(doc(useFirebaseClient().db, "users", user.uid), {
                        login: user.uid,
                        name: user.displayName,
                        email: user.email,
                        userInfo: {
                            status: "Newbie"
                        }
                    })
                    resolve(user)
                })
                .catch((err) => {
                    error.value = err
                    reject(err)
                })

        })
    }

    async function onUserLogin(fields: any) {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(auth, fields.email, fields.password)
                .then((userCredential) => {
                    const user = userCredential.user
                    client.value = user
                    resolve(user)
                })
                .catch((err) => {
                    error.value = err
                    reject(err)
                })
        })
    }

    return {
        onUserRegister,
        onUserLogin
    }

})