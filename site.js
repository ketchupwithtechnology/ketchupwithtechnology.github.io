const dialog = document.querySelector('#image-preview');
if (dialog && typeof dialog.showModal === 'function') {
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  document.querySelectorAll('[data-preview]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.caption;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}

const gallery = document.querySelector('.gallery');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-gallery-step]').forEach(button => {
  button.addEventListener('click', () => {
    gallery.scrollBy({ left: Number(button.dataset.galleryStep) * Math.max(250, gallery.clientWidth * 0.7), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
});

const motionToggle = document.querySelector('.motion-toggle');
let motionPaused = false;
motionToggle?.addEventListener('click', () => {
  motionPaused = !motionPaused;
  document.body.classList.toggle('motion-paused', motionPaused);
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.innerHTML = motionPaused ? 'Play motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
});
const cinema = document.querySelector('.cinema');
cinema?.addEventListener('pointermove', event => {
  if (reducedMotion.matches || motionPaused || event.pointerType !== 'mouse') return;
  const box = cinema.getBoundingClientRect();
  cinema.style.setProperty('--scene-x', `${((event.clientX - box.left) / box.width - 0.5) * 18}px`);
  cinema.style.setProperty('--scene-y', `${((event.clientY - box.top) / box.height - 0.5) * 10}px`);
});
cinema?.addEventListener('pointerleave', () => {
  cinema.style.setProperty('--scene-x', '0px');
  cinema.style.setProperty('--scene-y', '0px');
});
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); reveal.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.scene-copy, .game-heading, .about-copy').forEach(element => {
    element.classList.add('reveal-ready'); reveal.observe(element);
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { document.querySelectorAll('.reveal-ready').forEach(element => element.classList.add('in-view')); reveal.disconnect(); }
  });
}
