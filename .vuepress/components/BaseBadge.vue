<template>
  <span
    class="base-badge"
    :class="`base-badge--${color}`"
  >
    {{ label }}
  </span>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },

    color: {
      type: String,
      default: 'orange'
    }
  }
}
</script>

<style lang="scss" scoped>
$c-white: #fff;
$c-black: #000;
$c-primary-accent--dark: #dd8346;
$c-grey: #e6e6e6;

.base-badge {
  padding: 3px 12px;
  font-size: 12px;
  border-radius: 20px;

  &--orange {
    background-color: $c-primary-accent--dark;
    color: $c-white;
  }

  &--grey {
    background-color: $c-grey;
    color: $c-black;
  }
}
</style>
