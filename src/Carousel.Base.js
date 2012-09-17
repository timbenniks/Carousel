/*globals morpheus:true*/
(function ($, Carousel, morpheus)
{
	"use strict";

	Carousel.Base = function(element, options)
	{
		var defaults =
			{
				speed: 500,
				timeoutSpeed: 1000,
				easing: 'easeInOutExpo',
				auto: false,
				loop: false,
				prev: null,
				next: null,
				startAt: 0,
				step: 0
			},

			opts = $.extend({}, defaults, options),

			carousel = $(element),
			carouselWrapper = carousel.parent(),
			carouselItemCount = carousel.find('li').length,
			carouselItemWidth = opts.step,
			carouselPrevBtn = $(opts.prev),
			carouselNextBtn = $(opts.next),

			viewIndex = 0,
			cachedIndex = 0,
			autoRunTimeout,
			pauseCarousel = false,

		init = function()
		{
			if(carouselItemWidth === 0)
			{
				carouselItemWidth = carousel.find('li:first').outerWidth(true);
			}
			
			carousel
				.css({ width: totalSlides() * carouselItemWidth })
				.addClass('carousel-added');

			bindArrows();

			if(opts.auto)
			{
				handleAutoRun();
			}
			
			if(opts.startAt > 0)
			{
				viewIndex = opts.startAt;
				move();
			}

			carousel.on('pause', pause);
			carousel.on('resume', resume);
			carousel.on('stop', stop);
			
			carousel.on('moveTo', onMoveTo);
			carousel.on('prev', prev);
			carousel.on('next', next);
		},

		bindArrows = function()
		{
			if(carouselPrevBtn.length)
			{
				carouselPrevBtn.on('click.Carousel', prev);
			}

			if(carouselNextBtn.length)
			{
				carouselNextBtn.on('click.Carousel', next);
			}
		},

		unbindArrows = function()
		{
			if(carouselPrevBtn.length)
			{
				carouselPrevBtn.off('click.Carousel', prev);
			}

			if(carouselNextBtn.length)
			{
				carouselNextBtn.off('click.Carousel', next);
			}
		},

		calcPrevIndex = function()
		{
			if(viewIndex === 0)
			{
				return (totalSlides() - 1);
			}
			else
			{
				return viewIndex - 1;
			}
		},

		calcNextIndex = function()
		{
			if(viewIndex < (totalSlides() - 1))
			{
				return viewIndex + 1;
			}
			else
			{
				return 0;
			}
		},

		prev = function(e)
		{
			cachedIndex = viewIndex;
			viewIndex = calcPrevIndex();
			move();

			if(e)
			{
				e.preventDefault();
			}
		},

		next = function(e)
		{
			cachedIndex = viewIndex;
			viewIndex = calcNextIndex();
			move();

			if(e)
			{
				e.preventDefault();
			}
		},

		onMoveTo = function(e)
		{
			if(typeof e.index === 'number')
			{
				moveTo(e.index);
			}
		},

		moveTo = function(index)
		{
			if(index === viewIndex) 
			{
				return;
			}
			
			if(index <= (totalSlides() - 1) && index >= 0)
			{
				cachedIndex = viewIndex;
				viewIndex = index;

				move();
			}
			else
			{
				throw 'Incorrect viewIndex provided';
			}
		},

		checkButtonState = function()
		{
			if(opts.loop) 
			{
				return;
			}
			
			var hasNext, hasPrev;

			hasPrev = viewIndex > 0;
			hasNext = viewIndex < totalSlides() - 1;

			if(hasPrev)
			{
				carouselPrevBtn.addClass('active').removeClass('inactive').removeAttr('disabled');
			}
			else
			{
				carouselPrevBtn.addClass('inactive').removeClass('active').attr('disabled', 'disabled');
			}

			if(hasNext)
			{
				carouselNextBtn.addClass('active').removeClass('inactive').removeAttr('disabled');
			}
			else
			{
				carouselNextBtn.addClass('inactive').removeClass('active').attr('disabled', 'disabled');
			}
		},

		currentPos = function()
		{
			return viewIndex;
		},

		currentItem = function()
		{
			return carousel.find('li:eq('+ viewIndex +')');
		},

		getItemByIndex = function(index)
		{
			if(index <= (totalSlides() - 1) && index >= 0)
			{
				return carousel.find('li:eq('+ index +')');
			}
			else
			{
				throw 'Incorrect item Index provided';
			}
		},

		setInactive = function()
		{
			carousel.find('li').removeClass('active');
		},

		setActive = function(el)
		{
			el.addClass('active');
		},

		totalSlides = function()
		{
			return carouselItemCount;
		},

		move = function()
		{
			setInactive();
			unbindArrows();
			checkButtonState();

			carousel.trigger(
			{
				type: 'beforemove',
				currentPos: currentPos(),
				currentItem: currentItem(),
				currentCarousel: carouselWrapper
			});

			var offset = -(carouselItemWidth * currentPos());

			morpheus(carousel[0],
			{
				left: offset,
				duration: opts.speed,
				easing: morpheus.easings[opts.easing],
				complete: transitionEnd
			});
		},

		transitionEnd = function()
		{
			setActive(currentItem());

			carousel.trigger(
			{
				type: 'aftermove',
				currentPos: currentPos(),
				currentItem: currentItem(),
				currentCarousel: carouselWrapper
			});

			bindArrows();
			setAutoRunTimeout();
		},

		handleAutoRun = function()
		{
			carouselWrapper.one('mousemove.Carousel', function()
			{
				pause();
			});

			carouselWrapper.on('mouseenter.Carousel', function()
			{
				pause();
			});

			carouselWrapper.on('mouseleave.Carousel', function()
			{
				resume();
			});

			setAutoRunTimeout();
		},

		setAutoRunTimeout = function()
		{
			if(!opts.auto || pauseCarousel)
			{
				return;
			}

			clearTimeout(autoRunTimeout);

			autoRunTimeout = setTimeout(function()
			{
				if(viewIndex < (totalSlides() - 1))
				{
					moveTo(viewIndex + 1);
				}
				else
				{
					moveTo(0);
				}

			}, opts.timeoutSpeed);
		},

		unsetAutoRunTimeout = function()
		{
			clearTimeout(autoRunTimeout);
			pauseCarousel = true;
		},

		pause = function()
		{
			unsetAutoRunTimeout();
		},
		
		resume = function()
		{
			pauseCarousel = false;
			setAutoRunTimeout();
		},

		stop = function()
		{
			carouselWrapper.off('mouseenter.Carousel');
			carouselWrapper.off('mouseleave.Carousel');
			unsetAutoRunTimeout();
		},

		destroy = function()
		{
			carouselPrevBtn.off('click.Carousel', prev);
			carouselNextBtn.off('click.Carousel', next);
			stop();
		};

		init();

		return {
			moveTo: moveTo,
			prev: prev,
			next: next,
			currentPos: currentPos,
			totalSlides: totalSlides,
			currentItem: currentItem,
			getItemByIndex: getItemByIndex,
			stop: stop,
			pause: pause,
			resume: resume,
			destroy: destroy
		};
	};

	// Create a jQuery plugin for the peoples
	$.fn.carousel = function(options)
	{
		return this.each(function()
		{
			if(!$.data(this, 'carousel'))
			{
				$.data(this, 'carousel' , new Carousel.Base(this, options));
			}
		});
	};

}(jQuery, window.Carousel = window.Carousel || {}, window.morpheus));