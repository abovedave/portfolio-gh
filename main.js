/* Random pixels */

var pixels = document.getElementById('pixels');
var colours = ['#1B65FF', '#FFBE00', '#FF1B1B', '#808080'];

function randRange(minNum, maxNum) {
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}
function createPixels() {
  var wrap = document.createElement('div');
  wrap.id = 'pixels';
  document.body.appendChild(wrap);

  for (i=1;i<150;i++) {
    var pixel = document.createElement('div');
    
    pixel.id = 'p' + i;
    pixel.className = 'p'
    pixel.style.left = randRange(0,1600) + 'px';
    pixel.style.top = randRange(-1000,1400) + 'px';
    pixel.style.backgroundColor = colours[Math.floor(Math.random() * colours.length)];

    wrap.appendChild(pixel);
  }
}

createPixels();

/*
  https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
  https://css-tricks.com/the-complete-guide-to-lazy-loading-images/
*/

document.addEventListener('DOMContentLoaded', function() {
  var lazyloadImages;    

  if ('IntersectionObserver' in window) {
    lazyloadImages = document.querySelectorAll('img.lazy');
    var imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var image = entry.target;
          var parent = image.parentNode;

          image.src = image.dataset.src;
          parent.classList.add('loaded');
          imageObserver.unobserve(image);
        }
      });
    });

    lazyloadImages.forEach(function(image) {
      imageObserver.observe(image);
    });
  } else {  
    var lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll('img.lazy');
    
    function lazyload () {
      if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }    

      lazyloadThrottleTimeout = setTimeout(function() {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function(img) {
          if (img.offsetTop < (window.innerHeight + scrollTop)) {
            img.src = img.dataset.src;

            var parent = img.parentNode;
            parent.classList.add('loaded');
          }
        });
        if (lazyloadImages.length == 0) { 
          document.removeEventListener('scroll', lazyload);
          window.removeEventListener('resize', lazyload);
          window.removeEventListener('orientationChange', lazyload);
        }
      }, 20);
    }

    document.addEventListener('scroll', lazyload);
    window.addEventListener('resize', lazyload);
    window.addEventListener('orientationChange', lazyload);
  }
});