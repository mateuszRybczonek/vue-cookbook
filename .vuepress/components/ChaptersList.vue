<template>
  <div class="chapters-list">
    <ChaptersListItem
      v-for="chapter in chapters.slice(2)"
      :chapter="chapter"
    />
  </div>
</template>

<script>
import ChaptersListItem from './ChaptersListItem'
export default {
  props: {
    chapters: {
      type: Array,
      required: true
    }
  },

  components: {
    ChaptersListItem
  }
}
</script>

<style lang="scss" scoped>
.chapters-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
