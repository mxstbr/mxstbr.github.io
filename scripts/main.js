'use strict';

// Get most common elements
var wrapper = document.querySelector('.wrapper');
var post = document.querySelector('.post');
var footer = document.querySelector('footer');

// Align the title backgrounds asap
alignTitleBackgrounds();

// Deep link to headings
// https://github.com/callmecavs/heading-links.js
if (post !== null) {
	function HeadingLinks( options ) {
	  // defaults
	  this._selector          = options.selector || 'h1, h2, h3';
	  this._hoverLinks        = options.hoverLinks !== false;
	  this._hoverHeadingAttr  = options.hoverHeadingAttr || 'data-heading';
	  this._hoverLinkAttr     = options.hoverLinkAttr || 'data-heading-link';
	  if (window.innerWidth < 500) {
	  	this._hoverLinkPosition = 'after';
	  } else {
	  	this._hoverLinkPosition = 'before';
	  }

	  // headings vars
	  this._headings       = post.querySelectorAll(this._selector);
	  this._headingsLength = this._headings.length;

	  // call to create
	  document.addEventListener('DOMContentLoaded', this.create(), false);
	}

	// METHODS

	HeadingLinks.prototype.create = function() {
	  // loop through headings
	  for(var index = 0; index < this._headingsLength; index++) {
	    // get node
	    var element = this._headings[index];

	    // get heading text
	    var elementText = element.textContent;

	    // convert text to kebab-case
	    elementText = elementText.toLowerCase()                 // convert to lower case
	                             .replace(/[^\w\s]/gi, '')      // remove special chars, but preserve spaces
	                             .replace(/\s+/g, '-')          // replace spaces with dashes
	                             .replace(/\_+/g, '');          // remove underscores

	    // add id attribute to element
	    element.setAttribute('id', elementText);
	  }

	  // optionally add hover links
	  if(this._hoverLinks) {
	    this.addHoverLinks();
	  }
	}

	HeadingLinks.prototype.destroy = function() {
	  // loop through headings
	  for(var index = 0; index < this._headingsLength; index++) {
	    // remove id attribute
	    this._headings[index].removeAttribute('id');
	  }
	}

	HeadingLinks.prototype.addHoverLinks = function() {
	  // loop through headings
	  for(var index = 0; index < this._headingsLength; index++) {
	    // get heading
	    var heading = this._headings[index];

	    // add heading data attribute
	    heading.setAttribute(this._hoverHeadingAttr, '');

	    // save id
	    var headingID = heading.id;

	    // create link
	    var link = document.createElement('a');

	    // add link href attribute
	    var linkUrl = '#' + headingID;
	    link.setAttribute('href', linkUrl);
	    link.setAttribute(this._hoverLinkAttr, '');

	    // based on link position option
	    if(this._hoverLinkPosition === 'before') {
	      // prepend link, or
	      heading.insertBefore(link, heading.firstChild);
	    }
	    else {
	      // append link
	      heading.appendChild(link);
	    }
	  }
	}

	HeadingLinks.prototype.removeHoverLinks = function() {
	  // loop through headings
	  for(var headingIndex = 0; headingIndex < this._headingsLength; headingIndex++) {
	    // get heading
	    var heading = this._headings[headingIndex];

	    // remove heading data attribute
	    heading.removeAttribute(this._hoverHeadingAttr);

	    // get the children
	    var children = heading.children;

	    // cache children length
	    var childrenLength = children.length;

	    // loop through children
	    for(var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++) {
	      // remove only the link with heading
	      if(children[childrenIndex].hasAttribute(this._hoverLinkAttr)) {
	        children[childrenIndex].parentNode.removeChild(children[childrenIndex]);

	        // stop after we find it
	        break;
	      }
	    }
	  }
	}

	HeadingLinks.prototype.getList = function() {
	  // return node list of headings
	  return this._headings;
	}
	var headingLinks = new HeadingLinks({
	  selector: 'h2, h3, h4',
	  hoverLinkPosition: 'before'
	});
}
// Get all the post links and bind the click event to pageFadeOut
var postlinks = document.getElementsByClassName("post-home__link");
for (var k = 0; k < postlinks.length; k++) {
	addEvent(postlinks[k], "click", pageFadeOut);
}
// Same thing with the title
var titles = document.getElementsByClassName("title");
for (var l = 0; l < titles.length; l++) {
	addEvent(titles[l], "click", pageFadeOut);
}
// Then fade in the post if we're on a post page
setTimeout(function() {
	if (post !== null) {
		post.style.transition = 'opacity 250ms ease-in-out';
		setTimeout(function() {
			post.style.opacity = 1;
		}, 0);
	}
}, 0);
// Or the wrapper if we're on any other page
setTimeout(function() {
	if (wrapper !== null) {
		wrapper.style.transition = 'opacity 250ms ease-in-out, margin 250ms ease-in-out';
		setTimeout(function() {
			wrapper.style.opacity = 1;
		}, 0);
	}
}, 0);

// Align the title backgrounds on resize
addEvent(window, "resize", alignTitleBackgrounds);

// Aligns the title backgrounds
function alignTitleBackgrounds() {
	// Get the backgrounds
	var backgrounds = document.getElementsByClassName('post-home__title-bg');
	for (var i = 0; i < backgrounds.length; i++) {
	    var background = backgrounds[i];
	    var parent = background.parentNode;

	    for (var j = 0; j < parent.childNodes.length; j++) {
	        if (parent.childNodes[j].className == "post-home__link") {
	        	// Get the corresponding link to the title
	          	var title = parent.childNodes[j];
	          	// And position the background at the exact same spot
	          	background.style.width = title.offsetWidth + "px";
	          	background.style.height = title.offsetHeight + "px";
	          	background.style.marginTop = 0 - title.offsetHeight + "px";
	          	background.style.left = title.offsetLeft + "px";
	        }
	    }
	}
}

// Fades out the page on click
function pageFadeOut(evt) {
	evt.preventDefault();
	var target;
	// If the click event comes from the heading
	if (evt.target.href === undefined) {
		// Get the href attr from the wrapping anchor tag
		target = evt.target.parentNode.href;
	} else {
		// Otherwise just get the href attribute
		target = evt.target.href;
	}
	// Scroll ot the top of the page
	scrollTo(0);
	// Fade out the page
    setTimeout(function() {
		if (wrapper !== null) {
			wrapper.style.opacity = 0;
		}
		if (post !== null) {
			post.style.opacity = 0;
		}
		if (footer !== null) {
			footer.style.opacity = 0;
		}
		// Then open the clicked link
		setTimeout(function() {
			window.open(target,"_self");
		}, 250);
	}, 0);
}

// Smoothscrolls to a certain point
function scrollTo (amount) {
	if (amount === undefined) {
		amount = 0;
	}
	if (document.body.scrollTop !== amount || document.documentElement.scrollTop !== amount){
	    window.scrollBy(0,-50);
	    var scrollTimeout = setTimeout('scrollTo(' + amount + ')',10);
	} else {
		clearTimeout(scrollTimeout);
	}
}

// Cross browser event binding
function addEvent(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
}