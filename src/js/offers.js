const track = document.getElementById('offersTrack');
const progressBar = document.getElementById('offersProgress');
const prevBtn = document.getElementById('offersPrev');
const nextBtn = document.getElementById('offersNext');

if (track && progressBar && prevBtn && nextBtn) {
  const cards = track.querySelectorAll('.offer-card');

  function getCardStep() {
    return cards[0] ? cards[0].offsetWidth + 20 : 330;
  }

  function updateProgress() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const ratio = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    progressBar.style.width = `${ratio * 100}%`;
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= maxScroll - 1;
  }

  track.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getCardStep(), behavior: 'smooth' });
  });

  /* Drag scroll */
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;
  let dragDelta = 0;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragDelta = 0;
    startX = e.pageX;
    startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragDelta = e.pageX - startX;
    track.scrollLeft = startScroll - dragDelta;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('is-dragging');
  });

  /* Prevent accidental link clicks after drag */
  track.addEventListener('click', (e) => {
    if (Math.abs(dragDelta) > 8) e.preventDefault();
  }, true);
}
