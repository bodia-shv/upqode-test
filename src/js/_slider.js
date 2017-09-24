$(document).ready(function(){

    $('.banner__slider_wrapper').bxSlider({
        auto: true,
        autoControls: true,
        pause: 2000,
        nextSelector: '.slider-next',
        prevSelector: '.slider-prev',
        nextText: '<img src="assets/img/slider-next.png" alt="slider next" />',
        prevText: '<img src="assets/img/slider-prev.png" alt="slider prev" />'
    });

    $('.bxslider').bxSlider({
        auto: true,
        autoControls: true,
        pause: 3000,
        nextSelector: '.slider-next',
        prevSelector: '.slider-prev',
        nextText: '<img src="dist/img/slider-next.png" alt="slider next" />',
        prevText: '<img src="dist/img/slider-prev.png" alt="slider prev" />'
    });
});