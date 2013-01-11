# Gist-Blog

A simple static blog generator based on gist. Fetching user's gist list, and render them as blog posts.

I am still working on this repo, simple, not stable, but I'm glad if you try it or fork or submit some issues :)

## Usage

  * Config your site info in `gist.json`
    * `title`: Title for your site.
    * `description`: Description for your site.
    * `username`: Your github username.
    * 'gist_filter': The RegExp String to filter your gist as your blog post.
  * `node build.js`
  * update this repo to your `gh-pages` branch

## Screenshot

![Screen Shot 2013-01-04 at 8 39 52 PM](https://f.cloud.github.com/assets/499870/43072/df0ca9ec-566b-11e2-95f1-61593a0e8452.png)


## TODO

  * Add comment.
  * ~~Add `post detail` page, for now, all post is in `index.html`~~
