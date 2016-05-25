import {
    app, BrowserWindow, Menu, dialog
}
from 'electron';
import windowStateKeeper from './vendor/electron_boilerplate/window_state';
import env from './env';
import fs from 'fs';

var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

var ready = false;
var images;
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

// Update lightgallery conifg files
var updateConfig = function(key, val) {
    fs.readFile(app.getPath('userData') + '/lg-config.json', function(err, data) {
        if (err) throw err;
        defaults = JSON.parse(data);
        defaults[key] = val;
        fs.writeFile(app.getPath('userData') + '/lg-config.json', JSON.stringify(defaults), function(err) {
            if (err) throw err;
            mainWindow.webContents.send('refresh');
        });
    });
};

var setDevMenu = function() {
    var devMenu = Menu.buildFromTemplate([{
        label: 'Window',
        submenu: [{
            label: 'Toggle Full Screen',
            accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
            click(item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            }
        }, {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function() {
                app.quit();
            }
        }]
    }, {
        label: 'File',
        submenu: [{
            label: 'Open',
            click: function() {
                dialog.showOpenDialog({
                    properties: ['openFile', 'multiSelections'],
                    filters: [{
                        name: 'Images',
                        extensions: ['jpg', 'png', 'gif', 'webp']
                    }]
                }, function(files) {
                    mainWindow.webContents.send('openedFiles', files);
                });
            }
        }, {
            label: 'Open directory',
            click: function() {
                dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    filters: [{
                        name: 'Images',
                        extensions: ['jpg', 'png', 'gif', 'webp']
                    }]
                }, function(directory) {
                    mainWindow.webContents.send('openDirectory', directory);
                });
            }
        }]
    }, {
        label: 'Thumbnail',
        submenu: [{
            label: 'thumbnail',
            type: 'checkbox',
            checked: defaults.thumbnail,
            click: function(menuItem) {
                updateConfig('thumbnail', menuItem.checked);
            }
        }, {
            label: 'animateThumb',
            type: 'checkbox',
            checked: defaults.animateThumb,
            click: function(menuItem) {
                updateConfig('animateThumb', menuItem.checked);
            }
        }, {
            label: 'Current Pager Position',
            submenu: [{
                label: 'left',
                type: 'radio',
                checked: defaults.currentPagerPosition == 'left',
                click: function() {
                    updateConfig('currentPagerPosition', 'left');
                }
            }, {
                label: 'middle',
                type: 'radio',
                checked: defaults.currentPagerPosition == 'middle',
                click: function() {
                    updateConfig('currentPagerPosition', 'middle');
                }
            }, {
                label: 'right',
                type: 'radio',
                checked: defaults.currentPagerPosition == 'right',
                click: function() {
                    updateConfig('currentPagerPosition', 'right');
                }
            }]
        }, {
            label: 'toogleThumb',
            type: 'checkbox',
            checked: defaults.toogleThumb,
            click: function(menuItem) {
                updateConfig('toogleThumb', menuItem.checked);
            }
        }, {
            label: 'enableThumbDrag',
            type: 'checkbox',
            checked: defaults.enableThumbDrag,
            click: function(menuItem) {
                updateConfig('enableThumbDrag', menuItem.checked);
            }
        }, {
            label: 'Thumb width',
            submenu: [{
                label: '25 px',
                type: 'radio',
                checked: defaults.thumbWidth == 25,
                click: function() {
                    updateConfig('thumbWidth', 25);
                }
            }, {
                label: '50 px',
                type: 'radio',
                checked: defaults.thumbWidth == 50,
                click: function() {
                    updateConfig('thumbWidth', 50);
                }
            }, {
                label: '75 px',
                type: 'radio',
                checked: defaults.thumbWidth == 75,
                click: function() {
                    updateConfig('thumbWidth', 75);
                }
            }, {
                label: '100 px',
                type: 'radio',
                checked: defaults.thumbWidth == 100,
                click: function() {
                    updateConfig('thumbWidth', 100);
                }
            }, {
                label: '125 px',
                type: 'radio',
                checked: defaults.thumbWidth == 125,
                click: function() {
                    updateConfig('thumbWidth', 125);
                }
            }, {
                label: '150 px',
                type: 'radio',
                checked: defaults.thumbWidth == 150,
                click: function() {
                    updateConfig('thumbWidth', 150);
                }
            }, {
                label: '175 px',
                type: 'radio',
                checked: defaults.thumbWidth == 175,
                click: function() {
                    updateConfig('thumbWidth', 175);
                }
            }, {
                label: '200 px',
                type: 'radio',
                checked: defaults.thumbWidth == 200,
                click: function() {
                    updateConfig('thumbWidth', 200);
                }
            }, {
                label: '225 px',
                type: 'radio',
                checked: defaults.thumbWidth == 225,
                click: function() {
                    updateConfig('thumbWidth', 225);
                }
            }, {
                label: '250 px',
                type: 'radio',
                checked: defaults.thumbWidth == 250,
                click: function() {
                    updateConfig('thumbWidth', 250);
                }
            }, {
                label: '275 px',
                type: 'radio',
                checked: defaults.thumbWidth == 275,
                click: function() {
                    updateConfig('thumbWidth', 275);
                }
            }, {
                label: '300 px',
                type: 'radio',
                checked: defaults.thumbWidth == 300,
                click: function() {
                    updateConfig('thumbWidth', 300);
                }
            }]
        }, {
            label: 'Thumb container height',
            submenu: [{
                label: '25 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 25,
                click: function() {
                    updateConfig('thumbContHeight', 25);
                }
            }, {
                label: '50 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 50,
                click: function() {
                    updateConfig('thumbContHeight', 50);
                }
            }, {
                label: '75 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 75,
                click: function() {
                    updateConfig('thumbContHeight', 75);
                }
            }, {
                label: '100 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 100,
                click: function() {
                    updateConfig('thumbContHeight', 100);
                }
            }, {
                label: '125 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 125,
                click: function() {
                    updateConfig('thumbContHeight', 125);
                }
            }, {
                label: '150 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 150,
                click: function() {
                    updateConfig('thumbContHeight', 150);
                }
            }, {
                label: '175 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 175,
                click: function() {
                    updateConfig('thumbContHeight', 175);
                }
            }, {
                label: '200 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 200,
                click: function() {
                    updateConfig('thumbContHeight', 200);
                }
            }, {
                label: '225 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 225,
                click: function() {
                    updateConfig('thumbContHeight', 225);
                }
            }, {
                label: '250 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 250,
                click: function() {
                    updateConfig('thumbContHeight', 250);
                }
            }, {
                label: '275 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 275,
                click: function() {
                    updateConfig('thumbContHeight', 275);
                }
            }, {
                label: '300 px',
                type: 'radio',
                checked: defaults.thumbContHeight == 300,
                click: function() {
                    updateConfig('thumbContHeight', 300);
                }
            }]
        }, {
            label: 'Thumb Margin',
            submenu: [{
                label: '2 px',
                type: 'radio',
                checked: defaults.thumbMargin == 2,
                click: function() {
                    updateConfig('thumbMargin', 2);
                }
            }, {
                label: '3 px',
                type: 'radio',
                checked: defaults.thumbMargin == 3,
                click: function() {
                    updateConfig('thumbMargin', 3);
                }
            }, {
                label: '5 px',
                type: 'radio',
                checked: defaults.thumbMargin == 5,
                click: function() {
                    updateConfig('thumbMargin', 5);
                }
            }, {
                label: '8 px',
                type: 'radio',
                checked: defaults.thumbMargin == 8,
                click: function() {
                    updateConfig('thumbMargin', 8);
                }
            }, {
                label: '10 px',
                type: 'radio',
                checked: defaults.thumbMargin == 10,
                click: function() {
                    updateConfig('thumbMargin', 10);
                }
            }, {
                label: '12 px',
                type: 'radio',
                checked: defaults.thumbMargin == 12,
                click: function() {
                    updateConfig('thumbMargin', 12);
                }
            }, {
                label: '15 px',
                type: 'radio',
                checked: defaults.thumbMargin == 15,
                click: function() {
                    updateConfig('thumbMargin', 15);
                }
            }, {
                label: '20 px',
                type: 'radio',
                checked: defaults.thumbMargin == 20,
                click: function() {
                    updateConfig('thumbMargin', 20);
                }
            }, {
                label: '25 px',
                type: 'radio',
                checked: defaults.thumbMargin == 25,
                click: function() {
                    updateConfig('thumbMargin', 25);
                }
            }, {
                label: '30 px',
                type: 'radio',
                checked: defaults.thumbMargin == 30,
                click: function() {
                    updateConfig('thumbMargin', 30);
                }
            }, {
                label: '50 px',
                type: 'radio',
                checked: defaults.thumbMargin == 50,
                click: function() {
                    updateConfig('thumbMargin', 50);
                }
            }, {
                label: '100 px',
                type: 'radio',
                checked: defaults.thumbMargin == 100,
                click: function() {
                    updateConfig('thumbMargin', 100);
                }
            }]
        }]
    }, {
        label: 'Settings',
        submenu: [{
            label: 'Enable Drag',
            type: 'checkbox',
            checked: defaults.enableDrag,
            click: function(menuItem) {
                updateConfig('enableDrag', menuItem.checked);
            }
        }, {
            label: 'loop',
            type: 'checkbox',
            checked: defaults.loop,
            click: function(menuItem) {
                updateConfig('loop', menuItem.checked);
            }
        }, {
            label: 'keyPress',
            type: 'checkbox',
            checked: defaults.keyPress,
            click: function(menuItem) {
                updateConfig('keyPress', menuItem.checked);
            }
        }, {
            label: 'controls',
            type: 'checkbox',
            checked: defaults.controls,
            click: function(menuItem) {
                updateConfig('controls', menuItem.checked);
            }
        }, {
            label: 'mousewheel',
            type: 'checkbox',
            checked: defaults.mousewheel,
            click: function(menuItem) {
                updateConfig('mousewheel', menuItem.checked);
            }
        }, {
            label: 'showAfterLoad',
            type: 'checkbox',
            checked: defaults.showAfterLoad,
            click: function(menuItem) {
                updateConfig('showAfterLoad', menuItem.checked);
            }
        }, {
            label: 'counter',
            type: 'checkbox',
            checked: defaults.counter,
            click: function(menuItem) {
                updateConfig('counter', menuItem.checked);
            }
        }, {
            label: 'pager',
            type: 'checkbox',
            checked: defaults.pager,
            click: function(menuItem) {
                updateConfig('pager', menuItem.checked);
            }
        }, {
            label: 'zoom',
            type: 'checkbox',
            checked: defaults.zoom,
            click: function(menuItem) {
                updateConfig('zoom', menuItem.checked);
            }
        }, {
            label: 'Scale',
            submenu: [{
                label: '0.3',
                type: 'radio',
                checked: defaults.scale == 0.3,
                click: function() {
                    updateConfig('scale', 0.3);
                }
            }, {
                label: '0.5',
                type: 'radio',
                checked: defaults.scale == 0.5,
                click: function() {
                    updateConfig('scale', 0.5);
                }
            }, {
                label: '0.8',
                type: 'radio',
                checked: defaults.scale == 0.8,
                click: function() {
                    updateConfig('scale', 0.8);
                }
            }, {
                label: '1',
                type: 'radio',
                checked: defaults.scale == 1,
                click: function() {
                    updateConfig('scale', 1);
                }
            }, {
                label: '1.2',
                type: 'radio',
                checked: defaults.scale == 1.2,
                click: function() {
                    updateConfig('scale', 1.2);
                }
            }, {
                label: '1.3',
                type: 'radio',
                checked: defaults.scale == 1.3,
                click: function() {
                    updateConfig('scale', 1.3);
                }
            }, {
                label: '1.5',
                type: 'radio',
                checked: defaults.scale == 1.5,
                click: function() {
                    updateConfig('scale', 1.5);
                }
            }, {
                label: '1.8',
                type: 'radio',
                checked: defaults.scale == 1.8,
                click: function() {
                    updateConfig('scale', 1.8);
                }
            }, {
                label: '2',
                type: 'radio',
                checked: defaults.scale == 2,
                click: function() {
                    updateConfig('scale', 2);
                }
            }, {
                label: '2.5',
                type: 'radio',
                checked: defaults.scale == 2.5,
                click: function() {
                    updateConfig('scale', 2.5);
                }
            }, {
                label: '3',
                type: 'radio',
                checked: defaults.scale == 3,
                click: function() {
                    updateConfig('scale', 3);
                }
            }, {
                label: '5',
                type: 'radio',
                checked: defaults.scale == 5,
                click: function() {
                    updateConfig('scale', 5);
                }
            }]
        }]
    }, {
        label: 'Autoplay',
        submenu: [{
            label: 'autoplay',
            type: 'checkbox',
            checked: defaults.autoplay,
            click: function(menuItem) {
                updateConfig('autoplay', menuItem.checked);
            }
        }, {
            label: 'progressBar',
            type: 'checkbox',
            checked: defaults.progressBar,
            click: function(menuItem) {
                updateConfig('progressBar', menuItem.checked);
            }
        }, {
            label: 'fourceAutoplay',
            type: 'checkbox',
            checked: defaults.fourceAutoplay,
            click: function(menuItem) {
                updateConfig('fourceAutoplay', menuItem.checked);
            }
        }, {
            label: 'autoplayControls',
            type: 'checkbox',
            checked: defaults.autoplayControls,
            click: function(menuItem) {
                updateConfig('autoplayControls', menuItem.checked);
            }
        }, {
            label: 'Pause',
            submenu: [{
                label: '1000 ms',
                type: 'radio',
                checked: defaults.pause == 1000,
                click: function() {
                    updateConfig('pause', 1000);
                }
            }, {
                label: '1500 ms',
                type: 'radio',
                checked: defaults.pause == 1500,
                click: function() {
                    updateConfig('pause', 1500);
                }
            }, {
                label: '2000 ms',
                type: 'radio',
                checked: defaults.pause == 2000,
                click: function() {
                    updateConfig('pause', 2000);
                }
            }, {
                label: '2500 ms',
                type: 'radio',
                checked: defaults.pause == 2500,
                click: function() {
                    updateConfig('pause', 2500);
                }
            }, {
                label: '3000 ms',
                type: 'radio',
                checked: defaults.pause == 3000,
                click: function() {
                    updateConfig('pause', 3000);
                }
            }, {
                label: '3500 ms',
                type: 'radio',
                checked: defaults.pause == 3500,
                click: function() {
                    updateConfig('pause', 3500);
                }
            }, {
                label: '4000 ms',
                type: 'radio',
                checked: defaults.pause == 4000,
                click: function() {
                    updateConfig('pause', 4000);
                }
            }, {
                label: '4500 ms',
                type: 'radio',
                checked: defaults.pause == 4500,
                click: function() {
                    updateConfig('pause', 4500);
                }
            }, {
                label: '5000 ms',
                type: 'radio',
                checked: defaults.pause == 5000,
                click: function() {
                    updateConfig('pause', 5000);
                }
            }, {
                label: '6000 ms',
                type: 'radio',
                checked: defaults.pause == 6000,
                click: function() {
                    updateConfig('pause', 6000);
                }
            }, {
                label: '7000 ms',
                type: 'radio',
                checked: defaults.pause == 7000,
                click: function() {
                    updateConfig('pause', 7000);
                }
            }, {
                label: '8000 ms',
                type: 'radio',
                checked: defaults.pause == 8000,
                click: function() {
                    updateConfig('pause', 8000);
                }
            }, {
                label: '9000 ms',
                type: 'radio',
                checked: defaults.pause == 9000,
                click: function() {
                    updateConfig('pause', 9000);
                }
            }, {
                label: '10000 ms',
                type: 'radio',
                checked: defaults.pause == 10000,
                click: function() {
                    updateConfig('pause', 10000);
                }
            }]
        }]
    }, {
        label: 'View',
        submenu: [{
            label: 'Mode',
            submenu: [{
                label: 'Fade',
                type: 'radio',
                checked: defaults.mode == 'lg-fade',
                click: function() {
                    updateConfig('mode', 'lg-fade');
                }
            }, {
                label: 'Slide',
                type: 'radio',
                checked: defaults.mode == 'lg-slide',
                click: function() {
                    updateConfig('mode', 'lg-slide');
                }
            }, {
                label: 'Zoom In',
                type: 'radio',
                checked: defaults.mode == 'lg-zoom-in',
                click: function() {
                    updateConfig('mode', 'lg-zoom-in');
                }
            }, {
                label: 'Zoom In Big',
                type: 'radio',
                checked: defaults.mode == 'lg-zoom-in-big',
                click: function() {
                    updateConfig('mode', 'lg-zoom-in-big');
                }
            }, {
                label: 'Zoom Out',
                type: 'radio',
                checked: defaults.mode == 'lg-zoom-out',
                click: function() {
                    updateConfig('mode', 'lg-zoom-out');
                }
            }, {
                label: 'Zoom Out Big',
                type: 'radio',
                checked: defaults.mode == 'lg-zoom-out-big',
                click: function() {
                    updateConfig('mode', 'lg-zoom-out-big');
                }
            }, {
                label: 'Zoom Out In',
                type: 'radio',
                checked: defaults.mode == 'lg-zoom-out-in',
                click: function() {
                    updateConfig('mode', 'lg-zoom-out-in');
                }
            }, {
                label: 'Zoom In Out',
                type: 'radio',
                checked: defaults.mode == 'lg-zoom-in-out',
                click: function() {
                    updateConfig('mode', 'lg-zoom-in-out');
                }
            }, {
                label: 'Soft Zoom',
                type: 'radio',
                checked: defaults.mode == 'lg-soft-zoom',
                click: function() {
                    updateConfig('mode', 'lg-soft-zoom');
                }
            }, {
                label: 'Scale Up',
                type: 'radio',
                checked: defaults.mode == 'lg-scale-up',
                click: function() {
                    updateConfig('mode', 'lg-scale-up');
                }
            }, {
                label: 'Slide Circular',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-circular',
                click: function() {
                    updateConfig('mode', 'lg-slide-circular');
                }
            }, {
                label: 'Slide Circular Vertical',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-circular-vertical',
                click: function() {
                    updateConfig('mode', 'lg-slide-circular-vertical');
                }
            }, {
                label: 'Slide Vertical',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-vertical',
                click: function() {
                    updateConfig('mode', 'lg-slide-vertical');
                }
            }, {
                label: 'Slide Vertical Growth',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-vertical-growth',
                click: function() {
                    updateConfig('mode', 'lg-slide-vertical-growth');
                }
            }, {
                label: 'Slide Skew Only',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-only',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-only');
                }
            }, {
                label: 'Slide Skew Only Rev',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-only-rev',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-only-rev');
                }
            }, {
                label: 'Slide Skew Only Y',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-only-y',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-only-y');
                }
            }, {
                label: 'Slide Skew Only Y Rev',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-only-y-rev',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-only-y-rev');
                }
            }, {
                label: 'Slide Skew',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew');
                }
            }, {
                label: 'Slide Skew Rev',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-rev',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-rev');
                }
            }, {
                label: 'Slide Skew Cross',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-cross',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-cross');
                }
            }, {
                label: 'Slide Skew Cross Rev',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-cross-rev',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-cross-rev');
                }
            }, {
                label: 'Slide Skew Ver',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-ver',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-ver');
                }
            }, {
                label: 'Slide Skew Ver Rev',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-ver-rev',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-ver-rev');
                }
            }, {
                label: 'Slide Skew Ver Cross',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-ver-cross',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-ver-cross');
                }
            }, {
                label: 'Slide Skew Ver Cross Rev',
                type: 'radio',
                checked: defaults.mode == 'lg-slide-skew-ver-cross-rev',
                click: function() {
                    updateConfig('mode', 'lg-slide-skew-ver-cross-rev');
                }
            }, {
                label: 'Lollipop',
                type: 'radio',
                checked: defaults.mode == 'lg-lollipop',
                click: function() {
                    updateConfig('mode', 'lg-lollipop');
                }
            }, {
                label: 'Lollipop Rev',
                type: 'radio',
                checked: defaults.mode == 'lg-lollipop-rev',
                click: function() {
                    updateConfig('mode', 'lg-lollipop-rev');
                }
            }, {
                label: 'Rotate',
                type: 'radio',
                checked: defaults.mode == 'lg-rotate',
                click: function() {
                    updateConfig('mode', 'lg-rotate');
                }
            }, {
                label: 'Rotate Rev',
                type: 'radio',
                checked: defaults.mode == 'lg-rotate-rev',
                click: function() {
                    updateConfig('mode', 'lg-rotate-rev');
                }
            }, {
                label: 'Tube',
                type: 'radio',
                checked: defaults.mode == 'lg-tube',
                click: function() {
                    updateConfig('mode', 'lg-tube');
                }
            }]
        }, {
            label: 'Easing',
            submenu: [{
                label: 'linear',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.250, 0.250, 0.750, 0.750)');
                }
            }, {
                label: 'ease',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.250, 0.100, 0.250, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.250, 0.100, 0.250, 1.000)');
                }
            }, {
                label: 'ease-in',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.420, 0.000, 1.000, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.420, 0.000, 1.000, 1.000)');
                }
            }, {
                label: 'ease-out',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.000, 0.000, 0.580, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.000, 0.000, 0.580, 1.000)');
                }
            }, {
                label: 'ease-in-out',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.420, 0.000, 0.580, 1.000)');
                }
            }, {
                label: 'easeInQuad',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.550, 0.085, 0.680, 0.530)');
                }
            }, {
                label: 'easeInCubic',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.550, 0.055, 0.675, 0.190)');
                }
            }, {
                label: 'easeInQuart',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.895, 0.030, 0.685, 0.220)');
                }
            }, {
                label: 'easeInQuint',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.755, 0.050, 0.855, 0.060)');
                }
            }, {
                label: 'easeInSine',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.470, 0.000, 0.745, 0.715)');
                }
            }, {
                label: 'easeInExpo',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.950, 0.050, 0.795, 0.035)');
                }
            }, {
                label: 'easeInCirc',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.600, 0.040, 0.980, 0.335)');
                }
            }, {
                label: 'easeInBack',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.600, -0.280, 0.735, 0.045)');
                }
            }, {
                label: 'easeOutQuad',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.250, 0.460, 0.450, 0.940)');
                }
            }, {
                label: 'easeOutCubic',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.215, 0.610, 0.355, 1.000)');
                }
            }, {
                label: 'easeOutQuart',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.165, 0.840, 0.440, 1.000)');
                }
            }, {
                label: 'easeOutQuint',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.230, 1.000, 0.320, 1.000)');
                }
            }, {
                label: 'easeOutSine',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.390, 0.575, 0.565, 1.000)');
                }
            }, {
                label: 'easeOutExpo',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.190, 1.000, 0.220, 1.000)');
                }
            }, {
                label: 'easeOutCirc',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.075, 0.820, 0.165, 1.000)');
                }
            }, {
                label: 'easeOutBack',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.175, 0.885, 0.320, 1.275)');
                }
            }, {
                label: 'easeInOutQuad',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.455, 0.030, 0.515, 0.955)');
                }
            }, {
                label: 'easeInOutCubic',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.645, 0.045, 0.355, 1.000)');
                }
            }, {
                label: 'easeInOutQuart',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.770, 0.000, 0.175, 1.000)');
                }
            }, {
                label: 'easeInOutQuint',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.860, 0.000, 0.070, 1.000)');
                }
            }, {
                label: 'easeInOutSine',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.445, 0.050, 0.550, 0.950)');
                }
            }, {
                label: 'easeInOutExpo',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(1.000, 0.000, 0.000, 1.000)');
                }
            }, {
                label: 'easeInOutCirc',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.785, 0.135, 0.150, 0.860)');
                }
            }, {
                label: 'easeInOutBack',
                type: 'radio',
                checked: defaults.cssEasing == 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
                click: function() {
                    updateConfig('cssEasing', 'cubic-bezier(0.680, -0.550, 0.265, 1.550)');
                }
            }]
        }, {
            label: 'Speed',
            submenu: [{
                label: '100 ms',
                type: 'radio',
                checked: defaults.speed == 100,
                click: function() {
                    updateConfig('speed', 100);
                }
            }, {
                label: '200 ms',
                type: 'radio',
                checked: defaults.speed == 200,
                click: function() {
                    updateConfig('speed', 200);
                }
            }, {
                label: '300 ms',
                type: 'radio',
                checked: defaults.speed == 300,
                click: function() {
                    updateConfig('speed', 300);
                }
            }, {
                label: '400 ms',
                type: 'radio',
                checked: defaults.speed == 400,
                click: function() {
                    updateConfig('speed', 400);
                }
            }, {
                label: '500 ms',
                type: 'radio',
                checked: defaults.speed == 500,
                click: function() {
                    updateConfig('speed', 500);
                }
            }, {
                label: '600 ms',
                type: 'radio',
                checked: defaults.speed == 600,
                click: function() {
                    updateConfig('speed', 600);
                }
            }, {
                label: '700 ms',
                type: 'radio',
                checked: defaults.speed == 700,
                click: function() {
                    updateConfig('speed', 700);
                }
            }, {
                label: '800 ms',
                type: 'radio',
                checked: defaults.speed == 800,
                click: function() {
                    updateConfig('speed', 800);
                }
            }, {
                label: '900 ms',
                type: 'radio',
                checked: defaults.speed == 900,
                click: function() {
                    updateConfig('speed', 900);
                }
            }, {
                label: '1000 ms',
                type: 'radio',
                checked: defaults.speed == 1000,
                click: function() {
                    updateConfig('speed', 1000);
                }
            }]
        }, {
            label: 'hideBarsDelay',
            submenu: [{
                label: '1000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 1000,
                click: function() {
                    updateConfig('hideBarsDelay', 1000);
                }
            }, {
                label: '2000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 2000,
                click: function() {
                    updateConfig('hideBarsDelay', 2000);
                }
            }, {
                label: '3000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 3000,
                click: function() {
                    updateConfig('hideBarsDelay', 3000);
                }
            }, {
                label: '4000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 4000,
                click: function() {
                    updateConfig('hideBarsDelay', 4000);
                }
            }, {
                label: '5000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 5000,
                click: function() {
                    updateConfig('hideBarsDelay', 5000);
                }
            }, {
                label: '6000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 6000,
                click: function() {
                    updateConfig('hideBarsDelay', 6000);
                }
            }, {
                label: '7000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 7000,
                click: function() {
                    updateConfig('hideBarsDelay', 7000);
                }
            }, {
                label: '8000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 8000,
                click: function() {
                    updateConfig('hideBarsDelay', 8000);
                }
            }, {
                label: '9000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 9000,
                click: function() {
                    updateConfig('hideBarsDelay', 9000);
                }
            }, {
                label: '10000 ms',
                type: 'radio',
                checked: defaults.hideBarsDelay == 10000,
                click: function() {
                    updateConfig('hideBarsDelay', 10000);
                }
            }]
        }, {
            label: 'slideEndAnimatoin',
            type: 'checkbox',
            checked: defaults.slideEndAnimatoin,
            click: function(menuItem) {
                updateConfig('slideEndAnimatoin', menuItem.checked);
            }
        }, {
            label: 'hideControlOnEnd',
            type: 'checkbox',
            checked: defaults.hideControlOnEnd,
            click: function(menuItem) {
                updateConfig('hideControlOnEnd', menuItem.checked);
            }
        }]
    }, {
        label: 'Help',
        submenu: [{
            label: 'Github',
            click: function() {
                require('electron').shell.openExternal('https://github.com/sachinchoolur/lightgallery-desktop');
            }
        }, {
            label: 'Website',
            click: function() {
                require('electron').shell.openExternal('http://sachinchoolur.github.io/lightgallery-desktop/');
            }
        }, {
            label: 'Report issues',
            click: function() {
                require('electron').shell.openExternal('https://github.com/sachinchoolur/lightgallery-desktop/issues');
            }
        }, {
            label: 'Pull requests',
            click: function() {
                require('electron').shell.openExternal('https://github.com/sachinchoolur/lightgallery-desktop/pulls');
            }
        }, {
            label: 'Author',
            click: function() {
                require('electron').shell.openExternal('https://twitter.com/sachinchoolur');
            }
        }, {
            label: 'Developement',
            submenu: [{
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
                }
            }, {
                label: 'Toggle DevTools',
                accelerator: 'Alt+CmdOrCtrl+I',
                click: function() {
                    BrowserWindow.getFocusedWindow().toggleDevTools();
                }
            }]
        }]
    }]);
    Menu.setApplicationMenu(devMenu);
};

app.on('ready', function() {

    ready = true;
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
    });

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    if (env.name === 'test') {
        mainWindow.loadURL('file://' + __dirname + '/spec.html');
    } else {
        mainWindow.loadURL('file://' + __dirname + '/app.html');
    }

    fs.readFile(app.getPath('userData') + '/lg-config.json', function(err, data) {
        if (err) {
            fs.writeFile(app.getPath('userData') + '/lg-config.json', JSON.stringify(defaults), function(err) {
                if (err) throw err;
            });
        } else {
            defaults = JSON.parse(data);
        }

        setDevMenu();

        //mainWindow.openDevTools();
    });

    mainWindow.on('close', function() {
        mainWindowState.saveState(mainWindow);
    });

    mainWindow.webContents.on('dom-ready', function() {
        if (env.name !== 'production') {
            if (!images) {
                mainWindow.webContents.send('opened', app.getAppPath());
            };
        } else {
            if (images) {
                mainWindow.webContents.send('opened', images);
            };
        }
    });
});

app.on('window-all-closed', function() {
    app.quit();
});

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('open-file', (event, path) => {
    event.preventDefault();

    //win.send('opened', path)
    if (ready) {
        win.webContents.send('opened', path);
        return;
    };

    images = path;
});
app.on('open-url', (event, path) => {
    event.preventDefault();

    //win.send('opened', path)
    if (ready) {
        win.webContents.send('opened', path);
        return;
    };

    images = arg;
});
