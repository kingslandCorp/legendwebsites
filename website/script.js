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
if (testimonialScroll) {
  testimonialScroll.innerHTML += testimonialScroll.innerHTML;
}

const rotateWord = document.getElementById('rotateWord');
if (rotateWord) {
  const phrases = ['tell your story', 'scale your startup', 'grow your business', 'build your brand', 'win new customers', 'earn real trust', 'convert more visitors'];
  let phraseIndex = 0;
  setInterval(() => {
    rotateWord.classList.add('is-swapping');
    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      rotateWord.textContent = phrases[phraseIndex];
      rotateWord.classList.remove('is-swapping');
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
