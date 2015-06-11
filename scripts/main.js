// Get most common elements
var wrapper = document.getElementsByClassName('wrapper')[0];
var post = document.getElementsByClassName('post')[0];
var footer = document.getElementsByClassName('footer')[0];

// Align the title backgrounds asap
alignTitleBackgrounds();
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
	if (post !== undefined) {
		post.style.transition = 'opacity 250ms ease-in-out';
		setTimeout(function() {
			post.style.opacity = 1;
		}, 0);
	}
}, 0);
// Or the wrapper if we're on any other page
setTimeout(function() {
	if (wrapper !== undefined) {
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
		if (wrapper !== undefined) {
			wrapper.style.opacity = 0;
		}
		if (post !== undefined) {
			post.style.opacity = 0;
		}
		if (footer !== undefined) {
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