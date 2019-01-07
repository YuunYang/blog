/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function() {
  $('.page__content a').attr('target', '_blank');
  // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();

  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);

  // FitVids init
  $("#main").fitVids();

  // Sticky sidebar
  var stickySideBar = function() {
    var show =
      $(".author__urls-wrapper button").length === 0
        ? $(window).width() > 1024 // width should match $large Sass variable
        : !$(".author__urls-wrapper button").is(":visible");
    if (!show) {
      $(".sidebar").removeClass("sticky");
    }
  };

  stickySideBar();

  $(window).resize(function() {
    stickySideBar();
  });

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function() {
    $(".author__urls").toggleClass("is--visible");
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Search toggle
  $(".search__toggle").on("click", function() {
    $(".search-content").toggleClass("is--visible");
    $(".initial-content").toggleClass("is--hidden");
    // set focus on input
    setTimeout(function() {
      $(".search-content input").focus();
    }, 400);
  });

  // init smooth scroll
  $('a[href^="#"]').on('click', function (event) {
    event.preventDefault();
    $.smoothScroll({
      scrollTarget: decodeURI(this.hash),
      offset: -20,
    });
    return false;
  });

  // $("article img").addClass("image-popup");
  // // add lightbox class to all image links
  // $(
  //   "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']"
  // ).addClass("image-popup");

  // // Magnific-Popup options
  // $(".image-popup").magnificPopup({
  //   type: 'image',
  //   closeOnContentClick: false,
  //   closeBtnInside: false,
  //   mainClass: 'mfp-with-zoom mfp-img-mobile',
  //   image: {
  //     verticalFit: true,
  //     titleSrc: function (item) {
  //       return item.el.attr('title');
  //     }
  //   },
  //   gallery: {
  //     enabled: true
  //   },
  //   zoom: {
  //     enabled: true,
  //     duration: 300, // don't foget to change the duration also in CSS
  //     opener: function (element) {
  //       return element.find('img');
  //     }
  //   }
  // });
});
