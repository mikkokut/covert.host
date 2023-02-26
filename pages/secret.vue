<script setup lang="ts">
import { } from '@heroicons/vue/20/solid'

const secretFromSession = useSessionStorage('secret', '')

// Early exit if no secret stored in session
if (process.client && !secretFromSession.value)
  useRouter().push('/')

// Decrypted content
const content = ref('')
const hasFailed = ref(false)

// Fetch secret from server and decrypt it
onMounted(async () => {
  try {
    const { hash, key } = JSON.parse(secretFromSession.value)
    const response = await $fetch<{ hash: string; content: string }>('/api/download', {
      method: 'POST',
      body: {
        hash,
      },
    })

    content.value = await decryptContent(key, response.content)
  }
  catch (e) {
    console.error(e)
    content.value = ''
    hasFailed.value = true
  }
})

const logout = () => {
  secretFromSession.value = ''
  useRouter().push('/')
}
</script>

<template>
  <div>
    <div class="mx-auto my-20 max-w-lg p-3">
      <div class="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
        <div v-if="hasFailed" class="p-4">
          ERROR
        </div>
        <div v-else-if="content">
          <label for="content" class="sr-only">Content</label>
          <ContentEditor id="content" v-model="content" readonly />
          <div class="flex justify-end border-t border-gray-300 p-3">
            <button @click="logout">
              Logout
            </button>
          </div>
        </div>
        <div v-else class="flex items-center justify-center p-4">
          <IconSpinner class="text-gray-700" />
        </div>
      </div>
    </div>
  </div>
</template>
