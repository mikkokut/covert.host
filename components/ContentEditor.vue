<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'

const props = withDefaults(defineProps<{
  modelValue: string
  id: string
  readonly?: boolean
  limit?: number
}>(), {
  readonly: false,
})

const emit = defineEmits(['update:modelValue', 'characterCount'])

const editor = useEditor({
  content: props.modelValue,
  editable: !props.readonly,
  editorProps: {
    attributes: {
      id: props.id,
      class: 'prose focus:outline-none focus:ring-0 border-0 form-input p-4',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
    emit('characterCount', editor.storage.characterCount.characters())
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Write your secret note here...',
    }),
    CharacterCount.configure({
      limit: props.limit ?? null,
    }),
  ],
})

watch(() => props.readonly, (readonly) => {
  editor.value?.setOptions({
    editable: !readonly,
  })
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (isSame)
    return

  editor.value?.commands.setContent(value)
})
</script>

<template>
  <EditorContent :editor="editor" class="min-h-[60px]" />
</template>

<style lang="css">
.ProseMirror p.is-editor-empty:first-child::before {
  @apply text-gray-500;

  content: attr(data-placeholder);
  float: left;
  pointer-events: none;
  height: 0;
}
</style>
