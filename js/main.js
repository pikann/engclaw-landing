/* Engclaw landing – GSAP animations. Content is fully visible without JS. */
(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Sticky nav state (works without GSAP)
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.add('ready'); return; } // CDN blocked → static page still works
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // ---------- Reduced motion: show final states only ----------
  mm.add('(prefers-reduced-motion: reduce)', () => {
    root.classList.add('ready');
    document.getElementById('heroScore').textContent = '82';
    document.getElementById('heroRing').style.strokeDashoffset = 214 * (1 - 0.82);
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
  });

  // ---------- Full motion ----------
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // HERO intro timeline
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.line__in', { yPercent: 110, rotate: 4, duration: 1.1, stagger: 0.12 })
      .from('[data-hero]:not(.lead)', { y: 28, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.7')
      .from('.hero .lead', { y: 28, duration: 0.8 }, '<') // no opacity tween: keeps the LCP text painted immediately
      .from('.hero .window', { y: 70, opacity: 0, scale: 0.94, duration: 1.2 }, '-=1')
      .from('.float', { scale: 0, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(2)' }, '-=0.5')
      .to('#heroRing', { strokeDashoffset: 214 * (1 - 0.82), duration: 1.6, ease: 'power2.out' }, '-=0.6')
      .to({ v: 0 }, {
        v: 82, duration: 1.6, ease: 'power2.out',
        onUpdate() { document.getElementById('heroScore').textContent = Math.round(this.targets()[0].v); },
      }, '<');

    root.classList.add('ready'); // start states are now applied; safe to reveal

    // Looping hero ambience
    gsap.to('.float--score', { y: -12, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.float--phone', { y: 10, rotate: 2, duration: 3.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.float--wave i', {
      scaleY: () => gsap.utils.random(0.3, 1.9), duration: 0.45, yoyo: true, repeat: -1,
      ease: 'sine.inOut', stagger: { each: 0.06, repeat: -1, yoyo: true },
    });
    gsap.to('.hero__glow', { scale: 1.15, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // Hero parallax on scroll
    gsap.to('.hero__visual', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero__glow', {
      yPercent: 25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // Pointer tilt on hero window (fine pointers only)
    if (window.matchMedia('(pointer: fine)').matches) {
      const win = document.querySelector('.hero .window');
      const rx = gsap.quickTo(win, 'rotationY', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(win, 'rotationX', { duration: 0.6, ease: 'power3' });
      gsap.set(win, { transformPerspective: 1000 });
      document.querySelector('.hero').addEventListener('pointermove', (e) => {
        rx(gsap.utils.mapRange(0, innerWidth, -6, 6, e.clientX));
        ry(gsap.utils.mapRange(0, innerHeight, 5, -5, e.clientY));
      });
    }

    // Stats count-up
    document.querySelectorAll('[data-count]').forEach((el) => {
      const end = +el.dataset.count, suffix = el.dataset.suffix || '';
      const o = { v: 0 };
      gsap.to(o, {
        v: end, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = Math.round(o.v) + suffix; },
        onComplete: () => { el.textContent = end + suffix; },
      });
    });
    gsap.from('.stats__grid > div', {
      y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.stats', start: 'top 90%' },
    });

    // Section heading reveals
    gsap.utils.toArray('.section-head > *, .privacy__grid > div:first-child > *, .reqs h2, .faq h2, .start h2, .about__grid > div:first-child > *, .models > *').forEach((el) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    gsap.from('.facts > div, .start__list li', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.facts, .start__list', start: 'top 88%' },
    });

    // How-it-works steps
    gsap.from('.step', {
      y: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.steps', start: 'top 82%' },
    });
    gsap.from('.step__n', {
      scale: 0, rotate: -90, duration: 0.7, stagger: 0.12, ease: 'back.out(2.2)',
      scrollTrigger: { trigger: '.steps', start: 'top 82%' },
    });

    // Score blend bar grows
    gsap.from('.blend__bar span', {
      scaleX: 0, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.blend', start: 'top 80%' },
    });

    // Privacy cards + requirements + FAQ
    gsap.from('.card', {
      y: 40, opacity: 0, scale: 0.96, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.cards', start: 'top 85%' },
    });
    gsap.from('.reqs__grid > div', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: '.reqs__grid', start: 'top 88%' },
    });
    gsap.from('details', {
      x: -30, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.faq__wrap', start: 'top 80%' },
    });

    // Download CTA
    gsap.from('.download__inner > *', {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.download', start: 'top 70%' },
    });
    gsap.to('.download__logo', {
      y: -14, rotate: 4, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut',
    });

    // Magnetic buttons
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.btn:not(.dl__main):not(.dl__toggle)').forEach((b) => {
        const x = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' });
        const y = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' });
        b.addEventListener('pointermove', (e) => {
          const r = b.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.25);
          y((e.clientY - r.top - r.height / 2) * 0.35);
        });
        b.addEventListener('pointerleave', () => { x(0); y(0); });
      });
    }

  });

  // Small screens: simple reveal of the stacked screenshots
  mm.add('(max-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.from('.showcase__media', {
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.showcase__media', start: 'top 85%' },
    });
  });

  // Refresh after images/fonts settle
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // ---------- Feature showcase ----------
  const tabs = gsap.utils.toArray('[data-tab]');
  const shots = gsap.utils.toArray('.shot');
  const bar = document.getElementById('showcaseBar');
  const setActive = (i) => {
    tabs.forEach((t, n) => t.classList.toggle('is-active', n === i));
    shots.forEach((s, n) => s.classList.toggle('is-active', n === i));
  };

  // Desktop + motion: pinned, scroll drives the active tab + screenshot
  mm.add('(min-width: 961px) and (prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: '.showcase__stage',
      start: 'top top',
      end: () => '+=' + innerHeight * tabs.length * 0.8,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        setActive(Math.min(tabs.length - 1, Math.floor(self.progress * tabs.length)));
        bar.style.width = self.progress * 100 + '%';
      },
    });
    const handlers = tabs.map((t, i) => {
      const fn = () => {
        const y = st.start + ((i + 0.5) / tabs.length) * (st.end - st.start);
        window.scrollTo({ top: y, behavior: 'smooth' });
      };
      t.addEventListener('click', fn);
      return fn;
    });
    return () => { // cleanup when leaving this media query
      tabs.forEach((t, i) => t.removeEventListener('click', handlers[i]));
      bar.style.width = '0';
      setActive(0);
    };
  });

  // Desktop + reduced motion: no pin; tabs switch on click/keyboard
  mm.add('(min-width: 961px) and (prefers-reduced-motion: reduce)', () => {
    const fns = tabs.map((t, i) => {
      const fn = () => { setActive(i); bar.style.width = ((i + 1) / tabs.length) * 100 + '%'; };
      t.tabIndex = 0;
      t.setAttribute('role', 'button');
      t.addEventListener('click', fn);
      const key = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } };
      t.addEventListener('keydown', key);
      return { fn, key };
    });
    return () => tabs.forEach((t, i) => {
      t.removeEventListener('click', fns[i].fn);
      t.removeEventListener('keydown', fns[i].key);
      t.removeAttribute('role'); t.removeAttribute('tabindex');
    });
  });
})();
