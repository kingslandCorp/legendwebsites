document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const filmstripTrack = document.getElementById('filmstripTrack');
if (filmstripTrack) {
  filmstripTrack.innerHTML += filmstripTrack.innerHTML;
}

const testimonialScroll = document.getElementById('testimonialScroll');
const testimonialOuter = document.querySelector('.testimonial-scroll-outer');
if (testimonialScroll && testimonialOuter) {
  testimonialScroll.innerHTML += testimonialScroll.innerHTML;

  const SPEED = 0.65; // px per frame, auto-advance pace
  let isHovering = false;
  let isDragging = false;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartScroll = 0;

  function wrapScroll() {
    const half = testimonialScroll.scrollWidth / 2;
    if (testimonialOuter.scrollLeft >= half) testimonialOuter.scrollLeft -= half;
    if (testimonialOuter.scrollLeft < 0) testimonialOuter.scrollLeft += half;
  }

  function tick() {
    if (!isHovering && !isDragging) {
      testimonialOuter.scrollLeft += SPEED;
      wrapScroll();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  testimonialOuter.addEventListener('mouseenter', () => { isHovering = true; });
  testimonialOuter.addEventListener('mouseleave', () => { isHovering = false; });

  testimonialOuter.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return; // let touch use native scrolling
    isDragging = true;
    dragPointerId = e.pointerId;
    dragStartX = e.clientX;
    dragStartScroll = testimonialOuter.scrollLeft;
    testimonialOuter.classList.add('is-dragging');
    testimonialOuter.setPointerCapture(e.pointerId);
  });
  testimonialOuter.addEventListener('pointermove', (e) => {
    if (!isDragging || e.pointerId !== dragPointerId) return;
    testimonialOuter.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
  });
  function endDrag(e) {
    if (!isDragging || e.pointerId !== dragPointerId) return;
    isDragging = false;
    dragPointerId = null;
    testimonialOuter.classList.remove('is-dragging');
    wrapScroll();
  }
  testimonialOuter.addEventListener('pointerup', endDrag);
  testimonialOuter.addEventListener('pointercancel', endDrag);
}

const rotateWord = document.getElementById('rotateWord');
if (rotateWord) {
  const phrases = ['tell your story', 'scale your startup', 'grow your business', 'build your brand', 'win new customers', 'earn real trust', 'convert more visitors'];
  const heroH1 = rotateWord.closest('h1');

  // The heading now flows as one line (no forced <br>), so different phrase
  // lengths wrap to different numbers of lines. Lock the heading's height to
  // the tallest phrase's rendered height so rotation never shifts the page.
  function lockHeroHeight() {
    if (!heroH1) return;
    const current = rotateWord.textContent;
    heroH1.style.minHeight = '';
    let maxHeight = 0;
    phrases.forEach((phrase) => {
      rotateWord.textContent = phrase;
      maxHeight = Math.max(maxHeight, heroH1.getBoundingClientRect().height);
    });
    rotateWord.textContent = current;
    heroH1.style.minHeight = `${maxHeight}px`;
  }
  lockHeroHeight();
  // Re-measure once web fonts finish loading - an initial measurement taken
  // while Sora is still using a fallback font can under-measure line wraps.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(lockHeroHeight);
  }
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(lockHeroHeight, 200);
  });

  let phraseIndex = 0;
  setInterval(() => {
    rotateWord.classList.add('is-swapping');
    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      rotateWord.textContent = phrases[phraseIndex];
      rotateWord.classList.remove('is-swapping');
      // Cheap safety net: if this phrase ever renders taller than the
      // locked height (e.g. a font/layout edge case), fix it immediately
      // instead of letting the page shift.
      if (heroH1 && heroH1.getBoundingClientRect().height > parseFloat(heroH1.style.minHeight || 0) + 0.5) {
        lockHeroHeight();
      }
    }, 350);
  }, 2600);
}

async function sendEnquiry(form, fields) {
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Sending…';

  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error('Request failed');
    button.textContent = 'Sent — thank you!';
    form.reset();
    setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
    }, 5000);
  } catch (err) {
    button.disabled = false;
    button.textContent = originalText;
    window.alert("Sorry, that didn't send — please email support@legendwebsites.co.uk directly.");
  }
}

const heroQuickform = document.getElementById('heroQuickform');
if (heroQuickform) {
  heroQuickform.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(heroQuickform);
    sendEnquiry(heroQuickform, {
      name: data.get('name'),
      contact: data.get('contact'),
      message: data.get('need'),
    });
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    sendEnquiry(contactForm, {
      name: data.get('name'),
      contact: data.get('contact'),
      message: data.get('message'),
    });
  });
}

document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-item').forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});
