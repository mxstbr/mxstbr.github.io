---
published: true
title: CSS3 Animation Events in JavaScript
categories: javascript css animation
---

## Basics
There are 3 different events you can bind in JavaScript regarding CSS3 animations:

1. `animationstart` — fires when the animation starts
2. `animationiteration` — fires when an animation loop starts again
3. `animationend` — fires when an animation ends (attention, never fires for infinite animations)

Even though these events are supported by most browsers, prefixes have to be included for Safari, IE and Opera. To make our life even worse, the prefixed versions are camelCased, while the normal version is not. 

## Prefixing
With help of the great [Rachel Nabors](https://twitter.com/RachelNabors), I created a handy snippet to make using those events easier. They will save the correctly prefixed version in the global `animationStart`, `animationIteration` and `animationEnd` variables, which you can then use to bind the event.

```JavaScript
var prefixes = ["webkit", "moz", "MS", "o"];
var elem = document.createElement('div');

// Animation Start
for(var i = 0; i < prefixes.length; i++) {
      if(elem.style[prefixes[i] + "AnimationStart"] !== undefined){
          window.animationStart = animations[t];
      }
}
if (!window.animationStart) {
    window.animationStart = "animationstart";
}

// Animation Iteration
for(var i = 0; i < prefixes.length; i++) {
    if(elem.style[prefixes[i] + "AnimationIteration"] !== undefined){
        window.animationIteration = animations[t];
        break;
    }
}
if (!window.animationIteration) {
    window.animationStart = "animationiteration";
}

// Animation End
for(var i = 0; i < prefixes.length; i++) {
    if(elem.style[prefixes[i] + "AnimationEnd"] !== undefined){
        window.animationEnd = animations[t];
        break;
    }
}
if (!window.animationEnd) {
    window.animationEnd = "animationend";
}
```

Now we just need to bind the event, calling the `doSomething` function when it fires:

```
element.addEventListener(animationStart, doSomething, false);
element.addEventListener(animationIteration, doSomething, false);
element.addEventListener(animationEnd, doSomething, false);
```

Have fun playing around with CSS3 animation and the events!