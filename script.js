/* Small progressive enhancements; the portfolio works without JavaScript. */
(() => {
  'use strict';
  const menuButton = document.getElementById('menuToggle');
  const menu = document.getElementById('mainMenu');
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];

  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    };
    menuButton.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const buttons = [...document.querySelectorAll('.filter')];
  const cards = [...document.querySelectorAll('.project-card')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    buttons.forEach(other => {
      const active = other === button;
      other.classList.toggle('is-active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      card.hidden = selected !== 'all' && !(card.dataset.categories || '').split(' ').includes(selected);
    });
  }));

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const progress = document.getElementById('readingProgress');
  if (progress) {
    let ticking = false;
    const updateProgress = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${maximum > 0 ? Math.min(100, 100 * window.scrollY / maximum) : 0}%`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const entries = [...document.querySelectorAll('.reveal')];
    // Apply reveal styles only after the observer is available.
    document.documentElement.classList.add('js');
    const observer = new IntersectionObserver(changes => {
      changes.forEach(change => {
        if (change.isIntersecting) {
          change.target.classList.add('is-visible');
          observer.unobserve(change.target);
        }
      });
    }, { rootMargin: '0px 0px -25px 0px', threshold: 0.06 });
    entries.forEach(element => observer.observe(element));
  }

  if ('IntersectionObserver' in window && navLinks.length) {
    const sections = [...document.querySelectorAll('main section[id]')];
    const navObserver = new IntersectionObserver(changes => {
      changes.forEach(change => {
        if (!change.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${change.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }
})();
