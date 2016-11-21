---
published: true
title: Inline Styles and CSS-in-JS are not the same thing
tags: styling react inline css-in-js
---

With the emergence and popularity of libraries like Radium, JSS, Aphrodite and `styled-components`, everybody has been talking about styles in JavaScript. What many people don't realise is that there's a difference between what's called "inline styles" and what's called "CSS-in-JS".

Putting your styles into JavaScript ≠ putting your styles into JavaScript!

## Inline styles

As the name might suggest, "inline styles" attach your styles inline to the actual DOM nodes. This is possible with natively with React, or you can enhance your inline styles with a library like [Radium](https://github.com/FormidableLabs/radium).

This is what using inline styles looks like:

```JS
const styles = {
	backgroundColor: 'palevioletred',
	color: 'papayawhip',
};

<button style={styles} />
```

> No matter if you're using native React inline styles or Radium, both of them look the same way.

In the actual browsers DOM, React goes ahead and attaches those styles as strings to the DOM nodes:

```HTML
<button style="background-color: palevioletred; color: papayawhip;" />
```

## CSS-in-JS

CSS-in-JS doesn't have native support in React. This means that there's lots of different libraries to make CSS-in-JS happen.

This is what using CSS-in-JS with [`aphrodite`](https://github.com/khan/aphrodite) looks like:

```JS
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
	button: {
		backgroundColor: 'palevioletred',
		color: 'papayawhip',
	},
});

<button className={css(styles.button)} />
```

If you take a look into the DOM this is what you'll see:

```HTML
<style>
.1kt7baa {
	background-color: palevioletred;
	color: papayawhip;
}
</style>

<button class="1kt7baa" />
```

The same is also the case for [`styled-components`](https://github.com/styled-components/styled-components). If you look at a `styled-components` example, you won't see anything being attached to the `className` prop but `styled-components` does that under the hood:

```JS
import styled from 'styled-components';

const Button = styled.button`
  background-color: palevioletred;
  color: papayawhip;
`
```

Rendering this `<Button>` component will output this to the DOM:

```HTML
<style>
.dRUXBm {
  background-color: palevioletred;
  color: papayawhip;
}
</style>

<button class="dRUXBm" />
```

> Other examples of CSS-in-JS libraries include [JSS](https://github.com/cssinjs/jss), [`glamor`](https://github.com/threepointone/glamor) and many more.

## Differences

The biggest difference is that inline styles only support a subset of CSS. Putting your styles inline means you cannot use pseudo selectors, media queries, keyframes etc.

Using a library like Radium remedies some of that. Radium wraps your components and adds support for `:hover` and media queries by attaching event handlers. But they cannot alias all CSS features in JavaScript, many pseudo selectors (like `:disabled`, `:before`, `:nth-child`) and styling the `html` and `body` tags aren't supported.

With CSS-in-JS, you have all the power of CSS at your fingertips without having to resort to JavaScript events. Since actual CSS is exported, you can use every media query and pseudo selector you can think of. Some libraries (like `jss`, `styled-components`) even add support for neat, non-CSS-native features like nesting!

*In my personal, very biased opinion (I'm a co-creator of `styled-components`), CSS-in-JS is the way to go. CSS-in-JS offers the same benefits as inline styles with none of the downsides.*
