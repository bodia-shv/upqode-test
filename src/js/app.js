'use strict';


(function(window, document, undefined) {

    $(document).ready(function(){

        navigationScroll();

        // functions
        // animation for about us skills section    
        function animateSkills() {
            var aboutUsContainer = $('.about__skills');
            var skills = [
                { selector: '.photoshop__skill', width: 79 },
                { selector: '.html-css__skill', width: 90 },
                { selector: '.javascript__skill', width: 69 },
                { selector: '.wordpress__skill', width: 92 },
            ]
            skills.forEach (function (skill, index) {
                aboutUsContainer.find(skill.selector).css('width', skill.width + '%');
            });
        }

        //navigation scroll stuff
        function navigationScroll() {

            var sections = $('section'), 
                navigation = $('nav'), 
                navigationHeight = navigation.outerHeight();
    
            $(window).on('scroll', function () {
                var currentPosition = $(this).scrollTop();
            
                sections.each(function() {
                    var section = $(this),
                        topOffset = section.offset().top - navigationHeight,
                        bottomOffset = topOffset + section.outerHeight(),
                        sectionId = section.attr('id')
                        
                    if (currentPosition >= topOffset && currentPosition <= bottomOffset) {
                        // remove active classes for other nav items
                        navigation.find('a').removeClass('active');
                        sections.removeClass('active');
                
                        // activate nav item
                        section.addClass('active');
                        navigation.find('a[href="#'+ sectionId +'"]').addClass('active');
                        if (sectionId == 'about_us') animateSkills();
                    }

                });
            });

            navigation.find('a').on('click', function () {
                var navItem = $(this), 
                    scrollSectionId = navItem.attr('href');
            
                $('html, body').animate({
                    scrollTop: $(scrollSectionId).offset().top - navigationHeight
                }, 800);
            
                return false;
            });
        }


         //Hover menu

      $('.hover_menu').hover(
            function() {
                $(this).find('.submenu').slideDown();
            },
            function() {
                $(this).find('.submenu').slideUp();
        });

        $('.hover_menu_1').hover(
            function() {
                $(this).find('.sub-submenu').slideDown();
            },
            function() {
                $(this).find('.sub-submenu').slideUp();
        });


        //hover 'why choose us'

        $('.choose-us__content_item').hover(
            function() {
                $(this).find('.choose-us__hover').slideDown();
            },
            function() {
                $(this).find('.choose-us__hover').slideUp();
        })



    //Menu hidden        
    $('.header-section__burger-btn').on('click', function() {
        $('.header-section .header-section__nav .header-section__nav_menu').toggleClass('active-menu');
    })



 });





})(window, document);


