/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($)
{
	var DOM = $('<ul class="carousel"><li></li><li></li></ul>'),
		carouselInstance = new Carousel.Base(DOM.find('.carousel'));

	module('Carousel');

}(jQuery));
