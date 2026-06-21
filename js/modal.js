/* ==========================================================================
   modal.js
   Керує модальним вікном (lightbox) для перегляду фото у великому розмірі.
   ========================================================================== */

const Modal = (() => {
  let dialogEl, imageEl, titleEl, descriptionEl, closeBtn;
  let pendingOnClose = null;

  function init() {
    dialogEl = document.getElementById('photo-modal');
    imageEl = document.getElementById('photo-modal__image');
    titleEl = document.getElementById('photo-modal__title');
    descriptionEl = document.getElementById('photo-modal__description');
    closeBtn = document.getElementById('photo-modal__close');

    closeBtn.addEventListener('click', close);

    /* Закриття по кліку на фон (поза картинкою) */
    dialogEl.addEventListener('click', (event) => {
      if (event.target === dialogEl) close();
    });

    /* Закриття по Escape обробляється діалогом нативно, але підчистимо стан */
    dialogEl.addEventListener('close', onClosed);
  }

  function open({ src, title = '', description = '', onClose = null }) {
    imageEl.src = src;
    imageEl.alt = title || 'Спогад';
    titleEl.textContent = title;
    descriptionEl.textContent = description;
    pendingOnClose = onClose;

    if (typeof dialogEl.showModal === 'function') {
      dialogEl.showModal();
    } else {
      /* Фолбек для старих браузерів без підтримки <dialog> */
      dialogEl.setAttribute('open', '');
    }
    document.body.classList.add('no-scroll');
  }

  function close() {
    if (typeof dialogEl.close === 'function' && dialogEl.open) {
      dialogEl.close();
    } else {
      dialogEl.removeAttribute('open');
      onClosed();
    }
  }

  function onClosed() {
    document.body.classList.remove('no-scroll');
    imageEl.src = '';
    const callback = pendingOnClose;
    pendingOnClose = null;
    if (typeof callback === 'function') callback();
  }

  return { init, open, close };
})();
