//Set defaults
(function( $ ) {
  console.log('Donate.js initialized');
  console.log('Learn more at http://smartergiving.org/donatejs/');
  $(function(){

    // --- Reset modal ---
    var resetModal = function () {
      $('#sgvg-modal .collapse.in').collapse('hide');
      $('#accordion .panel-heading').addClass('collapsed');
      $('#accordion').css('display', 'block');
      $('.js-donate').button('reset');
      $('.panel-title').removeClass('na');
      $('.donate-dafs').css('display', 'block');
      $('.donate-dafs-na').css('display', 'none');
      $('.modal-back').css('display', 'none');
      // --- Remove sessionStorage objects
      Object.keys(sessionStorage)
      .forEach(function(key){
         if (/^sgvg/.test(key)) {
             sessionStorage.removeItem(key);
         }
       });
    };
    resetModal();

    // --- Fetch Data ---
    var setData = function () {
      if (sessionStorage) {
        //sessionStorage.setItem('sgvgSomeData', $(e.relatedTarget).data('some-data'));
      }
      //TODO: Need backups for when localStorage is not available

    };

    // --- Main click event ---
    $('.js-donate').click(function (e) {
      $(this).button('loading'); //TODO: Remove Twitter-Bootstrap 'button' reference

      // --- Fetch Data ---
      // TODO: Move to separate function: e.g.//setData();
      sessionStorage.setItem('sgvgEin', $(this).data('ein'));
      sessionStorage.setItem('sgvgId', $(this).data('id'));
      sessionStorage.setItem('sgvgName', $(this).data('donate-name'));
      sessionStorage.setItem('sgvgLink', $(this).data('donate-link'));

      // --- Trigger Modal ---
      // TODO: Currently handled by Bootstrap via data-toggle attribute

      // --- Google Analytics ---
      var gaLabel = $(this).data('donate-name');
      ga('send', 'event', 'dispatch-page', 'clicked-donate-opened-modal', gaLabel);
    });

    // --- Set up modal with dynamic data ---
    $('#sgvg-modal').on('show.bs.modal', function (e) {

      var ein = sessionStorage.getItem('sgvgEin');
      var id = sessionStorage.getItem('sgvgId');
      var name = sessionStorage.getItem('sgvgName');
      var link = sessionStorage.getItem('sgvgLink');

      var modal = $(this).find('.modal-front');
      modal.find('.modal-title h1').text(name);
      modal.find('.image img').attr('src','//d2zrr75qo845hh.cloudfront.net/images/db/' + id + '/avatar.jpg');
      //TODO: Handle missing images

      // --- DAFs ---
      if (!ein) {
        $('.donate-dafs').css('display', 'none');
        $('.donate-dafs-na').css('display', 'block');
        $('.panel-title-dafs').addClass('na');
      }
      $(document).on('change','#dafSelection',function (e){
        $('#dafAmountCollapse').collapse('show');
        var daf = $(e.target).val();
        sessionStorage.setItem('sgvgDafProvider', daf);
        // -- Google Analytics ---
        //var key = sessionStorage.get('donateKey');
        //ga('send', 'event', 'dispatch-page', 'selected-a-daf-provider', key + '-' + daf);
      });
      $('#dafAmount').keyup(function (e) {
        $('#dafAmountSubmitCollapse').collapse('show');
        var amt = parseInt($(e.target).val()) * 100;
        sessionStorage.setItem('sgvgAmt', amt);
        console.log(amt);
      });

        //DAF final submit
      $('.js-daf-submit').click(function (e) {
        e.preventDefault();
        //var id = Session.get('guestId');
        //var key = Session.get('donateKey');
        var ein = sessionStorage.getItem('sgvgEin');
        var daf = sessionStorage.getItem('sgvgDafProvider');
        var amt = sessionStorage.getItem('sgvgAmt') / 100; //adjust for Stripe format
        //Set proper text
        var txtSet = function () {
          if (sessionStorage.getItem('coinvest', true))
            return encodeURIComponent('SmarterGiving - Spark CoINVEST');
          else
            return encodeURIComponent('We found you via SmarterGiving - smartergiving.org/dispatch');
        };
        var txt = txtSet();
        // --- Google Analytics ---
        //var path = Router.current().params.name + '_' + Router.current().params.lens;
        //var gaSrc = 'dispatch_' + path;
        //var gaLabel = daf;
        //ga('send', 'event', 'dispatch-page', 'submitted-daf-amount', key + '-' + daf, amt);

        // --- Submit to partner sites ---
        if (daf == 'gkccf') {
          $('#sgvg-modal').modal('hide');
          window.open('https://prodstaging.edonorcentral.com/login_0048.asp?Npo_Id=' + ein + '&Grnt_Amnt='+ amt + '&Grnt_Dsg_Txt=' + txt);
        }
        if (daf == 'fidelity') {
          $('#sgvg-modal').modal('hide');
          window.open('https://charitablegift.fidelity.com/cgfweb/CGFLogon.cgfdo?Npo_Id=' + ein + '&Grnt_amnt='+ amt + '.0&Grnt_Dsg_Txt=&Device_Type=Widget&App_Id=MDNR&source=widget' + txt);
        }
        if (daf == 'schwab') {
          $('#sgvg-modal').modal('hide');
          window.open('https://client.schwab.com/Login/SignOn/CustomerCenterLogin.aspx?SANC=recommendgrant&PARMS=|Npo_Id=' + ein +'|Grnt_Amnt='+ amt + '|Device_Type=Widget|App_Id=MDNR|source=widget|Grnt_Dsg_Txt=' + txt);
        }
        // TODO - need to provide 'success' feedback
      });

      // --- Credit Cards & Bitcoin ---
      $('.panel-title-stripe').addClass('na');

      // --- Direct Link ---
      modal.find('.js-donate-direct').attr('href', link).text(link);
      $('.js-donate-direct').click( function (e) {
        var id = sessionStorage.getItem('sgvgId');
        ga('send', 'event', 'dispatch-page', 'clicked-external-donate-link', id );
      });

      // --- Edge Case: handle fiscal sponsored orgs e.g. Bayes Impact ---
      if (typeof $(e.target).data('ein-note') !== 'undefined') {
        var einNote = $(e.target).data('ein-note');
        sessionStorage.setItem('sgvgEinNote', einNote);
      } else {
        sessionStorage.setItem('sgvgEinNote', undefined);
      }

    });

    // --- SmarterGiving footer link ---
    $('.faq-drawer').click(function (e) {
      $('.modal-back').slideToggle({
        direction: "up"
      }, 300);
      //scroll if top is beyond viewable screen
      var modalTop = $('.modal-content').offset().top;
      var scroll = $(window).scrollTop();
      if (modalTop < scroll) {
        //TODO - fix
        $('#sgvg-modal').animate({
          scrollTop: $('.modal-dialog').position().top
        }, 500);
      }
    });

    //Clean up modals after hidden/closed
    $('#sgvg-modal').on('hide.bs.modal', function (e) {
      resetModal();
    });
  });
}( jQuery ));
