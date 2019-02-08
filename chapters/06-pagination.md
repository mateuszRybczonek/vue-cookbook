---
layout: chapter
title: "BasePagination component"
chapter_number: "06"
description: In this chapter you will learn how to build reusable Pagination component.
type: "Component"
tags: ["Pagination", "Component", "Performance"]
---

<MainMenuButton />

# Pagination component

## Introduction

If we look at the web applications, the idea behind most of them is to fetch data from the database and present it to the user in the best possible way. When we deal with data there are cases when the best possible way of presentation means creating a list.
Depending on the amount of data and its content we may decide to show all content at once (very rarely), or show only a specific part of a bigger data set. The main reason behind showing only part of the existing data is that we want to keep our applications as performant as possible and avoid loading / showing unnecessary data.

If we decide to show our data ‘in chunks’ we need a way to navigate through that collection.
The two most common ways of navigating through set of data are:

- pagination - technique that splits the set of data into specific number of pages, it saves users from being overwhelmed by the amount of data on one page and allows user to navigate through it
- infinite scrolling - technique that loads content continuously as the user scrolls down the page, eliminating the need for pagination

I created an example with a list of random articles, each one containing a short description, image, and a link to the source of the article. We will go through the process of creating a component that is in charge of displaying that list, and triggering action that fetch additional articles when we click on a specific page to be displayed. That means creating a pagination component.

<BaseSandbox src="https://codesandbox.io/s/nw5mqv3564" />

Let’s see how to build it.

## 1. Create the `ArticlesList` component in Vue

Let’s start by creating a component that will show a list of articles (but without infinite scrolling just yet). We’ll call it **ArticlesList**. In the component template, we’ll iterate through the set of articles and pass a single article item to each **ArticleItem** component.

```html
<!--ArticlesList.vue-->
<template>
  <div>
    <ArticleItem
      v-if="article.urlToImage"
      v-for="article in articles"
      :key="article.publishedAt"
      :article="article"
    />
  </div>
</template>
```

In the script section of the component, we set initial data:
- **articles** - empty array filled with data fetched from the API on **mounted** hook
- **currentPage** - used to manipulate the pagination
- **pageCount** - total number of pages, calculated on **mounted** hook based on the API response
- **visibleItemsPerPageCount** - how many articles we want to see on a single page

At this stage we fetch only first page of the news feed. That will give us a list of first two articles.

```js
// ArticlesList.vue
import ArticleItem from "./ArticleItem"
import axios from "axios"

export default {
  name: "ArticlesList",

  static: {
    visibleItemsPerPageCount: 2
  },

  data() {
    return {
      articles: [],
      currentPage: 1,
      pageCount: 0
    }
  },

  components: { 
    ArticleItem, 
  },

  async mounted() {
    try {
      const { data } = await axios.get(
        `?country=us&page=1&pageSize=${
          this.$options.static.visibleItemsPerPageCount
        }&category=business&apiKey=065703927c66462286554ada16a686a1`
      )

      this.articles = data.articles

      this.pageCount = Math.ceil(
        data.totalResults / this.$options.static.visibleItemsPerPageCount
      )
    } catch (error) {
      throw error
    }
  }
}
```

## 2. Create `pageChangeHandle` method

Now we need to create a method that will load next page, previous page or a selected page.

In **pageChangeHandle** method before loading new articles we change the **currentPage** value depending on a property passed to the method and fetch the data respective to a specific page from the API. Upon receiving new data we replace the existing **articles** array with the fresh data containing new page of articles.

```js
//ArticlesList.vue
...
export default {
...
  methods: {
    async pageChangeHandle(value) {
      switch (value) {
        case 'next':
          this.currentPage += 1
          break
        case 'previous':
          this.currentPage -= 1
          break
        default:
          this.currentPage = value
          break
      }

      const { data } = await axios.get(
        `?country=us&page=${this.currentPage}&pageSize=${
          this.$options.static.visibleItemsPerPageCount
        }&category=business&apiKey=065703927c66462286554ada16a686a1`
      )

      this.articles = data.articles
    }
  }
}
```

Now we have the **pageChangeHandle** method, but we do not fire it anywhere. We need to create a component that will be responsible for that.

### This component should do following things:

1. Allow user to go to next / previous page
2. Allow user to go to specific page within a range from currently selected page
3. Show information on which page we are currently on

Let’s proceed!

## 3. Requirement 1 - Allow user to go to next / previous page

Our **BasePagination** will contain two buttons responsible for going to the next and previous page.

```html
<!--BasePagination.vue-->
<template>
  <div class="base-pagination">
    <BaseButton
      :disabled="isPreviousButtonDisabled"
      @click.native="previousPage"
    >
      ←
    </BaseButton>

    <BaseButton
      :disabled="isNextButtonDisabled"
      @click.native="nextPage"
    >
      →
    </BaseButton>
  </div>
</template>
```

The component will accept **currentPage** and **pageCount** properties from the parent component and emit proper actions back to the parent when the next / previous button is clicked. It will also be responsible for disabling buttons when we are on the first or last page not to go out of the existing collection.

```js
// BasePagination.vue
import BaseButton from "./BaseButton.vue";

export default {
  components: {
    BaseButton
  },

  props: {
    currentPage: {
      type: Number,
      required: true
    },

    pageCount: {
      type: Number,
      required: true
    }
  },

  computed: {
    isPreviousButtonDisabled() {
      return this.currentPage === 1
    },

    isNextButtonDisabled() {
      return this.currentPage === this.pageCount
    }
  },

  methods: {
    nextPage() {
      this.$emit('nextPage')
    },

    previousPage() {
      this.$emit('previousPage')
    }
  }
```

We will render that component just below our **ArticleItems** in **ArticlesList** component.

```html
<!--ArticlesList.vue-->
<template>
  <div>
    <ArticleItem
      v-if="article.urlToImage"
      v-for="article in articles"
      :key="article.publishedAt"
      :article="article"
    />
    <BasePagination
      :current-page="currentPage"
      :page-count="pageCount"
      class="articles-list__pagination"
      @nextPage="pageChangeHandle('next')"
      @previousPage="pageChangeHandle('previous')"
    />
  </div>
</template>
```

That was the easy part, now we need to create a list of page numbers each allowing us to select a specific page, the number of pages should be customizable and we also need to make sure not to show any pages that may lead us beyond the collection range.

## 4. Requirement 2 - Allow user to go to specific page within a range from currently selected page

Let's first create a component that will be used as a single page number. I called it **BasePaginationTrigger**. It will do two things, show the page number passed from the **BasePagination** component and emit an event when user clicks on a specific number.

```html
<!--BasePaginationTrigger.vue-->
<template>
  <span class="base-pagination-trigger" @click="onClick">
    {{ pageNumber }}
  </span>
</template>

<script>
export default {
  props: {
    pageNumber: {
      type: Number,
      required: true
    }
  },

  methods: {
    onClick() {
      this.$emit("loadPage", this.pageNumber)
    }
  }
}
</script>
```

This component will them be rendered in the **BasePagination** component between the next / previous buttons. 

```html
<!--BasePagination.vue-->
<template>
  <div class="base-pagination">
    <BaseButton />
    ...
    <BasePaginationTrigger
      class="base-pagination__description"
      :pageNumber="currentPage"
      @loadPage="onLoadPage"
    />
    ...
    <BaseButton />
  </div>
</template>
```

In the script section we need to add one more method **onLoadPage** that will be fired when the **loadPage** event is emitted from the trigger component. This method will receive page number that was clicked and emit the event up to the **ArticlesList** component.

```js
// BasePagination.vue
export default {
  ...
    methods: {
    ...
    onLoadPage(value) {
      this.$emit("loadPage", value)
    }
  }
}
```

Then in the **ArticlesList** we will listen to that event and trigger **pageChangeHandle** method that will fetch the data for our new page.

```html
<!-- ArticlesList-->
<template>
  ...
    <BasePagination
      :current-page="currentPage"
      :page-count="pageCount"
      class="articles-list__pagination"
      @nextPage="pageChangeHandle('next')"
      @previousPage="pageChangeHandle('previous')"
      @loadPage="pageChangeHandle"
    />
  ...
</template>
```

Ok, now we have a single trigger that shows us current page and allows us to fetch the same page again, pretty useless, don't you think? Let's make some use of that newly created trigger component. We need a list of pages that will allow us to jump from one page to another without a need of going through the pages between.

We also need to make sure to display the pages in a nice manner. We always want to display first page and the last page (to be on the edges of the list) and remaining pages between them. 

### We have three possible scenarios:

1. When selected page number is smaller then the half of the list width - **1 - 2 - 3 - 4 - 18**

2. When selected page number is bigger then half of the list width counting from the end of the list - **1 - 15 - 16 - 17 - 18**

3. All other cases - **1 - 4 - 5 - 6 - 18**

To handle all those cases we will create a computed property that will return an array of numbers that should be shown between the next / previous buttons. To make the component more reusable we will accept a property **visiblePagesCount** that will specify how many pages should be visible in the pagination component.

Before going to the cases one by one we create few variables:
- **visiblePagesThreshold** - tells us how many pages from the center (selected page should be shown)
- **paginationTriggersArray** - array that will be filled with page numbers, we use **visiblePagesCount** to create an array with required length

```js
// BasePagination.vue
export default {
  props: {
    visiblePagesCount: {
      type: Number,
      default: 5
    }
  }
  ...
  computed: {
    ...
      paginationTriggers() {
        const currentPage = this.currentPage
        const pageCount = this.pageCount
        const visiblePagesCount = this.visiblePagesCount
        const visiblePagesThreshold = (visiblePagesCount - 1) / 2
        const pagintationTriggersArray = Array(this.visiblePagesCount - 1).fill(0)
      }
    ...
    }
  ...
}
```

Now let's go through each case separately.

1. When selected page number is smaller then the half of the list width - **1 - 2 - 3 - 4 - 18**

We set the first element to be always equal to 1. Then we iterate through the list adding index to each element. At the end we add last value to be equal to the last page number (we want to be able to go straight to the last page).

```js
if (currentPage <= visiblePagesThreshold + 1) {
  pagintationTriggersArray[0] = 1
    const pagintationTriggers = pagintationTriggersArray.map(
      (paginationTrigger, index) => {
        return pagintationTriggersArray[0] + index
      }
    )

    pagintationTriggers.push(pageCount)

    return pagintationTriggers
  }
```

2. When selected page number is bigger then half of the list width counting from the end of the list - **1 - 15 - 16 - 17 - 18**

Similar to the previous case, we start with the last page and iterate through the list subtracting, this time, index from each element. Then we reverse the array to get the proper order and push 1 into the first place in our array.

```js
  if (currentPage >= pageCount - visiblePagesThreshold + 1) {
    const pagintationTriggers = pagintationTriggersArray.map(
      (paginationTrigger, index) => {
        return pageCount - index
      }
    )

    pagintationTriggers.reverse().unshift(1)

    return pagintationTriggers
  }
```

3. All other cases - **1 - 4 - 5 - 6 - 18**

We know what number should be in the center of our list (current page), we also know how long the list should be. This allows us to get the first number that should be in our array. The we populate the list by adding index to each element. At the end we push 1 into the first place in our array and replace the last number with our last page number.

```js
  pagintationTriggersArray[0] = currentPage - visiblePagesThreshold + 1
  const pagintationTriggers = pagintationTriggersArray.map(
    (paginationTrigger, index) => {
      return pagintationTriggersArray[0] + index
    }
  )

  pagintationTriggers.unshift(1);
  pagintationTriggers[pagintationTriggers.length - 1] = pageCount

  return pagintationTriggers
}
```

## 5. Render the list of numbers in **BasePagination** component.

Now that we know exactly what number we want to show in our pagination we need to render a trigger component for each one of them.

We do that using **v-for** directive. Let's also add a conditional class that will handle selecting our current page.

```html
<!-- BasePagination.vue -->
<template>
  ...
  <BasePaginationTrigger
    v-for="paginationTrigger in paginationTriggers"
    :class="{
      'base-pagination__description--current':
        paginationTrigger === currentPage
    }"
    :key="paginationTrigger"
    :pageNumber="paginationTrigger"
    class="base-pagination__description"
    @loadPage="onLoadPage"
  />
  ...
</template>
```

And we are done. We just build nice and reusable pagination component.

## When To Avoid This Pattern
This pattern is not recommended for content that streams constantly and has a relatively flat structure (each item is at the same level of hierarchy and has similar chances of being interesting to users). In that case we are exploring the news rather than looking for something specific. We do not need to know where exactly the news is and how much we scrolled to get to a specific news, it makes the user experience more engaging in that case and saves us the effort to click next each time we reach the end of current page.

## Wrapping up
This solution is recommended for goal-oriented finding tasks, requiring people to locate specific content or compare options. Imagine looking for a specific search result that appears on a certain page of the search results.
