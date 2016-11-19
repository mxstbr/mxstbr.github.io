var post = document.querySelector('.post');

// Set the js-has-scrolled class on the body depending on scroll position
function setScrolledClass() {
  if (isScrolled() == true) {
    document.body.classList.add("js-has-scrolled");
  } else {
    document.body.classList.remove("js-has-scrolled");
  }
}

// Check if the user has scrolled
function isScrolled() {
  // IE...
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 0) {
    return true;
  } else {
    return false;
  }
}

// Cross browser compatible, non-overriding window.onload function
if (window.addEventListener) {
  window.addEventListener("load", init, false);
} else {
  window.attachEvent && window.attachEvent("onload", init);
}

function init() {
	setScrolledClass();
	window.onscroll = setScrolledClass;
}

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
