<template>
  <div>
    <section class="chapters-list__header">
      <div class="chapters-list__header-subheader">
        <span class="chapters-list__header-subheader-title">
          Filter by type:
        </span>
        <BaseBadge
          class="chapters-list__header-subheader-badge"
          v-for="chapterType in chapterTypes"
          :key="chapterType"
          :label="chapterType"
          :color="selectedChapterTypes.includes(chapterType) ? 'orange' : 'grey'"
          @click.native="toggleSelectedChapterType(chapterType)"
        />
      </div>
      <div class="chapters-list__header-search">
        <ZoomIcon class="chapters-list__header-search-lens" />
        <input
          placeholder="Search title.."
          class="chapters-list__header-search-input"
          type="text"
          v-model="search"
        >
      </div>
    </section>
    <span class="chapters-list__subheader">
        Chapters found: <span>{{ chaptersCount }}</span>
    </span>
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
import BaseBadge from './BaseBadge'
import ChaptersListItem from './ChaptersListItem'
import ZoomIcon from '../public/images/zoom-small.svg?inline'

export default {
  components: {
    BaseBadge,
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
      search: '',
      selectedChapterTypes: []
    }
  },

  computed: {
    chaptersCount() {
      return this.filteredChapters.length
    },

    chapterTypes() {
      const chapterTypes = []
      this.chapters.forEach(chapter => chapterTypes.push(chapter.frontmatter.type))
      return chapterTypes.filter((v, i, a) => a.indexOf(v) === i).filter(Boolean)
    },

    filteredChapters() {
      let chaptersFilteredByType = []
      const initialChapters = this.chapters.slice(2)

      if(this.selectedChapterTypes.length > 0) {
        this.selectedChapterTypes.forEach(selectedChapterType => {
          chaptersFilteredByType = [
            ...chaptersFilteredByType,
            ...initialChapters.filter(chapter => {
              return chapter.frontmatter.type === selectedChapterType
            })
          ]
        })
      } else {
        chaptersFilteredByType = initialChapters
      }

      const chaptersFilteredBySearchTerm = chaptersFilteredByType.filter(chapter => {
        return chapter.title.toLowerCase().includes(this.search.toLowerCase())
      })

      return chaptersFilteredBySearchTerm
    }
  },

  methods: {
    toggleSelectedChapterType(type) {
      if(this.selectedChapterTypes.includes(type)) {
        const typeIndex = this.selectedChapterTypes.indexOf(type)

        this.selectedChapterTypes.splice(typeIndex, 1)
      } else {
        this.selectedChapterTypes.push(type)
      }
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
    justify-content: space-between;
    flex-direction: column;
    align-items: flex-start;

    @media screen and (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }

    &-subheader {
      display: flex;
      width: 260px;
      margin-bottom: 20px;
      justify-content: space-between;
      align-items: center;

      @media screen and (min-width: 768px) {
        margin-bottom: 0;
      }

      &-title {
        font-size: 14px;
      }

      &-badge {
        cursor: pointer;
        transition: all 300ms ease-in-out;
        
        &:hover {
          opacity: 0.9;
        }
      }
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

  &__subheader {
    display: flex;
    justify-content: center;
    font-size: 14px;
    color: $c-primary-accent;
    align-self: center;
    margin: 30px 0;
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
