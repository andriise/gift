/* ==========================================================================
   easterEggs.js
   Додатковий, повністю необов'язковий шар взаємодії: 15 маленьких сердечок
   розкидані по всій сторінці. Клік відкриває маленький спогад, лічильник
   у верхньому індикаторі оновлюється, прогрес зберігається в localStorage.
   Якщо цей файл не підключити або він впаде з помилкою — основний сайт
   (Hero, галереї, музика, лист) продовжує працювати без змін.
   ========================================================================== */

/* Дані пасхалок. Просто додай/прибери об'єкти — лічильник підлаштується сам. */
const easterEggs = [
  { image: "assets/photos/eae1.jpg", text: "Невеличкі пасхалки \u2764\uFE0F" },
  {
    image: "assets/photos/eae9.jpg",
    text: "Твій красавчик \u2764\uFE0F",
  },
  { image: "assets/photos/eae3.jpg", text: "А тут я сплю \u2764\uFE0F" },
  {
    image: "assets/photos/eae4.jpg",
    text: "Спайдермен до того як став відомим \u2764\uFE0F",
  },
  {
    image: "assets/photos/eae5.jpg",
    text: "Клоун назавжди \u2764\uFE0F",
  },
  {
    image: "assets/photos/eae6.jpg",
    text: "Тут мені 16, то я тебе шукав, але жодні окуляри не допомогли 😄",
  },
  {
    image: "assets/photos/eae7.jpg",
    text: "Той самий Томас Шелбі з Аліекспрес 😄",
  },
  {
    image: "assets/photos/eae8.jpg",
    text: "Заманали ті хотдоги, краще з тобою каву б пив \u2764\uFE0F",
  },
  {
    image: "assets/photos/eae2.jpg",
    text: "Вирішив це вставити, чому б і ні 😄",
  },
  {
    image: "assets/photos/eae10.jpg",
    text: "Андрій моль, дух чи душніла, як зручніше 😄",
  },
  {
    image: "assets/photos/eae11.jpg",
    text: "Як ти казала, наче гамном мажеш 😂",
  },
  {
    image: "assets/photos/eae12.jpg",
    text: "Хоч одна фотографія, де я гарно виглядаю, завдяки тобі \u2764\uFE0F",
  },
  {
    image: "assets/photos/eae13.jpg",
    text: "Навіть до тебе я був справжнім б'юті блогером \u2764\uFE0F",
  },
  { image: "assets/photos/eae14.jpg", text: "Твоя прінцеска \u2764\uFE0F" },
  {
    image: "assets/photos/eae15.jpg",
    text: "Мої п'яні 18, сподіваюсь цього обличчя ти більше не побачиш 😅",
  },
];

const EasterEggs = (() => {
  const STORAGE_KEY = "anniversary-easter-eggs-found";
  const TOTAL = easterEggs.length;

  let foundIds = new Set();
  let layerEl;
  let countEl;
  let finalDialogEl;
  let finalCloseBtn;
  let resizeTimer;

  function init() {
    try {
      loadProgress();
      countEl = document.getElementById("easter-egg-count");
      finalDialogEl = document.getElementById("easter-egg-final-modal");
      finalCloseBtn = document.getElementById("easter-egg-final-close");

      if (finalCloseBtn)
        finalCloseBtn.addEventListener("click", closeFinalModal);
      if (finalDialogEl) {
        finalDialogEl.addEventListener("click", (event) => {
          if (event.target === finalDialogEl) closeFinalModal();
        });
      }

      buildLayer();
      renderHearts();
      updateIndicator();

      window.addEventListener("load", positionHearts);
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(positionHearts, 250);
      });

      /* Контент галерей вставляється синхронно, але фото вантажаться
         асинхронно і можуть змінити висоту сторінки — підстрахуємось. */
      setTimeout(positionHearts, 600);
      setTimeout(positionHearts, 1800);
    } catch (error) {
      /* Пасхалки — лише бонус. Якщо щось пішло не так, основний сайт
         не повинен постраждати. */
      console.warn("Easter eggs disabled due to an error:", error);
    }
  }

  /* ---------- Зберігання прогресу ---------- */
  function loadProgress() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const ids = raw ? JSON.parse(raw) : [];
      foundIds = new Set(Array.isArray(ids) ? ids : []);
    } catch (error) {
      foundIds = new Set();
    }
  }

  function saveProgress() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...foundIds]));
    } catch (error) {
      /* localStorage може бути недоступний (приватний режим тощо) —
         прогрес просто не збережеться, сайт працює далі. */
    }
  }

  /* ---------- Шар із сердечками ---------- */
  function buildLayer() {
    layerEl = document.createElement("div");
    layerEl.className = "easter-egg-layer";
    layerEl.setAttribute("aria-hidden", "false");
    document.body.appendChild(layerEl);
  }

  function renderHearts() {
    layerEl.innerHTML = "";

    easterEggs.forEach((egg, index) => {
      if (foundIds.has(index)) return;

      const heart = document.createElement("button");
      heart.type = "button";
      heart.className = "easter-egg-heart";
      heart.dataset.eggIndex = String(index);
      heart.setAttribute("aria-label", "Маленький секрет");
      heart.style.animationDelay = `${(index % 6) * 0.4}s`;
      heart.textContent = "\u2764\uFE0F";

      heart.addEventListener("click", (event) => {
        event.stopPropagation();
        collect(index, heart);
      });

      layerEl.appendChild(heart);
    });

    positionHearts();
  }

  /* Розкидає сердечка рівномірно-випадково по всій висоті сторінки */
  function positionHearts() {
    if (!layerEl) return;

    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
    layerEl.style.height = `${docHeight}px`;

    const hearts = layerEl.querySelectorAll(".easter-egg-heart");
    const bandCount = TOTAL;
    const bandHeight = docHeight / bandCount;

    hearts.forEach((heart) => {
      const index = Number(heart.dataset.eggIndex);
      const bandTop = bandHeight * index;
      const top = bandTop + bandHeight * (0.15 + Math.random() * 0.7);
      const left = 6 + Math.random() * 88; /* % від ширини, відступ від країв */

      heart.style.top = `${Math.round(top)}px`;
      heart.style.left = `${left.toFixed(1)}%`;
    });
  }

  /* ---------- Збір пасхалки ---------- */
  function collect(index, heartEl) {
    if (foundIds.has(index)) return;

    foundIds.add(index);
    saveProgress();
    updateIndicator();

    heartEl.classList.add("is-collected");
    setTimeout(() => heartEl.remove(), 350);

    const egg = easterEggs[index];
    const isLast = foundIds.size === TOTAL;

    Modal.open({
      src: egg.image,
      title: `Знайдено ${foundIds.size}/${TOTAL} \u2764\uFE0F`,
      description: egg.text,
      onClose: isLast ? showFinalCelebration : null,
    });
  }

  function updateIndicator() {
    if (countEl) countEl.textContent = String(foundIds.size);
  }

  /* ---------- Фінальне святкування ---------- */
  function showFinalCelebration() {
    if (!finalDialogEl) return;

    if (typeof finalDialogEl.showModal === "function") {
      finalDialogEl.showModal();
    } else {
      finalDialogEl.setAttribute("open", "");
    }
    document.body.classList.add("no-scroll");
    launchConfetti();
  }

  function closeFinalModal() {
    if (!finalDialogEl) return;
    if (typeof finalDialogEl.close === "function" && finalDialogEl.open) {
      finalDialogEl.close();
    } else {
      finalDialogEl.removeAttribute("open");
    }
    document.body.classList.remove("no-scroll");
  }

  /* Легке конфеті без зовнішніх бібліотек: летючі прямокутники у кольорах сайту */
  function launchConfetti() {
    const colors = ["#5b9bd5", "#f3c9d4", "#ffffff", "#f6e27a", "#2f6690"];
    const container = document.createElement("div");
    container.className = "confetti-layer";
    document.body.appendChild(container);

    const pieceCount = 90;
    for (let i = 0; i < pieceCount; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.animationDuration = `${2.4 + Math.random() * 2.2}s`;
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 160}px`);
      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 5200);
  }

  return { init };
})();
