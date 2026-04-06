/* ═══════════════════════════════════════════════════════════
   AMPLA FACIAL — main.js
   · Nav scroll shadow
   · Mobile menu toggle
   · Accordion trail items
   · Scroll reveal
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── NAV: scroll shadow ───
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ─── NAV: mobile hamburger ───
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('.nav__mobile-link, .nav__mobile-cta').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // ─── ACCORDION: trail items ───
  document.querySelectorAll('.trail-item__header').forEach(function (header) {
    header.addEventListener('click', function () {
      const targetId = header.getAttribute('data-accordion');
      if (!targetId) return;

      const trailItem = header.closest('.trail-item');
      const isOpen = trailItem.classList.contains('is-open');

      // Toggle this item
      trailItem.classList.toggle('is-open', !isOpen);
      header.setAttribute('aria-expanded', String(!isOpen));

      // Smooth scroll to item when opening
      if (!isOpen) {
        setTimeout(function () {
          const offset = 88; // nav height + buffer
          const top = trailItem.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }, 80);
      }
    });
  });

  // ─── SCROLL REVEAL ───
  const reveals = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-reveal-delay') || 0;
            setTimeout(function () {
              entry.target.classList.add('is-visible');
            }, parseInt(delay, 10));
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ─── Open accordion if URL has hash matching a trail item ───
  function openFromHash() {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.replace('#', '');
    const trailItem = document.getElementById(id);
    if (trailItem && trailItem.classList.contains('trail-item')) {
      trailItem.classList.add('is-open');
      const header = trailItem.querySelector('.trail-item__header');
      if (header) header.setAttribute('aria-expanded', 'true');
    }
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  // ─── MODULE CARDS: Lesson list expand/collapse ───
  document.querySelectorAll('.module-card__expand-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var lessons = btn.closest('.module-card__body').querySelector('.module-card__lessons');
      if (!lessons) return;

      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        lessons.hidden = true;
      } else {
        lessons.hidden = false;
      }
    });
  });

  // ─── MODULE CARDS: Video preview modal ───
  var modal      = document.getElementById('previewModal');
  var iframe     = document.getElementById('previewIframe');
  var comingMsg  = document.getElementById('previewComing');
  var closeBtn   = document.getElementById('previewClose');
  var backdrop   = document.getElementById('previewBackdrop');

  function getEmbedUrl(rawUrl) {
    if (!rawUrl) return null;
    // YouTube
    var ytMatch = rawUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return 'https://www.youtube.com/embed/' + ytMatch[1] + '?autoplay=1&rel=0&modestbranding=1';
    // Vimeo
    var vimeoMatch = rawUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return 'https://player.vimeo.com/video/' + vimeoMatch[1] + '?autoplay=1';
    // Google Drive
    var driveMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) return 'https://drive.google.com/file/d/' + driveMatch[1] + '/preview';
    return rawUrl;
  }

  function openModal(embedUrl) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    if (embedUrl) {
      iframe.src = embedUrl;
      iframe.hidden = false;
      comingMsg.hidden = true;
    } else {
      iframe.src = '';
      iframe.hidden = true;
      comingMsg.hidden = false;
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    iframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.module-card__play').forEach(function (playBtn) {
    playBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = playBtn.closest('.module-card');
      var rawUrl = card ? card.getAttribute('data-preview-url') : '';
      var embedUrl = getEmbedUrl(rawUrl);
      openModal(embedUrl);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop)  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

})();
