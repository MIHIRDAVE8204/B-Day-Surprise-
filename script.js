const pageBody = document.body;
const surpriseButton = document.getElementById('surpriseButton');
const message = document.getElementById('message');
const backgroundMusic = document.getElementById('backgroundMusic');
const showAlbumButton = document.getElementById('showAlbum');
const albumSection = document.getElementById('albumSection');
const closeAlbumButton = document.getElementById('closeAlbum');
const loveLetter = document.querySelector('.love-letter');
const letterText = document.querySelector('.letter-text');
const playStoryButton = document.getElementById('playStoryButton');
const storyOverlay = document.getElementById('storyOverlay');
const storyLines = document.querySelectorAll('.story-line');

let letterIndex = 0;
let isTyping = false;
let typingTimer = null;
let heartField = null;
let petalField = null;
let lastHeartTime = 0;
let hasOpenedCurtains = false;
let hasOpenedSurprise = false;
let hasStartedMusic = false;
let isStoryPlaying = false;
let storyTimers = [];

function normalizeLetterText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

const fullLetterText = letterText ? normalizeLetterText(letterText.textContent) : '';

if (backgroundMusic) {
  backgroundMusic.volume = 0.7;
}

if (letterText) {
  letterText.textContent = '';
}

function typeLetter() {
  if (!letterText || letterIndex >= fullLetterText.length) {
    isTyping = false;
    typingTimer = null;
    return;
  }

  letterText.textContent += fullLetterText.charAt(letterIndex);
  letterIndex += 1;
  typingTimer = setTimeout(typeLetter, 35);
}

function startLetterTyping() {
  if (!letterText || !fullLetterText || isTyping || letterText.textContent === fullLetterText) {
    return;
  }

  clearTimeout(typingTimer);
  letterIndex = 0;
  letterText.textContent = '';
  isTyping = true;
  typeLetter();
}

function createHeart() {
  if (!heartField) {
    return;
  }

  const heart = document.createElement('span');
  const size = Math.random() * 8 + 10;
  const duration = `${Math.random() * 4 + 7}s`;
  const x = Math.random() * window.innerWidth;
  const y = window.innerHeight - 24;
  const driftX = `${Math.random() * 60 - 30}px`;
  const driftY = `${Math.random() * -170 - 120}px`;
  const colors = [
    'rgba(255, 173, 207, 0.22)',
    'rgba(255, 120, 156, 0.2)',
    'rgba(255, 196, 214, 0.24)'
  ];

  heart.className = 'heart ambient';
  heart.textContent = '\u2665';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${size}px`;
  heart.style.color = colors[Math.floor(Math.random() * colors.length)];
  heart.style.animationDuration = duration;
  heart.style.setProperty('--drift-x', driftX);
  heart.style.setProperty('--drift-y', driftY);

  heartField.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, parseFloat(duration) * 1000);
}

function spawnHeart(x, y, options = {}) {
  if (!heartField) {
    return;
  }

  const heart = document.createElement('span');
  const size = options.size ?? Math.random() * 10 + 10;
  const duration = options.duration ?? Math.random() * 1.8 + 2.8;
  const driftX = options.driftX ?? Math.random() * 60 - 30;
  const driftY = options.driftY ?? -(Math.random() * 120 + 70);
  const opacity = options.opacity ?? 0.32;

  heart.className = 'heart';
  heart.textContent = '\u2665';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${size}px`;
  heart.style.color = `rgba(255, 173, 207, ${opacity})`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.setProperty('--drift-x', `${driftX}px`);
  heart.style.setProperty('--drift-y', `${driftY}px`);

  heartField.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

function createHeartBurst(x, y) {
  for (let i = 0; i < 10; i += 1) {
    spawnHeart(x, y, {
      size: Math.random() * 10 + 10,
      duration: Math.random() * 1 + 2.4,
      driftX: Math.random() * 120 - 60,
      driftY: -(Math.random() * 120 + 60),
      opacity: 0.42
    });
  }
}

function handleHeartMove(x, y) {
  const now = Date.now();

  if (now - lastHeartTime < 80) {
    return;
  }

  lastHeartTime = now;
  spawnHeart(x, y, {
    driftX: Math.random() * 50 - 25,
    driftY: -(Math.random() * 110 + 60)
  });
}

function createPetal() {
  if (!petalField) {
    return;
  }

  const petal = document.createElement('span');
  const size = 10 + Math.random() * 10;
  const duration = 7 + Math.random() * 5;
  const drift = Math.random() * 120 - 60;
  const rotation = 180 + Math.random() * 260;
  const colors = [
    'linear-gradient(180deg, #ff8aa8 0%, #d94b77 100%)',
    'linear-gradient(180deg, #ffb2c8 0%, #ff7d9d 100%)',
    'linear-gradient(180deg, #ffd0dd 0%, #ff98b5 100%)'
  ];

  petal.className = 'petal';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.35}px`;
  petal.style.background = colors[Math.floor(Math.random() * colors.length)];
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${Math.random() * 0.6}s`;
  petal.style.setProperty('--petal-drift', `${drift}px`);
  petal.style.setProperty('--petal-rotate', `${rotation}deg`);

  petalField.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, (duration + 1) * 1000);
}

function startHearts() {
  heartField = document.createElement('div');
  heartField.className = 'heart-field';
  document.body.appendChild(heartField);

  document.addEventListener('mousemove', (event) => {
    handleHeartMove(event.clientX, event.clientY);
  });

  document.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    handleHeartMove(touch.clientX, touch.clientY);
  }, { passive: true });

  document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    createHeartBurst(touch.clientX, touch.clientY);
  }, { passive: true });

  setInterval(createHeart, 3200);
}

function startPetals() {
  petalField = document.createElement('div');
  petalField.className = 'petal-field';
  document.body.appendChild(petalField);

  setInterval(createPetal, 950);
}

function openCurtains() {
  if (hasOpenedCurtains) {
    return;
  }

  hasOpenedCurtains = true;
  pageBody.classList.remove('curtain-closed');
  pageBody.classList.add('curtain-open');

  setTimeout(() => {
    surpriseButton.classList.remove('stage-hidden');
    surpriseButton.classList.add('stage-visible');
  }, 1150);
}

function startBackgroundMusic() {
  if (hasStartedMusic || !backgroundMusic) {
    return;
  }

  hasStartedMusic = true;
  backgroundMusic.muted = false;
  backgroundMusic.play().catch(() => {
    hasStartedMusic = false;
  });
}

function resetStoryTrailer() {
  storyTimers.forEach((timer) => {
    clearTimeout(timer);
  });

  storyTimers = [];
  storyLines.forEach((line) => {
    line.classList.remove('visible');
  });

  if (storyOverlay) {
    storyOverlay.classList.remove('visible');
    storyOverlay.setAttribute('aria-hidden', 'true');
  }

  isStoryPlaying = false;
}

function playStoryTrailer() {
  if (!storyOverlay || storyLines.length === 0 || isStoryPlaying) {
    return;
  }

  isStoryPlaying = true;
  storyOverlay.classList.add('visible');
  storyOverlay.setAttribute('aria-hidden', 'false');

  storyLines.forEach((line, index) => {
    const timer = setTimeout(() => {
      line.classList.add('visible');
    }, 600 + (index * 1800));

    storyTimers.push(timer);
  });

  const closeTimer = setTimeout(() => {
    resetStoryTrailer();
  }, 600 + (storyLines.length * 1800) + 1800);

  storyTimers.push(closeTimer);
}

startHearts();
startPetals();

document.addEventListener('click', (event) => {
  startBackgroundMusic();

  if (event.target.id === 'showAlbum') {
    showAlbumButton.style.display = 'none';
    albumSection.classList.remove('hidden');
    albumSection.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (event.target.id === 'closeAlbum') {
    albumSection.classList.add('hidden');
    showAlbumButton.style.display = '';
    showAlbumButton.classList.remove('hidden');
    return;
  }

  if (hasOpenedCurtains) {
    return;
  }

  openCurtains();
});

document.addEventListener('touchstart', () => {
  startBackgroundMusic();
  openCurtains();
}, { passive: true });

surpriseButton.addEventListener('click', () => {
  if (hasOpenedSurprise) {
    return;
  }

  hasOpenedSurprise = true;
  surpriseButton.classList.add('button-hidden');
  message.classList.remove('hidden');
  loveLetter.classList.add('visible');
  playStoryButton.classList.remove('hidden');
  showAlbumButton.classList.remove('hidden');
  startLetterTyping();
});

if (playStoryButton) {
  playStoryButton.addEventListener('click', playStoryTrailer);
}

if (storyOverlay) {
  storyOverlay.addEventListener('click', resetStoryTrailer);
}
