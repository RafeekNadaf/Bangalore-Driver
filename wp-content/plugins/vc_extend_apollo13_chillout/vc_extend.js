var a13_current_window_w = a13_prev_window_w = jQuery(window).width(); 

function a13_refresh_masonry(container){
    var $window=jQuery(window);
    
    var gallery_width = container.parent().width()+30;
    
    //container.width(gallery_width);
    
    var $cols=5;
    if(gallery_width>1600){
        $cols=5
    }else if(gallery_width <= 1600 && gallery_width > 1100){
        $cols=4
    }else if(gallery_width <= 1100 && gallery_width > 800){
        $cols=3
    }else if(gallery_width <= 800 && gallery_width > 480){
        $cols=2
    }else if(gallery_width <= 480){
        $cols=1
    }
    var h1item=container.find('.isotope-item.h1:first img').height();
    var double_ratio=($window.innerWidth()>480)?2:1;
    container.find('.isotope-item.h2 img').css('height',(h1item * double_ratio));
    //setTimeout(function (){
        //console.log(Math.floor(gallery_width / parseInt($cols)));
        container.isotope({masonry:{columnWidth : Math.floor(gallery_width / parseInt($cols))}});
        
    //}, 500); // how long do you want the delay to be? 
    
    
    
}

function a13_refresh_carousel(owl,container){
   
        
    var slide_rows          = container.data('slide_rows'),
        
        carousel_w          = container.outerWidth(),
        items_per_slide     = slide_rows * Math.floor(carousel_w/270),
        padding             = ((carousel_w - ((Math.floor(carousel_w/270)) * 270)) / 2) - 5;
        
    owl.destroy();    
    //remove previous containers
    jQuery('.people_item').unwrap();
    //brake into rows
    if( slide_rows > 0 ){
        while(($children = jQuery(':not(.items_container)>.people_item:lt('+items_per_slide+')')).length) {
            $children.wrapAll(jQuery('<div class="items_container" style="padding: 10px '+padding+'px;"></div>'));
        }
    }
         
    owl.reinit();
}

(function(jQuery){
	jQuery(window).load(function(){
		
		
        jQuery(".people_img_overlay").each( function(){
            var content_h = jQuery(this).find('.mCSB_container').outerHeight(),
                container_h = jQuery(this).find('.mCSB_container').parent().outerHeight(),
                margin = ( (container_h - content_h) / 2 );
            if ( margin > 0 ){
                jQuery(this).find('.mCSB_container').css( 'margin-top' , margin + 'px' );
            }
        } );
        
		
	});
})(jQuery);


jQuery(document).ready(function(){

    jQuery(".touch_scroll").each( function(){
        var theme_name = jQuery(this).hasClass('dark') ? "minimal-light" : "minimal-dark";
        jQuery(this).mCustomScrollbar({
			theme:'inset-3-dark'
            
		});
    } );
    
    
    jQuery('.a13_image_grid_ul').each( function(){
        var this_gallery = jQuery(this);
        jQuery(this).isotope({
                layoutMode: 'packery',        
                itemSelector: '.isotope-item',
                responsive: false,
            }
        );
        jQuery(window).resize(debounce(function(){
            //a13_refresh_masonry(this_gallery);
        }, 300)
        );
    } );
    
    jQuery('.a13-custom-image-carousel').each( function(){
        
        var $this_carousel      = jQuery(this),
            $carousel           = jQuery(this).find('.vc-carousel-slideline-inner'),
            slides              = jQuery(this).data('per_view'),
            single              = slides == 1,
            animation_speed     = jQuery(this).data('speed'),
            scroll_count        = jQuery(this).data('scroll'),
            auto_play           = jQuery(this).data('autoplay') === 'yes',
            hide_nav            = jQuery(this).data('hide_nav') === 'yes',
            hide_pag            = jQuery(this).data('hide_pag') === 'yes',
            interval            = jQuery(this).data('interval'),
            slide_rows          = jQuery(this).data('slide_rows'),
            responsiveness      = [],
            carousel_w          = $this_carousel.outerWidth(),
            items_per_slide     = slide_rows * Math.floor(carousel_w/270),
            padding             = ((carousel_w - ((Math.floor(carousel_w/270)) * 270)) / 2) - 5;
            
        
        for (var i = 0; i < slides; i++) {
           responsiveness.push([ Math.floor(i*(1920/slides)) ,(i+1)]);
        }    
            
        //brake into rows
        
        if( slide_rows > 0 ){
            while(($children = jQuery(':not(.items_container)>.people_item:lt('+items_per_slide+')')).length) {
                $children.wrapAll(jQuery('<div class="items_container" style="padding: 10px '+padding+'px;"></div>'));
            }
        }
            
        
        $carousel.owlCarousel({
            autoPlay : auto_play,
            items: slides,
            singleItem: single,
            pagination : !hide_pag,
            scrollPerPage : scroll_count,
            slideSpeed : animation_speed,
            paginationSpeed : interval,
            navigation : !hide_nav,
            navigationText : false,
            paginationSpeed:800,
            itemsCustom: responsiveness
            
        });
        
        var $owl = $carousel.data('owlCarousel');
        jQuery(window).resize(debounce(function(){
            if( slide_rows > 0 ){
                a13_refresh_carousel($owl,$this_carousel);
            }else{
                return;
            }
        }, 300)
        );
    });


jQuery('.a13_load_more_works > span').on( 'click', function(){

    var button          = jQuery(this),
        container       = button.parent().parent().parent().find('ul.wpb_thumbnails:first');
    var G = ApolloParams;
    if ( button.hasClass( 'loading' ) ){
        return false;
    }
    
    
    
    button.addClass('loading');
    
        jQuery.ajax({
           type: "GET",
           data: {
              postType: button.attr('data-post-type'),
              category: button.attr('data-category'),
              postNotIn: button.attr('data-post-not-in'),
              numPosts: button.attr('data-posts-number'),
              offset: button.attr('data-offset'),
              orderBy: button.attr('data-order-by'),
              order: button.attr('data-order'),
              target: button.attr('data-target'),
              grid_template: button.attr('data-template'),
              item_layout_mode: button.attr('data-item-layout-mode'),
              v_margin: button.attr('data-v-margin'),
              h_margin: button.attr('data-h-margin'),
              margin_class: button.attr('data-margin_class'),
           },
           dataType: "json",
           url: G['plugins']+"/vc_extend_apollo13_chillout/load-more.php",
           success: function (data) {
              if (data.ok == 1 && data.html != '') {
                 var index,
                     new_offset = (parseInt(button.attr('data-offset')) + data.post_found);
                     
                 for (index = 0; index < data.html.length; ++index) {
                    var elem = jQuery(data.html[index]);
                    container.append(elem).isotope( 'appended', elem );
                 }
                jQuery(".to_scroll:not(.mCustomScrollbar)").each( function(){
                    var theme_name = jQuery(this).hasClass('dark') ? "minimal" : "minimal-dark";
                    jQuery(this).mCustomScrollbar({
                        theme:theme_name,
                    });
                } );
                 container.parent().append(data.css);
                 button.removeClass('loading');
                 
                 button.attr('data-offset',new_offset);
              } else if (data.ok == 0) {
                
                 button.removeClass('loading').parent().remove();
                 //var $message = jQuery('<span class="a13-button">'+data.err+'</span>');
                 //$message.hide();
                 //button.parent().append($message);
                 //button.fadeOut(300, function(){$message.fadeIn(300).delay(500).fadeOut(500, function(){button.fadeIn(200);} );} );
                 
              }
              jQuery(window).trigger('resize');
           },
           error: function (jqXHR, textStatus, errorThrown) {
              button.removeClass('loading');
           }
        });
    

} );

jQuery('.a13_load_more_gallery_images > span').on( 'click', function(){

    var button          = jQuery(this),
        container       = button.parent().parent().find('ul.wpb_thumbnails');
    
    if ( button.hasClass( 'loading' ) ){
        return false;
    }
    
    button.addClass('loading');
    jQuery.ajax({
       type: "GET",
       data: {
          gallery_id: button.attr('data-gallery-id'),
          offset: button.attr('data-offset'),
          numPosts: button.attr('data-posts-number'),
          grid_template: button.attr('data-template'),
          item_layout_mode: button.attr('data-item-layout-mode'),
          item_height: button.attr('data-item-height'),
          v_margin: button.attr('data-v-margin'),
          h_margin: button.attr('data-h-margin')
       },
       dataType: "json",
       url: G['plugins']+"/vc_extend_apollo13/gallery-load-more.php",
       success: function (data) {
          
          if (data.ok == 1 && data.html != '') {
             var $to_show = jQuery(data.html);
             var new_offset = (parseInt(button.attr('data-offset')) + data.post_found);
             
             
             container.append($to_show).isotope( 'appended', $to_show );
             $to_show.waitForImages( function(){
                //$to_show.find(".jackbox[data-group]").each(function(){ jQuery(this).jackBox("newItem"); });
                jQuery(window).trigger( 'resize' );
             } );
             button.removeClass('loading');
             
             button.attr('data-offset',new_offset);
          } else if (data.ok == 0) {
            
             button.removeClass('loading');
             //var $message = jQuery('<span class="a13-button">'+data.err+'</span>');
             //$message.hide();
             //button.parent().append($message);
             //button.fadeOut(300, function(){$message.fadeIn(300).delay(500).fadeOut(500, function(){button.fadeIn(200);} );} );
             
          }
       },
       error: function (jqXHR, textStatus, errorThrown) {
          button.removeClass('loading');
          
       }
    });

} );

jQuery(".wpb_thumbnails").on( 'click', '.submit_password', function(e){
    var container = jQuery(this).parent(),
        input = container.find('.post_password');

    jQuery.ajax({
       type: "POST",
       data: {
          post_id: input.attr('data-post-id'),
          pass: input.val()
       },
       dataType: "json",
       url: "wp-content/plugins/vc_extend_apollo13/check_pass.php",
       success: function (data) {
          
          if (data.ok == 1) {
            container.parentsUntil('.g-item').parent().find('.g-link').attr('data-pass-protection','0').click();
            
            container.parent().parent().find(".filling_table:not(.pass_form)").show();
            container.parent().remove();
          } else{
             container.find(".error").text(data.err)
          }
       },
       error: function (jqXHR, textStatus, errorThrown) {
          
          
       }
    });
    
    e.preventDefault();
    
    return false;
} );

var curent_loaded_post_index = null;

jQuery('.wpb_thumbnails').on( 'click', 'a.ajax_to_container', function(e){
    var headerH = jQuery('#header').outerHeight(),
        $url = jQuery(this).attr('href'),
        container_wrapper = jQuery(this).parentsUntil('.teaser_grid_container').parent().find(".a13_pt_ajax_container_wrapper"),
        container_title = container_wrapper.find(".post-title.works"),
        container_subtitle = container_wrapper.find(".works_subtitle"),
        container_navbar = container_wrapper.find(".a13_pt_ajax_container_navbar"),
        container = container_wrapper.find(".a13_pt_ajax_container"),
        protection = jQuery(this).attr('data-pass-protection') == 1,
        post_type = jQuery(this).attr('data-post-type'),
        target_part = (post_type=='gallery' ? '.wpb_teaser_grid' : '.type-work' ),
        ajax_loader = jQuery(this).parentsUntil('.teaser_grid_container').parent().find(".ajax_loader"),
        title = jQuery(this).find(".post_title_for_ajax_action").text(),
        subtitle = jQuery(this).find(".post_subtitle_for_ajax_action").text();
    
    curent_loaded_post_index = jQuery(this).parent().parent().find('li').index(jQuery(this).parent());
    
    
    //password protection
    if(protection){
        jQuery(this).find(".pass_form").animate({opacity:1});
        jQuery(this).find(".filling_table:not(.pass_form)").hide();
        
    }else{
        ajax_loader.addClass('loading');
        container_wrapper.animate({opacity:0}, function(){container.html("");} );	

        jQuery.get($url, {'ie=' : (new Date()).getTime()}, function(result){
            $result = jQuery(result);
       
            $result.find(target_part).appendTo(container);
             
            container_title.text(title);
            if( subtitle != '' ){
                container_subtitle.parent().parent().show();
                container_subtitle.text(subtitle);
            }else{
                container_subtitle.parent().parent().hide();
            }
            
            jQuery("html, body").animate({
                scrollTop: (container_wrapper.offset().top - headerH - 5) + "px"
                }, {
                duration: 1200,
                easing: "easeInOutExpo"
            });
    		container.find(target_part).waitForImages(function() {
    			ajax_loader.removeClass('loading'); 
                container.find(target_part).fitVids();	
                
                var content_h = container.find(target_part).outerHeight();
                var ajax_content_h = ( content_h + container_title.outerHeight() + container_subtitle.outerHeight() + (2*container_navbar.outerHeight()) + 60 )+'px';
                
                container_wrapper.animate({height:ajax_content_h}, function(){
                    container_wrapper.animate({opacity:1});
    				//projectNav.fadeIn();		
    			});
                a13_shortcodes();
    		});			  
				
			
			
            
        }, 'html');
        
        
    }
    
       
    
    e.preventDefault();
    
    return false;
});

//navigation
jQuery('.a13_pt_ajax_container_navbar li.grid a').on( 'click', function(e){
    var headerH = jQuery('#header').outerHeight(),
        container_wrapper = jQuery(this).parent().parent().parent().parent();
    
    container_wrapper.animate({opacity:0,height:0}, function(){
        var top = container_wrapper.parent().find('.categories_filter').length > 0 ? container_wrapper.parent().find('.categories_filter').offset().top : container_wrapper.parent().find('.wpb_thumbnails').offset().top ;
		jQuery("html, body").animate({
            scrollTop: ( top - headerH - 5) + "px"
            }, {
            duration: 500,
            easing: "easeInOutExpo"
        });		
	});
    container_wrapper.find(".a13_pt_ajax_container").html("");    
    e.preventDefault();
    
});
jQuery('.a13_pt_ajax_container_navbar li.prev a, .a13_pt_ajax_container_navbar li.next a').on( 'click', function(e){
    var items = jQuery(this).parentsUntil('.teaser_grid_container').parent().find('li.g-item'),
        items_in_grid = jQuery(this).parentsUntil('.teaser_grid_container').parent().find('li.g-item:not(.isotope-hidden)').length,
        checked_index = curent_loaded_post_index > 0 ? curent_loaded_post_index : 0,
        found_to_display = false,
        factor = jQuery(this).parent().hasClass('prev') ? -1 : 1 ;
    
    while (!found_to_display){
    
        checked_index = checked_index + factor;
        if ( checked_index < 0 ){
            checked_index = parseInt( items.length - 1 );
        }
        if ( checked_index >= items.length ){
            checked_index = 0;
        }
        
        if ( !items.eq(checked_index).hasClass('isotope-hidden') ){
            found_to_display = true;   
        }
        
    }
    items.eq(checked_index).find('a.g-link.ajax_to_container').click();
    
    
    e.preventDefault();
    
});

//filter collapse
jQuery('.categories_filter').on('click', '.label', function(){

    var filter = jQuery(this).parent(),
        filters = filter.find('li').not('.label');

    
    filters.toggle(300);
    //jQuery(this).toggleClass('open');
    
} );

//counter shortcode

function start_counting(o){
    jQuery(o).find('.a13_counter_sc_digits').each( function(index){
    
        var digits_field = jQuery(this).find('.inner_wrapper'),
            start_v = jQuery(this).attr('data-start'),
            end_v = jQuery(this).attr('data-end'),
            time = jQuery(this).attr('data-time'),
            step_time = jQuery(this).attr('data-step-time'),
            easing_mode = jQuery(this).attr('data-easing'),
            decimal = jQuery(this).attr('data-decimal'),
            appendix = jQuery(this).attr('data-append'),
            frame_distance = parseFloat((parseFloat(end_v) - parseFloat(start_v))/(time/step_time)),
            distance_pointer = 0;
            
            jQuery({countNum: start_v}).animate({countNum: end_v}, {
                duration: parseInt(time),
                easing:easing_mode,
                step: function(now, fx) {
                    // What todo on every count
                    if(parseFloat(this.countNum) > distance_pointer){
                        digits_field.html(parseFloat(this.countNum).toFixed(decimal) + ' ' + appendix  );
                        distance_pointer = distance_pointer + frame_distance;
                    }
                    
                },
                complete: function() {
                    // last step
                    digits_field.html(parseFloat(this.countNum).toFixed(decimal) + ' ' + appendix);
                }
            });
    
    } );

}

jQuery('.a13_counter_sc').each( function(){
    jQuery(this).waypoint( jQuery.proxy(start_counting, this, this),{ offset: '85%', triggerOnce:true } );
} );



});