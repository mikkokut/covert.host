<script setup lang="ts">
import { ArrowPathIcon, ArrowRightIcon } from '@heroicons/vue/20/solid'
const emit = defineEmits<{
  (e: 'created', url: string): void
}>()

const title = ref('')
const content = ref('')

const characterCount = ref(0)
const limit = ref(1000)

const disabled = computed(() => characterCount.value < 1)

const saving = ref(false)

const submit = async () => {
  if (saving.value || disabled.value)
    return

  saving.value = true

  const { key, content: encryptedContent } = await encryptContent(content.value)
  const { hash } = await $fetch<{ hash: string }>('/api/upload', {
    method: 'POST',
    body: {
      title: title.value,
      content: encryptedContent,
    },
  })

  content.value = ''
  saving.value = false
  emit('created', `${window.location.origin}/#${hash}/${key}`)
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:shadow-md">
      <label for="content" class="sr-only">Content</label>

      <ContentEditor id="content" v-model="content" :readonly="saving" :limit="limit" @character-count="count => characterCount = count" />

      <div class="flex items-center justify-between border-t border-gray-200 p-2">
        <span class="ml-2 text-xs text-gray-500">
          {{ characterCount }} / {{ limit }}
        </span>
        <button
          type="submit" :disabled="disabled" :class="[
            disabled && 'pointer-events-none opacity-50',
            saving && 'animate-pulse opacity-50 focus:!ring-0',
          ]" class="group inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
          <ArrowPathIcon v-if="saving" class="ml-2 h-4 w-4 animate-spin text-gray-100" />
          <ArrowRightIcon v-else class="ml-2 h-4 w-4 text-gray-100 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  </form>
</template>
