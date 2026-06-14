const body = document.body;
const enterButton = document.querySelector("#enterButton");
const soniyaAudio = document.querySelector("#soniyaAudio");
const raanjhanaAudio = document.querySelector("#raanjhanaAudio");
const musicToggle = document.querySelector(".music-toggle");
const ambientStars = document.querySelector(".ambient-stars");
const tulipField = document.querySelector(".tulip-field");
const constellationMap = document.querySelector("#constellationMap");
const starNote = document.querySelector("#starNote");
const starNoteText = document.querySelector("#starNoteText");
const starNoteClose = document.querySelector(".star-note__close");
const envelopeButton = document.querySelector("#envelopeButton");
const certificateCard = document.querySelector("#certificateCard");

let hasEntered = false;
let currentTrack = soniyaAudio;
let safePlaceTransitioned = false;
let fadeFrame = null;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const constellationMessages = [
  "Your smile",
  "Your sleepy voice",
  "The way you care",
  "The way you call me Bhukad",
  "The way you call me Mota",
  "The way you hold my hand",
  "The way you changed my mornings",
  "The way you changed my playlist",
  "The way you make silence feel safe",
  "The way you listen without making noise",
  "Your tiny angry face",
  "Your heart that notices everyone",
  "The way you became my favorite habit",
  "The way your voice feels like home",
  "The way you make ordinary days cinematic",
  "The way you are you",
];

const starPositions = [
  [12, 18, 7],
  [24, 28, 5],
  [37, 16, 8],
  [52, 23, 5],
  [69, 14, 7],
  [84, 26, 6],
  [18, 48, 5],
  [31, 57, 8],
  [46, 44, 6],
  [59, 58, 9],
  [74, 49, 5],
  [88, 62, 8],
  [16, 76, 7],
  [38, 82, 6],
  [62, 76, 7],
  [79, 84, 5],
  [71, 69, 4],
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createAmbientStars() {
  if (!ambientStars) return;

  const starCount = window.innerWidth < 720 ? 64 : 118;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("span");
    star.className = "ambient-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--size", `${Math.random() * 2.1 + 0.8}px`);
    star.style.setProperty("--alpha", `${Math.random() * 0.55 + 0.22}`);
    star.style.setProperty("--duration", `${Math.random() * 7 + 5}s`);
    star.style.setProperty("--delay", `${Math.random() * 3.5}s`);
    star.style.setProperty("--drift", `${Math.random() * 2.5 - 1.25}rem`);
    fragment.appendChild(star);
  }

  ambientStars.appendChild(fragment);
}

function createTitleStars() {
  const titleStage = document.querySelector(".star-title");
  if (!titleStage) return;

  const fragment = document.createDocumentFragment();
  const rows = 6;
  const cols = 22;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (Math.random() < 0.2) continue;
      const star = document.createElement("span");
      star.className = "title-star";
      const x = 16 + col * (68 / cols);
      const y = 35 + row * 4.5 + Math.sin(col * 0.8) * 1.5;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.setProperty("--from-x", `${Math.random() * 100 - 50}vw`);
      star.style.setProperty("--from-y", `${Math.random() * 100 - 50}vh`);
      star.style.setProperty("--delay", `${Math.random() * 0.9}s`);
      fragment.appendChild(star);
    }
  }

  titleStage.appendChild(fragment);
}

function createTulips() {
  if (!tulipField) return;

  const count = window.innerWidth < 720 ? 18 : 32;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const tulip = document.createElement("span");
    tulip.className = "tulip";
    tulip.style.setProperty("--x", `${Math.random() * 100}%`);
    tulip.style.setProperty("--delay", `${Math.random() * 7}s`);
    tulip.style.transform = `rotate(${Math.random() * 18 - 9}deg)`;
    fragment.appendChild(tulip);
  }

  tulipField.appendChild(fragment);
}

function createConstellation() {
  if (!constellationMap) return;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("constellation-lines");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  const linePairs = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [5, 10],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
    [12, 13],
    [13, 14],
    [14, 16],
    [16, 15],
  ];

  linePairs.forEach(([from, to]) => {
    const [x1, y1] = starPositions[from];
    const [x2, y2] = starPositions[to];
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    svg.appendChild(line);
  });

  constellationMap.appendChild(svg);

  starPositions.forEach(([x, y, size], index) => {
    const star = document.createElement("button");
    const isSpecial = index === starPositions.length - 1;
    star.type = "button";
    star.className = `constellation-star${isSpecial ? " special" : ""}`;
    star.style.setProperty("--x", `${x}%`);
    star.style.setProperty("--y", `${y}%`);
    star.style.setProperty("--s", `${size + 16}px`);
    star.style.setProperty("--pulse", `${Math.random() * 2 + 2.6}s`);
    star.setAttribute("aria-label", isSpecial ? "Hidden special star" : constellationMessages[index]);

    star.addEventListener("click", (event) => {
      const message = isSpecial
        ? "Congratulations My Lovely HR ❤️\n\nYou found the star that represents my favorite person.\n\nYou."
        : constellationMessages[index];
      showStarNote(message);
      createParticles(event.clientX, event.clientY, isSpecial ? 22 : 10, isSpecial ? "#F7A8B8" : "#D4AF37");
      constellationMap.classList.add("constellation-awake");
      window.setTimeout(() => constellationMap.classList.remove("constellation-awake"), 900);
    });

    constellationMap.appendChild(star);
  });
}

function showStarNote(message) {
  if (!starNote || !starNoteText) return;

  starNoteText.textContent = message;
  starNote.classList.add("is-visible");
}

function hideStarNote() {
  starNote?.classList.remove("is-visible");
}

function createParticles(x, y, amount = 12, color = "#D4AF37") {
  if (prefersReducedMotion) return;

  for (let i = 0; i < amount; i += 1) {
    const particle = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 86 + 24;
    particle.className = "pop-particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = color;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    document.body.appendChild(particle);
    window.setTimeout(() => particle.remove(), 820);
  }
}

function playAudio(audio, volume = 1) {
  if (!audio) return Promise.resolve();
  audio.volume = volume;
  return audio.play().catch(() => {
    body.classList.add("music-paused");
  });
}

function unlockAudio(audio) {
  if (!audio) return;

  const originalVolume = audio.volume;
  audio.volume = 0;
  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = originalVolume;
    })
    .catch(() => {
      audio.volume = originalVolume;
    });
}

function fadeAudio(fromAudio, toAudio, duration = 3000) {
  if (!fromAudio || !toAudio) return;
  if (fadeFrame) cancelAnimationFrame(fadeFrame);

  const start = performance.now();
  const fromStart = fromAudio.volume;
  toAudio.volume = 0;
  toAudio.currentTime = 0;
  playAudio(toAudio, 0);

  function step(now) {
    const progress = clamp((now - start) / duration, 0, 1);
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    fromAudio.volume = fromStart * (1 - eased);
    toAudio.volume = eased;

    if (progress < 1) {
      fadeFrame = requestAnimationFrame(step);
      return;
    }

    fromAudio.pause();
    fromAudio.currentTime = 0;
    fromAudio.volume = 1;
    toAudio.volume = 1;
    currentTrack = toAudio;
  }

  fadeFrame = requestAnimationFrame(step);
}

function enterUniverse(event) {
  if (hasEntered) return;
  hasEntered = true;
  body.classList.add("entered");
  body.classList.remove("locked", "music-paused");
  enterButton.disabled = true;

  const rect = enterButton.getBoundingClientRect();
  createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
  playAudio(soniyaAudio, 1);
  unlockAudio(raanjhanaAudio);

  window.setTimeout(() => {
    document.querySelector("#my-lovely-hr")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, prefersReducedMotion ? 20 : 680);
}

function toggleMusic() {
  if (!hasEntered) return;

  if (currentTrack?.paused) {
    playAudio(currentTrack, currentTrack === raanjhanaAudio ? 1 : currentTrack.volume || 1);
    body.classList.remove("music-paused");
    return;
  }

  currentTrack?.pause();
  body.classList.add("music-paused");
}

function setupRevealObserver() {
  const targets = document.querySelectorAll(".reveal, .section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  targets.forEach((target) => observer.observe(target));
}

function setupSafePlaceObserver() {
  const safePlace = document.querySelector("#safe-place");
  if (!safePlace) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || safePlaceTransitioned || !hasEntered) return;

        safePlaceTransitioned = true;
        if (body.classList.contains("music-paused")) {
          soniyaAudio.pause();
          raanjhanaAudio.volume = 1;
          currentTrack = raanjhanaAudio;
          return;
        }

        fadeAudio(soniyaAudio, raanjhanaAudio, 3000);
      });
    },
    {
      threshold: 0.48,
    }
  );

  observer.observe(safePlace);
}

function setupCards() {
  document.querySelectorAll(".lux-card").forEach((card) => {
    const toggle = () => card.classList.toggle("is-open");
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle();
    });
  });
}

function setupEnvelope() {
  if (!envelopeButton) return;

  envelopeButton.addEventListener("click", () => {
    const wrap = envelopeButton.closest(".envelope-wrap");
    wrap?.classList.add("open");
    certificateCard?.setAttribute("aria-hidden", "false");

    const rect = envelopeButton.getBoundingClientRect();
    createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 34);
  });
}

function setupPointerGlow() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  body.classList.add("has-pointer");
  window.addEventListener("pointermove", (event) => {
    body.style.setProperty("--x", `${event.clientX}px`);
    body.style.setProperty("--y", `${event.clientY}px`);
  });
}

function setupMagneticButtons() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      button.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

function setupInitialLoad() {
  window.addEventListener("load", () => {
    window.setTimeout(() => body.classList.add("loaded"), 450);
  });

  window.setTimeout(() => body.classList.add("loaded"), 2200);
}

enterButton?.addEventListener("click", enterUniverse);
musicToggle?.addEventListener("click", toggleMusic);
starNoteClose?.addEventListener("click", hideStarNote);

soniyaAudio.volume = 1;
raanjhanaAudio.volume = 0;

createAmbientStars();
createTitleStars();
createTulips();
createConstellation();
setupRevealObserver();
setupSafePlaceObserver();
setupCards();
setupEnvelope();
setupPointerGlow();
setupMagneticButtons();
setupInitialLoad();
