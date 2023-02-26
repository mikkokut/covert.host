<script setup lang="ts">
import { LockClosedIcon } from '@heroicons/vue/20/solid'

const openSecretIfExists = () => {
  if (!process.client)
    return

  if (!location.hash)
    return

  const [hash, key] = location.hash.slice(1).split('/')
  if (!hash || !key) {
    location.replace('/')
    return
  }

  useSessionStorage('secret', { hash, key })
  location.replace('/secret')
}

const createdSecrets = ref<string[]>([])
const handleCreated = (url: string) => {
  createdSecrets.value.push(url)
}

const clipboard = useClipboard()

openSecretIfExists()
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-lg flex-col justify-between px-3 pt-10 sm:pt-20">
    <div>
      <p class="mb-2 flex items-center justify-end gap-1 pr-1 text-xs font-medium text-gray-500">
        <LockClosedIcon class="inline h-3 w-3 text-gray-400" />
        End-to-end encrypted
      </p>
      <NewSecret @created="handleCreated" />
      <div v-if="createdSecrets.length > 0" class="mt-10">
        <strong class="text-gray-500">Created secrets</strong>

        <div class="mt-3 flex flex-col gap-1">
          <div v-for="url in createdSecrets" :key="url" class="flex gap-1">
            <input :value="url" readonly class="block w-full rounded-md border bg-white px-2 py-1.5 text-gray-600">
            <button class="rounded-md border bg-gray-100 px-3 text-sm hover:bg-gray-200" @click="clipboard.copy(url)">
              <span>
                Copy
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="pb-6 pt-20 font-medium text-gray-500">
      © Secreto {{ new Date().getFullYear() }}. Handcrafted by <a class="text-indigo-600 hover:underline" href="https://twitter.com/mikkokut">@mikkokut</a>
    </div>
  </div>
</template>
