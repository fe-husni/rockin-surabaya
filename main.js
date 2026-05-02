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
  const target = new Date('2026-12-06T19:00:00+07:00').getTime();
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