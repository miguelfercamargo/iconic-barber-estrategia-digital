const progress = document.querySelector('.scroll-progress');
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress?.style.setProperty('transform', `scaleX(${Math.min(Math.max(value, 0), 1)})`);
}

function updateActiveNav() {
  const marker = window.scrollY + window.innerHeight * 0.34;
  let activeId = sections[0]?.id;

  for (const section of sections) {
    if (section.offsetTop <= marker) {
      activeId = section.id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('[data-copy]').forEach((button) => {
  const originalLabel = button.textContent;

  button.addEventListener('click', async () => {
    const text = button.getAttribute('data-copy');

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Dominio copiado';
    } catch {
      button.textContent = text;
    }

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  });
});

window.addEventListener('scroll', () => {
  updateProgress();
  updateActiveNav();
});

window.addEventListener('resize', updateProgress);
updateProgress();
updateActiveNav();
