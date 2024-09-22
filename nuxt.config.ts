import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', "@nuxtjs/supabase", "@pinia/nuxt"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "app-dark"
        }
      }
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/global.css", 'primeicons/primeicons.css'],
  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ]
})