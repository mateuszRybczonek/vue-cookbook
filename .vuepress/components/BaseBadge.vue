<template>
  <span class="base-badge">
    {{ label }}
  </span>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
$c-primary-accent--dark: #dd8346;

.base-badge {
  padding: 3px 12px;
  font-size: 12px;
  border-radius: 20px;
  background-color:$c-primary-accent--dark;
}
</style>
