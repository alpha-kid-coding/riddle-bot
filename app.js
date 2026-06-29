const contentEl = document.getElementById("content");
const riddleCountEl = document.getElementById("riddle-count");
const scoreCornerEl = document.getElementById("score-corner");
const timerCornerEl = document.getElementById("timer-corner");
const reviewsBtn = document.getElementById("reviews-btn");
const timesBtn = document.getElementById("times-btn");
const stepLabelEl = document.getElementById("step-label");
const footerTextEl = document.getElementById("footer-text");
const prevBtn = document.getElementById("prev-btn");
const giveUpBtn = document.getElementById("give-up-btn");
const clueBtn = document.getElementById("clue-btn");
const nextBtn = document.getElementById("next-btn");
const endGameBtn = document.getElementById("end-game-btn");
const keyboardToggleBtn = document.getElementById("keyboard-toggle-btn");
const startOverBtn = document.getElementById("start-over-btn");
const virtualKeyboardEl = document.getElementById("virtual-keyboard");
const stepDots = document.querySelectorAll(".step-dot");

const VIRTUAL_KEYBOARD_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];
const REVIEWS_API_URL = "http://127.0.0.1:8767/api/reviews";
const TIMES_API_URL = "http://127.0.0.1:8767/api/times";
const SYNONYM_GROUPS = [
  ["pig", "swine", "hog"],
  ["footsteps", "footprints", "steps"],
  ["map", "chart", "atlas"],
  ["keyboard", "keypad"],
  ["clock", "timepiece"],
  ["cold", "sickness", "illness"],
  ["shirt", "top", "tee"],
  ["towel", "washcloth"],
  ["name", "title"],
  ["stamp", "postage", "postagestamp"],
  ["penny", "cent", "coin"],
  ["egg", "ova"],
  ["sponge", "scrubber"],
  ["age", "years"],
  ["fire", "flame"],
  ["table", "desk"],
  ["needle", "pin"],
  ["hole", "pit"],
  ["book", "novel", "textbook"],
  ["window", "pane"],
  ["glove", "mitten"],
  ["library", "archive"],
  ["alarmclock", "alarm"],
  ["fence", "barrier"],
  ["garbagetruck", "trashtruck", "refusetruck"],
  ["bed", "cot", "bunk"],
  ["mushroom", "fungus"],
  ["telephone", "phone", "cellphone", "mobilephone"],
  ["light", "illumination"],
  ["tree", "plant"],
  ["piano", "keyboardinstrument"],
  ["corn", "maize"],
  ["umbrella", "parasol"],
  ["chair", "seat"],
  ["dictionary", "lexicon"],
  ["rubberband", "elasticband"],
  ["faucet", "tap"],
  ["teapot", "kettle"],
  ["bank", "financialinstitution"],
  ["road", "street"],
  ["conversation", "chat", "dialogue"],
  ["envelope", "mailer"],
  ["joke", "gag"],
  ["river", "stream"],
  ["promise", "vow", "pledge"],
  ["potato", "spud"],
  ["nails", "nail", "fingernails"],
  ["notebook", "notepad"],
  ["music", "song"],
  ["postoffice", "mailoffice"],
  ["battery", "cell"],
  ["staircase", "stairs"],
  ["echo", "reverberation"]
];
const ROUND_SIZE = 16;

let keyboardOpen = false;

let riddles = [];
let currentSetIndex = 0;
let riddleIndex = 0;
let step = 0;
let score = 0;
let gameOver = false;
let exitWarningPending = false;
let showReviewPage = false;
let showReviewsListPage = false;
let showTimesListPage = false;
let selectedStars = 0;
let reviewText = "";
let reviewError = "";
let unansweredWarningPending = false;
let furthestRiddleIndex = -1;
let riddleSteps = [];
let solvedCorrectly = [];
let usedTypedClues = [];
let wrongAttempts = [];
let riddlePoints = [];
let gaveUp = [];
let cluesRevealed = [];
let guessFeedback = "";
let pendingGuessValue = "";
let endConfettiLaunched = false;
let showRulesPage = true;
let timedModeChoice = false;
let timedRoundActive = false;
let roundStartedAtMs = 0;
let frozenRoundTimeMs = 0;
let timerTickId = null;
let countdownActive = false;
let countdownLabel = "";
let countdownTimeoutIds = [];
let fiveMinuteMode = false;
let fiveMinuteLimitMs = 5 * 60 * 1000;
let timeLimitReached = false;
let synonymLookup = null;

const STEP_LABELS = ["Ready", "Riddle", "Clues", "Answer", "End Game"];

function loadRiddleSet(setIndex) {
  if (typeof RIDDLE_SETS === "undefined" || !RIDDLE_SETS.length) {
    return false;
  }

  currentSetIndex = setIndex;
  const sourceSet = RIDDLE_SETS[currentSetIndex];
  if (!Array.isArray(sourceSet) || sourceSet.length === 0) {
    riddles = [];
    return false;
  }

  if (sourceSet.length <= ROUND_SIZE) {
    riddles = sourceSet.slice();
    return riddles.length > 0;
  }

  const pool = sourceSet.slice();
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pool[i];
    pool[i] = pool[j];
    pool[j] = temp;
  }

  riddles = pool.slice(0, ROUND_SIZE);
  return riddles.length > 0;
}

function pickNewRiddleSet() {
  const otherSets = RIDDLE_SETS.map(function (_, index) {
    return index;
  }).filter(function (index) {
    return index !== currentSetIndex;
  });

  const nextIndex =
    otherSets.length > 0
      ? otherSets[Math.floor(Math.random() * otherSets.length)]
      : 0;

  loadRiddleSet(nextIndex);
}

function resetProgress() {
  riddleIndex = 0;
  step = 0;
  score = 0;
  gameOver = false;
  exitWarningPending = false;
  showReviewPage = false;
  showReviewsListPage = false;
  showTimesListPage = false;
  selectedStars = 0;
  reviewText = "";
  reviewError = "";
  unansweredWarningPending = false;
  furthestRiddleIndex = -1;
  riddleSteps = [];
  solvedCorrectly = new Array(riddles.length).fill(false);
  usedTypedClues = new Array(riddles.length).fill(false);
  wrongAttempts = new Array(riddles.length).fill(0);
  riddlePoints = new Array(riddles.length).fill(0);
  gaveUp = new Array(riddles.length).fill(false);
  cluesRevealed = new Array(riddles.length).fill(0);
  guessFeedback = "";
  pendingGuessValue = "";
  endConfettiLaunched = false;
  timedModeChoice = false;
  timedRoundActive = false;
  roundStartedAtMs = 0;
  frozenRoundTimeMs = 0;
  clearInterval(timerTickId);
  timerTickId = null;
  clearCountdown();
  fiveMinuteMode = false;
  timeLimitReached = false;
}

function restartGame() {
  pickNewRiddleSet();
  resetProgress();
  showRulesPage = true;
  render();
}

function clearCountdown() {
  countdownTimeoutIds.forEach(function (timeoutId) {
    clearTimeout(timeoutId);
  });
  countdownTimeoutIds = [];
  countdownActive = false;
  countdownLabel = "";
}

function beginRound(useFiveMinuteMode) {
  showRulesPage = false;
  timedModeChoice = true;
  timedRoundActive = true;
  fiveMinuteMode = Boolean(useFiveMinuteMode);
  timeLimitReached = false;
  roundStartedAtMs = Date.now();
  frozenRoundTimeMs = 0;
  clearInterval(timerTickId);
  timerTickId = null;

  timerTickId = setInterval(function () {
    updateTimerDisplay();
  }, 500);

  step = 1;
  furthestRiddleIndex = 0;
  riddleSteps[0] = 1;
  render();
}

function startGame(useFiveMinuteMode) {
  clearInterval(timerTickId);
  timerTickId = null;
  timedModeChoice = true;
  timedRoundActive = false;
  fiveMinuteMode = Boolean(useFiveMinuteMode);
  timeLimitReached = false;
  roundStartedAtMs = 0;
  frozenRoundTimeMs = 0;
  showRulesPage = false;
  clearCountdown();
  countdownActive = true;
  countdownLabel = "3";
  render();

  countdownTimeoutIds.push(setTimeout(function () {
    countdownLabel = "2";
    render();
  }, 1000));

  countdownTimeoutIds.push(setTimeout(function () {
    countdownLabel = "1";
    render();
  }, 2000));

  countdownTimeoutIds.push(setTimeout(function () {
    countdownLabel = "GO!";
    render();
  }, 3000));

  countdownTimeoutIds.push(setTimeout(function () {
    clearCountdown();
    beginRound(useFiveMinuteMode);
  }, 3800));
}

function getCurrentRoundTimeMs() {
  if (timedRoundActive) {
    return Math.max(0, Date.now() - roundStartedAtMs);
  }

  return Math.max(0, frozenRoundTimeMs);
}

function formatRoundTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return (
      String(hours) +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  }

  return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function updateTimerDisplay() {
  const shouldShow = timedModeChoice && (timedRoundActive || frozenRoundTimeMs > 0);
  timerCornerEl.hidden = !shouldShow;

  if (!shouldShow) {
    return;
  }

  const elapsedMs = getCurrentRoundTimeMs();

  if (fiveMinuteMode) {
    const remainingMs = Math.max(0, fiveMinuteLimitMs - elapsedMs);
    timerCornerEl.textContent = "Time Left: " + formatRoundTime(remainingMs);

    if (
      timedRoundActive &&
      !timeLimitReached &&
      remainingMs === 0 &&
      !gameOver &&
      !showRulesPage &&
      !countdownActive
    ) {
      timeLimitReached = true;
      guessFeedback = "Time is up!";
      tryEndGame(true);
    }
    return;
  }

  timerCornerEl.textContent = "Time: " + formatRoundTime(elapsedMs);
}

function finalizeRoundTimer() {
  if (!timedModeChoice || !timedRoundActive) {
    return;
  }

  frozenRoundTimeMs = getCurrentRoundTimeMs();
  if (fiveMinuteMode) {
    frozenRoundTimeMs = Math.min(frozenRoundTimeMs, fiveMinuteLimitMs);
  }
  saveTimeToStorage(frozenRoundTimeMs);
  timedRoundActive = false;
  clearInterval(timerTickId);
  timerTickId = null;
  updateTimerDisplay();
}

function formatScore(value) {
  if (value % 1 === 0) {
    return String(value);
  }

  if (Math.round(value * 100) % 50 === 0) {
    return value.toFixed(1);
  }

  return value.toFixed(2);
}

function getModePointValue(baseValue) {
  return fiveMinuteMode ? baseValue * 2 : baseValue;
}

function formatPointsEarned(points) {
  const noun = points === 1 ? "point" : "points";
  return "+" + formatScore(points) + " " + noun + " earned";
}

function drawConfettiPiece(ctx, particle) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, particle.opacity);
  ctx.translate(particle.x, particle.y);
  ctx.rotate((particle.rotation * Math.PI) / 180);
  ctx.fillStyle = particle.color;
  ctx.fillRect(
    -particle.width / 2,
    -particle.height / 2,
    particle.width,
    particle.height
  );
  ctx.restore();
}

function launchBalloonCelebration() {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const colors = ["#38bdf8", "#4ade80", "#fbbf24", "#f472b6", "#a78bfa", "#fb923c", "#f8fafc"];
  const balloonColors = ["#f472b6", "#38bdf8", "#4ade80", "#fbbf24", "#a78bfa"];
  const centerX = canvas.width / 2;
  const startY = canvas.height + 100;
  const popY = canvas.height * 0.38;
  const riseFrames = 50;
  const popFrame = riseFrames;

  const balloon = {
    x: centerX,
    y: startY,
    radiusX: 52,
    radiusY: 66,
    color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
    popped: false
  };

  const particles = [];
  let popFlash = 0;
  let frame = 0;
  const maxFrames = 210;

  function drawBalloon(x, y, scale) {
    const rx = balloon.radiusX * scale;
    const ry = balloon.radiusY * scale;

    ctx.save();
    ctx.translate(x, y);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ry * 0.75);
    ctx.quadraticCurveTo(8, ry + 28, 0, ry + 46);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-7, ry * 0.82);
    ctx.lineTo(0, ry * 0.95);
    ctx.lineTo(7, ry * 0.82);
    ctx.closePath();
    ctx.fillStyle = balloon.color;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = balloon.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(-rx * 0.28, -ry * 0.22, rx * 0.18, ry * 0.14, -0.6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fill();

    ctx.restore();
  }

  function explodeBalloon(x, y) {
    for (let i = 0; i < 130; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      particles.push({
        x: x,
        y: y,
        width: Math.random() * 10 + 5,
        height: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 14 - 7,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 2,
        opacity: 1,
        type: "confetti"
      });
    }

    for (let i = 0; i < 10; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x: x,
        y: y,
        width: Math.random() * 16 + 10,
        height: Math.random() * 10 + 6,
        color: balloon.color,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        opacity: 1,
        type: "shard"
      });
    }

    popFlash = 1;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!balloon.popped) {
      const progress = Math.min(frame / riseFrames, 1);
      balloon.y = startY - (startY - popY) * progress;
      balloon.x = centerX + Math.sin(frame * 0.12) * 10;
      const wobble = 1 + Math.sin(frame * 0.2) * 0.03;
      drawBalloon(balloon.x, balloon.y, wobble);

      if (frame >= popFrame) {
        balloon.popped = true;
        explodeBalloon(balloon.x, balloon.y);
      }
    }

    if (popFlash > 0) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - popFlash / 12);
      ctx.fillStyle = "#fff7ed";
      ctx.beginPath();
      ctx.arc(balloon.x, balloon.y, 30 + popFlash * 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      popFlash += 1;
    }

    particles.forEach(function (particle) {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += particle.type === "shard" ? 0.12 : 0.08;
      particle.velocityX *= 0.99;
      particle.rotation += particle.rotationSpeed;

      if (frame > maxFrames - 55) {
        particle.opacity -= 0.022;
      }

      drawConfettiPiece(ctx, particle);
    });

    frame += 1;

    if (frame < maxFrames) {
      requestAnimationFrame(animate);
      return;
    }

    canvas.remove();
  }

  animate();
}

function launchSprinkleConfetti() {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const colors = ["#38bdf8", "#4ade80", "#fbbf24", "#f472b6", "#a78bfa", "#fb923c", "#f8fafc"];
  const particles = [];

  for (let i = 0; i < 140; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5 - canvas.height * 0.5,
      width: Math.random() * 10 + 5,
      height: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 12 - 6,
      velocityX: Math.random() * 8 - 4,
      velocityY: Math.random() * 4 + 3,
      opacity: 1
    });
  }

  let frame = 0;
  const maxFrames = 180;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (particle) {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += 0.08;
      particle.rotation += particle.rotationSpeed;

      if (frame > maxFrames - 50) {
        particle.opacity -= 0.025;
      }

      drawConfettiPiece(ctx, particle);
    });

    frame += 1;

    if (frame < maxFrames) {
      requestAnimationFrame(animate);
      return;
    }

    canvas.remove();
  }

  animate();
}

function launchSideConfetti() {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const colors = ["#38bdf8", "#4ade80", "#fbbf24", "#f472b6", "#a78bfa", "#fb923c", "#f8fafc"];
  const particles = [];

  for (let i = 0; i < 180; i += 1) {
    const fromLeft = i % 2 === 0;
    particles.push({
      x: fromLeft ? -20 : canvas.width + 20,
      y: Math.random() * canvas.height,
      width: Math.random() * 10 + 5,
      height: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 12 - 6,
      velocityX: fromLeft ? Math.random() * 5 + 3 : -(Math.random() * 5 + 3),
      velocityY: Math.random() * 4 - 2,
      opacity: 1
    });
  }

  let frame = 0;
  const maxFrames = 200;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (particle) {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += 0.06;
      particle.rotation += particle.rotationSpeed;

      if (frame > maxFrames - 50) {
        particle.opacity -= 0.025;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, particle.opacity);
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.fillStyle = particle.color;
      ctx.fillRect(
        -particle.width / 2,
        -particle.height / 2,
        particle.width,
        particle.height
      );
      ctx.restore();
    });

    frame += 1;

    if (frame < maxFrames) {
      requestAnimationFrame(animate);
      return;
    }

    canvas.remove();
  }

  animate();
}

function tryLaunchEndGameConfetti() {
  const total = riddles.length;

  if (endConfettiLaunched || score <= total / 2) {
    return;
  }

  endConfettiLaunched = true;
  launchSideConfetti();
}

function getAttemptCount(index) {
  return (wrongAttempts[index] || 0) + 1;
}

function calculatePoints(index) {
  const tries = getAttemptCount(index);

  if (tries > 5) {
    return fiveMinuteMode ? 0.5 : 0.25;
  }

  if (cluesRevealed[index] >= 1) {
    return fiveMinuteMode ? 1 : 0.5;
  }

  if (tries === 1) {
    return fiveMinuteMode ? 2 : 1;
  }

  return fiveMinuteMode ? 1 : 0.5;
}

function getCorrectFeedback(points, tries) {
  const noun = points === 1 ? "point" : "points";
  return "Correct on try " + tries + "! +" + formatScore(points) + " " + noun;
}

function getWrongFeedback(index) {
  const nextTry = getAttemptCount(index);
  const clueMax = getModePointValue(0.5);
  const lateTry = getModePointValue(0.25);

  if (nextTry > 5) {
    return "Not quite — try again! Try 6 or more earns " + formatScore(lateTry) + " points if correct.";
  }

  if (cluesRevealed[index] >= 1) {
    return "Not quite — try again! A clue was shown, so " + formatScore(clueMax) + " point max if correct.";
  }

  if (nextTry === 1) {
    return "Not quite — try again!";
  }

  return "Not quite — try again! Tries 2-5 earn " + formatScore(clueMax) + " points if correct.";
}

function updateScoreDisplay(total) {
  if (total) {
    scoreCornerEl.textContent = "Points: " + formatScore(score) + " / " + total;
    return;
  }

  scoreCornerEl.textContent = "Points: " + formatScore(score);
}

function getRoundMaxPoints() {
  return riddles.length * (fiveMinuteMode ? 2 : 1);
}

function awardPointsForCorrectAnswer(index) {
  if (solvedCorrectly[index]) {
    return riddlePoints[index];
  }

  solvedCorrectly[index] = true;
  const points = calculatePoints(index);
  riddlePoints[index] = points;
  score += points;
  return points;
}

function revealNextClue(index) {
  if (cluesRevealed[index] >= 2) {
    return false;
  }

  cluesRevealed[index] += 1;
  if (step < 2) {
    step = 2;
  }
  saveCurrentStep();
  return true;
}

function canRequestClue() {
  if (showRulesPage || gameOver || unansweredWarningPending || step === 0) {
    return false;
  }

  if (isAnswerRevealed(riddleIndex)) {
    return false;
  }

  return cluesRevealed[riddleIndex] < 2;
}

function requestClue() {
  if (!canRequestClue()) {
    return;
  }

  if (cluesRevealed[riddleIndex] >= 2) {
    guessFeedback = "You already have both clues.";
    render();
    return;
  }

  usedTypedClues[riddleIndex] = true;
  revealNextClue(riddleIndex);
  const clueMax = formatScore(getModePointValue(0.5));
  guessFeedback =
    cluesRevealed[riddleIndex] === 1
      ? "Here is your first clue! " + clueMax + " point max for this riddle."
      : "Here is your second clue! " + clueMax + " point max for this riddle.";
  pendingGuessValue = "";
  render();
}

function isCluesRequest(guess) {
  const normalized = guess.trim().toLowerCase();
  return normalized === "clues" || normalized === "clue";
}

function showLoadError() {
  contentEl.innerHTML =
    '<p class="prompt error">Riddles failed to load. Refresh the page or open index.html from the AryanFirstRiddle folder.</p>';
  footerTextEl.textContent = "Check that riddles.js is in the same folder as index.html.";
  stepLabelEl.textContent = "Error";
  updateScoreDisplay();
  updateNavButtons();
}

function normalizeAnswer(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/^((a|an|the)\s+)+/, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function buildSynonymLookup() {
  const lookup = {};

  SYNONYM_GROUPS.forEach(function (group) {
    const normalizedGroup = group
      .map(function (term) {
        return normalizeAnswer(term);
      })
      .filter(Boolean);

    normalizedGroup.forEach(function (term) {
      lookup[term] = normalizedGroup;
    });
  });

  return lookup;
}

function areSynonyms(compactGuess, compactAnswer) {
  if (!synonymLookup) {
    synonymLookup = buildSynonymLookup();
  }

  const group = synonymLookup[compactAnswer];
  if (!group) {
    return false;
  }

  return group.includes(compactGuess);
}

function getEditDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, function (_, row) {
    const line = new Array(cols).fill(0);
    line[0] = row;
    return line;
  });

  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      );
    }
  }

  return matrix[rows - 1][cols - 1];
}

function isTypoMatch(compactGuess, compactAnswer) {
  if (!compactGuess || !compactAnswer) {
    return false;
  }

  if (compactGuess === compactAnswer) {
    return true;
  }

  const lengthDiff = Math.abs(compactGuess.length - compactAnswer.length);
  if (lengthDiff > 2) {
    return false;
  }

  const minLen = Math.min(compactGuess.length, compactAnswer.length);
  if (minLen < 3) {
    return false;
  }

  const distance = getEditDistance(compactGuess, compactAnswer);
  const maxDistance = minLen >= 8 ? 2 : 1;
  return distance <= maxDistance;
}

function isCorrectGuess(guess, answer, acceptedAnswers) {
  const trimmedGuess = guess.trim().toLowerCase();
  const trimmedAnswer = answer.trim().toLowerCase();

  if (!trimmedGuess) {
    return false;
  }

  if (trimmedGuess === trimmedAnswer) {
    return true;
  }

  const compactGuess = normalizeAnswer(guess);
  const compactAnswerText = normalizeAnswer(answer);

  if (!compactGuess) {
    return false;
  }

  if (compactGuess === compactAnswerText) {
    return true;
  }

  if (isTypoMatch(compactGuess, compactAnswerText)) {
    return true;
  }

  if (areSynonyms(compactGuess, compactAnswerText)) {
    return true;
  }

  if (!acceptedAnswers || !acceptedAnswers.length) {
    return false;
  }

  for (let i = 0; i < acceptedAnswers.length; i += 1) {
    const alias = acceptedAnswers[i];

    if (trimmedGuess === alias.trim().toLowerCase()) {
      return true;
    }

    if (compactGuess === normalizeAnswer(alias)) {
      return true;
    }

    if (isTypoMatch(compactGuess, normalizeAnswer(alias))) {
      return true;
    }

    if (areSynonyms(compactGuess, normalizeAnswer(alias))) {
      return true;
    }
  }

  return false;
}

function isViewingPast() {
  return riddleIndex < furthestRiddleIndex;
}

function isAnswerRevealed(index) {
  return solvedCorrectly[index] || (riddleSteps[index] || 0) >= 3;
}

function saveCurrentStep() {
  if (step > 0 && riddleIndex >= 0) {
    riddleSteps[riddleIndex] = Math.max(riddleSteps[riddleIndex] || 0, step);
  }
}

function getStepForRiddle(index) {
  if (solvedCorrectly[index]) {
    return 3;
  }
  return riddleSteps[index] || 1;
}

function getUnansweredRiddleNumbers() {
  const unanswered = [];

  for (let i = 0; i < riddles.length; i += 1) {
    if (solvedCorrectly[i] || gaveUp[i]) {
      continue;
    }

    unanswered.push(i + 1);
  }

  return unanswered;
}

function formatRiddleList(numbers) {
  if (numbers.length === 1) {
    return "Riddle " + numbers[0];
  }

  if (numbers.length === 2) {
    return "Riddles " + numbers[0] + " and " + numbers[1];
  }

  const last = numbers[numbers.length - 1];
  const rest = numbers.slice(0, -1).join(", ");
  return "Riddles " + rest + ", and " + last;
}

function canGoPrevious() {
  if (showRulesPage) {
    return false;
  }

  if (gameOver || unansweredWarningPending) {
    return true;
  }
  return step > 0 && riddleIndex > 0;
}

function canGoNext() {
  if (showRulesPage) {
    return false;
  }

  if (gameOver || unansweredWarningPending) {
    return false;
  }
  return step > 0 && riddleIndex < riddles.length - 1;
}

function canGiveUp() {
  if (showRulesPage) {
    return false;
  }

  if (gameOver || unansweredWarningPending || step === 0) {
    return false;
  }

  if (solvedCorrectly[riddleIndex] || gaveUp[riddleIndex]) {
    return false;
  }

  return !isAnswerRevealed(riddleIndex);
}

function canEndGame() {
  if (showRulesPage || showReviewPage || step === 0) {
    return false;
  }

  if (unansweredWarningPending) {
    return true;
  }

  if (gameOver) {
    return false;
  }

  return (
    riddleIndex === riddles.length - 1 &&
    step >= 3 &&
    isAnswerRevealed(riddleIndex)
  );
}

function shouldShowEndGameBtn() {
  if (showRulesPage || showReviewPage || gameOver) {
    return false;
  }

  return canEndGame();
}

function updateNavButtons() {
  if (countdownActive || showReviewsListPage || showTimesListPage) {
    prevBtn.disabled = true;
    clueBtn.disabled = true;
    giveUpBtn.disabled = true;
    nextBtn.disabled = true;
    endGameBtn.hidden = true;
    return;
  }

  prevBtn.disabled = !canGoPrevious();
  clueBtn.disabled = !canRequestClue();
  giveUpBtn.disabled = !canGiveUp();
  nextBtn.disabled = !canGoNext();

  const showEndGame = shouldShowEndGameBtn();
  endGameBtn.hidden = !showEndGame;
  endGameBtn.disabled = !canEndGame();
}

function finishRound() {
  if (!canEndGame()) {
    return;
  }

  if (unansweredWarningPending) {
    tryEndGame(true);
    return;
  }

  tryEndGame();
}

function giveUp() {
  if (!canGiveUp()) {
    return;
  }

  gaveUp[riddleIndex] = true;
  riddlePoints[riddleIndex] = 0;
  step = 3;
  saveCurrentStep();
  guessFeedback = "";
  pendingGuessValue = "";
  render();
}

function goPrevious() {
  if (!canGoPrevious()) {
    return;
  }

  if (gameOver || unansweredWarningPending) {
    exitWarningPending = false;
    unansweredWarningPending = false;

    if (showReviewPage) {
      showReviewPage = false;
      reviewError = "";
      render();
      return;
    }

    gameOver = false;
    riddleIndex = riddles.length - 1;
    step = getStepForRiddle(riddleIndex);
    guessFeedback = "";
    pendingGuessValue = "";
    render();
    return;
  }

  saveCurrentStep();
  riddleIndex -= 1;
  step = getStepForRiddle(riddleIndex);
  guessFeedback = "";
  pendingGuessValue = "";
  render();
}

function goToNextRiddle() {
  if (!canGoNext()) {
    return;
  }

  saveCurrentStep();
  guessFeedback = "";
  pendingGuessValue = "";

  if (riddleIndex === riddles.length - 1) {
    tryEndGame();
    return;
  }

  riddleIndex += 1;
  if (riddleIndex > furthestRiddleIndex) {
    furthestRiddleIndex = riddleIndex;
    step = 1;
    riddleSteps[riddleIndex] = 1;
  } else {
    step = getStepForRiddle(riddleIndex);
  }

  render();
}

function updateStepDots() {
  stepDots.forEach(function (dot) {
    const dotStep = Number(dot.dataset.step);
    if (gameOver || unansweredWarningPending) {
      dot.classList.add("active");
      dot.classList.remove("current");
      return;
    }
    dot.classList.toggle("active", step >= dotStep);
    dot.classList.toggle("current", step === dotStep);
  });
}

function getFooterText() {
  const total = riddles.length;

  if (countdownActive) {
    return "Timed round starts in " + countdownLabel + ".";
  }

  if (showReviewsListPage) {
    return "Click Back to return to the game.";
  }

  if (showTimesListPage) {
    return "Click Back to return to the game.";
  }

  if (showRulesPage) {
    return "Press Space or click Start Game to begin.";
  }

  if (gameOver) {
    if (showReviewPage) {
      return "Pick 1–5 stars, write your review, then Submit. Press Enter to submit.";
    }
    return "Press Enter to rate this round, or ← to review riddles.";
  }

  if (unansweredWarningPending) {
    return "Press End Game or Space to finish anyway, or use ← / Next to go back and answer.";
  }

  if (step === 0) {
    if (fiveMinuteMode) {
      return "5 Min Double Points mode. Try 1 = 2 pt · tries 2-5 = 1 pt · clue shown = 1 pt max · try 6+ = 0.5 pt.";
    }
    return "Space to start. Try 1 = 1 pt · tries 2-5 = 0.5 pt · 1+ clues = 0.5 pt max · try 6+ = 0.25 pt.";
  }

  if (isViewingPast()) {
    return fiveMinuteMode
      ? "Reviewing a previous riddle. Any clue shown means 1 point max."
      : "Reviewing a previous riddle. Any clue shown means half a point max.";
  }

  if (step === 1 || step === 2) {
    const cluesLeft = 2 - (cluesRevealed[riddleIndex] || 0);
    if (cluesRevealed[riddleIndex] >= 1) {
      if (fiveMinuteMode) {
        return "A clue was shown — 1 point max. Try 6+ earns 0.5 points.";
      }
      return "A clue was shown — half point max. Try 6+ earns a quarter point.";
    }
    if (cluesLeft > 0) {
      return "Type your answer, click Give a Clue, or press Space for the next hint (" + cluesLeft + " left).";
    }
    return "Type your answer, or press Space to reveal the answer.";
  }

  const isLast = riddleIndex === total - 1;
  return isLast
    ? "Click End Game to finish the round, or press Space."
    : "Press Space for the next riddle, or Next → to jump ahead.";
}

function bindGuessForm() {
  const input = document.getElementById("guess-input");

  if (!input) {
    return;
  }

  input.value = pendingGuessValue;
  input.oninput = function () {
    pendingGuessValue = input.value;
  };
  input.focus();
}

function getGuessInput() {
  const input = document.getElementById("guess-input");
  return input instanceof HTMLInputElement ? input : null;
}

function buildVirtualKeyboard() {
  let html = "";

  VIRTUAL_KEYBOARD_ROWS.forEach(function (row) {
    html += '<div class="vk-row">';

    row.forEach(function (key) {
      html +=
        '<button type="button" class="vk-key" data-key="' +
        key +
        '">' +
        key +
        "</button>";
    });

    html += "</div>";
  });

  html +=
    '<div class="vk-row vk-row-actions">' +
    '<button type="button" class="vk-key vk-key-wide" data-key="space">Space</button>' +
    '<button type="button" class="vk-key" data-key="backspace" aria-label="Backspace">⌫</button>' +
    '<button type="button" class="vk-key vk-key-submit" data-key="submit">Submit</button>' +
    "</div>";

  virtualKeyboardEl.innerHTML = html;
}

function updateKeyboardUI() {
  keyboardToggleBtn.textContent = keyboardOpen ? "Hide Keyboard" : "Keyboard";
  keyboardToggleBtn.classList.toggle("active", keyboardOpen);
  keyboardToggleBtn.setAttribute("aria-pressed", keyboardOpen ? "true" : "false");
  virtualKeyboardEl.hidden = !keyboardOpen;
  document.body.classList.toggle("keyboard-open", keyboardOpen);
}

function toggleKeyboard() {
  keyboardOpen = !keyboardOpen;
  updateKeyboardUI();

  if (keyboardOpen) {
    const input = getGuessInput();
    if (input) {
      input.focus();
    }
  }
}

function handleVirtualKey(key) {
  const input = getGuessInput();

  if (!input) {
    return;
  }

  if (key === "backspace") {
    input.value = input.value.slice(0, -1);
  } else if (key === "space") {
    input.value += " ";
  } else if (key === "submit") {
    submitGuess(input.value);
    return;
  } else {
    input.value += key;
  }

  pendingGuessValue = input.value;
  input.focus();
}

function submitGuess(guess) {
  pendingGuessValue = guess;

  if (!guess.trim()) {
    guessFeedback = "Type an answer first.";
    render();
    return;
  }

  if (isCluesRequest(guess)) {
    pendingGuessValue = "";
    requestClue();
    return;
  }

  if (isCorrectGuess(
    guess,
    riddles[riddleIndex].answer,
    riddles[riddleIndex].acceptedAnswers
  )) {
    const tries = getAttemptCount(riddleIndex);
    const points = awardPointsForCorrectAnswer(riddleIndex);
    if (tries === 1) {
      launchBalloonCelebration();
    } else if (tries === 2) {
      launchSprinkleConfetti();
    }
    guessFeedback = getCorrectFeedback(points, tries);
    pendingGuessValue = "";
    step = 3;
    saveCurrentStep();
    render();
    return;
  }

  wrongAttempts[riddleIndex] = (wrongAttempts[riddleIndex] || 0) + 1;
  guessFeedback = getWrongFeedback(riddleIndex);
  pendingGuessValue = "";
  render();
}

function getRiddleSummaryText(index) {
  if (solvedCorrectly[index]) {
    const pts = riddlePoints[index];
    return formatScore(pts) + (pts === 1 ? " point" : " points");
  }

  if (gaveUp[index]) {
    return "Gave up — 0 points";
  }

  if (isAnswerRevealed(index)) {
    return "Answer revealed — 0 points";
  }

  return "Not answered — 0 points";
}

function buildRiddleSummaryHtml() {
  let html =
    '<div class="riddle-summary">' +
    "<h3>Riddle Summary</h3>" +
    '<ul class="riddle-summary-list">';

  for (let i = 0; i < riddles.length; i += 1) {
    const earned = solvedCorrectly[i] && riddlePoints[i] > 0;
    html +=
      '<li class="riddle-summary-item">' +
      '<span class="riddle-summary-number">Riddle ' + (i + 1) + "</span>" +
      '<span class="riddle-summary-points' + (earned ? " earned" : "") + '">' +
      getRiddleSummaryText(i) +
      "</span>" +
      "</li>";
  }

  html += "</ul></div>";
  return html;
}

function renderRulesPage() {
  const total = riddles.length;

  riddleCountEl.textContent = "How to Play";
  updateScoreDisplay();
  stepLabelEl.textContent = "Rules";
  updateStepDots();
  updateNavButtons();

  contentEl.innerHTML =
    '<div class="block rules-block">' +
    "<h2>How to Play the Riddle Game</h2>" +
    "<ul class=\"rules-list\">" +
    "<li>Each round has <strong>" + total + " riddles</strong>.</li>" +
    "<li><strong>Answering:</strong> Type your answer and click <strong>Submit</strong>. You can guess as many times as you want.</li>" +
    "<li><strong>Hints:</strong> Click <strong>Give a Clue</strong>, type <strong>clue</strong>, or press the <strong>Spacebar</strong> to see a hint.</li>" +
    "<li><strong>Giving Up:</strong> Click <strong>Give Up</strong> to see the answer, but you will not get any points.</li>" +
    "<li><strong>Moving Around:</strong> Use the <strong>Previous</strong> and <strong>Next</strong> buttons to skip between riddles.</li>" +
    "<li><strong>Ending:</strong> At the end, press <strong>Enter</strong> to rate the game with stars and leave a review.</li>" +
    "<li><strong>How You Win Points</strong></li>" +
    "<li><strong>1 Point:</strong> Guess the answer correctly on your 1st try (before seeing both clues).</li>" +
    "<li><strong>0.5 Points:</strong> Guess it right on your 2nd, 3rd, 4th, or 5th try, or after seeing any clue.</li>" +
    "<li><strong>0.25 Points:</strong> Guess it right on your 6th try or later.</li>" +
    "<li><strong>5 Min Double Points:</strong> Play a 5-minute round where each correct riddle is worth double points.</li>" +
    "</ul>" +
    '<div class="start-options">' +
    '<button id="start-btn" type="button" class="start-btn">Start Game</button>' +
    '<button id="start-five-btn" type="button" class="start-btn start-five-btn">5 Min Double Points</button>' +
    "</div>" +
    "</div>";

  footerTextEl.textContent = getFooterText();
}

function renderUnansweredWarning() {
  const unanswered = getUnansweredRiddleNumbers();
  const total = riddles.length;

  riddleCountEl.textContent = "Round complete?";
  updateScoreDisplay();
  stepLabelEl.textContent = "Warning";
  updateStepDots();
  updateNavButtons();

  contentEl.innerHTML =
    '<div class="block warning-block">' +
    "<h2>Unanswered Riddles</h2>" +
    "<p>You have not answered " + formatRiddleList(unanswered) + ".</p>" +
    "<p>Go back to solve them for more points, or press End Game to finish the round.</p>" +
    '<button id="end-game-inline-btn" type="button" class="start-btn end-game-inline-btn">End Game</button>' +
    "</div>";

  footerTextEl.textContent = getFooterText();
}

function renderCountdownPage() {
  riddleCountEl.textContent = "Timed Round";
  updateScoreDisplay();
  stepLabelEl.textContent = "Starting";
  updateStepDots();
  updateNavButtons();

  contentEl.innerHTML =
    '<div class="block countdown-block">' +
    "<h2>Get Ready</h2>" +
    '<p class="countdown-number">' + countdownLabel + "</p>" +
    "</div>";

  footerTextEl.textContent = getFooterText();
}

function buildStarPickerHtml(selected) {
  let html =
    '<div class="star-rating" role="radiogroup" aria-label="Rate this round">';

  for (let star = 1; star <= 5; star += 1) {
    const isSelected = star <= selected;
    html +=
      '<button type="button" class="star-btn' +
      (isSelected ? " selected" : "") +
      '" data-star="' +
      star +
      '" aria-label="' +
      star +
      " star" +
      (star === 1 ? "" : "s") +
      '" aria-pressed="' +
      isSelected +
      '">★</button>';
  }

  html += "</div>";

  if (selected > 0) {
    html += '<p class="star-label">' + selected + " out of 5 stars</p>";
  } else {
    html += '<p class="star-label star-label-empty">Tap a star to rate</p>';
  }

  return html;
}

function loadReviewsFromStorage() {
  try {
    const reviews = JSON.parse(localStorage.getItem("riddleBotReviews") || "[]");
    if (!Array.isArray(reviews)) {
      return [];
    }

    return reviews.slice().reverse();
  } catch (error) {
    return [];
  }
}

function loadTimesFromStorage() {
  try {
    const times = JSON.parse(localStorage.getItem("riddleBotTimes") || "[]");
    if (!Array.isArray(times)) {
      return [];
    }

    return times.slice().reverse();
  } catch (error) {
    return [];
  }
}

function mergeTimeEntries(localTimes, fileTimes) {
  const merged = [];
  const seen = new Set();
  const combined = []
    .concat(Array.isArray(localTimes) ? localTimes : [])
    .concat(Array.isArray(fileTimes) ? fileTimes : []);

  combined.forEach(function (entry) {
    if (!entry || typeof entry !== "object") {
      return;
    }

    const timeMs = Number(entry.timeMs) || 0;
    const scoreValue = entry.score === undefined || entry.score === null ? "" : String(entry.score);
    const dateValue = String(entry.date || entry.savedAt || "");
    const signature = String(timeMs) + "|" + scoreValue + "|" + dateValue;

    if (seen.has(signature)) {
      return;
    }

    seen.add(signature);
    merged.push(entry);
  });

  merged.sort(function (a, b) {
    const aTime = new Date(a.date || a.savedAt || 0).getTime();
    const bTime = new Date(b.date || b.savedAt || 0).getTime();
    return bTime - aTime;
  });

  return merged;
}

function syncTimesFromFile() {
  fetch(TIMES_API_URL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load times");
      }
      return response.json();
    })
    .then(function (fileTimes) {
      const localTimes = loadTimesFromStorage().slice().reverse();
      const mergedTimes = mergeTimeEntries(localTimes, fileTimes);
      localStorage.setItem("riddleBotTimes", JSON.stringify(mergedTimes));

      if (showTimesListPage) {
        render();
      }
    })
    .catch(function () {
      // Keep local times visible if file sync fails.
    });
}

function saveTimeToStorage(timeMs) {
  let times = [];

  try {
    times = JSON.parse(localStorage.getItem("riddleBotTimes") || "[]");
    if (!Array.isArray(times)) {
      times = [];
    }
  } catch (error) {
    times = [];
  }

  const timeEntry = {
    timeMs: timeMs,
    score: score,
    totalRiddles: riddles.length,
    date: new Date().toISOString()
  };

  times.push(timeEntry);

  localStorage.setItem("riddleBotTimes", JSON.stringify(times));
  saveTimeToFile(timeEntry);
}

function saveTimeToFile(timeEntry) {
  fetch(TIMES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(timeEntry)
  }).catch(function () {
    // Keep localStorage save as fallback if file endpoint is unavailable.
  });
}

function formatReviewDate(isoString) {
  if (!isoString) {
    return "Date unavailable";
  }

  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  } catch (error) {
    return "";
  }
}

function buildStarsReadonlyHtml(stars) {
  let html =
    '<span class="review-stars-readonly" aria-label="' +
    stars +
    ' out of 5 stars">';

  for (let star = 1; star <= 5; star += 1) {
    html +=
      '<span class="review-star' +
      (star <= stars ? " filled" : "") +
      '">★</span>';
  }

  html += "</span>";
  return html;
}

function openReviewsList() {
  showReviewsListPage = true;
  showTimesListPage = false;
  render();
}

function closeReviewsList() {
  showReviewsListPage = false;
  render();
}

function openTimesList() {
  showTimesListPage = true;
  showReviewsListPage = false;
  render();
  syncTimesFromFile();
}

function closeTimesList() {
  showTimesListPage = false;
  render();
}

function renderReviewsListPage() {
  const reviews = loadReviewsFromStorage();

  riddleCountEl.textContent = "Your Reviews";
  updateScoreDisplay();
  stepLabelEl.textContent = "Reviews";
  updateStepDots();
  updateNavButtons();

  let html =
    '<div class="block reviews-list-block">' +
    "<h2>Reviews</h2>";

  if (reviews.length === 0) {
    html +=
      '<p class="reviews-empty">No reviews yet. Finish a round and leave a rating!</p>';
  } else {
    html += '<ul class="reviews-list">';

    reviews.forEach(function (entry) {
      const stars = Number(entry.stars) || 0;
      const totalRiddles = entry.totalRiddles || riddles.length;
      const reviewDate = formatReviewDate(entry.date || entry.savedAt);

      html += '<li class="review-card">';
      html += buildStarsReadonlyHtml(stars);
      html += '<p class="review-meta">Date: ' + reviewDate;

      if (entry.score !== undefined && entry.score !== null) {
        html +=
          " · Score: " +
          formatScore(entry.score) +
          " / " +
          totalRiddles;
      }

      html += "</p>";

      if (entry.review) {
        html += '<p class="review-text">' + escapeHtml(entry.review) + "</p>";
      } else {
        html += '<p class="review-text review-text-empty">No written review.</p>';
      }

      html += "</li>";
    });

    html += "</ul>";
  }

  html +=
    '<button id="close-reviews-btn" type="button" class="start-btn">← Back</button>' +
    "</div>";

  contentEl.innerHTML = html;
  footerTextEl.textContent = getFooterText();
}

function renderTimesListPage() {
  const times = loadTimesFromStorage();

  riddleCountEl.textContent = "Your Times";
  updateScoreDisplay();
  stepLabelEl.textContent = "Times";
  updateStepDots();
  updateNavButtons();

  let html =
    '<div class="block reviews-list-block">' +
    "<h2>Times</h2>";

  if (times.length === 0) {
    html +=
      '<p class="reviews-empty">No times yet. Complete a round to save your time!</p>';
  } else {
    html += '<ul class="reviews-list">';

    times.forEach(function (entry) {
      const totalRiddles = entry.totalRiddles || riddles.length;
      html += '<li class="review-card">';
      html += '<p class="time-value">' + formatRoundTime(Number(entry.timeMs) || 0) + "</p>";
      html += '<p class="review-meta">' + formatReviewDate(entry.date || entry.savedAt);

      if (entry.score !== undefined && entry.score !== null) {
        html +=
          " · Score: " +
          formatScore(entry.score) +
          " / " +
          totalRiddles;
      }

      html += "</p>";
      html += "</li>";
    });

    html += "</ul>";
  }

  html +=
    '<button id="close-times-btn" type="button" class="start-btn">← Back</button>' +
    "</div>";

  contentEl.innerHTML = html;
  footerTextEl.textContent = getFooterText();
}

function saveReviewToStorage(stars, text) {
  let reviews = [];

  try {
    reviews = JSON.parse(localStorage.getItem("riddleBotReviews") || "[]");
    if (!Array.isArray(reviews)) {
      reviews = [];
    }
  } catch (error) {
    reviews = [];
  }

  const reviewEntry = {
    stars: stars,
    review: text.trim(),
    score: score,
    totalRiddles: riddles.length,
    date: new Date().toISOString()
  };

  reviews.push(reviewEntry);

  localStorage.setItem("riddleBotReviews", JSON.stringify(reviews));

  saveReviewToFile(reviewEntry);
}

function saveReviewToFile(reviewEntry) {
  fetch(REVIEWS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reviewEntry)
  }).catch(function () {
    // Keep localStorage save as fallback if file endpoint is unavailable.
  });
}

function goToReviewPage() {
  showReviewPage = true;
  selectedStars = 0;
  reviewText = "";
  reviewError = "";
  render();
}

function setSelectedStars(stars) {
  selectedStars = stars;
  reviewError = "";
  render();
}

function submitReview() {
  if (selectedStars < 1) {
    reviewError = "Please pick a star rating before submitting.";
    render();
    return;
  }

  const textarea = document.getElementById("review-input");
  reviewText = textarea instanceof HTMLTextAreaElement ? textarea.value : reviewText;
  saveReviewToStorage(selectedStars, reviewText);
  restartGame();
}

function renderReviewPage() {
  riddleCountEl.textContent = "Rate this round";
  updateScoreDisplay(riddles.length);
  stepLabelEl.textContent = "Review";
  updateStepDots();
  updateNavButtons();

  let html =
    '<div class="block review-page-block">' +
    "<h2>How was this round?</h2>" +
    "<p class=\"review-intro\">Pick how many stars the game deserves, then write a short review.</p>" +
    buildStarPickerHtml(selectedStars) +
    '<label class="review-label" for="review-input">Your review</label>' +
    '<textarea id="review-input" class="review-input" rows="5" maxlength="1000" placeholder="What did you like? What could be better?"></textarea>' +
    '<button id="review-submit-btn" type="button" class="start-btn">Submit Review</button>';

  if (reviewError) {
    html += '<p class="review-error">' + escapeHtml(reviewError) + "</p>";
  }

  html += "</div>";
  contentEl.innerHTML = html;
  footerTextEl.textContent = getFooterText();

  const textarea = document.getElementById("review-input");
  if (textarea instanceof HTMLTextAreaElement) {
    textarea.value = reviewText;
    textarea.addEventListener("input", function () {
      reviewText = textarea.value;
    });
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderEndGame() {
  const totalRiddles = riddles.length;
  const maxPoints = getRoundMaxPoints();
  const unanswered = getUnansweredRiddleNumbers();

  riddleCountEl.textContent = "All " + totalRiddles + " riddles complete";
  updateScoreDisplay(maxPoints);
  stepLabelEl.textContent = STEP_LABELS[4];
  updateStepDots();
  updateNavButtons();

  let endGameHtml =
    '<div class="block end-game-block">' +
    '<h2 class="end-game-title">End Game</h2>' +
    '<p class="end-game-message">You finished the round with <strong>' + formatScore(score) + "</strong> out of <strong>" + formatScore(maxPoints) + "</strong> points.</p>";

  if (timedModeChoice) {
    endGameHtml +=
      '<p class="end-game-time">Timed round: <strong>' +
      formatRoundTime(getCurrentRoundTimeMs()) +
      "</strong></p>";
  }

  if (fiveMinuteMode) {
    endGameHtml += '<p class="end-game-time">Mode: <strong>5 Min Double Points</strong></p>';
  }

  endGameHtml +=
    buildRiddleSummaryHtml();

  if (unanswered.length > 0) {
    endGameHtml +=
      '<div class="unanswered-warning">' +
      "<h3>Unanswered riddles</h3>" +
      "<p>You did not answer " + formatRiddleList(unanswered) + ".</p>" +
      "</div>";
  }

  endGameHtml +=
    '<button id="continue-review-btn" type="button" class="start-btn review-continue-btn">Rate &amp; Review</button>' +
    '<button id="skip-review-btn" type="button" class="start-btn review-skip-btn">Skip Review</button>';
  endGameHtml += "</div>";
  contentEl.innerHTML = endGameHtml;
  footerTextEl.textContent = getFooterText();
  tryLaunchEndGameConfetti();
}

function render() {
  const total = riddles.length;
  updateTimerDisplay();

  if (countdownActive) {
    renderCountdownPage();
    return;
  }

  if (showReviewsListPage) {
    renderReviewsListPage();
    return;
  }

  if (showTimesListPage) {
    renderTimesListPage();
    return;
  }

  if (showRulesPage) {
    renderRulesPage();
    return;
  }

  if (unansweredWarningPending) {
    renderUnansweredWarning();
    return;
  }

  if (gameOver) {
    if (showReviewPage) {
      renderReviewPage();
      return;
    }

    renderEndGame();
    return;
  }

  riddleCountEl.textContent =
    step === 0
      ? "Riddle 0 of " + total
      : "Riddle " + (riddleIndex + 1) + " of " + total;
  updateScoreDisplay();
  stepLabelEl.textContent = STEP_LABELS[step];
  updateStepDots();
  updateNavButtons();

  if (step === 0) {
    contentEl.innerHTML =
      '<p class="prompt">Press the spacebar to get your first riddle!</p>';
    footerTextEl.textContent = getFooterText();
    return;
  }

  const riddle = riddles[riddleIndex];
  const revealed = isAnswerRevealed(riddleIndex);
  let html = "";

  if (isViewingPast()) {
    html += '<p class="review-badge">Reviewing previous riddle</p>';
  }

  if (step >= 1) {
    html +=
      '<div class="block riddle-block">' +
      "<h2>Riddle</h2>" +
      "<p>" + riddle.question + "</p>" +
      "</div>";
  }

  if (cluesRevealed[riddleIndex] > 0) {
    html +=
      '<div class="block clues-block">' +
      "<h2>Clues</h2>" +
      "<ol>";

    for (let c = 0; c < cluesRevealed[riddleIndex]; c += 1) {
      html += "<li>" + riddle.clues[c] + "</li>";
    }

    html += "</ol></div>";
  }

  if (cluesRevealed[riddleIndex] >= 2) {
    html += '<p class="clues-penalty-badge">Clue shown — ' + formatScore(getModePointValue(0.5)) + " point max</p>";
  } else if (cluesRevealed[riddleIndex] === 1) {
    html += '<p class="clues-penalty-badge">Clue shown — ' + formatScore(getModePointValue(0.5)) + " point max</p>";
  }

  if (!revealed) {
    html +=
      '<div class="block guess-block">' +
      "<h2>Your Answer</h2>" +
      '<p class="attempt-count">Attempt ' + getAttemptCount(riddleIndex) + "</p>" +
      '<p class="clues-penalty-note">' +
      "You earn " + formatScore(getModePointValue(1)) + " points if you answer the question correctly on the first try. " +
      "You earn " + formatScore(getModePointValue(0.5)) + " points if the question is answered within 2-5 tries. " +
      "You earn " + formatScore(getModePointValue(0.25)) + " points if the riddle is answered in 6 or more tries." +
      "</p>" +
      '<form id="guess-form" class="guess-form">' +
      '<input id="guess-input" type="text" placeholder="Type your answer..." autocomplete="off" />' +
      '<button type="submit">Submit</button>' +
      "</form>";

    if (guessFeedback) {
      let feedbackClass = "info";
      if (guessFeedback.indexOf("Correct") === 0) {
        feedbackClass = "success";
      } else if (
        guessFeedback.indexOf("Not quite") === 0 ||
        guessFeedback.indexOf("Type an answer") === 0
      ) {
        feedbackClass = "error";
      }
      html += '<p class="guess-feedback ' + feedbackClass + '">' + guessFeedback + "</p>";
    }

    html += "</div>";
  } else {
    html +=
      '<div class="block answer-block">' +
      "<h2>Answer</h2>" +
      '<p class="answer">' + riddle.answer + "</p>";

    if (solvedCorrectly[riddleIndex]) {
      html += '<p class="points-badge">' + formatPointsEarned(riddlePoints[riddleIndex]) + "</p>";
    } else if (gaveUp[riddleIndex]) {
      html += '<p class="missed-badge">Gave up — no points</p>';
    } else {
      html += '<p class="missed-badge">No point — answer revealed</p>';
    }

    html += "</div>";

    if (riddleIndex === riddles.length - 1) {
      html +=
        '<button id="end-game-inline-btn" type="button" class="start-btn end-game-inline-btn">End Game</button>';
    }
  }

  contentEl.innerHTML = html;
  footerTextEl.textContent = getFooterText();
  bindGuessForm();
}

function tryEndGame(forceEnd) {
  const unanswered = getUnansweredRiddleNumbers();

  if (!forceEnd && unanswered.length > 0) {
    unansweredWarningPending = true;
    render();
    return;
  }

  gameOver = true;
  exitWarningPending = false;
  unansweredWarningPending = false;
  finalizeRoundTimer();
  render();
}

function advance() {
  if (countdownActive) {
    return;
  }

  if (showRulesPage) {
    startGame(false);
    return;
  }

  if (gameOver) {
    return;
  }

  if (unansweredWarningPending) {
    tryEndGame(true);
    return;
  }

  if (isViewingPast()) {
    return;
  }

  if (step === 0) {
    step = 1;
    furthestRiddleIndex = 0;
    riddleSteps[0] = 1;
    render();
    return;
  }

  if (step >= 1 && step < 3) {
    if (cluesRevealed[riddleIndex] < 2) {
      revealNextClue(riddleIndex);
      guessFeedback = "";
      render();
      return;
    }

    step = 3;
    saveCurrentStep();
    guessFeedback = "";
    render();
    return;
  }

  saveCurrentStep();
  guessFeedback = "";
  pendingGuessValue = "";

  const isLastRiddle = riddleIndex === riddles.length - 1;
  if (isLastRiddle) {
    tryEndGame();
    return;
  }

  riddleIndex += 1;
  step = 1;
  furthestRiddleIndex = riddleIndex;
  riddleSteps[riddleIndex] = 1;
  render();
}

function handleEnterAtEndGame() {
  if (!gameOver) {
    return;
  }

  if (showReviewPage) {
    submitReview();
    return;
  }

  goToReviewPage();
}

function isTypingTarget(target) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

document.addEventListener("keydown", function (event) {
  if (countdownActive) {
    return;
  }

  if (isTypingTarget(event.target)) {
    return;
  }

  if (event.key === "Enter") {
    if (gameOver) {
      event.preventDefault();
      handleEnterAtEndGame();
      return;
    }

    if (
      !showRulesPage &&
      !showReviewsListPage &&
      !showTimesListPage &&
      !showReviewPage &&
      !unansweredWarningPending &&
      !isViewingPast() &&
      step === 3 &&
      isAnswerRevealed(riddleIndex)
    ) {
      event.preventDefault();
      advance();
      return;
    }

    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goPrevious();
    return;
  }

  if (event.code !== "Space" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  advance();
});

prevBtn.addEventListener("click", goPrevious);
clueBtn.addEventListener("click", requestClue);
giveUpBtn.addEventListener("click", giveUp);
nextBtn.addEventListener("click", goToNextRiddle);
endGameBtn.addEventListener("click", finishRound);
reviewsBtn.addEventListener("click", openReviewsList);
timesBtn.addEventListener("click", openTimesList);
keyboardToggleBtn.addEventListener("click", toggleKeyboard);
startOverBtn.addEventListener("click", restartGame);

virtualKeyboardEl.addEventListener("click", function (event) {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement) || !target.dataset.key) {
    return;
  }

  event.preventDefault();
  handleVirtualKey(target.dataset.key);
});

contentEl.addEventListener("click", function (event) {
  const target = event.target;

  if (target instanceof HTMLButtonElement && target.id === "close-reviews-btn") {
    closeReviewsList();
    return;
  }

  if (target instanceof HTMLButtonElement && target.id === "close-times-btn") {
    closeTimesList();
    return;
  }

  if (target instanceof HTMLButtonElement && target.id === "start-btn") {
    startGame(false);
    return;
  }

  if (target instanceof HTMLButtonElement && target.id === "start-five-btn") {
    startGame(true);
    return;
  }

  if (target instanceof HTMLButtonElement && target.id === "continue-review-btn") {
    goToReviewPage();
    return;
  }

  if (target instanceof HTMLButtonElement && target.id === "skip-review-btn") {
    restartGame();
    return;
  }

  if (
    target instanceof HTMLButtonElement &&
    target.id === "end-game-inline-btn"
  ) {
    finishRound();
    return;
  }

  if (target instanceof HTMLButtonElement && target.id === "review-submit-btn") {
    submitReview();
    return;
  }

  if (target instanceof HTMLButtonElement && target.dataset.star) {
    setSelectedStars(Number(target.dataset.star));
  }
});

contentEl.addEventListener("submit", function (event) {
  const form = event.target;

  if (!(form instanceof HTMLFormElement) || form.id !== "guess-form") {
    return;
  }

  event.preventDefault();
  const input = form.querySelector("#guess-input");
  submitGuess(input ? input.value : "");
});

function init() {
  if (!loadRiddleSet(0)) {
    showLoadError();
    return;
  }

  buildVirtualKeyboard();
  updateKeyboardUI();
  resetProgress();
  showRulesPage = true;
  render();
}

init();
