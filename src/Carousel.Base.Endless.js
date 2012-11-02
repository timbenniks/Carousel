/*globals morpheus:true*/
(function ($, Carousel)
{
	"use strict";

	/*
	*	Carousel.Base
	*	@constructor
	*/
	Carousel.Base = function(element, options)
	{
		var defaults =
			{
				speed: 500,
				easing: 'easeInOutExpo',
			},

			opts = $.extend({}, defaults, options),

			carousel = $(element),
			carouselItems = carousel.children(),
			carouselItemsList = carouselItems.get(),

			viewIndex = 0,
			oldViewIndex = carouselItemsList.length,
			
		init = function()
		{
			carouselItems.css({ position: 'absolute' }).each(function(index, el)
			{
				$(el).css('z-index', carouselItemsList.length - index);
			});
		},

		next = function()
		{
			oldViewIndex = viewIndex;

			if(viewIndex < (carouselItemsList.length - 1))
			{
				viewIndex += 1;
			}
			else
			{
				viewIndex = 0;
			}

			go();
		},

		prev = function()
		{
			oldViewIndex = viewIndex;
			
			if(viewIndex === 0)
			{
				viewIndex = carouselItemsList.length - 1;
			}
			else
			{
				viewIndex -= 1;
			}

			go();
		},

		go = function()
		{
			$(carouselItemsList[oldViewIndex])
				.removeClass('active')
				.animate({opacity: 'hide'}, opts.speed, opts.easing);
			
			$(carouselItemsList[viewIndex])
				.addClass('active')
				.animate({opacity: 'show'}, opts.speed, opts.easing)	
		};

		init();

		return {
			next: next,
			prev: prev
		};
	};

}(jQuery, window.Carousel = window.Carousel || {}));