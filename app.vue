<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'bg-zinc-50 antialiased',
  },
})
</script>

<template>
  <div class="flex min-h-screen flex-col justify-between">
    <div>
      <header class="py-10">
        <h1 class="text-center text-xl font-bold text-gray-800">
          Covert.host
        </h1>
        <p class="text-center text-gray-600">
          Simple end-to-end encrypted shareable notes.
        </p>
      </header>
      <main>
        <NuxtPage />
      </main>
    </div>
    <footer class="px-3 py-10 text-center font-medium text-gray-500">
      © {{ new Date().getFullYear() }} <a class="text-indigo-600 hover:underline" href="https://twitter.com/mikkokut">mikkokut</a>. All rights reserved. This product is <a class="text-indigo-600 hover:underline" href="https://github.com/mikkokut/covert.host">100% open source</a>.
    </footer>
  </div>
</template>
