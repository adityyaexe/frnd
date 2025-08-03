// FRIENSHIP-DAY-CARDS/app.js

// 📝 Your custom quiz as configuration
const questions = [
  {
    text: "kya aap tom ka sir 🧠 khana pasand karoge?",
    options: ["Mai to Ladies hu khaungi hi 😉", "Basic need hai 😜"]
  },
  {
    text: "kya tom gussa karta hai?",
    options: ["bilkul bohot gusse wala hai😠", "nahi mera accha baccha hai 🤗"]
  },
  {
    text: "kya tom pareshan karta hai?",
    options: ["Bilkul kaleshi hai 😒", "nhi pyaara hai 😽"]
  },
  {
    text: "kya aap tom se shadi karogi?",
    options: ["aaj ke aaj😁", "mujh se peecha nhi chhuda sakta 😉"]
  },
  {
    text: "kya tom successful banega?",
    options: ["meow ke aashirwad se zarur ✋🏻", "bann na padega no option 🙅🏻‍♀️"]
  },
  {
    text: "Aap ko kya karna pasand hai?",
    options: ["Uddna Pasand hai ✈️", "Chhup jaana pasand h 🥷"]
  },
  {
    text: "Jab Tom sathme hota h Dimag apna use karogi ki tom ka?",
    options: ["Ovioo tom ka 🧠", "No option Mere pass toh hai hi nhi 🤯"]
  },
  {
    text: "Aditya exactly hai kya aaj confirm kardo ?",
    // Multiple options for this question
    options: ["Tom🐈", "Macchar🦟", "Jaggu🐒", "Aur boht naam rakhungi 💅🏻"]
  },
  {
    text: "Tom ke baare me aapko kya pasand hai what makes him perfect for you?",
    input: true, // This is a text input question
    placeholder: "Jaldi type kar yaha motii🐈"
  },
  {
    text: "kaisa laga yeh surprise meow aapko?",
    options: ["itna khas nahi🥱", "Made my day🤗", "aww mera pyaara tom😘"]
  }
];

// State
let currentQuestionIndex = 0;
let answers = [];
let isTransitioning = false;

// Emoji reactions (optional, basic, you can expand/adjust as you like)
const reactions = {
  option: [
    { emoji: "😻", text: "Cute pick!" },
    { emoji: "😹", text: "Haha, awesome!" },
    { emoji: "😽", text: "Meow-approved!" },
    { emoji: "💖", text: "So sweet!" },
    { emoji: "🎉", text: "Fun answer!" }
  ],
  text: [
    { emoji: "💌", text: "Aww, personalized!" },
    { emoji: "😻", text: "Dil se jawab!" }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const totalEl = document.getElementById('total-questions');
  if (totalEl) totalEl.textContent = questions.length;

  // Hide others initially
  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('celebration-screen').style.display = 'none';

  setInterval(createFloatingHeart, 3000);
  setTimeout(animateWelcomeScreen, 500);
});

// Floating hearts animation
function createFloatingHeart() {
  const container = document.querySelector('.floating-hearts');
  if (!container) return;
  const heart = document.createElement('div');
  const emojis = ['💖', '💕', '💗', '🌸', '✨', '😻'];
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  heart.className = 'heart';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.animationDuration = (4 + Math.random() * 4) + 's';
  container.appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}

// Start quiz
function startQuiz() {
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('quiz-screen').style.display = 'flex';
  document.getElementById('quiz-screen').classList.remove('hidden');

  currentQuestionIndex = 0;
  answers = [];
  isTransitioning = false;
  displayQuestion();
}

// Render the current question card
function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    return showCelebration();
  }
  const qObj = questions[currentQuestionIndex];
  const qText = document.getElementById('question-text');
  if (!qText) return;
  qText.textContent = qObj.text;
  // Update question number and progress bar
  document.getElementById('current-question').textContent = currentQuestionIndex + 1;
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

  // Render answer buttons or input box
  const answerBtnsDiv = document.querySelector('.answer-buttons');
  answerBtnsDiv.innerHTML = '';

  if (qObj.options) {
    qObj.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = `btn btn--${idx === 0 ? 'primary' : 'secondary'} btn--lg answer-btn`;
      btn.textContent = opt;
      btn.onclick = () => answerQuestion(opt);
      answerBtnsDiv.appendChild(btn);
    });
  } else if (qObj.input) {
    // Render input + submit
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input-answer';
    input.style.fontSize = '1.1em';
    input.style.padding = '0.7em';
    input.style.borderRadius = '8px';
    input.style.marginBottom = '16px';
    input.placeholder = qObj.placeholder || 'Type here...';
    input.id = 'user-input-answer';
    answerBtnsDiv.appendChild(input);
    const btn = document.createElement('button');
    btn.className = 'btn btn--primary btn--lg answer-btn';
    btn.textContent = "Submit 💌";
    btn.onclick = () => {
      const val = input.value.trim();
      if (val.length === 0) {
        input.focus();
        shakeInput(input);
        return;
      }
      answerQuestion(val);
    };
    answerBtnsDiv.appendChild(btn);
    input.focus();
  }

  isTransitioning = false;
}

// Little shake animation for invalid text input
function shakeInput(el) {
  el.style.transition = 'all 0.1s';
  el.style.transform = 'translateX(4px)';
  setTimeout(() => {
    el.style.transform = 'translateX(-4px)';
    setTimeout(() => {
      el.style.transform = 'translateX(0)';
    }, 100);
  }, 100);
}

// Handle answering
function answerQuestion(selectedAnswer) {
  if (isTransitioning) return;
  isTransitioning = true;

  // Save answer in {question, answer} format
  answers.push({
    question: questions[currentQuestionIndex].text,
    answer: selectedAnswer
  });

  // Visual feedback (animation/reaction)
  showReactionAnimation(
    questions[currentQuestionIndex].options
      ? "option"
      : "text"
  );

  createCelebrationParticles(selectedAnswer);

  // Move to next question after reaction
  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, 1650);
}

// Show reaction
function showReactionAnimation(kind = "option") {
  const reactionAnim = document.getElementById('reaction-animation');
  const reactionEmoji = document.getElementById('reaction-emoji');
  const reactionText = document.getElementById('reaction-text');
  if (reactionAnim && reactionEmoji && reactionText) {
    const src = reactions[kind];
    const r = src[Math.floor(Math.random() * src.length)];
    reactionEmoji.textContent = r.emoji;
    reactionText.textContent = r.text;
    reactionAnim.classList.add('show');
    setTimeout(() => reactionAnim.classList.remove('show'), 1300);
  }
}

// Floating confetti/emoji particles
function createCelebrationParticles(option) {
  const emojis =
    typeof option === "string" && option.includes("😜")
      ? ["😜", "🙃", "💞", "✨"]
      : ["💖", "✨", "😻", "🌸", "🎉", "💕", "💅🏻"];
  for (let i = 0; i < 7; i++) {
    setTimeout(() => createParticle(emojis[Math.floor(Math.random() * emojis.length)]), i * 66);
  }
}
function createParticle(emoji) {
  const particle = document.createElement('div');
  particle.textContent = emoji;
  particle.style.cssText = `
    position: fixed;
    font-size: 1.5rem;
    pointer-events: none;
    z-index: 50;
    left: ${Math.random() * window.innerWidth}px;
    top: ${Math.random() * window.innerHeight}px;
  `;
  document.body.appendChild(particle);
  particle.animate([
    { transform: 'translateY(0) scale(1)', opacity: 1 },
    { transform: 'translateY(-100px) scale(0)', opacity: 0 }
  ], {
    duration: 1700,
    easing: 'ease-out'
  }).onfinish = () => particle.remove();
}

// Show celebration and save to MongoDB
function showCelebration() {
  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('quiz-screen').classList.add('hidden');
  const celebrationScreen = document.getElementById('celebration-screen');
  celebrationScreen.style.display = 'flex';
  celebrationScreen.classList.remove('hidden');
  // Statistic: count only MCQ option answers resembling positive/negative for fun
  // But, for open answers/multiple option, you may skip stats or show "Submitted!"
  let yesCount = 0, noCount = 0;
  answers.forEach(({answer}) => {
    if(typeof answer === "string" && (
      answer.toLowerCase().includes("yes") ||
      answer.toLowerCase().includes("hu") || // fun guess
      answer.includes("pyaara") || answer.includes("zarur") || answer.includes("made my day"))) {
      yesCount++;
    }
    else if(typeof answer === 'string' && (
      answer.toLowerCase().includes("nahi") ||
      answer.toLowerCase().includes("no option")
    )) {
      noCount++;
    }
  });
  animateNumber('yes-count', yesCount);
  animateNumber('no-count', noCount);
  setTimeout(() => createMassiveCelebration(), 1000);

  setTimeout(() => saveAnswersToServer(answers), 1300);
}

// Animate numbers
function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const incr = Math.max(1, Math.ceil(target / 16));
  const timer = setInterval(() => {
    current += incr;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 40);
}

// Massive confetti
function createMassiveCelebration() {
  const emojis = ['🎉', '💖', '✨', '😻', '🎊', '😽', '🌸', '💫', "🥳", "😁"];
  for (let i = 0; i < 29; i++) {
    setTimeout(() => {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      createCelebrationExplosion(emoji);
    }, i * 75);
  }
}
function createCelebrationExplosion(emoji) {
  const particle = document.createElement('div');
  particle.textContent = emoji;
  particle.style.cssText = `
    position: fixed;
    font-size: 2rem;
    pointer-events: none;
    z-index: 100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(particle);
  const angle = Math.random() * Math.PI * 2;
  const distance = 180 + Math.random() * 300;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  particle.animate([
    { transform: 'translate(-50%,-50%) scale(0)', opacity: 1 },
    { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.7)`, opacity: 0.8, offset: 0.7 },
    { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px + 100px)) scale(0)`, opacity: 0 }
  ], {
    duration: 2400,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }).onfinish = () => particle.remove();
}

// Save answers (for use with MongoDB/Express backend)
async function saveAnswersToServer(answers) {
  const API_URL = 'http://localhost:5000/api/submit';
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizTitle: "Tom Friendship Quiz",
        answers: answers, // [{question, answer}]
        userName: "Love Cat", // You can make this dynamic (prompt or form)
        timestamp: new Date().toISOString()
      })
    });
    if (response.ok) {
      const result = await response.json();
      showSaveStatus('✅ Your answers are saved! 🥳', 'green');
      console.log('✅ MongoDB Save:', result);
    } else {
      showSaveStatus('❌ Failed to save', 'red');
      console.error('❌ Save failed', await response.text());
    }
  } catch (err) {
    showSaveStatus('❌ Could not connect to server', 'orange');
    console.error('📡 Network error', err);
  }
}

// Save status message helper
function showSaveStatus(msg, color) {
  let statusEl = document.getElementById('save-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'save-status';
    statusEl.style.marginTop = '1.5em';
    statusEl.style.fontWeight = 'bold';
    statusEl.style.fontSize = '1.1em';
    statusEl.style.borderRadius = '8px';
    const parent = document.querySelector('.celebration-content');
    if (parent) parent.appendChild(statusEl);
  }
  statusEl.textContent = msg;
  statusEl.style.color = color;
}

// Restart quiz function
function restartQuiz() {
  document.getElementById('celebration-screen').style.display = 'none';
  document.getElementById('celebration-screen').classList.add('hidden');
  document.getElementById('welcome-screen').style.display = 'flex';
  document.getElementById('welcome-screen').classList.remove('hidden');
  currentQuestionIndex = 0;
  answers = [];
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = '0%';
  const statusEl = document.getElementById('save-status');
  if (statusEl) statusEl.remove();
  setTimeout(animateWelcomeScreen, 300);
}

// Welcome animation
function animateWelcomeScreen() {
  const elements = [
    document.querySelector('.main-title'),
    document.querySelector('.subtitle'),
    document.querySelector('.welcome-message'),
    document.querySelector('.main-cat-image'),
    document.querySelector('.start-btn')
  ];
  elements.forEach((el, i) => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'all 0.8s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 180);
    }
  });
}

// ⌨️ Keyboard and touch support remain unchanged
document.addEventListener('keydown', e => {
  const quizScreen = document.getElementById('quiz-screen');
  if (!quizScreen || quizScreen.style.display === 'none') return;
  const q = questions[currentQuestionIndex];
  // Use 1/2/3/4 or first letter for fast answers
  if (q && q.options) {
    for (let i = 0; i < q.options.length; i++) {
      if (e.key === String(i + 1)) answerQuestion(q.options[i]);
    }
  } else if (q && q.input && e.key === "Enter") {
    const inp = document.getElementById('user-input-answer');
    if (inp) {
      let val = inp.value.trim();
      if (val.length) answerQuestion(val);
    }
  }
});
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, false);

// Expose controls for HTML onclick
window.startQuiz = startQuiz;
window.answerQuestion = answerQuestion;
window.restartQuiz = restartQuiz;

console.log("🐱 Custom Tom Friendship Card Quiz loaded!");
