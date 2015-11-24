
/*********************************************************************************/
/* Skel + Theme Defaults                                                         */
/*********************************************************************************/

(function($) {

  skel.breakpoints({
    xlarge: '(max-width: 1680px)',
    large: '(max-width: 1140px)',
    medium: '(max-width: 980px)',
    small: '(max-width: 736px)',
    xsmall: '(max-width: 480px)',
    xxsmall: '(max-width: 320px)'
  });

  $(function() {

    var $window = $(window),
      $body = $('body');

    // Disable animations/transitions until the page has loaded.
      $body.addClass('is-loading');

      $window.on('load', function() {
        window.setTimeout(function() {
          $body.removeClass('is-loading');
        }, 250);
      });

    // Fix: Placeholder polyfill.
      $('form').placeholder();

    // Prioritize "important" elements on mobile.
      skel.on('+mobile -mobile', function() {
        $.prioritize(
          '.important\\28 mobile\\29',
          skel.breakpoint('mobile').active
        );
      });

    // Scrolly.
      $('.scrolly').scrolly();

  });

})(jQuery);

/*********************************************************************************/
/* Custom JS                                                                     */
/*********************************************************************************/

$(function() {

  //Card flip
  $( '.js-flip' ).click(function(e) {
    e.preventDefault();
    $(e.target).closest('.flip-container').toggleClass('flip');
    $('html, body').animate({
      'scrollTop': $(e.target).closest('.flip-container').offset().top,
    }, 'slow');
  });
  //Auto-fit description text
    $('.js-card-description').each(function(){
      var _self = $(this);
      if (_self.outerHeight() > (19*5)){
        _self.addClass('text-shrink');
      }
    });
    //Donate button
    $( '.js-donate' ).click(function(e) {
    console.log('clicked');
    e.preventDefault();
    swal({
      title: 'Your generosity is infectious!',
      text: 'Unfortunately, we have a few legal and tax issues to finalize before we can allow the world to donate so simply :)',
      type: 'warning',
      allowOutsideClick: true,
      confirmButtonText: 'Close',
    });
  });
});
