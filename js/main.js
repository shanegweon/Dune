/* ============================================================
   DUNE Maritime Group — Main JavaScript
   ============================================================ */

/* ---- Hero video crossfade loop ---- */
(function () {
  const vidA = document.querySelector('.hero-vid-a');
  const vidB = document.querySelector('.hero-vid-b');
  if (!vidA || !vidB) return;

  const FADE = 1.5; // seconds
  let current = 0;  // 0 = A active, 1 = B active
  let fading = false;

  // Opacity-only crossfade — no z-index changes, so the shadow overlay
  // (z-index: 1 in CSS) always sits above both videos.
  vidA.style.opacity = '1';
  vidB.style.opacity = '0';

  function crossfade() {
    if (fading) return;
    fading = true;
    const outVid = current === 0 ? vidA : vidB;
    const inVid  = current === 0 ? vidB : vidA;

    inVid.currentTime = 0;
    inVid.play();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        inVid.style.opacity = '1';
      });
    });

    setTimeout(function () {
      outVid.pause();
      outVid.currentTime = 0;
      outVid.style.opacity = '0';
      current = 1 - current;
      fading = false;
    }, FADE * 1000 + 200);
  }

  vidA.addEventListener('timeupdate', function () {
    if (current === 0 && vidA.duration && vidA.currentTime >= vidA.duration - FADE) crossfade();
  });
  vidB.addEventListener('timeupdate', function () {
    if (current === 1 && vidB.duration && vidB.currentTime >= vidB.duration - FADE) crossfade();
  });
})();

/* ---- Loading Screen ---- */
window.addEventListener('load', () => {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  setTimeout(() => {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1300);
});

/* ---- Navbar: transparent ↔ solid on scroll ---- */
const navbar = document.querySelector('.navbar');

function refreshNav() {
  if (!navbar) return;
  const isHome = document.body.classList.contains('page-home');
  if (isHome && window.scrollY < 70) {
    navbar.classList.add('transparent');
    navbar.classList.remove('solid');
  } else {
    navbar.classList.remove('transparent');
    navbar.classList.add('solid');
  }
}

if (navbar) {
  refreshNav();
  window.addEventListener('scroll', refreshNav, { passive: true });
}

/* ---- Highlight active nav link ---- */
const curFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[href]').forEach(a => {
  if (a.getAttribute('href').split('/').pop() === curFile) a.classList.add('active');
});

/* ---- Mobile Menu ---- */
const hamburger   = document.querySelector('.hamburger');
const mobileMenu  = document.querySelector('.nav-mobile-overlay');
const closeBtn    = document.querySelector('.mob-close-btn');

function openMenu()  { if (mobileMenu) { mobileMenu.classList.add('open');  document.body.style.overflow = 'hidden'; } }
function closeMenu() { if (mobileMenu) { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; } }

if (hamburger) hamburger.addEventListener('click', openMenu);
if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
if (mobileMenu) {
  mobileMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
}

/* ---- Language Toggle ---- */
let lang = localStorage.getItem('dune-lang') || 'en';

function applyLang(l) {
  lang = l;
  localStorage.setItem('dune-lang', l);

  /* Update all lang-btn active states */
  document.querySelectorAll('.lang-btn, .mob-lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === l);
  });

  /* Swap text on all elements carrying data-en / data-ko */
  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerHTML = (l === 'ko' && el.dataset.ko) ? el.dataset.ko : el.dataset.en;
  });

  /* Toggle lang-specific blocks (data-lang-show="en" etc.) */
  document.querySelectorAll('[data-lang-show]').forEach(el => {
    el.style.display = (el.dataset.langShow === l) ? '' : 'none';
  });
}

/* Wire buttons */
document.querySelectorAll('.lang-btn, .mob-lang-btn').forEach(b => {
  b.addEventListener('click', () => applyLang(b.dataset.lang));
});

/* Apply on page load (after DOM ready) */
document.addEventListener('DOMContentLoaded', () => applyLang(lang));

/* ---- Live Clocks ---- */
function tickClocks() {
  const sg    = document.getElementById('sg-clock');
  const seoul = document.getElementById('seoul-clock');
  if (!sg && !seoul) return;

  const now = new Date();
  const fmt = (tz) => new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(now);

  if (sg)    sg.textContent    = fmt('Asia/Singapore');
  if (seoul) seoul.textContent = fmt('Asia/Seoul');
}
tickClocks();
setInterval(tickClocks, 1000);

/* ---- Scroll Fade-up Animations ---- */
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.fade-up');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
});

/* ---- Contact Form ---- */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = lang === 'ko' ? '전송 중...' : 'Sending...';
    btn.disabled = true;
    /* Replace the setTimeout below with your actual form-submission logic (e.g. fetch to a backend or Formspree). */
    setTimeout(() => {
      btn.textContent = lang === 'ko' ? '전송 완료! ✓' : 'Message Sent! ✓';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        form.reset();
      }, 2500);
    }, 1600);
  });
}
