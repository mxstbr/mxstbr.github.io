---
published: true
title: Linting styles in JavaScript with stylelint
tags: stylelint postcss
---

[`stylelint`](http://stylelint.io) is a linter for CSS, meaning it helps you make sure you're writing good code. It's like `eslint`, except for CSS instead of JS.

`stylelint` has a huge amount of rules and a vibrant ecosystem, which means it's the best choice for CSS linting right now. I recently co-created a styling library for React called [`styled-components`](https://styled-components.com), which let's you write actual CSS in your JavaScript.

I wanted to leverage the power and ecosystem of `stylelint` to allow developers to lint their CSS. The problem is that the `styled-components` CSS code is inside JavaScript files, and doesn't have any selectors:

```JS
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

How can we make `stylelint` lint this CSS?

## Processors

`stylelint` has support for something called a ["processor"](http://stylelint.io/user-guide/processors/). Processors allow developers to write integrations for filetypes which `stylelint` normally doesn't understand. They get the file contents, and have to return a CSS string which `stylelint` can lint.

An example would be linting CSS inside HTML (in `<style>` tags) or Markdown. (in code blocks) There are processors [for](https://github.com/mapbox/stylelint-processor-markdown) [that](https://github.com/ccbikai/stylelint-processor-html/blob/master/index.js), which basically take the HTML/Markdown file you pass to `stylelint`, parse it, take the CSS code from the `<style>` tags or fenced code blocks, and pass it to `stylelint`.

What does such a processor look like?

## Writing your own processor

The first thing you need is a main file, we'll call it `index.js`. This file has to export a function which returns an object with two keys, `code` and `result`:

```JS
// index.js

module.exports = function (options) {
  return {
    code: code,
    result: result,
  };
}
```

Both of these keys have to be functions. `code` is a function that gets passed the contents of the file the user wants to lint, and should return the extracted CSS code for `stylelint` to lint. `result` is a function that gets passed the linting result as an object, which you can optionally mutate to adjust things like source maps or error messages.

For example, for the `styled-components` processor I replace each mention of "brace" in the warnings with "backtick", since you generally don't have braces when writing `styled-components`.

```JS
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

This is the basic idea of a `stylelint` processor. How exactly you extract the CSS or how much or little you adjust the source map and result is very much up to your use case.

Take a look at the excellent, well commented and tested [`stylelint-processor-markdown`](https://github.com/mapbox/stylelint-processor-markdown) by [@davidtheclark](https://twitter.com/davidtheclark) for some inspiration on how to write a `stylelint` processor!
