export default defineNuxtPlugin(() => {
    const router = useRouter()

    return {
        provide: {
            router
        }
    }
})