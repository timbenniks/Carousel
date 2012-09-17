!function($, Carousel)
{
	"use strict";

	Carousel.Pager = function(element, options)
	{
		var pager = $(element),

			defaults =
			{
				activateOn: 'aftermove',
				killAutoRunAfterPagerIsUsed: false,
				carouselToMove: pager.parent().find('.carousel-added')
			},

			opts = $.extend({}, defaults, options),
			pagerLinks = pager.find('a'),

		init = function()
		{
			pagerLinks.on('click.CarouselPager', onCLick);

			opts.carouselToMove.on(opts.activateOn, function(e)
			{
				var currentPos = e.currentPos,
					currentItem = e.currentItem,
					activeLink = pager.find('a:eq('+ currentPos +')');

				pagerLinks.removeClass('active');
				activeLink.addClass('active');
			});
		},

		onCLick = function(e)
		{
			opts.carouselToMove.trigger(
			{
				type: 'moveTo',
				index: $(this).index()
			});

			if(opts.killAutoRunAfterPagerIsUsed)
			{
				opts.carouselToMove.trigger('killAutoRun');
			}

			e.preventDefault();
		},

		destroy = function()
		{
			pagerLinks.off('click.CarouselPager');
		};

		init();

		return {
			destroy: destroy
		};
	};

}(jQuery, window.Carousel = window.Carousel || {});