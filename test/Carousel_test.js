/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($)
{
	var setupCarousel = function(element, options)
	{
		var opts = options || {};
		return new Carousel.Base(element, opts);
	};

	/**
	 * Carousel Basics
	 * Init,
	 * Total slides,
	 * List width,
	 * Options.
	 */
	module('Carousel Basics',
	{
		setup: function()
		{
			this.fixture = $('#qunit-fixture');
			this.carouselTmpl = '<div class="carousel-wrapper">'+
									'<ul class="carousel">'+
										'<li></li>'+
										'<li></li>'+
										'<li></li>'+
										'<li></li>'+
									'</ul>'+
								'</div>';

			this.fixture.append(this.carouselTmpl);
			this.carouselSelector = this.fixture.find('.carousel');
			this.carouselOptions = { step: 20 };
			this.carouselInstance = new Carousel.Base(this.carouselSelector, this.carouselOptions);
		},

		teardown: function()
		{
			this.carouselInstance.destroy();
			this.carouselOptions = {};
			this.carouselInstance = null;
			this.fixture.empty();
		}
	});

	test('Init', function()
	{
		ok(this.carouselSelector.hasClass('carousel-added'), 'The Carousel was instantiated and added the "carousel-added" class.');
	});

	test('Total slides', function()
	{
		equal(this.carouselInstance.totalSlides(), 4, 'The Carousel found '+ this.carouselInstance.totalSlides() +' slides.');
	});

	test('List width', function()
	{
		equal(parseInt(this.carouselSelector.width(), 10), 80, 'The Carousel is 80px wide.');
	});

	/**
	 * Carousel Viewstate
	 *
	 * initial viewstate,
	 * using startAt,
	 * after clicking the buttons,
	 * by using an event,
	 * by using the public functions,
	 * after auto run.
	 */
	module('Carousel Viewstate',
	{
		setup: function()
		{
			this.fixture = $('#qunit-fixture');
			this.carouselTmpl = '<div class="carousel-wrapper">'+
									'<ul class="carousel">'+
										'<li></li>'+
										'<li></li>'+
										'<li></li>'+
										'<li></li>'+
									'</ul>'+
								'</div>';

			this.fixture.append(this.carouselTmpl);
			this.carouselSelector = this.fixture.find('.carousel');
		},

		teardown: function()
		{
			this.carouselInstance.destroy();
			this.carouselOptions = {};
			this.carouselInstance = null;
			this.fixture.empty();
		}
	});

	test('get viewIndex with currentPos()', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector, { startAt: 3 });

		equal(this.carouselInstance.currentPos(), 3, 'currentPos() returned 3 ');
	});

	test('Initial viewIndex', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector, { startAt: 0 });
		
		equal(this.carouselInstance.currentPos(), 0, 'The initial viewState is 0');
	});

	test('viewIndex with startAt', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector, { startAt: 2 });

		equal(this.carouselInstance.currentPos(), 2, 'The initial viewState with startAt is 2');
	});

	test('viewIndex after calling moveTo()', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector);
		this.carouselInstance.moveTo(2);
		
		equal(this.carouselInstance.currentPos(), 2, 'The viewIndex is 2 after calling moveTo(2)');
	});

	asyncTest('viewIndex after calling moveTo() by an event', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector);
		
		this.carouselSelector.trigger({type: 'moveTo', index: 2});
		
		equal(this.carouselInstance.currentPos(), 2, 'The viewIndex is 2 after calling moveTo(2) by an event');
		start();
	});

	test('viewIndex after calling next()', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector, { startAt: 0 });
		this.carouselInstance.next();

		equal(this.carouselInstance.currentPos(), 1, 'The viewIndex is 1 after the next() function was called');
	});

	asyncTest('viewIndex after calling next() by an event', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector);
		this.carouselSelector.trigger('next');
		
		equal(this.carouselInstance.currentPos(), 1, 'The viewIndex is 1 after calling next() by an event');
		start();
	});

	test('viewIndex after calling prev()', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector, { startAt: 1 });
		this.carouselInstance.prev();
		
		equal(this.carouselInstance.currentPos(), 0, 'The viewIndex is 0 after the prev() function was called');
	});

	asyncTest('viewIndex after calling prev() by an event', function()
	{
		this.carouselInstance = setupCarousel(this.carouselSelector, { startAt: 1 });
		this.carouselSelector.trigger('prev');
		
		equal(this.carouselInstance.currentPos(), 0, 'The viewIndex is 0 after calling prev() by an event');
		start();
	});
	
	module('Carousel Button state',
	{
		setup: function(){},
		teardown: function(){}
	});

	module('Carousel Loop',
	{
		setup: function(){},
		teardown: function(){}
	});

	module('Carousel Autoplay',
	{
		setup: function(){},
		teardown: function(){}
	});

}(jQuery));
