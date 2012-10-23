/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($)
{
	module('Carousel Basics',
	{
		setup: function()
		{
			this.fixture = $('#qunit-fixture');
			this.carouselTmpl = '<div class="carousel-wrapper">'+
									'<ul class="carousel">'+
										'<li></li>'+
										'<li></li>'+
									'</ul>'+
									'<button class="prev"></button>'+
									'<button class="next"></button>'+
								'</div>';

			this.fixture.append(this.carouselTmpl);
			
			this.carouselSelector = this.fixture.find('.carousel');
			
			this.carouselOptions =
			{
				prev: this.fixture.find('.prev'),
				next: this.fixture.find('.next'),
				step: 20
			};
			
			this.carouselInstance = new Carousel.Base(this.carouselSelector, this.carouselOptions);
		},

		teardown: function()
		{
			this.carouselInstance.destroy();
			this.carouselInstance = null;
			this.carouselOptions = {};
		}
	});

	test('Init', function()
	{
		ok(this.carouselSelector.hasClass('carousel-added'), 'The Carousel was instantiated and added the "carousel-added" class.');
	});

	test('Total slides', function()
	{
		equal(this.carouselInstance.totalSlides(), 2, 'The Carousel found two slides.');
	});

	test('List width', function()
	{
		equal(parseInt(this.carouselSelector.width(), 10), 40, 'The Carousel is 40px wide.');
	});

	test('Options', function()
	{
		var opts = this.carouselInstance.options;

		equal(opts.prev[0], this.carouselOptions.prev[0], 'The prev button the Carousel found is in fact to actual prev button.');
		equal(opts.next[0], this.carouselOptions.next[0], 'The next button the Carousel found is in fact to actual next button.');
	});

	module('Carousel Viewstate',
	{
		setup: function()
		{
			this.fixture = $('#qunit-fixture');
			this.carouselTmpl = '<div class="carousel-wrapper">'+
									'<ul class="carousel">'+
										'<li></li>'+
										'<li></li>'+
									'</ul>'+
									'<button class="prev"></button>'+
									'<button class="next"></button>'+
								'</div>';

			this.fixture.append(this.carouselTmpl);
			
			this.carouselSelector = this.fixture.find('.carousel');
		},

		teardown: function()
		{
			this.carouselInstance.destroy();
			this.carouselInstance = null;
			this.carouselOptions = {};
		}
	});

	test('Initial ViewIndex', function()
	{
		this.carouselOptions =
		{
			prev: this.fixture.find('.prev'),
			next: this.fixture.find('.next'),
			step: 20,
			startAt: 0
		};
		
		this.carouselInstance = new Carousel.Base(this.carouselSelector, this.carouselOptions);
	
		equal(this.carouselInstance.currentPos(), 0, 'The initial viewState is 0');
	});

	module('Carousel Events',
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
