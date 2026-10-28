// NEXUS landing page interactions
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Reveal content as it enters the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(element);
});

// Animate metrics when the stats section appears.
const numberObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    const duration = 1500;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    observer.unobserve(element);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((number) => numberObserver.observe(number));

// Subtle pointer glow on devices with a fine pointer.
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
} else if (glow) {
  glow.remove();
}

// Demo signup interaction: this front-end does not send or store email addresses.
const signupForm = document.querySelector('#signup-form');
const emailInput = document.querySelector('#email');
const formMessage = document.querySelector('#form-message');

signupForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }
  formMessage.textContent = 'You’re on the radar. Connect a backend to enable real signups.';
  signupForm.reset();
});
