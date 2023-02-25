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

openSecretIfExists()
</script>

<template>
  <div>
    <NewSecret />
  </div>
</template>
