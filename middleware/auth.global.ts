import useFirebaseClient from "~/composable/firebase";
import { RouterPaths } from "~/types/router";

const {auth} = useFirebaseClient()

export default defineNuxtRouteMiddleware((to, from) => {
    if(!auth.currentUser && to.name !== RouterPaths.LOGIN) {
        return navigateTo({name: RouterPaths.LOGIN})
    }
})