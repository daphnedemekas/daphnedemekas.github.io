// Navigation scroll effect
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// --- Shared modal helpers ---
function lockScroll() { document.body.style.overflow = 'hidden'; }
function unlockScroll() { document.body.style.overflow = ''; }

// --- Poem Modal ---
const poemOverlay = document.createElement('div');
poemOverlay.className = 'poem-modal-overlay';
poemOverlay.innerHTML = `
  <button class="modal-close" aria-label="Close">&times;</button>
  <div class="poem-modal">
    <h3 class="poem-title"></h3>
    <div class="poem-text"></div>
  </div>
`;
document.body.appendChild(poemOverlay);

const poemModalTitle = poemOverlay.querySelector('.poem-title');
const poemModalText = poemOverlay.querySelector('.poem-text');

function openPoem(poemEl) {
  poemModalTitle.textContent = poemEl.querySelector('.poem-title').textContent;
  poemModalText.innerHTML = poemEl.querySelector('.poem-text').innerHTML;
  poemOverlay.classList.add('open');
  lockScroll();
}

function closePoem() {
  poemOverlay.classList.remove('open');
  unlockScroll();
}

document.querySelectorAll('.poem').forEach(poem => {
  poem.addEventListener('click', () => openPoem(poem));
});

poemOverlay.querySelector('.modal-close').addEventListener('click', closePoem);
poemOverlay.addEventListener('click', (e) => { if (e.target === poemOverlay) closePoem(); });

// --- Photo Lightbox ---
const photoOverlay = document.createElement('div');
photoOverlay.className = 'photo-lightbox';
photoOverlay.innerHTML = `
  <button class="modal-close" aria-label="Close">&times;</button>
  <button class="lightbox-prev" aria-label="Previous">&lsaquo;</button>
  <button class="lightbox-next" aria-label="Next">&rsaquo;</button>
  <img class="lightbox-img" src="" alt="">
`;
document.body.appendChild(photoOverlay);

const lightboxImg = photoOverlay.querySelector('.lightbox-img');
let photoItems = [];
let currentPhotoIndex = 0;

function openPhoto(index) {
  currentPhotoIndex = index;
  lightboxImg.src = photoItems[index].querySelector('img').src;
  photoOverlay.classList.add('open');
  lockScroll();
}

function closePhoto() {
  photoOverlay.classList.remove('open');
  unlockScroll();
  lightboxImg.src = '';
}

function prevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + photoItems.length) % photoItems.length;
  lightboxImg.src = photoItems[currentPhotoIndex].querySelector('img').src;
}

function nextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % photoItems.length;
  lightboxImg.src = photoItems[currentPhotoIndex].querySelector('img').src;
}

photoItems = Array.from(document.querySelectorAll('.photo-item'));
photoItems.forEach((item, i) => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => openPhoto(i));
});

photoOverlay.querySelector('.modal-close').addEventListener('click', closePhoto);
photoOverlay.querySelector('.lightbox-prev').addEventListener('click', prevPhoto);
photoOverlay.querySelector('.lightbox-next').addEventListener('click', nextPhoto);
photoOverlay.addEventListener('click', (e) => { if (e.target === photoOverlay) closePhoto(); });

// --- Thoughts expand/collapse ---
document.querySelectorAll('.thought').forEach(thought => {
  const collapseBtn = thought.querySelector('.thought-collapse button');

  thought.addEventListener('click', (e) => {
    // Don't expand if clicking collapse button or already expanded
    if (e.target === collapseBtn || thought.classList.contains('expanded')) return;
    thought.classList.add('expanded');
  });

  if (collapseBtn) {
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      thought.classList.remove('expanded');
      thought.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});

// --- Keyboard ---
document.addEventListener('keydown', (e) => {
  if (poemOverlay.classList.contains('open') && e.key === 'Escape') closePoem();
  if (photoOverlay.classList.contains('open')) {
    if (e.key === 'Escape') closePhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  }
});

// --- Intersection Observer for fade-in animations ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.poem, .thought, .cv-section, .photo-item').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// --- Active nav link highlighting ---
const sections = document.querySelectorAll('.section');
const navLinkElements = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinkElements.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--text)';
    }
  });
});
