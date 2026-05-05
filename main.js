const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const closeBtn = document.getElementById('closeNav');
const navLinks = mobileNav.querySelectorAll('a');

/* toggle menu */
function toggleMenu() {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
}

/* events */
hamburger.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

/* klik link = auto close */
navLinks.forEach(link => {
  link.addEventListener('click', toggleMenu);
});

/* navbar scroll */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 40);
});


/* ── Accordion ── */
function toggleAccordion(btn) {
  const item = btn.closest('.accordion-item');
  const body = item.querySelector('.accordion-body');
  const isOpen = item.classList.contains('open');

  // close all
  document.querySelectorAll('.accordion-item').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.accordion-body').style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

/* ── Countdown ── */
function updateCountdown() {
  const target = new Date('2026-12-12T19:00:00+07:00').getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '000';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(3, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);


/* ═══════════════════════════════════════════════════════════════
   GALLERY.JS — Paste BEFORE </body>, after main.js
   Or append to main.js
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. MASONRY HEIGHT BALANCE
     CSS columns() already handles masonry layout.
     This script just re-balances on resize/load
     to ensure images distribute well across cols.
  ───────────────────────────────────────────── */
  const masonryGrid = document.getElementById('galleryMasonry');

  function balanceMasonry() {
    if (!masonryGrid) return;
    // Force a reflow so browser re-distributes
    // column items after all images are loaded.
    masonryGrid.style.columnCount = 'auto';
    void masonryGrid.offsetHeight; // trigger reflow
    // Restore correct count via CSS media queries
    masonryGrid.style.columnCount = '';
  }

  // Balance after all images in gallery load
  const galleryImgs = masonryGrid
    ? Array.from(masonryGrid.querySelectorAll('img'))
    : [];

  let loadedCount = 0;
  if (galleryImgs.length === 0) {
    balanceMasonry();
  } else {
    galleryImgs.forEach(img => {
      if (img.complete) {
        loadedCount++;
        if (loadedCount === galleryImgs.length) balanceMasonry();
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === galleryImgs.length) balanceMasonry();
        });
        img.addEventListener('error', () => {
          loadedCount++;
          if (loadedCount === galleryImgs.length) balanceMasonry();
        });
      }
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(balanceMasonry, 120);
  });


  /* ─────────────────────────────────────────────
     2. LIGHTBOX
  ───────────────────────────────────────────── */
  const lightbox = document.getElementById('galleryLightbox');
  const glbImg = document.getElementById('glbImg');
  const glbCaption = document.getElementById('glbCaption');
  const glbClose = document.getElementById('glbClose');
  const glbPrev = document.getElementById('glbPrev');
  const glbNext = document.getElementById('glbNext');
  const glbCounter = document.getElementById('glbCounter');

  if (!lightbox || !glbImg) return; // guard

  const galleryItems = masonryGrid
    ? Array.from(masonryGrid.querySelectorAll('.gallery-item'))
    : [];

  let currentIndex = 0;

  // Build data array from DOM
  const galleryData = galleryItems.map(item => ({
    src: item.querySelector('img')?.src || '',
    alt: item.querySelector('img')?.alt || '',
    overlay: item.dataset.overlay || '',
  }));

  /* Open lightbox */
  function openLightbox(index) {
    currentIndex = index;
    showSlide(index, false);
    lightbox.classList.add('glb-open');
    document.body.classList.add('no-scroll');
    glbClose.focus();
  }

  /* Close lightbox */
  function closeLightbox() {
    lightbox.classList.remove('glb-open');
    document.body.classList.remove('no-scroll');
  }

  /* Show a slide (with optional crossfade) */
  function showSlide(index, animate) {
    const item = galleryData[index];
    if (!item) return;

    if (animate) {
      glbImg.classList.add('glb-fade');
      setTimeout(() => {
        glbImg.src = item.src;
        glbImg.alt = item.alt;
        glbCaption.textContent = item.overlay || item.alt;
        glbCounter.textContent = (index + 1) + ' / ' + galleryData.length;
        glbImg.classList.remove('glb-fade');
      }, 200);
    } else {
      glbImg.src = item.src;
      glbImg.alt = item.alt;
      glbCaption.textContent = item.overlay || item.alt;
      glbCounter.textContent = (index + 1) + ' / ' + galleryData.length;
    }
  }

  /* Navigate */
  function prevSlide() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    showSlide(currentIndex, true);
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    showSlide(currentIndex, true);
  }

  /* ── Events ── */

  // Click on any gallery item
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  glbClose.addEventListener('click', closeLightbox);
  glbPrev.addEventListener('click', prevSlide);
  glbNext.addEventListener('click', nextSlide);

  // Click backdrop to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('glb-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Touch swipe support (mobile)
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      delta < 0 ? nextSlide() : prevSlide();
    }
  }, { passive: true });


  /* ─────────────────────────────────────────────
    3. SCROLL REVEAL — gallery items
    Uses the existing ScrollReveal instance (sr)
  ───────────────────────────────────────────── */
  if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal().reveal('.gallery-header', {
      origin: 'top',
      distance: '40px',
      duration: 1400,
      delay: 200,
    });
    ScrollReveal().reveal('.gallery-item', {
      origin: 'bottom',
      distance: '30px',
      duration: 900,
      delay: 100,
      interval: 60,
    });
    ScrollReveal().reveal('.gallery-cta-line', {
      origin: 'bottom',
      distance: '30px',
      duration: 1200,
      delay: 400,
    });
  }

})();

/* ══════════════════════════════════════
  VINYL / AUDIO — Autoplay + Play/Pause
   ══════════════════════════════════════ */
const audio = document.getElementById('vinyl-audio');
let vinylPlaying = false;
let autoplayAttempted = false;

function setVinylState(playing) {
  vinylPlaying = playing;
  document.getElementById('vinylDisc').classList.toggle('playing', playing);
  document.getElementById('vinyl-btn').classList.toggle('vinyl-active', playing);
  const tooltip = document.querySelector('.vinyl-tooltip');
  if (tooltip) tooltip.textContent = playing ? '⏸ Pause Soundtrack' : '▶ Play Soundtrack';
}

function tryAutoplay() {
  if (!audio || autoplayAttempted) return;
  autoplayAttempted = true;
  audio.volume = 0.65;
  audio.play()
    .then(() => {
      setVinylState(true);
    })
    .catch(() => {
      // Autoplay blocked by browser — show hint pointing to vinyl button
      const prompt = document.getElementById('autoplay-prompt');
      if (prompt) {
        setTimeout(() => prompt.classList.add('visible'), 1200);
        setTimeout(() => prompt.classList.remove('visible'), 6500);
      }
    });
}

function toggleVinyl() {
  if (!audio) return;
  const prompt = document.getElementById('autoplay-prompt');
  if (prompt) prompt.classList.remove('visible');

  if (vinylPlaying) {
    audio.pause();
    setVinylState(false);
  } else {
    audio.play().then(() => setVinylState(true)).catch(() => { });
  }
}

// Attempt autoplay after page fully loads
window.addEventListener('load', () => setTimeout(tryAutoplay, 700));

// Fallback: start on first user gesture (scroll or any click outside vinyl)
let gestureHandled = false;
function onFirstGesture() {
  if (gestureHandled || vinylPlaying) return;
  gestureHandled = true;
  if (audio) {
    audio.volume = 0.65;
    audio.play()
      .then(() => {
        setVinylState(true);
        const prompt = document.getElementById('autoplay-prompt');
        if (prompt) prompt.classList.remove('visible');
      })
      .catch(() => { });
  }
}

document.addEventListener('scroll', onFirstGesture, { once: true });
document.addEventListener('click', function firstClickHandler(e) {
  if (!e.target.closest('#vinyl-btn')) {
    onFirstGesture();
    document.removeEventListener('click', firstClickHandler);
  }
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2000,
  delay: 300,
})

sr.reveal('.hero-eyebrow, .hero-headline, #vinyl-btn, .section-eyebrow, .date-display, .venue-row, .lineup-header, .rundown-header')
sr.reveal('.hero-sub, .hero-support, .cta-row, .countdown', { origin: 'bottom' })
sr.reveal('.footer-main, .footer-bar', { delay: 900, origin: 'bottom' })
sr.reveal('.lineup-card, .accordion-item, .ticket-top', { origin: 'left' }, { delay: 700 })
sr.reveal('.ticket-bottom', { origin: 'right' }, { delay: 700 })