<script setup lang="ts">
const emit = defineEmits<{
  (e: 'created', url: string): void
}>()

const title = ref('')
const content = ref('')

const characterCount = ref(0)
const limit = ref(1000)

const submit = async () => {
  const { key, content: encryptedContent } = await encryptContent(content.value)
  const { hash } = await $fetch<{ hash: string }>('/api/upload', {
    method: 'POST',
    body: {
      title: title.value,
      content: encryptedContent,
    },
  })

  emit('created', `${window.location.origin}/#${hash}/${key}`)
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:shadow-md">
      <label for="content" class="sr-only">Content</label>
      <ContentEditor id="content" v-model="content" :limit="limit" @character-count="count => characterCount = count" />

      <div class="flex items-center justify-between border-t border-gray-200 p-2">
        <span class="ml-2 text-xs text-gray-500">
          {{ characterCount }} / {{ limit }}
        </span>
        <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create
        </button>
      </div>
    </div>
  </form>
</template>
