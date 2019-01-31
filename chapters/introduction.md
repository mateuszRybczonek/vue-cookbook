---
layout: chapter
title: "Introduction"
chapter_number: "01"
description: In this chapter you will get to know what is Vue Cookbook and how it can help you.
---

# Introduction

## The Cookbook vs the Guide
How is the cookbook different from the guide? Why is this necessary?

* Greater Focus: In the guide, we’re essentially telling a story. Each section builds on and assumes knowledge from each previous section. In the cookbook, each recipe can and should stand on its own. This means recipes can focus on one specific aspect of Vue, rather than having to give a general overview.

* Greater Depth: To avoid making the guide too long, we try to include only the simplest possible examples to help you understand each feature. Then we move on. In the cookbook, we can include more complex examples, combining features in interesting ways. Each recipe can also be as long and detailed as it needs to be, in order to fully explore its niche.

* Teaching JavaScript: In the guide, we assume at least intermediate familiarity with ES5 JavaScript. For example, we won’t explain how Array.prototype.filter works in a computed property that filters a list. In the cookbook however, essential JavaScript features (including ES6/2015+) can be explored and explained in the context of how they help us build better Vue applications.

* Exploring the Ecosystem: For advanced features, we assume some ecosystem knowledge. For example, if you want to use single-file components in Webpack, we don’t explain how to configure the non-Vue parts of the Webpack config. In the cookbook, we have the space to explore these ecosystem libraries in more depth - at least to the extent that is universally useful for Vue developers.

## What we’re looking for
The Cookbook gives developers examples to work off of that both cover common or interesting use cases, and also progressively explain more complex detail. Our goal is to move beyond a simple introductory example, and demonstrate concepts that are more widely applicable, as well as some caveats to the approach.

If you’re interested in contributing, please initiate collaboration by filing an issue under the tag cookbook idea with your concept so that we can help guide you to a successful pull request. After your idea has been approved, please follow the template below as much as possible. Some sections are required, and some are optional. Following the numerical order is strongly suggested, but not required.

### Recipes should generally:

* Solve a specific, common problem
* Start with the simplest possible example
* Introduce complexities one at a time
* Link to other docs, rather than re-explaining concepts
* Describe the problem, rather than assuming familiarity
* Explain the process, rather than just the end result
* Explain the pros and cons of your strategy, including when it is and isn’t appropriate
* Mention alternative solutions, if relevant, but leave in-depth explorations to a separate recipe
* We request that you follow the template below. We understand, however, that there are times when you may necessarily need to deviate for clarity or flow. Either way, all recipes should at some point discuss the nuance of the choice made using this pattern, preferably in the form of the alternative patterns section.