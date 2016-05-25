var pageLoaded = false;
$(document).ready(function() {

    var downloadBtn = '';
    if (navigator.appVersion.indexOf("Win")!=-1){
        downloadBtn = '<a id="lg-download-btn" style="margin-right:10px;" class="btn btn-primary btn-lg" onclick="ga(\'send\', \'event\', \'download\', \'download\');" href="https://github.com/sachinchoolur/lightgallery-desktop/releases/download/0.1.0/lightgallery_0.1.0.zip">Download For Windows</a>';
    } else if (navigator.appVersion.indexOf("Mac")!=-1){
        downloadBtn = '<a id="lg-download-btn" style="margin-right:10px;" class="btn btn-primary btn-lg" onclick="ga(\'send\', \'event\', \'download\', \'download\');" href="https://github.com/sachinchoolur/lightgallery-desktop/releases/download/0.1.0/lightgallery_0.1.0.dmg.zip">Download For Mac</a>';
    } else if (navigator.appVersion.indexOf("Linux")!=-1){
        downloadBtn = '<a id="lg-download-btn" style="margin-right:10px;" class="btn btn-primary btn-lg" onclick="ga(\'send\', \'event\', \'download\', \'download\');" href="https://github.com/sachinchoolur/lightgallery-desktop/releases/download/0.1.0/lightgallery_0.1.0_amd64.zip">Download For Linux</a>';
    }
    $('#view-on-github').after(downloadBtn);

    $('#lg-download-btn').on('click', function(){
        setTimeout(function(){
            $( "#promoBar" ).slideDown( 'fast', function() {
                $('html, body').animate({scrollTop:0}, 'fast');
            });
        }, 3000);
    });

    $('#promo_close').on('click', function(){
        $( '#promoBar' ).slideUp( 'fast');
    });

    function layout () {
        $('#hero').height($(window).height());

        var margin = (($(window).height() - $('#core').height()) / 2) - 50;
        if (margin < 0 ) {
            margin = 0;
        };
        $('#core').css('margin-top',  margin);
    }

    layout();

    $(window).on('resize', function() {
        layout();
    });

    new WOW().init();

    setTimeout(function() {
        if (!pageLoaded) {
            pageLoading();
            console.log('timeout')
            pageLoaded = true;
        }
    }, 1500);
});

var pageLoading = function() {
    $('body').addClass('loaded');
    setTimeout(function() {
        $('body').addClass('in');
    }, 400);

    setTimeout(function() {
        $('.page-loading').remove();
    }, 600);
};

$(window).on('load', function() {
    if (!pageLoaded) {
        pageLoading();
        pageLoaded = true;
    }

    setTimeout(function() {
        $('#twitter').sharrre({
            share: {
                twitter: true
            },
            enableHover: false,
            enableTracking: true,
            buttons: {
                twitter: {}
            },
            click: function(api, options) {
                api.simulateClick();
                api.openPopup('twitter');
            }
        });
        $('#facebook').sharrre({
            share: {
                facebook: true
            },
            enableHover: false,
            enableTracking: true,
            click: function(api, options) {
                api.simulateClick();
                api.openPopup('facebook');
            }
        });
        $('#googleplus').sharrre({
            share: {
                googlePlus: true
            },
            enableHover: false,
            enableTracking: true,
            click: function(api, options) {
                api.simulateClick();
                api.openPopup('googlePlus');
            }
        })
    }, 800);
})
