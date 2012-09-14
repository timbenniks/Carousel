/* 
*	@Class:			Carousel.Base
*	@Author:		Tim Benniks <tim.benniks@akqa.com>
*	@Dependencies:	jQuery, morpheus
---------------------------------------------------------------------------- */

(function($, Carousel, morpheus)
{
	"use strict",

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
				next: null
			},
			
			opts = $.extend({}, defaults, options),
			
			carousel = $(element),
			carouselWrapper = carousel.parent(),
		    carouselItemCount = carousel.find('li').length,
			carouselItemWidth = carousel.find('li:first').outerWidth(true),
			carouselPrevBtn = $(opts.prev),
			carouselNextBtn = $(opts.next),
		    
			viewIndex = 0,
		    cachedIndex = 0,
			autoRunTimeout,
		    pause = false,
		    
		init = function()
		{
			carousel
				.css({ width: totalSlides() * carouselItemWidth })
				.addClass('carousel-added');
			
			bindArrows();

			carousel.on('moveTo', onMoveTo);
			carousel.on('killAutoRun', killAutoRun);

			if(opts.auto)
			{
				handleAutoRun();
			}
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

		prev = function()
		{
			cachedIndex = viewIndex;
			viewIndex = calcPrevIndex();
			move();
		},
		
		next = function()
		{
			cachedIndex = viewIndex;
			viewIndex = calcNextIndex();
			move();
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
			if(index === viewIndex) return;

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
			if(opts.loop) return;

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
				unsetAutoRunTimeout();
			});

			carouselWrapper.on('mouseenter.Carousel', function()
			{
				unsetAutoRunTimeout();
			});
			
			carouselWrapper.on('mouseleave.Carousel', function()
			{
				pause = false;
				setAutoRunTimeout();
			});
			
			setAutoRunTimeout();
		},
		
		setAutoRunTimeout = function()
		{
			if(!opts.auto || pause)
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
			pause = true;
		},

		killAutoRun = function()
		{
			carouselWrapper.off('mouseenter.Carousel');
			carouselWrapper.off('mouseleave.Carousel');
			unsetAutoRunTimeout();
		},
		    
		destroy = function()
		{
			carouselPrevBtn.off('click.Carousel', prev);
			carouselNextBtn.off('click.Carousel', next);
			killAutoRun();
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
			setAutoRunTimeout: setAutoRunTimeout,
			killAutoRun: killAutoRun,
			destroy: destroy
		};
	};

}(jQuery, window.Carousel = window.Carousel || {}, morpheus));