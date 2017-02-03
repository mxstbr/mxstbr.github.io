---
published: true
hidden: true
title: "A deep dive into children in React"
---

The core of React is components. You can nest these components like you would nest HTML tags, which makes is easy to write JSX since it resembles markup.

When I first started learning React, I thought "Put `this.props.children` everywhere, and that's all there is to know about children". Boy, was I wrong.

Because we're working with JavaScript, we can manipulate child components. We can send special properties to them, decide if we want them to render or not and generally manipulate them to our will. Let's dig into the magic that is children in React.

## Table of contents

- [Child components](#child-components)
  - [Everything can be a child](#everything-can-be-a-child)
  - [Function as a child](#function-as-a-child)
- [Manipulating children](#manipulating-children)
  - [Looping over children](#looping-over-children)
  - [Counting children](#counting-children)
  - [Converting children to an array](#converting-children-to-an-array)
  - [Enforcing a single child](#enforcing-a-single-child)

## Child components

Let's say we have a `<Grid />` component which can contain `<Row />` components. You'd use it like so:

```html
<Grid>
  <Row />
  <Row />
  <Row />
</Grid>
```

<figure>
  <a target="_blank" href="http://www.webpackbin.com/Ekg_vyjPz">
    <img alt="The rendered components, one Grid containing three rows" src="/img/react-children-grid-row.png" />
    <figcaption><a target="_blank" href="http://www.webpackbin.com/Ekg_vyjPz">(Live demo)</a></figcaption>
  </a>
</figure>

These three `Row` components are passed to the `Grid` component as `props.children`. Using an _expression container_ (that's the technical term for those squiggly brackets in JSX) parents can render their children:

```javascript
class Grid extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}
```

Parents can also decide not to render any children or to manipulate them before rendering. For example, this `<Fullstop />` component does not render its children at all:

```javascript
class Fullstop extends React.Component {
  render() {
    return <h1>Hello world!</h1>
  }
}
```

No matter which children you pass to this component, it will always show "Hello world!" and nothing else. Full stop.

> Note: The `<h1>` in the example above (much like all the HTML primitives) does render its children, in this case 'Hello World!'.

### Everything can be a child

Children in React don't have to be components, they can be anything. For example, we can pass our `<Grid />` component from above some text as children and it'll work perfectly fine:

```html
<Grid>Hello world!</Grid>
```

<figure>
  <a target="_blank" href="http://www.webpackbin.com/N1FUPocvz">
    <img alt="The grid component rendering 'Hello world!'" src="/img/react-children-grid-string.png" />
    <figcaption><a target="_blank" href="http://www.webpackbin.com/N1FUPocvz">(Live demo)</a></figcaption>
  </a>
</figure>

JSX will automatically remove whitespace on the beginning and ending of a line as well as blank lines. It also condenses blank lines in the middle of string literals into one space.

This means all of these examples will render the same thing:

```html
<Grid>Hello world!</Grid>

<Grid>
  Hello world!
</Grid>

<Grid>
  Hello
  world!
</Grid>

<Grid>

  Hello world!
</Grid>
```

You can also mix and match multiple types of children perfectly fine:

```html
<Grid>
  Here is a row:
  <Row />
  Here is another row:
  <Row />
</Grid>
```

<figure>
  <a target="_blank" href="http://www.webpackbin.com/E1IpLQ3PM">
    <img alt="The grid component rendering two rows and some text" src="/img/react-children-grid-mixed.png" />
    <figcaption><a target="_blank" href="http://www.webpackbin.com/E1IpLQ3PM">(Live demo)</a></figcaption>
  </a>
</figure>

### Function as a child

We can pass any JavaScript expression as children. This includes functions.

To illustrate what that would look like, this is a component which executes a function passed to it as a child:

```javascript
class Executioner extends React.Component {
  render() {
    // See how we're calling the child as a function?
    //                        ↓
    return this.props.children()
  }
}
```

You'd use this component like so:

```javascript
<Executioner>
  {() => <h1>Hello World!</h1>}
</Executioner>
```

This specific example isn't useful, of course, but it shows the idea.

Imagine you had to fetch some data from a server. You could do this in a variety of ways, but it's possible with this function-as-a-child pattern:

```javascript
<Fetch url="api.myself.com">
  {(result) => <p>{result}</p>}
</Fetch>
```

Spend a minute to play around with [this bin](http://www.webpackbin.com/NymfRpcwf) and see if you can figure out how to make this work. ([here](http://www.webpackbin.com/NkoIz1owG) is my go at it)

Don't worry if this is over your head. All I want is that you're not surprised when you see this in the wild. With children, anything goes.

## Manipulating children

If you take a look at the React docs you will see it says that "children are an _opaque data structure_". What they are essentially telling us is that `props.children` can be any type, such as an array, a function, an object, etc. Since you can pass anything, you can never know for sure.

React provides a bunch of helper functions to make manipulating children easy and painless. These are available at `React.Children`.

### Looping over children

The two most obvious helpers are `React.Children.map` and `React.Children.forEach`. They work exactly like their array counterparts, except they also work when a function, object or anything is passed as children.

```javascript
class IgnoreFirstChild extends React.Component {
  render() {
    const children = this.props.children
    return (
      <div>
        {React.Children.map(children, (child, i) => {
          // Ignore the first child
          if (i < 1) return
          return child
        })}
      </div>
    )
  }
}
```

The `<IgnoreFirstChild />` component here maps over all its children, ignoring the first child and returning all the others.

```javascript
<IgnoreFirstChild>
  <h1>First</h1>
  <h1>Second</h1> // <- Only this is rendered
</IgnoreFirstChild>
```

<figure>
  <a target="_blank" href="http://www.webpackbin.com/NyfgFQ2wz">
    <img alt="Some text saying 'Second'" src="/img/react-children-map.png" />
    <figcaption><a target="_blank" href="http://www.webpackbin.com/NyfgFQ2wz">(Live demo)</a></figcaption>
  </a>
</figure>

In this case, we could've also used `this.props.children.map`. But what would've happened if somebody passed a function as a child? `this.props.children` would've been a function instead of an array, and we would've had an error! 😱

![TypeError: this.props.children.map is not a function](/img/react-children-error.png)

With the `React.Children.map` function though, this is no problem whatsoever:

```javascript
<IgnoreFirstChild>
  {() => <h1>First</h1>} // <- Ignored 💪
</IgnoreFirstChild>
```

### Counting children

Since `this.props.children` can be any type, checking how _many_ children a component has turns out to be rather hard! Naïvely doing `this.props.children.length` would break when passed a String or a function. We'd have one child, `"Hello World!"`, but the `.length` would be reported as `12` instead!

That's why we have `React.Children.count`:

```javascript
class ChildrenCounter extends React.Component {
  render() {
    return <p>React.Children.count(this.props.children)</p>
  }
}
```

It returns the number of children no matter what type they are:

```javascript
// Renders "1"
<ChildrenCounter>
  Second!
</ChildrenCounter>

// Renders "2"
<ChildrenCounter>
  <p>First</p>
  <ChildComponent />
</ChildrenCounter>

// Renders "3"
<ChildrenCounter>
  {() => <h1>First!</h1>}
  Second!
  <p>Third!</p>
</ChildrenCounter>
```

### Converting children to an array

As a last resort, if none of the above methods fit your need, you can convert your children to an array with `React.Children.toArray`. This would be useful if you needed to e.g. sort them:

```javascript
class Sort extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children)
    // Sort and render the children
    return <p>{children.sort().join(' ')}</p>
  }
}
```

```javascript
<Sort>
  // We use expression containers to make sure our strings
  // are passed as three children, not as one string
  {'bananas'}{'oranges'}{'apples'}
</Sort>
```

The above example renders the strings, but sorted:

<figure>
  <a target="_blank" href="http://www.webpackbin.com/NyE2TQhwz">
    <img alt="apples bananas oranges" src="/img/react-children-apples-bananas-oranges.png" />
    <figcaption><a target="_blank" href="http://www.webpackbin.com/NyE2TQhwz">(Live demo)</a></figcaption>
  </a>
</figure>

### Enforcing a single child

If you think back to our `<Executioner />` component above, it expects only a single child to be passed, which has to be a function.

```javascript
class Executioner extends React.Component {
  render() {
    return this.props.children()
  }
}
```

We could try to enforce this with `propTypes`, which would look something like this:

```javascript
Executioner.propTypes = {
  children: React.PropTypes.func.isRequired,
}
```

That would log a message to the console though, something developers could ignore. Instead, we can use `React.Children.only` inside our `render` method!

```javascript
class Executioner extends React.Component {
  render() {
    return React.Children.only(this.props.children)()
  }
}
```

This returns the only child in `this.props.children`. If there is more than one child, it throws an error, thusly grinding the entire app to a halt—perfect to avoid lazy devs trying to mess with our component. 😎

## Editing children

<small class="footnote">Thanks to [Karl Horky](https://twitter.com/karlhorky){:target="_blank"}.</small>
