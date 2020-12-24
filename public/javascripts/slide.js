function anotherSlide() {
    $("#bg-one").fadeToggle();
    //delay(300);
    $("#bg-two").fadeToggle();

    setTimeout(anotherSlide, 5000);
}
anotherSlide()

jQuery('#slider-slick-1').slick({
	slidesToShow: 4,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 2000,
	swipeToSlide: true,
});

jQuery('#slider-slick-2').slick({
	slidesToShow: 4,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 2000,
	swipeToSlide: true,
});

// sync
var numSlick = 0;
$('.slider-products').each( function() {
	numSlick++;
	$(this).addClass( 'slider-' + numSlick ).slick({
		autoplay:true,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		asNavFor: '.slider-nav.slider-' + numSlick
	});
});

numSlick = 0;
$('.slider-nav').each( function() {
	numSlick++;
	$(this).addClass( 'slider-' + numSlick ).slick({
		autoplay: true,
		vertical: false,
		centerMode: true,
		centerPadding: '0px',
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.slider-products.slider-' + numSlick,
		arrow: false,
		focusOnSelect: true,
		swipeToSlide: true,
		responsive: [
		{
			breakpoint: 800,
			settings: {
				slidesToShow: 4,
			}
		}
		]
	});
});