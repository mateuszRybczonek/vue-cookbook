<template>
  <div>
    <section class="chapters-list__header">
      <div class="chapters-list__header-search">
        <ZoomIcon class="chapters-list__header-search-lens" />
        <input
          placeholder="Search title.."
          class="chapters-list__header-search-input"
          type="text"
          v-model="search"
        >
      </div>
      <span class="chapters-list__header-subheader">
        Chapters found: <span>{{ chaptersCount }}</span>
      </span>
    </section>
    <transition-group
      name="fade"
      mode="out-in"
      tag="section"
      class="chapters-list"
    >
      <ChaptersListItem
        v-for="chapter in filteredChapters"
        :key="chapter"
        :chapter="chapter"
      />
    </transition-group>
  </div>
</template>

<script>
import ChaptersListItem from './ChaptersListItem'
import ZoomIcon from '../public/images/zoom-small.svg?inline'

export default {
  components: {
    ChaptersListItem,
    ZoomIcon
  },

  props: {
    chapters: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      search: ''
    }
  },

  computed: {
    chaptersCount() {
      return this.filteredChapters.length
    },

    filteredChapters() {
      return this.chapters.slice(2).filter(chapter => {
        return chapter.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$c-white: #fff;
$c-primary-accent: #ff9a57;

.chapters-list {
  display: flex;
  flex-wrap: wrap;

  &__header {
    display: flex;
    align-items: flex-end;
    flex-direction: column;

    &-subheader {
      font-size: 14px;
      color: $c-primary-accent;
      align-self: center;
      margin: 30px 0;
    }

    &-search {
      display: flex;
      width: 240px;
      margin-left: 10px;
      padding-right: 5px;
      padding-left: 10px;
      border-radius: 20px;
      border: 1px solid rgba(120, 120, 120, 0.1);
      background-color: $c-primary-accent;
      box-shadow: 0 16px 32px 0 rgba(120, 120, 120, 0.1);
      align-items: center;

      &-input {
        height: 35px;
        font-size: 14px;
        outline: none;
        border: none;
        color: $c-white;
        flex-grow: 2;
        background-color: transparent;

        &::placeholder {
          color: $c-white;
          opacity: 0.8;
        }
      }

      &-lens {
        z-index: 3;
        color: $c-white;
        margin-right: 10px;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
