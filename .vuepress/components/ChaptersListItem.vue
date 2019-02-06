<template>
  <article
    class="chapter-list-item"
    @click="$router.push(chapter.path)"
  >
    <div class="chapter-list-item__header">
      <span class="chapter-list-item__header-type">
        {{ chapterType}}
      </span>

      <div class="chapter-list-item__header-tags">
        <BaseBadge
          v-for="tag in chapterTags"
          :key="tag"
          :label="tag"
          class="chapter-list-item__header-tag"
        />
      </div>
    </div>

    <div class="chapter-list-item__content">
      <span class="chapter-list-item__content-title">
        {{ chapter.title }}
      </span>
    </div>

    <div class="chapter-list-item__footer">
      <VueLogo />
      <BaseButton
        class="chapter-list-item__button"
        type="ellipse"
      >
        <span slot="description">Go to chapter</span>
        <ArrowRight slot="icon" />
      </BaseButton>
    </div>

  </article>
</template>

<script>
import BaseBadge from './BaseBadge'
import BaseButton from './BaseButton'
import ArrowRight from '../public/images/tail-right.svg?inline'
import VueLogo from '../public/images/vue-logo.svg?inline'

export default {
  components: {
    ArrowRight,
    BaseBadge,
    BaseButton,
    VueLogo
  },

  props: {
    chapter: {
      type: Object,
      required: true
    }
  },

  computed: {
    chapterType() {
      return this.chapter.frontmatter.type
    },

    chapterTags() {
      return this.chapter.frontmatter.tags
    }
  }
}
</script>

<style lang="scss" scoped>
$c-white: #fff;
$c-primary-accent: #ff9a57;
$c-primary-accent--dark: #dd8346;

.chapter-list-item {
  display: flex;
  justify-content: space-between;
  width: calc(50% - 20px);
  margin: 10px;
  padding: 10px 15px;
  box-shadow: 0 16px 32px 0 rgba(120, 120, 120, 0.1);
  border: 1px solid rgba(120, 120, 120, 0.1);
  border-radius: 2px;
  border-bottom: 2px solid $c-primary-accent;
  flex-direction: column;
  transition: all 300ms ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: rgba($c-primary-accent, 0.1);
  }

  &__header {
    display: flex;
    flex-direction: column;

    &-type {
      text-align: right;
      font-size: 12px;
      font-weight: 700;
      color: $c-primary-accent;
    }

    &-tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    &-tag {
      margin: 5px 5px 5px 0;
      color: $c-white;
    }
  }
  
  &__content {
    margin-top: 20px;

    &-title {
      display: flex;
      font-size: 16px;
      letter-spacing: 0.5px;
      line-height: 25px;
      text-align: right;
      margin: 10px 0;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  &__button {
    max-width: 175px;
    align-self: flex-end;
  }
}
</style>
