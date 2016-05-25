import { remote, ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';

// Lightgallery components
import { lightGallery } from './lightGallery/js/lightgallery.js';
import { Thumbnail } from './lightGallery/js/lg-thumbnail.js';
import { Zoom } from './lightGallery/js/lg-zoom.js';
import { Autoplay } from './lightGallery/js/lg-autoplay.js';
import { Pager } from './lightGallery/js/lg-pager.js';
import { mousewheel } from './lightGallery/js/mousewheel.js';

import env from './env';

var app = remote.app;
var lg;

// Lightgallery default settings
// Write to config file  only once
var defaults = {

    mode: 'lg-slide',

    // Ex : 'ease'
    cssEasing: 'ease',

    //'for jquery animation'
    easing: 'linear',
    speed: 600,
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 0,
    hideBarsDelay: 6000,

    useLeft: false,

    closable: false,
    loop: true,
    escKey: false,
    keyPress: true,
    controls: true,
    slideEndAnimatoin: true,
    hideControlOnEnd: false,
    mousewheel: true,

    // .lg-item || '.lg-sub-html'
    appendSubHtmlTo: '.lg-sub-html',

    /**
     * @desc number of preload slides
     * will exicute only after the current slide is fully loaded.
     *
     * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
     * slide will be loaded in the background after the 4th slide is fully loaded..
     * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
     *
     */
    preload: 1,
    showAfterLoad: true,
    selector: '',
    selectWithin: '',
    nextHtml: '',
    prevHtml: '',

    // 0, 1
    index: false,

    iframeMaxWidth: '100%',

    download: false,
    counter: true,
    appendCounterTo: '.lg-toolbar',

    swipeThreshold: 50,
    enableSwipe: true,
    enableDrag: true,

    dynamic: true,
    dynamicEl: [],
    galleryId: 1,
    scale: 1,
    zoom: true,
    enableZoomAfter: 300,
    autoplay: false,
    pause: 5000,
    progressBar: true,
    fourceAutoplay: false,
    autoplayControls: true,
    appendAutoplayControlsTo: '.lg-toolbar',
    pager: false,
    thumbnail: true,

    animateThumb: true,
    currentPagerPosition: 'middle',

    thumbWidth: 100,
    thumbContHeight: 100,
    thumbMargin: 5,

    exThumbImage: false,
    showThumbByDefault: true,
    toogleThumb: true,
    pullCaptionUp: true,

    enableThumbDrag: true,
    enableThumbSwipe: true,
    swipeThreshold: 50,

    loadYoutubeThumbnail: true,
    youtubeThumbSize: 1,

    loadVimeoThumbnail: true,
    vimeoThumbSize: 'thumbnail_small',

    loadDailymotionThumbnail: true
};

// Write settings to config file
fs.readFile(app.getPath('userData') + '/lg-config.json', function(err, data) {
    if (err) {
        fs.writeFile(app.getPath('userData') + '/lg-config.json', JSON.stringify(defaults), function(err) {
            if (err) throw err;
        });
    } else {
        defaults = JSON.parse(data);
    }
});

var el = [];

/**
 * @desc Create dynamic elements and initiate lightgallery
 * @param  {string} dir - the directory from where lightgallery is opened
 * @param  {string} file - filename from path; only used for development for opening image in the gallery
 * */
var loadFiles = function(dir, file) {
    fs.readdir(dir, function(err, files) {
        var _images = [];
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                if (path.extname(files[i]).toLowerCase() === '.jpg' || path.extname(files[i]).toLowerCase() === '.png' || path.extname(files[i]).toLowerCase() === '.gif' || path.extname(files[i]).toLowerCase() === '.webp') {
                    el.push({
                        src: dir + '\\' + files[i],
                        thumb: './lightgallery/img/lg-default.png'
                    });
                    _images.push(files[i]);
                }
            };
        };

        var _index = file ? _images.indexOf(file) : 0;
        if (env.name !== 'production') {
            _index = 0;
        }

        if ($.isArray(el) && el.length) {

            if ($('.lightgallery').data('lightGallery')) {
                $('.lightgallery').data('lightGallery').destroy(true);
            }

            setTimeout(function() {
                $('.lightgallery').lightGallery($.extend({}, defaults, {
                    dynamicEl: el,
                    index: _index
                }));
            }, 100);
        };
    });
};

var getFiles = function(files) {
    el = [];
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            if (path.extname(files[i].path || files[i]).toLowerCase() === '.jpg' || path.extname(files[i].path || files[i]).toLowerCase() === '.png' || path.extname(files[i].path || files[i]).toLowerCase() === '.gif' || path.extname(files[i].path || files[i]).toLowerCase() === '.webp') {
                el.push({
                    src: files[i].path || files[i],
                    thumb: './lightgallery/img/lg-default.png'
                });
            }
        };
    };

    if ($.isArray(el) && el.length) {
        if ($('.lightgallery').data('lightGallery')) {
            $('.lightgallery').data('lightGallery').destroy(true);
        }

        setTimeout(function() {
            $('.lightgallery').lightGallery($.extend({}, defaults, {
                dynamicEl: el,
                index: 0
            }));
        }, 100);
    };
};

/**
 * @desc reload lightgallery when user changes the settings
 */
var reload = function() {

    // Store the current index
    var _index = $('.lightgallery').data('lightGallery').index;

    // Destroy the gallery
    $('.lightgallery').data('lightGallery').destroy(true);

    // Read settings from config file and rebuild lightgallery
    fs.readFile(app.getPath('userData') + '/lg-config.json', function(err, data) {
        if (err) throw err;
        defaults = JSON.parse(data);

        setTimeout(function() {
            $('.lightgallery').lightGallery($.extend({}, defaults, {
                dynamicEl: el,
                index: _index
            }));
        }, 100);
    });
};

document.addEventListener('dragover', function(event) {
    event.preventDefault();
    $('body').addClass('lg-drag-over');
    return false;
}, false);

document.addEventListener('drop', function(event) {
    event.preventDefault();
    getFiles(event.dataTransfer.files);
    $('body').removeClass('lg-drag-over');
    return false;
}, false);

document.addEventListener('dragleave', function(event) {
    event.preventDefault();
    $('body').removeClass('lg-drag-over');
    return false;
}, false);

document.addEventListener('dragexit', function(event) {
    event.preventDefault();
    $('body').removeClass('lg-drag-over');
    return false;
}, false);

// Listen opened events from main process
ipcRenderer.on('opened', function(event, arg) {
    if (arg) {
        var dir = path.parse(arg).dir;
        var _file = path.basename(arg);
        loadFiles(dir, _file);
    }
});

ipcRenderer.on('openDirectory', function(event, directory) {
    if (directory && directory.length) {
        loadFiles(directory[0]);
    }
});

ipcRenderer.on('openedFiles', function(event, arg) {
    if (arg && arg.length) {
        getFiles(arg);
    }
});

// Listen opened events from main process and reload gallery
ipcRenderer.on('refresh', function(event, arg) {
    reload();
});
