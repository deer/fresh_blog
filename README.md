[![Coverage Status](https://coveralls.io/repos/github/deer/fresh_blog/badge.svg?branch=main)](https://coveralls.io/github/deer/fresh_blog?branch=main)

## Fresh Blog

This project provides a
[Fresh Plugin](https://fresh.deno.dev/docs/concepts/plugins) that allows for the
easy creation of a blog.

Inspired by
[https://github.com/lumeland/theme-simple-blog](https://github.com/lumeland/theme-simple-blog)
and
[https://github.com/denoland/deno_blog](https://github.com/denoland/deno_blog).

## Demo

The `tests/fixture` folder within this repository provides an example of this
plugin being used to power a project.

## Features

So what does this actually do? It registers one middleware to load the posts and
stash them in a global context for later usage. I'm open to PRs on improving
this!

Additionally, it provides the following routes:

- an `_app.tsx` for the layout (this should be configurable in the future)
- a `blog/[slug]` route for actually showing posts
- an `index` route for showing post excerpts and a paginated listing of posts
- an `author/[author]` route for showing all posts of a certain author
- an `archive` route for showing all posts, with a listing of tags for filtering
- an `archive/[tag]` route for showing all posts of a particular tag

## Usage

In your `main.ts` (or wherever you invoke `start`) add an import like the
following:

```ts
import {
  BlogOptions,
  blogPlugin,
  Localization,
} from "https://deno.land/x/fresh_blog@0.0.1/mod.ts";
```

(Note: you probably want to use the latest version, which isn't 0.0.1, but don't
do this: `https://deno.land/x/fresh_blog/mod.ts` either.)

You'll need to configure the plugin. An example could be something like this:

```ts
const blogOptions: BlogOptions = {
  title: "Reed's Blog",
  rootPath: import.meta.url,
  navbarItems: {
    Archive: "/archive",
    About: "/about",
    Contact: "/contact",
    Projects: "/projects",
  },
  strings: {
    lang: "en",
    attribution: "Author:",
  },
};
```

Then change your `start` invocation like so:

```diff
-await start(manifest);
+await start(manifest, { plugins: [blogPlugin(blogOptions)] });
```

Put your posts in a `posts` folder at the root of your project. My personal blog
looks like this:

```
tree
.
├── README.md
├── deno.json
├── dev.ts
├── fresh.gen.ts
├── main.ts
├── posts
│   └── (lots of posts here)
├── routes
│   ├── about.tsx
│   ├── contact.tsx
│   └── projects.tsx
├── static
│   ├── favicon.ico
│   └── logo.svg
└── twind.config.ts
```

Note how I'm not providing any index file -- that comes from the plugin.

### Separate Index

Don't want the blog listing to be the index page? No problem: simply set your
`BlogOptions` object to have `separateIndex` set to true. You'll need to provide
your own `index.tsx` route in order to avoid errors now. The blog get shunted
into a /blog/ route as a result.

### Posts Per Page

There's also an option to configure the `postsPerPage` which defaults to 10.

### Localization and String Overrides

You don't like some of the wording built into the blog? Simply provide your own
`strings` object in the config:

```tsx
strings: {
  lang: "en",
  attribution: "Author:",
},
```

Note: we provide some built in localizations as well (currently just EN and ES)
for you. Feel free to use one of these as a starting point, and then override
any of the following strings as you see fit:

- attribution
- nextPage
- previousPage
- nextPost
- previousPost
- continueReading
- noPostsFound
- blogTitleEnding
- archiveTitleEnding
- authorTitleEnding

### Notion as a CMS

If you want to use Notion as a CMS, then you'll need to leverage the `sources`
property in your config. It's currently typed like this:

```ts
export type Source = "local" | "notion";
```

You can have both local and notion based posts. In order for things to work,
you'll need to create a database that has the following columns:

- slug
- Date
- Excerpt
- Description
- Draft
- Author
- Tags

The actual content needs to (currently) be in a markdown code block within the
page. The content in the code block is the only block which will get pulled into
the post.

You also need to configure the following env variables:

- BLOG_NOTION_API_KEY
- BLOG_NOTION_DATABASE_ID $$

### Post Details

Front matter should be in the following format:

```md
---
title: "Collaboration is Great"
date: 2023-6-19 04:38
author:
  - Reed von Redwitz
  - Guest Author
tags:
  - placeholder
---
```

Note that you can also provide authors and tags as single values:

```md
---
title: "Single Tag"
date: 2023-7-10
author: Single McTag
tags: single-tag-test
---
```

To get a snippet (excerpt) to appear on the index page, add the following to
function as a separator within your content:

```md
<!--more-->
```
