/* Lazy-load and play showcase videos only while they are on screen; pause for reduced motion. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var videos = document.querySelectorAll('video');
  videos.forEach(function (v) { v.muted = true; if (reduce) { v.removeAttribute('autoplay'); v.pause(); } });
  if (reduce || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (v.dataset.src && !v.src) v.src = v.dataset.src;
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      } else if (v.src) {
        v.pause();
      }
    });
  }, { rootMargin: '200px' });
  videos.forEach(function (v) { io.observe(v); });
})();
