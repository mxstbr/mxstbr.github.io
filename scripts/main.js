var post = document.querySelector('article[role="article"]');
var tweetButton = document.querySelector('.share-on-twitter')

window.onhashchange = function() {
  console.log('ON HASH CHANGE')
}

window.addEventListener('popstate', function (e) {
    console.log('ON POP')
});

if (post && tweetButton) {
  var postSmallerThanWindow = post.clientHeight < window.innerHeight;
	if (postSmallerThanWindow) {
    // Immediately show tweet button
    tweetButton.classList.remove('hidden');
  } else {
    setTimeout(function() {
      window.addEventListener("scroll", showTweetButton, false);
    }, 5000);
  }
}

function showTweetButton() {
  const halfwayThroughPost = (window.innerHeight + window.scrollY) >= document.body.offsetHeight / 1.5
  if (halfwayThroughPost) {
    tweetButton.classList.remove('hidden');
    window.removeEventListener("scroll", showTweetButton, false);
  }
}

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

function init() {
	setScrolledClass();
  window.addEventListener("scroll", setScrolledClass, false);
}

// Cross browser compatible, non-overriding window.onload function
if (window.addEventListener) {
  window.addEventListener("load", init, false);
} else {
  window.attachEvent && window.attachEvent("onload", init);
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
