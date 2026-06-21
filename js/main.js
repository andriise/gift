/* ==========================================================================
   main.js
   Точка входу: ініціалізує всі модулі та керує лічильником часу,
   плавним скролом і ефектом друкарської машинки у фіналі.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Modal.init();
  MusicPlayer.init();
  Gallery.init();
  if (typeof EasterEggs !== 'undefined') EasterEggs.init();

  initHero();
  initCountdown();
  initAOS();
  initSmoothScroll();
  initScrollIndicator();
  initFinalLetter();
});

/* ---------- Фон Hero + дата початку стосунків ---------- */
function initHero() {
  const bgEl = document.getElementById('hero-bg');
  if (bgEl) bgEl.style.backgroundImage = `url('${HERO_PHOTO}')`;

  const dateEl = document.getElementById('hero-start-date');
  if (dateEl) {
    const formatted = RELATIONSHIP_START_DATE.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    dateEl.textContent = `Разом з ${formatted}`;
  }
}

/* ---------- Лічильник днів/годин/хвилин ---------- */
function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');

  if (!daysEl || !hoursEl || !minutesEl) return;

  function tick() {
    const now = new Date();
    let diffMs = now - RELATIONSHIP_START_DATE;
    if (diffMs < 0) diffMs = 0;

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000 * 30);
}

/* ---------- AOS (Animate On Scroll) ---------- */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });
}

/* ---------- Плавний скрол для якірних посилань ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- Стрілка "гортай вниз" у Hero ---------- */
function initScrollIndicator() {
  const indicator = document.querySelector('.hero__scroll-hint');
  if (!indicator) return;

  indicator.addEventListener('click', () => {
    document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- Ефект друкарської машинки у фінальному листі ---------- */
function initFinalLetter() {
  const target = document.getElementById('letter-typed');
  const section = document.getElementById('letter');
  if (!target || !section || typeof Typed === 'undefined') return;

  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          new Typed('#letter-typed', {
            strings: [LETTER_TEXT.replace(/\n/g, '<br>')],
            typeSpeed: 38,
            startDelay: 300,
            showCursor: true,
            cursorChar: '|',
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(section);
}
