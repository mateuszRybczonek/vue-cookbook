---
layout: chapter
title: "Infinite Scroll with Vue.js and Intersection Observer"
chapter_number: "05"
description: In this chapter you will learn how to build infinite scroll with Vue.js.
type: "Use case"
tags: ["Infinite scroll", "Intersection Observer", "Images", "Performance"]
---

# Infinite Scroll with Vue.js and Intersection Observer

## Introduction

If we look at the web applications, the idea behind most of them is to fetch data from the database and present it to the user in the best possible way. When we deal with data there are cases when the best possible way of presentation means creating a list.
Depending on the amount of data and its content we may decide to show all content at once (very rarely), or show only a specific part of a bigger data set. The main reason behind showing only part of the existing data is that we want to keep our applications as performant as possible and avoid loading / showing unnecessary data.

If we decide to show our data ‘in chunks’ we need a way to navigate through that collection.
The two most common ways of navigating through set of data are:

- pagination - technique that splits the set of data into specific number of pages, it saves users from being overwhelmed by the amount of data on one page and allows user to navigate through it
- infinite scrolling - technique that loads content continuously as the user scrolls down the page, eliminating the need for pagination

I created an example with a list of random articles, each one containing a short description, image, and a link to the source of the article. We will go through the process of creating a component that is in charge of displaying that list, and triggering action that fetch additional articles when we reach the end of the existing collection. That means creating an infinite scroll component.

<BaseSandbox src="https://codesandbox.io/s/vy4n7nzjk3" />

Let’s see how to build it.

## 1. Create the **ArticlesList** component in Vue

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

In the script section of the component, we set initial **articles** to an empty array and fill that array with data fetched from the API on **mounted** hook. At this stage we fetch only first page of the news feed. That will give us a list of first three articles.

```js
// ArticlesList.vue
import ArticleItem from "./ArticleItem"
import axios from "axios"

export default {
  name: "ArticlesList",
  data() {
    return {
      articles: []
    }
  },

  components: { 
    ArticleItem, 
  },

  async mounted() {
    try {
      const { data } = await axios.get(
        "?country=us&page=1&pageSize=3&category=business&apiKey=yourAPIKey"
      )
      this.articles = data.articles
    } catch (error) {
      throw error
    }
  },
}
```

## 2. Create **loadMore** method

Now we need to create a method that will load next page, we also need to keep a reference to our current page and increment that value before loading fresh data.

We will add a **page** prop to our **data** to keep the value of last loaded page. In **loadMore** method before loading new articles we increment the **page** value and fetch the next batch of data from the API. Upon receiving new data we merge the existing **articles** array with the fresh data containing next page of articles.

```js
//ArticlesList.vue
...
export default {
...
data() {
  return {
    page: 1,
    articles: []
};
...
methods: {
    async loadMore() {
      this.page += 1

      const { data } = await axios.get(
        `?country=us&page=${
          this.page
        }&pageSize=3&category=business&apiKey=yourApiKey`
      )

      this.articles = [...this.articles, ...data.articles]
    }
  }
}
```

Now we have the **loadMore** method, but we do not fire it anywhere. We need to find a way to detect if user reached the end of our list and fire **loadMore** then.

To accomplish that we need to do two things:

1. Create a component that will be rendered below the last element on the list.
2. Detect when that component becomes visible to the user and trigger the request to load more articles.

Let’s proceed!

## 3. Create a **Trigger** component

Our **Trigger** component doesn’t have to contain anything except one **`<span>`** tag as below.

```html
<!--Trigger.vue-->
<template>
  <span />
</template>
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
    <Trigger />
  </div>
</template>
```

That was the easy part, now we need to detect when that component becomes visible to the user and trigger the request to load more articles. How do we do that?


## 4. Detect when the **Trigger** component becomes visible to the user

There are ways to determine when an element is in view using JavaScript, maybe you even created some custom solution to achieve that. I bet though that you were not very happy with the result, but you went forward with it because there was no better way.
Believe me or not, but that better way exist, and it is called Intersection Observer. This provides a very efficient way of detecting if an element is visible in the viewport. Specifically, it allows you to configure a callback that is triggered when one element — called the target — intersects with either the device viewport or a specified element.
So, what we need to do to use it? A few things:

- create a new intersection observer
- watch the element for visibility changes
- trigger the event when it becomes visible
- stop watching for visibility changes (**disconnect**) if the component before the component is destroyed

We will put all that logic in our **Trigger** component just now. 

```js
// Trigger.vue
export default {
  props: {
    options: {
      type: Object,
      default: {
        root: null,
        threshold: 0
      }
    }
  },

  data: () => ({
    observer: null
  }),

  mounted() {
    this.observer = new IntersectionObserver(([entry]) => {
      this.handleIntersect(entry)
    }, this.options)

    this.observer.observe(this.$el)
  },

  destroyed() {
    this.observer.disconnect()
  },

  methods: {
    handleIntersect(entry) {
      if (entry && entry.isIntersecting) {
        this.$emit("triggerIntersected")
      }
    }
  }
}
```

Let’s break this code into pieces and explain what is happening.

At the beginning we allow to pass an **options** object as a prop to the component. This **options** object allows us to configure our Intersection Observer (specifically circumstances under which the observer's callback will be invoked). It contains (but is not limited to) following props:

- **root** as our reference object, which we use to base the visibility of our watched element. It might be any ancestor of the object or our browser viewport if we pass **null**. 
-  **threshold** value that can vary from **0** to **1** and tells us at what percent of the target’s visibility the **observer** callback should be executed, with **0** meaning as soon as even one pixel is visible and **1** meaning the whole element must be visible.

```js
// Trigger.vue
export default {
  props: {
    options: {
      type: Object,
      default: {
        root: null,
        threshold: 0,
      }
    }
  },
  ...
}
```

In **data** we set initial value of **observer** to null. This is the value that will be changed when we create our Intersection Observer.

```js
// Trigger.vue
...
  data: () => ({
    observer: null
  }),
...
```

The core logic lives in the component’s hook function. That function allows us to fire a custom logic at a specific moment of a bound element lifecycle. In our case we will use **mounted** hook.

In there we create an intersection observer. The **IntersectionObserver** constructor accepts a callback (**handleIntersect** function) that is fired when the observed element passes the specified **threshold** and the **options** object that carries our observer options. It also has access to **entries**, which is an array of all elements that are watched by the observer. As in our case we will have only one element that will be observed (one element in **entries**) we will use array destructuring on the **entries** to extract that first element (**entries[0]**).

And then, after creating the Intersection Observer, we attach it to our element using the **observe** method.

```js
// Trigger.vue
...
  mounted() {
    this.observer = new IntersectionObserver(([entry]) => {
      this.handleIntersect(entry);
    }, this.options);

    this.observer.observe(this.$el);
  },
...
```

In the **handleIntersect** function we emit a **triggerIntersected**  event when certain conditions are met. Specifically, it is fired when Intersection Observer detects that the element enters the viewport or a parent component element. This event will be then caught by the parent component and used to trigger **loadMore** function.

```js
// Trigger.vue
...
  methods: {
    handleIntersect(entry) {
      if (entry && entry.isIntersecting) {
        this.$emit("triggerIntersected");
      }
    }
  }
...
```

The last thing we need to do with our **Trigger**  component is to stop watching for the component intersection before it gets destroyed. To do that we, again, use hook function, specifically **beforeDestroy** hook, in this case.

```js
// Trigger.vue
...
  beforeDestroy() {
    this.observer.disconnect();
  },
...
```

## 5. Catch the **triggerIntersected** event and fetch additional articles.

The last missing piece is a connection between that moment that our **Trigger** component becomes visible in the viewport and our **loadMore** method responsible for loading more articles.

Our **Trigger** component creates an Intersection Observer and **emit** an event when the component enters the viewport. What we need to do now is catch that event in or **ArticlesList** component.

We do that using **v-on** directive (or **@**  shorthand) that needs to be attached to our **Trigger** component. That will fire **loadMore** method each time **Trigger** component emits **triggerIntersected** event (each time the component enters viewport).

```html
<template>
  <div>
    <ArticleItem
      v-if="article.urlToImage"
      v-for="article in articles"
      :key="article.publishedAt"
      :article="article"
    />
    <Trigger @triggerIntersected="loadMore"/>
  </div>
</template>
```

## When To Avoid This Pattern

It is not recommended for goal-oriented finding tasks, requiring people to locate specific content or compare options. Imagine looking for a specific search result that appears on a certain page of the search results. Using infinite scroll in this case makes it hard to find it as we need to trigger the infinite scroll many times to reach our desired page and find our item.
Having pagination in that case allows us to find the item (as long as we remember at which page it was) in literally two clicks (one for page, second for item).

## Wrapping up

As the infinite scroll may sound like a solution for all lists, it is not the best solution in all cases, it may look fancy, but in some cases it can cause more harm then good.

Infinite scrolling shows it’s potential for content that streams constantly and has a relatively flat structure (each item is at the same level of hierarchy and has similar chances of being interesting to users). For example stream of news. In that case we are exploring the news rather than looking for something specific. We do not need to know where exactly the news is and how much we scrolled to get to a specific news, it makes the user experience more engaging in that case and saves us the effort to click next each time we reach the end of current page.
