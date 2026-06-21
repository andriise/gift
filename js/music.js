/* ==========================================================================
   music.js
   Керує програвачем "Нашої пісні": play/pause по кліку, без автозапуску.
   ========================================================================== */

const MusicPlayer = (() => {
  let audioEl, buttonEl, iconEl;

  function init() {
    audioEl = document.getElementById('song-audio');
    buttonEl = document.getElementById('music-toggle');
    iconEl = document.getElementById('music-toggle__icon');

    audioEl.src = SONG_PATH;
    audioEl.loop = true;

    buttonEl.addEventListener('click', toggle);
    audioEl.addEventListener('ended', () => setPlayingState(false));
  }

  function toggle() {
    if (audioEl.paused) {
      audioEl
        .play()
        .then(() => setPlayingState(true))
        .catch(() => {
          /* Браузер може заблокувати відтворення — нічого страшного,
             користувач спробує ще раз кліком. */
        });
    } else {
      audioEl.pause();
      setPlayingState(false);
    }
  }

  function setPlayingState(isPlaying) {
    buttonEl.classList.toggle('is-playing', isPlaying);
    iconEl.textContent = isPlaying ? '\u23F8' : '\u{1F3B5}';
    buttonEl.setAttribute('aria-pressed', String(isPlaying));
  }

  return { init };
})();
