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
		
		/*
		*	Add event listeners to the prev and next buttons if they exist.
		*/
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

		/*
		*	remove event listeners to the prev and next buttons if they exist.
		*/
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

		/*
		*	Calculate the previous viewIndex. If it is already 0, return the last viewIndex.
		*	@return {number} The current viewIndex - 1 or the last viewIndex.
		*/
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

		/*
		*	Calculate the next viewIndex. If it is already teh last one, return the first viewIndex.
		*	@return {number} The current viewIndex + 1 or the first viewIndex.
		*/
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

		/*
		*	Move the carousel to the previous slide state.
		*	@param {object} e Event from the mouseclick.
		*/
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

		/*
		*	Move the carousel to the next slide state.
		*	@param {object} e Event from the mouseclick.
		*/
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

		/*
		*	This function is called if an event was fired to move the carousel to a specific index.
		*	Called like this: carousel.trigger({type: 'moveTo', index: 3});
		*	@param {object} e index to move to.
		*/
		onMoveTo = function(e)
		{
			if(typeof e.index === 'number')
			{
				moveTo(e.index);
			}
		},
		
		/*
		*	Move the carousel to a specific index.
		*	@param {object} index Slide to move to.
		*/
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
		
		/*
		*	Checks if the buttons should be disabled or not according to the viewIndex.
		*/
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

		/*
		*	Get current carousel position
		*	@returns {number} viewIndex
		*/
		currentPos = function()
		{
			return viewIndex;
		},

		/*
		*	Get current active slide as a DOM node.
		*	@returns {HTMLElement} The currently activated slide.
		*/
		currentItem = function()
		{
			return carousel.find('li:eq('+ viewIndex +')');
		},

		/*
		*	Get DOM node for slide by index.
		*	@param {number} index The index of the slide you want to get.
		*	@returns {HTMLElement} The DOM node for selected index.
		*/
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

		/*
		*	Deactivae all slides
		*/
		setInactive = function()
		{
			carousel.find('li').removeClass('active');
		},

		/*
		*	Activate a slide.
		*	@param {HTMLElement} the slide you want to active.
		*/
		setActive = function(el)
		{
			el.addClass('active');
		},

		/*
		*	Get the amount of slides
		*	@return {number} The amount of slides in the carousel.
		*/
		totalSlides = function()
		{
			return carouselItemCount;
		},

		/*
		*	Move the carousel according to the current viewIndex.
		*	Uses Morpheus if it exists.
		*/
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

			if(window.morpheus)
			{
				morpheus(carousel[0],
				{
					left: offset,
					duration: opts.speed,
					easing: morpheus.easings[opts.easing],
					complete: transitionEnd
				});
			}
			else
			{
				carousel.animate({left: offset}, opts.speed, opts.easing, transitionEnd);
			}
		},

		/*
		*	Get's called after move() has finished.
		*	Triggers 'aftermove' event.
		*/
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

		/*
		*	Handles autorun events for mousemove, mouseover and mouseleave.
		*	Sets the autorun Timeout.
		*/
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

		/*
		*	Sets the autorun timeout.
		*	Clears and reasigns the timeout after each move().
		*/
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

		/*
		*	Clears the autorun timeout and sets pause to true.
		*/
		unsetAutoRunTimeout = function()
		{
			clearTimeout(autoRunTimeout);
			pauseCarousel = true;
		},

		/*
		*	Pauses the carousel if autorun was set.
		*/
		pause = function()
		{
			unsetAutoRunTimeout();
		},
		
		/*
		*	Resumes the carousel if autorun was set.
		*/
		resume = function()
		{
			pauseCarousel = false;
			setAutoRunTimeout();
		},

		/*
		*	Stops the carousel and unbinds the mouseenter and
		*	mouseleave events that are used to resume the carousel.
		*/
		stop = function()
		{
			carouselWrapper.off('mouseenter.Carousel');
			carouselWrapper.off('mouseleave.Carousel');
			unsetAutoRunTimeout();
		},

		/*
		*	Stops the carousel and unbinds the prev and next buttons
		*/
		destroy = function()
		{
			carouselPrevBtn.off('click.Carousel');
			carouselNextBtn.off('click.Carousel');
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

	/*
	*	Create a jQuery plugin for the peoples.
	*	@param {object} options The plugin options.
	*	@return {function} Returns and instance of Carousel.Base on the data attribute of the HTMLElement.
	*/
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

}(jQuery, window.Carousel = window.Carousel || {}));
(function($, Carousel)
{
	"use strict";
	
	/*
	*	Carousel.Pager
	*	@constructor
	*/
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
			if(!pagerLinks.length)
			{
				throw('Cannot find pager links.');
			}
			
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

		/*
		*	Triggers tge carousel to move to the index of the clicked DOM node.
		*/
		onCLick = function(e)
		{
			opts.carouselToMove.trigger(
			{
				type: 'moveTo',
				index: $(this).index()
			});

			if(opts.killAutoRunAfterPagerIsUsed)
			{
				opts.carouselToMove.trigger('stop');
			}

			e.preventDefault();
		},

		/*
		*	Removes the click binding on the pager links.
		*/
		destroy = function()
		{
			pagerLinks.off('click.CarouselPager');
		};

		init();

		return {
			destroy: destroy
		};
	};
	
	/*
	*	Create a jQuery plugin for the peoples.
	*	@param {object} options The plugin options.
	*	@return {function} Returns and instance of Carousel.Pager on the data attribute of the HTMLElement.
	*/
	$.fn.carouselPager = function(options)
	{
		return this.each(function()
		{
			if(!$.data(this, 'carouselPager'))
			{
				$.data(this, 'carouselPager' , new Carousel.Pager(this, options));
			}
		});
	};

}(jQuery, window.Carousel = window.Carousel || {}));