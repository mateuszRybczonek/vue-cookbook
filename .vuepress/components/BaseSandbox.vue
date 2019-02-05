<template>
  <iframe
    :src="src"
    class="base-sandbox"
    sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
  />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.base-sandbox {
  width: 100%;
  height: 500px;
  border: 0;
  border-radius: 4px;
  overflow: hidden;
}
</style>

