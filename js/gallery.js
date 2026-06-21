/* ==========================================================================
   gallery.js
   Генерує HTML усіх розділів історії на основі масиву MEMORIES з data.js.
   Нічого тут не хардкодиться — додаси новий об'єкт у data.js, і з'явиться
   новий розділ на сторінці.
   ========================================================================== */

const Gallery = (() => {
  let containerEl;

  function init() {
    containerEl = document.getElementById('story');
    render();
  }

  function render() {
    const fragment = document.createDocumentFragment();

    MEMORIES.forEach((section, index) => {
      const sectionEl = buildSectionShell(section, index);
      const bodyEl = sectionEl.querySelector('.section__body');

      if (section.type === 'gallery' || section.type === 'gallery-easter-egg') {
        bodyEl.appendChild(buildPhotoGrid(section));
      } else if (section.type === 'single') {
        bodyEl.appendChild(buildSinglePhoto(section));
      }

      fragment.appendChild(sectionEl);
    });

    containerEl.appendChild(fragment);
  }

  /* Загальна "обгортка" розділу: eyebrow + заголовок + опис + місце для контенту */
  function buildSectionShell(section, index) {
    const article = document.createElement('article');
    article.className = 'section';
    article.id = section.id;

    article.innerHTML = `
      <div class="section__marker" aria-hidden="true"></div>
      <header class="section__header" data-aos="fade-up">
        <span class="section__eyebrow">${section.eyebrow ?? ''}</span>
        <h2 class="section__title">${section.title}</h2>
        ${section.description ? `<p class="section__description">${section.description}</p>` : ''}
      </header>
      <div class="section__body"></div>
    `;

    return article;
  }

  /* Сітка фото-полароїдів для типів gallery / gallery-easter-egg */
  function buildPhotoGrid(section) {
    const grid = document.createElement('div');
    grid.className = 'photo-grid';

    section.images.forEach((src, i) => {
      grid.appendChild(buildPolaroid(src, section.title, '', i));
    });

    if (section.type === 'gallery-easter-egg' && section.easterEgg) {
      grid.appendChild(buildEasterEggCard(section.easterEgg, section.images.length));
    }

    return grid;
  }

  function buildPolaroid(src, title, description, index) {
    const figure = document.createElement('figure');
    figure.className = 'polaroid';
    figure.style.setProperty('--tilt', `${(index % 5) - 2}deg`);
    figure.setAttribute('data-aos', index % 3 === 0 ? 'fade-up' : index % 3 === 1 ? 'zoom-in' : 'fade-left');
    figure.setAttribute('data-aos-delay', String((index % 4) * 60));

    figure.innerHTML = `
      <button type="button" class="polaroid__button" aria-label="Відкрити фото">
        <img class="polaroid__image" src="${src}" alt="${title}" loading="lazy">
      </button>
    `;

    figure.querySelector('.polaroid__button').addEventListener('click', () => {
      Modal.open({ src, title, description });
    });

    return figure;
  }

  /* Прихована картка-пасхалка: спочатку показує лише запитання,
     і відкриває фото-відповідь по кліку */
  function buildEasterEggCard(easterEgg, index) {
    const figure = document.createElement('figure');
    figure.className = 'polaroid polaroid--easter-egg';
    figure.style.setProperty('--tilt', `${(index % 5) - 2}deg`);
    figure.setAttribute('data-aos', 'zoom-in');

    figure.innerHTML = `
      <button type="button" class="polaroid__button polaroid__button--teaser" aria-label="${easterEgg.buttonText}">
        <span class="polaroid__teaser-text">${easterEgg.teaserText}</span>
        <span class="polaroid__teaser-hint">${easterEgg.buttonText} \u2192</span>
      </button>
    `;

    figure.querySelector('.polaroid__button').addEventListener('click', () => {
      Modal.open({
        src: easterEgg.image,
        title: easterEgg.title,
        description: easterEgg.description,
      });
    });

    return figure;
  }

  /* Один великий емоційний кадр для секцій типу single */
  function buildSinglePhoto(section) {
    const wrapper = document.createElement('div');
    wrapper.className = 'feature-photo';
    wrapper.setAttribute('data-aos', 'fade-up');

    wrapper.innerHTML = `
      <button type="button" class="feature-photo__button" aria-label="Відкрити фото">
        <img class="feature-photo__image" src="${section.image}" alt="${section.title}" loading="lazy">
      </button>
    `;

    wrapper.querySelector('.feature-photo__button').addEventListener('click', () => {
      Modal.open({ src: section.image, title: section.title, description: section.description });
    });

    return wrapper;
  }

  return { init };
})();
