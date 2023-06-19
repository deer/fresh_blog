## Fresh Blog

This project provides a
[Fresh Plugin](https://fresh.deno.dev/docs/concepts/plugins) that allows for the
easy creation of a blog.

Inspired by
[https://github.com/lumeland/theme-simple-blog](https://github.com/lumeland/theme-simple-blog)
and
[https://github.com/denoland/deno_blog](https://github.com/denoland/deno_blog).

## Warning

This requires a forked version of Fresh, due to two issues:

- props not having access to state
- plugins not being able to create middleware and routes

The branch in my fork can be found in the demo's `deno.json` file.

## Demo

The demo folder contains an example blog using this plugin.

### Another Warning

Currently the `islands` and `routes` folders are required by Fresh, even though
they're empty for this demo. All of the routes are provided by the plugin. You
just need to bring the posts!
