$(function() {
	alignTitleBackgrounds();
	$('.post-home__link').click(pageFadeOut);
	$('.title').click(pageFadeOut);
	$('.pagination-item').click(pageFadeOut);
	setTimeout(function() {
		$('.post').css('transition', 'opacity 250ms ease-in-out');
		setTimeout(function() {
			$('.post').css('opacity', '1');
		}, 0);
	}, 0);
	setTimeout(function() {
		$('.wrapper').css('transition', 'opacity 250ms ease-in-out, margin 250ms ease-in-out');
		setTimeout(function() {
			$('.wrapper').css('opacity', '1');
		}, 0);
	}, 0);

	// Smooth scrolling
	$('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 125);
	        return false;
	      }
	    }
	});
});

$(window).resize(alignTitleBackgrounds);

function alignTitleBackgrounds() {
	$('.post-home__title-bg').each(function(i, elem) {
		var $elem = $(elem);
		var title = $elem.parent().find(".post-home__title")[0];
		$elem.css('width', $(title).width() + parseFloat($(title).css("padding-right")) * 2).css('height', $(title).height() + 2).css('margin-top', -$(title).height()).css('left', $(title).offset().left);
	});
}

function pageFadeOut(evt) {
	evt.preventDefault();
	var target;
	if (!$(evt.target).attr('href')) {
		target = $(evt.target).parent().attr('href');
	} else {
		target = $(evt.target).attr('href');
	}
	// Scroll to top
	$('html,body').animate({
        scrollTop: 0
    }, 125);
    setTimeout(function() {
		$('.wrapper').css('opacity', '0');
		$('footer').css('opacity', '0');
		$('.post').css('opacity', '0');
		setTimeout(function() {
			window.open(target,"_self");
		}, 250);
	}, 0);
}