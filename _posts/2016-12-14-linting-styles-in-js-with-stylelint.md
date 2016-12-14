---
published: true
hidden: true
title: Linting styles in JavaScript with stylelint
tags: stylelint postcss
---

I recently co-created a styling library for React called [`styled-components`](https://styled-components.com), which let's you write actual CSS in your JavaScript. The issue is that you write this CSS inside strings and without selectors:

```javascript
const Button = styled.button`
  background: tomato;
  border-radius: 3px;
  color: white;
  font-size: 1em;

  @media screen and (min-width: 750px) {
    font-size: 1.1em;
  }
`;
```

[`stylelint`](http://stylelint.io) is a linter for CSS, meaning it helps you make sure you're writing good code. It's like `eslint`, except for CSS instead of JS. `stylelint` has a huge amount of rules and a vibrant ecosystem, which means it's the best choice for CSS linting right now.

Leveraging the power and ecosystem of `stylelint` to allow developers to lint their CSS in `styled-components` seems like a great thing to do! How can we make that happen?

## First try

My first idea was to leverage the power of `eslint`, the JavaScript linter, to parse the JavaScript and then run `stylelint` from there on the CSS string. A lot of people already use and rely on `eslint`, so providing an eslint rule that does this would be easy to adopt and use.

Sadly, that doesn't work. I built a first prototype, but for some reason the stylelint results weren't coming back to the CLI from `eslint`! I asked around and somebody in the `eslint` Gitter chatroom explained to me why:

**`eslint` rules have to be sync, but `stylelint` has to be run async.**

Ugh, super annoying! Back to the drawing board. As always, I sent out a frustrated tweet on [Twitter](https://twitter.com/mxstbr). Somebody helpfully replied that I should check out `stylelint` processors, since they seem to be exactly for my use case!

Huh, processors? Never heard of those...

## Processors

As it turns out, `stylelint` has support for custom ["processors"](http://stylelint.io/user-guide/processors/). Processors allow developers to add support for filetypes which `stylelint` normally doesn't understand. They get the file contents, and have to return a CSS string which `stylelint` can lint.

One of the most common use cases would be linting CSS inside HTML (in `<style>` tags) or Markdown. (in code blocks) There are processors [for](https://github.com/mapbox/stylelint-processor-markdown) [that](https://github.com/ccbikai/stylelint-processor-html/blob/master/index.js), which basically take the HTML/Markdown file you pass to `stylelint`, parse it, take the CSS code from the `<style>` tags or fenced code blocks, and pass it to `stylelint`.

That sounds exactly like what I need! How do I write one?!

### Writing a processor

The main file of your processor has to export a function which returns an object with two keys, `code` and `result`:

```javascript
// index.js

module.exports = function (options) {
  return {
    code: code,
    result: result,
  };
}
```

Both values of these properties have to be functions:

- `code` is a function that gets passed the contents of the file the user wants to lint, and should return the extracted CSS code for `stylelint` to lint.
- `result` is a function that gets passed the linting result as an object, which you can optionally mutate to adjust things like source maps or error messages.

```javascript
// index.js

module.exports = function (options) {
  return {
    code: function (input, filename) {
      return extractCSS(input);
    },
    result: function (stylelintResult, filename) {
      return fixSourceMap(stylelintResult);
    },
  };
}
```

In the `code` step, my `styled-components` processor parses the incoming JavaScript files with [`babylon`](https://github.com/babel/babylon). (the parser Babel uses under the hood) Then it gets the content of all the tagged template literals that are `styled-components` related and fixes the resulting CSS to be "real" CSS with selectors etc. before passing it to `stylelint`.

In the `result` step I then replace each mention of "brace" in all error messages with "backtick", since you generally don't have braces when writing `styled-components`, and adjust the source map to fit the JavaScript file again.

This is what that looks like now that it's done 🎉

<video width="100%" height="334.5px" loop controls id="stylelint-video" data-src="/img/stylelint-processor.mov"></video>

While it _works_, as you can imagine there's quite a few edge cases and I definitely haven't fixed all of them yet. Feel free to take a look [at the source](https://github.com/styled-components/stylelint-processor-styled-components) and if you use `styled-components` please try it out and let me know how it went!

*To see what a really well tested, commented and perfectly working processor looks like take a look at the excellent [`stylelint-processor-markdown`](https://github.com/mapbox/stylelint-processor-markdown) by [@davidtheclark](https://twitter.com/davidtheclark) for some inspiration!*

<script>
  // Lazy load the video onload so it doesn't block the rendering
  window.onload = function() {
		setTimeout(function() {
	    var video = document.querySelector('#stylelint-video')
	    var sourceFile = video.getAttribute('data-src')
	    video.setAttribute('src', sourceFile)
	    video.load()
		}, 500)
  }
</script>
