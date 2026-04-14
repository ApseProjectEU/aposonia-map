/* ============================================================
   ui.js – UI panel and player controls
   ============================================================ */

const UIModule = (() => {
  const playerPanel = document.getElementById('player-panel');
  const playerTitle = document.getElementById('player-title');
  const playerLocation = document.getElementById('player-location');
  const playerDescription = document.getElementById('player-description');
  const audioPlayer = document.getElementById('audio-player');
  const closeBtn = document.getElementById('close-player');
  const categoryFilter = document.getElementById('category-filter');

  let onFilterChange = null;

  function init(callbacks) {
    onFilterChange = callbacks.onFilterChange;

    closeBtn.addEventListener('click', () => {
      hidePlayer();
      audioPlayer.pause();
    });

    categoryFilter.addEventListener('change', () => {
      if (onFilterChange) onFilterChange(categoryFilter.value);
    });
  }

  function showPlayer(point) {
    playerTitle.textContent = point.title;
    playerLocation.textContent = `${point.location} — ${point.country}`;
    playerDescription.textContent = point.description || '';

    if (point.audio) {
      audioPlayer.src = point.audio;
      audioPlayer.load();
      audioPlayer.play().catch(() => {
        // Autoplay blocked – user must press play manually
      });
    } else {
      audioPlayer.src = '';
    }

    playerPanel.classList.remove('hidden');
  }

  function hidePlayer() {
    playerPanel.classList.add('hidden');
  }

  return { init, showPlayer, hidePlayer };
})();
