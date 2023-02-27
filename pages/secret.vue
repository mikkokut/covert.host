<script setup lang="ts">
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/20/solid'

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
    <div class="mx-auto max-w-lg px-3">
      <E2EE v-if="content" />
      <div class="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
        <div v-if="hasFailed" class="p-4">
          ERROR
        </div>
        <div v-else-if="content">
          <label for="content" class="sr-only">Content</label>
          <ContentEditor id="content" v-model="content" readonly />
          <div class="flex justify-end border-t border-gray-300 p-2">
            <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2" @click="logout">
              <ArrowRightOnRectangleIcon class="mr-2 h-4 w-4 text-gray-100 transition-transform" />
              Log out
            </button>
          </div>
        </div>
        <div v-else class="flex items-center justify-center p-4">
          <IconSpinner class="!text-gray-600" />
        </div>
      </div>
    </div>
  </div>
</template>
