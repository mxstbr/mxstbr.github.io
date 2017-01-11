---
published: true
hidden: true
title: "Build your first Node.js microservice"
tags: node micro zeit
twitter_large: true
image: micro-meta-image.png
custom_excerpt: "A microservice is a single, self-contained unit which, together with many others, makes up a large application. Let's write our first microservice in JavaScript!"
---

A microservice is a single self-contained unit which, together with many others, makes up a large application. By splitting your app into small units every part of it is independently deployable and scalable, can be written by different teams and in different programming languages and can be tested individually. (a bit like a component in a React application!)

[`micro`](https://github.com/zeit/micro) is a tiny, ~100 lines of code module that makes writing a microservice in Node.js a joy. It's easy to use and super fast. No matter if you've used Node.js before or not, you'll be able to understand what's going on here.

## The Setup

There are two tiny steps needed for the setup, first we need to install `micro`:

```
npm install -g micro
```

> I'm installing it globally to make sure we get access to the `micro` command. If you know how to use npm scripts, feel free to use those instead!

And second we need to create a file that will contain our microservice. Let's call it `index.js`:

```
touch index.js
```

## The First Steps

Our `index.js` file needs to export a single function, which `micro` will pass the incoming request and a response object to:

```javascript
module.exports = function (request, response) {
  // Your microservice here
}
```

The main function we'll use from `micro` is `send`, which allows us to send a response back to the client requesting something. Let's `require` it and send back a simple "Hello World" string no matter what the request is:

```javascript
const { send } = require('micro')

module.exports = function (request, response) {
  send(response, 200, 'Hello World! 👋')
}
```

`send` takes the response we want to send as the first argument, the HTTP status code the response should have as the second argument and some body (can also be JSON) as the third argument.

Starting our microservice is just one command away:

```
$ micro index.js

  Ready! Listening on http://0.0.0.0:3000
```

Open the page in your browser and this is what you'll see:

![A browser page showing "Hello World! 👋"](/img/micro-hello-world.png)

## Building something useful

Since that's quite boring, let's build something useful! We want to make a microservice which remembers how many times a certain path has been requested. So if a request to `/foo` comes in, the request should return `1`. If another request to `/foo` comes in, the rquest should return `2`!

The first thing we need is the pathname of the requested URL. The requested URL is at `request.url` (surprise!), and Node.js has the `url` core module (so you don't need to install it) which can parse URL strings. Perfect for our needs!

Let's require the `url` module  and parse the requested URL to get the `pathname`:

```javascript
const { send } = require('micro')
const url = require('url')

module.exports = function (request, response) {
  const { pathname } = url.parse(request.url)
  console.log(pathname)
  send(response, 200, 'Hello World! 👋')
}
```

Restart our microservice (press `CTRL+C`, then enter `micro index.js` again) and try it out. Requesting `localhost:3000/foo` logs `/foo` to the terminal, and requesting `localhost:3000/bar` will log `/bar`.

Now that we have the pathname, the last step is to save the requests that have come to that specific path. Let's create a global object called `visits`, which will be responsible for saving all the visits to that path:

```javascript
const { send } = require('micro')
const url = require('url')

const visits = {}

module.exports = function (request, response) {
  const { pathname } = url.parse(request.url)
  send(response, 200, 'Hello World! 👋')
}
```

Every time a request comes in we check if `visits[pathname]` already exists. If it does, we increment the views and send them back to the client. If it doesn't, we set it to `1` and send that back to the client.

```javascript
const { send } = require('micro')
const url = require('url')

const visits = {}

module.exports = function (request, response) {
  const { pathname } = url.parse(request.url)

  if (visits[pathname]) {
    visits[pathname] = visits[pathname] + 1
  } else {
    visits[pathname] = 1
  }

  send(response, 200, `This page has ${visits[pathname]} visits!`)
}
```

Restart the service again, open `localhost:3000/foo` in your browser and refresh a bunch of times. This what you'll see:

![A webpage showing "This page has 5 visits!"](/img/micro-visit-counter.png)

Amazing, it works!

> This is basically how I ended up building [`micro-analytics`](https://github.com/mxstbr/micro-analytics) in a few hours. It's the same concept, with a few more features, and once I knew what I was building the code to build it was easy.

## Persisting Data

Something you might notice about our service is that the data is deleted whenever we restart the server. We don't save the visits to a database, they solely exists in memory.

Let's fix that! We'll use `level`, a simple file-based key-value storage, to persist data across server restarts.

```
npm install level
```

`micro` has built-in support for `async/await`, which makes asynchronous code look beautiful. The issue is that `level` is callback based, not Promise based. 😕

As always, `npm` has the modules we need. [Forbes Lindesay](https://twitter.com/ForbesLindesay) wrote `then-levelup`, which allows us to promisify `level`. Don't worry if you don't understand all that, you'll see what it means very soon! Let's install that module too:

```
npm install then-levelup
```

To create our database we require those two modules and wrap them inside each other. We need to tell `level` where to save the database, and that we want the storage to be JSON encoded so we can store numbers. We'll also export an `async` function instead of a normal one:

```javascript
const { send } = require('micro')
const url = require('url')
const level = require('level')
const promisifiy = require('then-levelup')

const db = promisify(level('visits.db', {
  valueEncoding: 'json'
}))

module.exports = async function (request, response) {
  /* ... */
}
```

Our database has two function we'll need: `db.put(key, value)` to save some data (that's kinda like `visits[pathname] = x`) and `db.get(key)` to get the data back out again! (that's kinda like `const x = visits[pathname]`)

First, we want to see if there are current visits for that pathname in the database. We do this with `db.get(pathname)`, and we wait for that to finish with the `await` keyword:

```javascript
module.exports = async function (request, response) {
  const { pathname } = url.parse(request.url)

  const currentVisits = await db.get(pathname)
}
```

If we didn't put `await` there, `currentVisits` would be a Promise and the function would go on before we have the value — not what we want!

Contrary to before, if there are no current visits `db.get` will throw a "NotFoundError", which we have to catch with a `try/catch` block. When that happens we have to `db.put` the initial value for a path, which is `1`:

```javascript
/* ... */

module.exports = async function (request, response) {
  const { pathname } = url.parse(request.url)

  try {
    const currentVisits = await db.get(pathname)
  } catch (error) {
    if (error.notFound) await db.put(pathname, 1)
  }
}
```

There is two small thing to do before this works, we need to increment the current visits when we already have visits, and we need to send back the response again:

```javascript
/* ... */

module.exports = async function (request, response) {
  const { pathname } = url.parse(request.url)

  try {
    const currentVisits = await db.get(pathname)
    await db.put(pathname, currentVisits + 1)
  } catch (error) {
    if (error.notFound) await db.put(pathname, 1)
  }

  send(response, 200, `This page has ${await db.get(pathname)} visits!`)
}
```

That's everything we need to do! Now the visits of a page are persisted across server restarts, and written to the `vists.db` file. Try it out by restarting the service, opening `localhost:3000/foo` a bunch of times, then restarting the service again and going to the same page. You'll see that your previous visits are still counted, even though you restarted the service.

Amazing, we just built a page counter and it only took us a few short minutes! 🎉

**That's the power of small, focussed modules in Node.js: Instead of having to mess around with primitives directly, we just write our app.**
