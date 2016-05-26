# lightGallery
A modern, electron and nodejs based image viewer for Mac, Windows and Linux.
![lightgallery](http://sachinchoolur.github.io/electron-gallery/lightgallery.png)

Main features
---

* Built with Electron.
  * LightGallery uses HTML, CSS, and JavaScript with Chromium and Node.js to build the app.
* Cross-platform.
  * LightGallery works across operating systems. You can use it on OS X, Windows, or Linux. 
* 20+ Animations
  * LightGallery comes with numerous number of beautiful in-built animations.
* Animated thumbnails
  * You also have the option to enable animated thumbnails from the settings.
* Zoom & Fullscreen
  * You can double-click on the image to see its actual size. Zoom-in and zoom-out controls can be used for changing the zoom values of the image.
*  Mouse Drag & keyboard Navigations
   * LightGallery allows users to navigate between slides via mouse drag and keyboard arrows.
* Pagers
* Auto slideshow
* Support various kind of image formats (jpg, png, gif, webp).
* Highly customizable
* And many more.

##### Watch :star: this repository. More features are coming

Settings
---


| Name        | Default           | Description  |
| ------------- |:-------------:| -----|
|mode|`'lg-slide'`|Type of transition between images. lightGallery comes with lots of transition effects such as `'lg-slide'`, `'lg-fade'`, `'lg-zoom-in'`, `'lg-zoom-in-big'`, `'lg-zoom-out'`, `'lg-zoom-out-big'`, `'lg-zoom-out-in'`, `'lg-zoom-in-out'`, `'lg-soft-zoom'`, `'lg-scale-up'`, `'lg-slide-circular'`, `'lg-slide-circular-vertical'`, `'lg-slide-vertical'`, `'lg-slide-vertical-growth'`, `'lg-slide-skew-only'`, `'lg-slide-skew-only-rev'`, `'lg-slide-skew-only-y'`, `'lg-slide-skew-only-y-rev'`, `'lg-slide-skew'`, `'lg-slide-skew-rev'`, `'lg-slide-skew-cross'`, `'lg-slide-skew-cross-rev'`, `'lg-slide-skew-ver'`, `'lg-slide-skew-ver-rev'`, `'lg-slide-skew-ver-cross'`, `'lg-slide-skew-ver-cross-rev'`, `'lg-lollipop'`, `'lg-lollipop-rev'`, `'lg-rotate'`, `'lg-rotate-rev'`, `'lg-tube'`|
|cssEasing|`'ease'`|Type of easing to be used for animations|
|speed|`600`|Transition duration (in ms).|
|hideBarsDelay|`6000`|Delay for hiding gallery controls in ms|
|useLeft|`false`|force lightgallery to use css left property instead of transform.|
|closable|`true`|allows clicks on dimmer to close gallery.|
|loop|`true`|If `false`, will disable the ability to loop back to the beginning of the gallery when on the last element.|
|keyPress|`true`|Enable keyboard navigation|
|controls|`true`|If `false`, prev/next buttons will not be displayed.|
|slideEndAnimatoin|`true`|Enable slideEnd animation|
|hideControlOnEnd|`false`|If `true`, prev/next button will be hidden on first/last image.|
|mousewheel|`true`|Change slide on mousewheel|
|preload|`1`|Number of preload slides. will exicute only after the current slide is fully loaded. ex:// you clicked on 4th image and if preload = 1 then 3rd slide and 5th slide will be loaded in the background after the 4th slide is fully loaded.. if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded|
|showAfterLoad|`true`|Show Content once it is fully loaded|
|counter|`true`|Whether to show total number of images and index number of currently displayed image.|
|swipeThreshold|`50`|By setting the swipeThreshold (in px) you can set how far the user must swipe for the next/prev image.|
|enableDrag|`true`|Enables desktop mouse drag support|
|thumbnail|`true`|Enable thumbnails for the gallery|
|animateThumb|`true`|Enable thumbnail animation.|
|currentPagerPosition |`'middle'`|Position of selected thumbnail. `'left'` or `'middle'` or `'right'`|
|thumbWidth|`100`|Width of each thumbnails.|
|thumbContHeight|`100`|Height of the thumbnail container including padding and border|
|thumbMargin|`5`|Spacing between each thumbnails|
|toogleThumb|true|Whether to display thumbnail toggle button.|
|enableThumbDrag|`true`|Enables desktop mouse drag support for thumbnails.|
|swipeThreshold|`50`|By setting the swipeThreshold (in px) you can set how far the user must swipe for the next/prev slide.|
|autoplay|`true`|Enable gallery autoplay|
|pause|`5000`|The time (in ms) between each auto transition.|
|progressBar |`true`|Enable autoplay progress bar|
|fourceAutoplay|`false`|If `false` autoplay will be stopped after first user action|
|autoplayControls|`true`|Show/hide autoplay controls.|
|pager|`true`|Enable/Disable pager|
|zoom|`true`|Enable/Disable zoom option|
|scale|`1`|Value of zoom should be incremented/decremented|
 

 
Development
---
#### Project's folders

- `app` - code of your application goes here.
- `config` - place for you to declare environment specific stuff.
- `build` - in this folder lands built, runnable application.
- `releases` - ready for distribution installers will land here.
- `resources` - resources for particular operating system.
- `tasks` - build and development environment scripts.


#### Installation

```
npm install
```
It will also download Electron runtime, and install dependencies for second `package.json` file inside `app` folder.

#### Starting the app

```
npm start
```




Making a release
----

To make ready for distribution installer use command:
```
npm run release
```
It will start the packaging process for operating system you are running this command on. Ready for distribution file will be outputted to `releases` directory.

You can create Windows installer only when running on Windows, the same is true for Linux and OSX. So to generate all three installers you need all three operating systems.


Other Projects
----

##### [LightGallery for web](https://github.com/sachinchoolur/lightGallery)
> A customizable, modular, responsive, lightbox gallery plugin.

##### [jQuery lightslider](https://github.com/sachinchoolur/lightslider)
> lightSlider is a lightweight responsive Content slider with carousel thumbnails navigation.

##### [Angular flash](https://github.com/sachinchoolur/angular-flash)
> A simple lightweight flash message module for angularjs

##### [ngclipboard](https://github.com/sachinchoolur/ngclipboard)
> An angularjs directive to copy text to clipboard without using flash

##### [Angular trix](http://sachinchoolur.github.io/angular-trix/)
> A rich WYSIWYG text editor directive for angularjs.

##### [ladda-angular](https://github.com/sachinchoolur/ladda-angular)
> Ladda button directive for angularjs

##### [Teamwave](http://www.teamwave.com/?kid=676V2)
> Integrated Suite of Business Applications.. (Not an open source project but free for the first 1,000 Companies!)

Follow me on twitter [@sachinchoolur](https://twitter.com/sachinchoolur) for the latest news, updates about this project.

Special thanks to [Jakub Szwacz](https://github.com/szwacz) for electron boilerplate

### License

MIT License
