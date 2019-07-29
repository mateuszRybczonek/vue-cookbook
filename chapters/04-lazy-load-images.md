---
layout: chapter
title: "Lazy Loading Images with Intersection Observer"
chapter_number: "04"
description: In this chapter you will learn how to lazy load images.
type: "Use case"
tags: ["Lazy Loading", "Images", "Performance"]
---

<MainMenuButton />

# Lazy Loading Images with Vue.js Directives and Intersection Observer

## Introduction

When I think about web performance, the first thing that comes to my mind is how images are generally the last elements that appear on a page. Today, images can be a major issue when it comes to performance, which is unfortunate since the speed a website loads has a direct impact on users successfully doing what they came to the page to do (think conversation rates).

Rahul Nanwani wrote up an extensive [guide on lazy loading images](https://css-tricks.com/the-complete-guide-to-lazy-loading-images/).
I’d like to cover the same topic, but from a different approach: using data attributes, [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and [custom directives in Vue.js](https://vuejs.org/v2/guide/custom-directive.html).

What this’ll basically do is allow us to solve two things:

- store the **src** of the image we want to load without loading it in the first place.
- detect when the image becomes visible to the user and trigger the request to load the image.

Same basic lazy loading concept, but another way to go about it.

## Real-world example

I created [an example](https://codesandbox.io/s/5v17x4zr64), based on Benjamin Taylor's [blog post](https://benjamintaylorportfolio.netlify.com/?utm_campaign=Revue%20newsletter&utm_medium=Newsletter&utm_source=Vue.js%20Developers#/post/lazy-loading-images-with-vue-js-directives). It contains a list of random articles each one containing a short description, image, and a link to the source of the article. We will go through the process of creating a component that is in charge of displaying that list, rendering an article, and lazy loading the image for a specific article.

<BaseSandbox src="https://codesandbox.io/s/5v17x4zr64" />
 
Let’s get lazy! Or at least break this component down piece-by-piece.


## 1. Create the ImageItem component in Vue

Let’s start by creating a component that will show an image (but with no lazy loading involved just yet). We’ll call this file **ImageItem.vue**. In the component template, we’ll use a **figure** tag that contains our image, the image tag itself will receive the  **src** attribute that points to the source URL for the image file.

```html
<figure class="image__wrapper">
  <img
    class="image__item"
    :src="source"
    alt="random image"
  >
</figure>
```

In the script section of the component, we receive the prop **source** that we’ll use for the **src** url of the image we are displaying.

```js
{
  name: "ImageItem",
  props: {
    source: {
      type: String,
      required: true
    }
  }
}
```

All this is perfectly fine and will render the image normally as is. But, if we leave it here, the image will load straight away without waiting for the entire component to be render. That’s not what we want, so let’s go to the next step.

## 2. Prevent the image from being loaded when the component is created

It might sound a little funny that we want to prevent something from loading when we want to show it, but this is about loading it at the **right time** rather than blocking it indefinitely. To prevent the image from being loaded, we need to get rid of the **src** attribute from the **img** tag. But, we still need to store it somewhere so we can make use of it when we want it. A good place to keep that information is in a [data-attribute](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). These allow us to store information on standard, semantic HTML elements. In fact, you may already be accustomed to using them as JavaScript selectors.

In this case, they’re a perfect fit for our needs!

```html
<!--ImageItem.vue-->
<template>
  <figure class="image__wrapper">
    <img
      class="image__item"
      :data-url="source" // yay for data attributes!
      alt="random image"
    >
  </figure>
</template>
```

With that, our image will **not** load because there is no source URL to pull from.

That’s a good start, but still not quite what we want. We want to load our image under specific conditions. We can request the image to load by replacing the **src** attribute with the image source URL kept in our  **data-url** attribute. That’s the easy part. The real challenge is figuring out when to replace it with the actual source.

Our goal is to pin the load to the user’s screen location. So, when the user scrolls to a point where the image comes into view, that’s where it loads.

How can we detect if the image is in view or not? That’s our next step.

## 3. Detect when the image is visible to the user

You may have experience using JavaScript to determine when an element is in view. You may also have experience winding up with some gnarly script.

For example, we could use events and event handlers to detect the scroll position, offset value, element height, and viewport height, then calculate whether an image is in the viewport or not. But that already sounds gnarly, doesn’t it?

But it could get worse. This has direct implications on performance. Those calculations would be fired on every scroll event. Even worse, imagine a few dozen images, each having to recalculate whether it is visible or not on each scroll event. **Madness!**

[Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to the rescue! This provides a very efficient way of detecting if an element is visible in the viewport. Specifically, it allows you to configure a **callback** that is triggered when one element, called the **target** intersects with either the device viewport or a specified element. 

So, what we need to do to use it? A few things:

- create a new intersection observer
- watch the element we wish to lazy load for visibility changes
- load the element when the element is in viewport (by replacing **src** with our **data-url**)
- stop watching for visibility changes (**unobserve**) after the load completes

Vue.js has custom directives to wrap all this functionality together and use it when we need it, as many times as we need it. Putting that to use is our next step.


## 4. Create a Vue custom directive

What is a custom directive? Vue’s [documentation](https://vuejs.org/v2/guide/custom-directive.html) describes it as a way to get low-level DOM access on elements. For example, changing an attribute of a specific DOM element which, in our case, could be changing the **src** attribute of an **img** element. Perfect!

We’ll break this down in a moment, but here’s what we’re looking at as far as the code:

```js
export default {
  inserted: el => {
    function loadImage() {
      const imageElement = Array.from(el.children).find(
      el => el.nodeName === "IMG"
      )
      if (imageElement) {
        imageElement.addEventListener("load", () => {
          setTimeout(() => el.classList.add("loaded"), 100)
        });
        imageElement.addEventListener("error", () => console.log("error"))
        imageElement.src = imageElement.dataset.url
      }
    }

    function handleIntersect(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      });
    }

    function createObserver() {
      const options = {
        root: null,
        threshold: "0"
      };
      const observer = new IntersectionObserver(handleIntersect, options)
      observer.observe(el)
    }
    if (window["IntersectionObserver"]) {
      createObserver()
    } else {
      loadImage()
    }
  }
}
```

OK, let’s tackle this step-by-step.

The [hook function](https://vuejs.org/v2/guide/custom-directive.html#Hook-Functions) allows us to fire a custom logic at a specific moment of a bound element lifecycle. We use the **inserted** hook because it is called when the bound element has been inserted into its parent node (this guarantees the parent node is present). Since we want to observe visibility of an element in relation to its parent (or any ancestor), we need to use that hook.

```js
export default {
  inserted: el => {
    ...
  }
}
```

The **loadImage** function is the one responsible for replacing the **src** value with **data-url**. In it, we have access to our element **(el)** which is where we apply the directive. We can extract the **img** from that element.

Next, we check if the image exists and, if it does, we add a listener that will fire a callback function when the loading is finished. That callback will be responsible for hiding the spinner and adding the animation (fade-in effect) to the image using a CSS class. We also add a second listener that will be called in the event that the URL fails to load.

Finally, we replace the **src** of our **img** element with the source URL of the image and show it!

```js
function loadImage() {
  const imageElement = Array.from(el.children).find(
    el => el.nodeName === "IMG"
  )
  if (imageElement) {
    imageElement.addEventListener("load", () => {
      setTimeout(() => el.classList.add("loaded"), 100)
    })
    imageElement.addEventListener("error", () => console.log("error"))
    imageElement.src = imageElement.dataset.url
  }
}
```

We use Intersection Observer’s **handleIntersect** function, which is responsible for firing **loadImage** when certain conditions are met. Specifically, it is fired when Intersection Observer detects that the element enters the viewport or a parent component element.

The function has access to **entries**, which is an array of all elements that are watched by the observer and **observer** itself. We iterate through **entries** and check if a single entry becomes visible to our user with **isIntersecting** and fire the **loadImage** function if it is. Once the image is requested, we **unobserve** the element (remove it from the observer’s watch list), which prevents the image from being loaded again. And again. And again. And…

```js
function handleIntersect(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage()
      observer.unobserve(el)
    }
  })
}
```

The last piece is the [createObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Creating_an_intersection_observer) function. This guy is responsible for creating our Intersection Observer and attaching it to our element. The **IntersectionObserver** constructor accepts a callback (our **handleIntersect** function) that is fired when the observed element passes the specified **threshold** and the **options** object that carries our observer options.

Speaking of the **options** object, it uses **root** as our reference object, which we use to base the visibility of our watched element. It might be any ancestor of the object or our browser viewport if we pass **null**. The object also specifies a **threshold** value that can vary from **0** to **1** and tells us at what percent of the target’s visibility the **observer** callback should be executed, with **0** meaning as soon as even one pixel is visible and **1** meaning the whole element must be visible.

And then, after creating the Intersection Observer, we attach it to our element using the **observe** method.

```js
function createObserver() {
  const options = {
    root: null,
    threshold: "0"
  }
  const observer = new IntersectionObserver(handleIntersect, options)
  observer.observe(el)
}
```

## 5. Registering directive

To use our newly created directive, we first need to register it. There are two ways to do it: globally (available everywhere in the app) or locally (on a specified component level).
 
**Global registration**

For global registration, we import our directive and use the **Vue.directive** method to pass the name we want to call our directive and directive itself. That allows us to add a **v-lazyload** attribute to any element in our code.

```js
// main.js
import Vue from "vue"
import App from "./App"
import LazyLoadDirective from "./directives/LazyLoadDirective"

Vue.config.productionTip = false

Vue.directive("lazyload", LazyLoadDirective)

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
})
```


**Local registration**

If we want to use our directive only in a specific component and restrict the access to it, we can register the directive locally. To do that, we need to import the directive inside the component that will use it and register it in the **directives** object. That will give us the ability to add a **v-lazyload** attribute to any element in that component.

```js
import LazyLoadDirective from "./directives/LazyLoadDirective"

export default {
  directives: {
    lazyload: LazyLoadDirective
  }
}
```

## 6. Use a directive on the ImageItem component

Now that our directive has been registered, we can use it by adding **v-lazyload** on the parent element that carries our image (the **figure** tag in our case).

```html
<template>
  <figure v-lazyload class="image__wrapper">
    <ImageSpinner
      class="image__spinner"
    />
    <img
      class="image__item"
      :data-url="source"
      alt="random image"
    >
  </figure>
</template>
```

## Browser Support

We’d be remiss if we didn’t make a note about browser support. Even though the Intersection Observe API it is not supported by **all** browsers, it does cover 73% of users (as of this writing).

Not bad. Not bad at all. 

But! Having in mind that we **want** to show images to **all** users (remember that using **data-url** prevents the image from being loaded at all), we need to add one more piece to our directive. Specifically, we need to check if the browser supports Intersection Observer, and it it doesn’t, fire **loadImage** instead. This will be our fallback.
 
```js
if (window["IntersectionObserver"]) {
    createObserver();
} else {
    loadImage();
}
```

## Wrapping Up

Lazy loading images can **significantly** improve page performance because it takes the page weight hogged by images and loads them in only when the user actually needs them. 

For those still not convinced if it is worth playing with lazy loading, here’s some raw numbers from the [simple example](https://codesandbox.io/s/5v17x4zr64) we’ve been using. The list contains 11 articles with one image per article. That’s a total of 11 images (math!). It’s not like that’s a **ton** of images but we can still work with it.

Here’s what we get rending all 11 images without lazy loading on a 3G connection:
 
<BaseImage img="03.1-vue-lazy-load.png" alt="Example pre-lazy-load statistics" />

The 11 image requests contribute to an overall page size of 3.2 MB. **Oomph.**

Here’s the same page putting lazy loading to task:
 
<BaseImage img="03.2-vue-lazy-load.png" alt="Example post-lazy-load statistics" />


Say what? Only one request for one image. Our page is now 1.4 MB. We saved 10 requests and **reduced the page size by 56%**.

Is it a simple and isolated example? Yes, but the numbers still speak for themselves. Hopefully you find lazy loading an effective way to fight the battle against page bloat and that this specific approach using Vue with Intersection Observer comes in handy.