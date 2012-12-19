/*globals console*/
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
				speedIn: 500,
				speedOut: 500,
				easingIn: 'easeInOutExpo',
				easingOut: 'easeInOutExpo',
				cssBefore: { opacity: 0, display: 'block' },
				cssAfter: { display: 'none' },
				animOut: { opacity: 0 },
				animIn: { opacity: 1 },
				sync: true
			},

			opts = $.extend({}, defaults, options),

			carousel = $(element),
			carouselItems = carousel.children(),
			carouselItemsList = carouselItems.get(),
			amountOfSlides = carouselItemsList.length,

			viewIndex = 0,
			oldViewIndex = 0,

		init = function()
		{
			carousel.addClass('carousel-added');
			carouselItems.css({ position: 'absolute' }).each(function(index, el)
			{
				$(el).css('z-index', amountOfSlides - index);
			});

			$(carouselItemsList[0]).addClass('active');
		},

		next = function()
		{
			oldViewIndex = viewIndex;

			if(viewIndex < (amountOfSlides - 1))
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
				viewIndex = amountOfSlides - 1;
			}
			else
			{
				viewIndex -= 1;
			}

			go();
		},

		go = function()
		{
			var oldSlide = $(carouselItemsList[oldViewIndex]),
				newSlide = $(carouselItemsList[viewIndex]);

			anim(oldSlide, newSlide);
		},

		anim = function(oldSlide, newSlide)
		{
			var animIn = function()
			{
				newSlide.addClass('active');
				newSlide.animate(opts.animIn, opts.speedIn, opts.easingIn);
			};

			newSlide.css(opts.cssBefore);

			oldSlide.animate(opts.animOut, opts.speedOut, opts.easingOut, function()
			{
				oldSlide.removeClass('active');

				if(!opts.sync)
				{
					animIn();
				}

				oldSlide.css(opts.cssAfter);
			});

			if(opts.sync)
			{
				animIn();
			}
		},

		gotoSlide = function(index)
		{
			if(viewIndex !== index && index < amountOfSlides)
			{
				oldViewIndex = viewIndex;
				viewIndex = index;

				go();
			}
		};

		init();

		return {
			next: next,
			prev: prev,
			gotoSlide: gotoSlide
		};
	};

}(jQuery, window.Carousel = window.Carousel || {}));