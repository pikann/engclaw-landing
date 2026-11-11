/* Smart download button: detects the OS and points the main button at the right installer. */
(function () {
  function detectOS() {
    var ua = navigator.userAgent || '';
    var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    var s = (platform + ' ' + ua).toLowerCase();
    // Mobile / tablets can't run the desktop app. iPadOS reports as Mac with touch.
    if (/android|iphone|ipad|ipod/.test(s) || (/mac/.test(platform.toLowerCase()) && navigator.maxTouchPoints > 1)) return null;
    if (/win/.test(s)) return 'windows';
    if (/mac/.test(s)) return 'mac';
    if (/linux|x11|cros/.test(s)) return 'linux';
    return null;
  }

  var NAMES = { mac: 'macOS', windows: 'Windows', linux: 'Linux' };
  var os = detectOS();

  document.querySelectorAll('[data-dl]').forEach(function (root) {
    var main = root.querySelector('[data-dl-main]');
    var label = root.querySelector('[data-dl-label]');
    var toggle = root.querySelector('[data-dl-toggle]');
    var menu = root.querySelector('[data-dl-menu]');
    var isSmall = root.classList.contains('dl--small');

    if (os) {
      var match = root.querySelector('[data-os="' + os + '"]');
      if (match) {
        main.href = match.href;
        main.setAttribute('rel', 'noopener');
        label.textContent = isSmall ? 'Download' : 'Download for ' + NAMES[os];
        match.classList.add('is-detected');
      }
    }

    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      root.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(menu.hidden);
    });
    document.addEventListener('click', function (e) {
      if (!root.contains(e.target)) setOpen(false);
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    menu.addEventListener('click', function () { setOpen(false); });
  });
})();
