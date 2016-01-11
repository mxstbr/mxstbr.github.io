---
published: false
title: npm scripts
tags: nodejs npm tooling
---

`npm` has support for the `scripts` property in the `package.json` file — one of the most used, but also one of the most overlooked features of `npm`!

## What does the `scripts` property do?

Chances are high you're using scripts if you're using `npm`: Whenever you type `npm run <command>` (which is a short version of `npm run-script <command>`), that's a script being ran. There's also default scripts for which you can omit the `run`, e.g. `npm test` is the same thing as `npm run test`, so `npm test` also uses scripts.

The thing that makes `npm run` so powerful is that it adds `node_modules/.bin` (which is where dependencies are installed) to the `PATH` provided to scripts. In english this means that you can use your installed dependencies on the command line without having to install them globally!

## Real world usage

Lets say you're using [Mocha](https://mochajs.org) for unit testing. If you want to run your unit tests, you normally have to `npm install -g mocha` (the `-g` argument installs the package globally on your machine) to get access to the `mocha` terminal command. This allows you to run your unit tests in the terminal:

```
$ mocha *.test.js
```

This works, but it also requires all developers working on that project to `npm install -g mocha`. Not everybody might have permissions to do that on their machine, or somebody might forget and it's going to lead to annoying problems down the road.

### npm scripts to the rescue!

Using npm scripts, we can specify Mocha as a `devDependency` in our `package.json`:

```JSON
"devDependencies": {
  "mocha": ""
}
```

> Note: Please don't forget to add a [version range](https://docs.npmjs.com/misc/semver) so breaking changes in Mocha won't mess with your setup.

Now, when developers run `npm install` (which is part of every initial setup anyway), they have Mocha installed. The problem is that it isn't globally installed, so entering `$ mocha *.test.js` into the terminal will give you an `/usr/local/bin/mocha: No such file or directory` error.

We can work around this by adding a `test` script to your `package.json`. Since npm scripts add the `node_modules` folder to the `PATH`, we have access to the `mocha` command from there even though it isn't globally installed!

Lets add that `test` script:

```JSON
"scripts": {
  "test": "mocha *.test.js"
}
```

Now your collaborators can enter `$ npm test` into the terminal and Mocha will unit test your application without needing to globally install anything!
