var wrapper = document.getElementsByClassName('wrapper')[0];
var post = document.getElementsByClassName('post')[0];
var footer = document.getElementsByClassName('footer')[0];

(function(funcName, baseObj) {
    "use strict";
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    function ready() {
        if (!readyFired) {
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }
    baseObj[funcName] = function(callback, context) {
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            readyList.push({fn: callback, ctx: context});
        }
        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", ready, false);
                window.addEventListener("load", ready, false);
            } else {
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);

var addEvent = function(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false );
    } else if ( elem.attachEvent ) {
        elem.attachEvent( "on" + type, eventHandle );
    } else {
        elem["on"+type]=eventHandle;
    }
};

docReady(function() {
	alignTitleBackgrounds();
	var postlinks = document.getElementsByClassName("post-home__link");
	for (var k = 0; k < postlinks.length; k++) {
		addEvent(postlinks[k], "click", pageFadeOut);
	}
	var titles = document.getElementsByClassName("title");
	for (var l = 0; l < titles.length; l++) {
		addEvent(titles[l], "click", pageFadeOut);
	}
	setTimeout(function() {
		if (post !== undefined) {
			post.style.transition = 'opacity 250ms ease-in-out';
			setTimeout(function() {
				post.style.opacity = 1;
			}, 0);
		}
	}, 0);
	setTimeout(function() {
		if (wrapper !== undefined) {
			wrapper.style.transition = 'opacity 250ms ease-in-out, margin 250ms ease-in-out';
			setTimeout(function() {
				wrapper.style.opacity = 1;
			}, 0);
		}
	}, 0);
});

addEvent(window, "resize", alignTitleBackgrounds);

function alignTitleBackgrounds() {
	var backgrounds = document.getElementsByClassName('post-home__title-bg');
	for (var i = 0; i < backgrounds.length; i++) {
	    var background = backgrounds[i];
	    var parent = background.parentNode;

	    for (var j = 0; j < parent.childNodes.length; j++) {
	        if (parent.childNodes[j].className == "post-home__link") {
	          	var title = parent.childNodes[j];
	          	background.style.width = title.offsetWidth + "px";
	          	background.style.height = title.offsetHeight + "px";
	          	background.style.marginTop = 0 - title.offsetHeight + "px";
	          	background.style.left = title.offsetLeft + "px";
	        }
	    }
	}
}

function pageFadeOut(evt) {
	evt.preventDefault();
	var target;
	if (evt.target.href === undefined) {
		target = evt.target.parentNode.href;
	} else {
		target = evt.target.href;
	}
	scrollTo(0);
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
		setTimeout(function() {
			window.open(target,"_self");
		}, 250);
	}, 0);
}

function scrollTo (amount) {
	if (amount === undefined) {
		amount = 0;
	}
	if (document.body.scrollTop !== amount || document.documentElement.scrollTop !== amount){
	    window.scrollBy(0,-1);
	    var scrollTimeout = setTimeout('scrollTo(' + amount + ')',10);
	} else {
		clearTimeout(scrollTimeout);
	}
}