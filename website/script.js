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

const ENQUIRY_EMAIL = 'support@legendwebsites.co.uk';

function sendAsMailto(fields) {
  const subject = encodeURIComponent('New project enquiry');
  const bodyLines = Object.entries(fields)
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`);
  const body = encodeURIComponent(bodyLines.join('\n'));
  window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
}

const heroQuickform = document.getElementById('heroQuickform');
if (heroQuickform) {
  heroQuickform.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(heroQuickform);
    sendAsMailto({
      Name: data.get('name'),
      'Email/phone': data.get('contact'),
      'What they need': data.get('need'),
    });
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    sendAsMailto({
      Name: data.get('name'),
      'Email/phone': data.get('contact'),
      Message: data.get('message'),
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
