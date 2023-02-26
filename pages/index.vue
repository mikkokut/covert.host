<script setup lang="ts">
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
  <div class="my-20 mx-auto max-w-lg px-3">
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
</template>
