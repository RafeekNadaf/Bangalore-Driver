jQuery.noConflict();


(function($, window, document){
    
    "use strict";
    
    Modernizr.addTest('highresdisplay', function(){
        if (window.matchMedia) {
            var mq = window.matchMedia("only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
            return (mq && mq.matches);
        }
        return false;
    });
 
    
    var A13,
        body                = document.body,
        $body               = $(body),
        $window             = $(window),
        $header             = $('#header'),
        $preloader          = $("#preloader"),
        $preloader_small    = $("#small_preloader"),
        $top_menu           = $('#access').find('.top-menu'),
        hash_from_url       = window.location.hash,
        $logo               = $('#logo'),
        G                   = ApolloParams,
        header_shield_w     = 200, 
        opened_work         = null,
        isHDScreen          = Modernizr.highresdisplay;
    
        
    window.A13 = {
        rise : function(){
            A13.startAll();
            A13.header.init();
            A13.a13_parralax();
            $window.resize( debounce( function(){
                A13.toggle_menus();
                
                var top_menu_items_count = $header.find('.top-menu > li').length,
                    middle = Math.ceil(top_menu_items_count/2) - 1,
                    $left = $header.find('.top-menu > li:eq('+middle+')'),
                    $right = $header.find('.top-menu > li:eq('+(middle+1)+')'),
                    l_half_w = 0,
                    full_w = $top_menu.outerWidth( true ),
                    css_left = 0 ;
                
                $header.find('.top-menu > li:lt(' + ( 1 + middle ) + ')').each(function() {
                    l_half_w += $(this).outerWidth( true );
                  
                });
                css_left = ( ( (2*l_half_w) - full_w ) / 2 ) * (-1);
                
                $left.css('margin-right',((header_shield_w/2)+6)+'px');
                $right.css('margin-left',(header_shield_w/2)+'px');
                $top_menu.css('left', css_left + 'px');
                if( top_menu_items_count == 1){
                    $top_menu.css('left', ((header_shield_w/2) + css_left) + 'px');
                }
                
            }, 250) );
            
                                    
            $window.trigger( 'resize' );
        },
        toggle_menus : function(){
            var visible = !($('#header').hasClass('transparent'));
            if( $window.width() > G.menu_bp && !visible ){
                $('#header').toggleClass('transparent').find('#access, .socials').show();
                $('.mobile_menu_switch').hide();
                $('#mobile_access').trigger( "close.mm" );
                
            } else if( $window.width() <= G.menu_bp && visible ) {
                $('#header').toggleClass('transparent').find('#access, .socials').hide();
                $('.mobile_menu_switch').show();
            }
        },
        a13_parralax : function(){
        
            var paralax_elements = $('div.with-parallax');
        
            if( paralax_elements.length ){
                paralax_elements.each( function(){
                    var element     = this,
                        $elem       = $(element),
                        using_ratio = element.style.backgroundRepeat !== 'no-repeat',
                        ratio       = using_ratio ? $elem.data('a13_parallax_speed') : 1;
            
                    
                    
                    $(window).on('scroll resize', function() {
                        var view_port_height        = $(window).height(),
                            view_port_top           = $(window).scrollTop(),  
                            view_port_bottom        = view_port_top + view_port_height,
                            elem_height             = $elem.innerHeight(),
                            //moÅ¼e lepiej outerHeight?
                            elem_top                = $elem.offset().top,
                            elem_bottom             = elem_top + elem_height,
                            end_range               = elem_top + elem_height + view_port_height,
                            top_part_in_range       = view_port_bottom >= elem_top,
                            bottom_part_in_range    = view_port_bottom <= end_range,
                            current_position_in_range = (view_port_bottom - elem_top) / (end_range - elem_top);
        
                        //we can see element
                        if( top_part_in_range && bottom_part_in_range ){
                            //choose type of move
                            element.style.backgroundPosition = '50% '+( ( 1 - current_position_in_range ) * 100 * ratio )+'%';
                            
                        }
                    });
                    
                });
            
            }
        
        },
        
        startAll : function(){
            var shield_initial_top = $logo.css('top');
            
            if(isHDScreen){
                var d = new Date(),
                    expires;
                d.setTime(d.getTime()+(365*24*60*60*1000)); //one year
                expires = d.toGMTString();
                document.cookie="a13_screen_mode=high; expires="+expires+"; path=/";
            }
                
            $header.stick_in_parent().on("sticky_kit:stick", function(e) {
                $logo.velocity({'top':G.logo_hide_pixels},500 );
                if(G['dropping_header'] == 1){
                    $header.slideDown();
                }                
            }).on("sticky_kit:unstick", function(e) {
                $logo.velocity({'top':shield_initial_top},500 );
                if(G['dropping_header'] == 1){
                    $header.slideUp();
                }                
            });   
            
            $(".to_scroll").each( function(){
                var theme_name = $(this).hasClass('dark') ? "minimal" : "minimal-dark";
                $(this).mCustomScrollbar({
        			theme:theme_name,
        		});
            } );
            
            //remove empty paragraphs
            $('.real-content').find('p:empty').remove();
            
            //manage nice scrolling to # places when you come from another page
            if ( '' !== hash_from_url && $(hash_from_url).length ){
                //jQuery(hash_from_url).click();
                
                window.location.hash = '';
                history.pushState('', document.title, window.location.pathname);
                var headerH = $header.outerHeight();
                var headerTop = $header.offset().top;
                if( headerTop >= $(hash_from_url).offset().top){
                    headerH = 0;
                }
                if ( $('#access').hasClass('touch') ) {
                    //a13_mobile_menu_toggle();
                }
                
                
                $(".scroll-to a").removeClass('active');
                $("html, body").animate({
                    scrollTop: ( $(hash_from_url).offset().top - (headerH) ) + "px"
                    }, {
                    duration: 1500,
                    easing: "easeInOutExpo"
                });
               
            }
            
            //nice scrolling
            $(".scroll-to>a, a.a13-sc-button,.to-top").bind('click',function(event){
                var force_scroll = false,
                    hash = '',
                    hash_i = $(this).attr("href").indexOf("#"),
                    headerH = $header.outerHeight();
            
                if( hash_i != -1 ) {
                    hash = $(this).attr("href").substr(hash_i);
                } 
                
                if( hash != '' && $(hash).length ) {
                    force_scroll = true;
                } 
                
                if( $(this).parent().hasClass('scroll-to') && $(this).parent().hasClass('menu-item-has-children') && !$(this).parent().find('.sub-menu, ul.children').hasClass('open') && !$(this).parent().hasClass('hovered') ){
                    event.preventDefault();
                }else{
                    if( force_scroll || ( $('#access').hasClass('touch') && !$(this).hasClass('sf-with-ul') && !$(this).hasClass('a13-sc-button') ) || (!$('#access').hasClass('touch') && !$(this).hasClass('a13-sc-button') ) ){
                        
                        
                        var headerTop = $header.offset().top;
                        if( $header.hasClass('is_stuck') ){
                            headerH = 0;
                        }
                        
                        
                        $(".scroll-to a").removeClass('active');
                        $(this).addClass('active');
                        
                        $("html, body").animate({
                            scrollTop: ($(hash).offset().top - (headerH)) + "px"
                            }, {
                            duration: 1500,
                            easing: "easeInOutExpo"
                        });
                        event.preventDefault();
                    }
                }
                
            });
            
            //
            $window.resize( debounce( function(){
                jQuery('[data-spy="scroll"]').each(function () {
                    var $spy = jQuery(this).scrollspy('refresh');
                });
            }, 250) );
            
            
            $(".cb_image").each(function(){ $(this).colorbox(); });
            
        },
        
        
        header : {
            init: function(){
                
                var footer_text = ( $('#header').find('.socials').length ? '<div class="socials">'+$('#header').find('.socials').html()+'</div>' : '' );
                
                
                $('#mobile_access').mmenu({
                footer: {
                    add: true,
                    content: footer_text
                },
                "offCanvas": {
                  "zposition": "front"
               }}).on( "opening.mm", function() {
                    $('.mobile_menu_switch').toggleClass('opened');
                }).on( "closing.mm", function() {
                    $('.mobile_menu_switch').toggleClass('opened');
                }).removeClass('hide');
                
                
                //droping header
                if(G['dropping_header'] == 1){
                    //$("#header").css('height','0px');
                    if(!$('#header').hasClass('is_stuck')){
                        $('#header').slideUp();
                    }
                }                
                              
            }
        },
        
    
    }
  
    //make things alive
    
    $(document).ready( function(){
        //override vc bakery function to run masonry more flexible
        window.vc_teaserGrid = function(){
            var layout_modes = {
              fitrows:'fitRows',
              masonry:'masonry'
            }
            
            jQuery('.wpb_grid .teaser_grid_container:not(.wpb_carousel), .wpb_filtered_grid .teaser_grid_container:not(.wpb_carousel)').each(function () {
                var $container = jQuery(this);
                var $thumbs = $container.find('.wpb_thumbnails');
                var layout_mode = $thumbs.attr('data-layout-mode');
                
                
                $thumbs.isotope({
                    // options
                    itemSelector:'.isotope-item',
                    layoutMode: 'packery',   
                });
                
                
                $container.find('.categories_filter a').data('isotope', $thumbs).click(function (e) {
                    e.preventDefault();
                    var $thumbs = jQuery(this).data('isotope');
                    jQuery(this).parent().parent().find('.active').removeClass('active').find('a').removeClass('fa-dot-circle-o');
                    jQuery(this).addClass('fa-dot-circle-o').parent().addClass('active');
                    $thumbs.isotope({filter:jQuery(this).attr('data-filter')});
                });
                jQuery(window).bind('load resize', function () {
                    $thumbs.isotope("layout");
                });
            });
        }
        A13 = window.A13;
        A13.rise();
    });
    
    
})(jQuery, window, document);