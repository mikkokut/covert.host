import eslintPlugin from 'vite-plugin-eslint'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    supabase: {
      url: '',
      key: '',
    },
  },
  vite: {
    plugins: [
      eslintPlugin(),
    ],
  },
})
