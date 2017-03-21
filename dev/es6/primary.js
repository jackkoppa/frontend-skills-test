/*
Primary scripts for populating, interacting with, and updating homepage
*/

// Set carousel height
function adjCarouselHeight() {
	var $carousel = $(".carousel");
	var $activeSlide = $(".carousel .slide.active") ? $(".carousel .slide.active") : $(".carousel .slide");
	var carouselHeight = $carousel.height();
	var slideHeight = $activeSlide.height();
	if (carouselHeight != slideHeight) {
		$carousel.height(slideHeight);
	}
}



$(document).ready(function(){
	// Handle nav menu hovers

	// set initial height on .carousel
	adjCarouselHeight();
});