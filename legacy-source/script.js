// NOTE: Fichier obsolète. La version active du quiz est dans assets/js/quiz.js.
console.log("Quiz JS loaded...");

const questions = [
  {
    text: "Quelle est la capitale de la France ?",
    answers: ["Marseille", "Paris", "Lyon", "Bordeaux"],
    correct: 1,
    timeLimit: 10,
  },
  {
    text: "Combien font 2 + 3 ?",
    answers: ["3", "4", "5", "1"],
    correct: 2,
    timeLimit: 5,
  },
  {
    text: "Quelle est la capitale de l'Italie ?",
    answers: ["Rome", "Milan", "Naples", "Venise"],
    correct: 0,
    timeLimit: 8,
  },
  {
    text: "Quelle planète est la plus grande du système solaire ?",
    answers: ["Jupiter", "Saturne", "Mars", "Vénus"],
    correct: 0,
    timeLimit: 10,
  },
  {
    text: "En quelle année l'homme a-t-il marché sur la Lune pour la première fois ?",
    answers: ["1969", "1959", "1975", "1981"],
    correct: 0,
    timeLimit: 12,
  },
  {
    text: "Quel est le symbole chimique de l'eau ?",
    answers: ["H2O", "O2", "CO2", "NaCl"],
    correct: 0,
    timeLimit: 6,
  },
  {
    text: "Qui a écrit \"Les Misérables\" ?",
    answers: [
      "Victor Hugo",
      "Émile Zola",
      "Alexandre Dumas",
      "Gustave Flaubert",
    ],
    correct: 0,
    timeLimit: 10,
  },
  {
    text: "Quel est le plus long fleuve du monde ?",
    answers: ["Nil", "Amazone", "Yangtsé", "Mississippi"],
    correct: 0,
    timeLimit: 9,
  },
  {
    text: "Dans quel continent se trouve le Sahara ?",
    answers: ["Afrique", "Asie", "Amérique", "Europe"],
    correct: 0,
    timeLimit: 7,
  },
  {
    text: "Quelle est la monnaie du Japon ?",
    answers: ["Yen", "Won", "Yuan", "Rouble"],
    correct: 0,
    timeLimit: 7,
  },
  {
    text: "Combien y a-t-il de continents sur Terre ?",
    answers: ["7", "5", "6", "8"],
    correct: 0,
    timeLimit: 6,
  },
  {
    text: "Qui a peint la Joconde ?",
    answers: ["Léonard de Vinci", "Michel-Ange", "Raphaël", "Donatello"],
    correct: 0,
    timeLimit: 10,
  },
  {
    text: "Quelle est la plus haute montagne du monde ?",
    answers: ["Everest", "K2", "Kilimandjaro", "Mont Blanc"],
    correct: 0,
    timeLimit: 9,
  },
  {
    text: "Quel organe pompe le sang dans le corps humain ?",
    answers: ["Le cœur", "Le foie", "Les poumons", "Le rein"],
    correct: 0,
    timeLimit: 7,
  },
  {
    text: "Quel pays a pour capitale Canberra ?",
    answers: ["Australie", "Nouvelle-Zélande", "Canada", "Afrique du Sud"],
    correct: 0,
    timeLimit: 8,
  },
  {
    text: "Quel est le plus grand océan ?",
    answers: ["Pacifique", "Atlantique", "Indien", "Arctique"],
    correct: 0,
    timeLimit: 8,
  },
  {
    text: "Combien de secondes y a-t-il dans une minute ?",
    answers: ["60", "90", "45", "100"],
    correct: 0,
    timeLimit: 5,
  },
  {
    text: "Quel instrument mesure la température ?",
    answers: ["Thermomètre", "Baromètre", "Hygromètre", "Altimètre"],
    correct: 0,
    timeLimit: 7,
  },
  {
    text: "Quelle langue est la plus parlée au monde (locuteurs natifs) ?",
    answers: ["Mandarin", "Anglais", "Espagnol", "Hindi"],
    correct: 0,
    timeLimit: 10,
  },
  {
    text: "Quel est l'astre au centre du système solaire ?",
    answers: ["Le Soleil", "La Terre", "La Lune", "Mars"],
    correct: 0,
    timeLimit: 6,
  },
  {
    text: "Dans quel pays se trouve la ville de Rio de Janeiro ?",
    answers: ["Brésil", "Argentine", "Portugal", "Mexique"],
    correct: 0,
    timeLimit: 8,
  },
  {
    text: "Quel est le plus petit des continents ?",
    answers: ["Océanie", "Europe", "Antarctique", "Amérique du Sud"],
    correct: 0,
    timeLimit: 9,
  },
  // Ajoutez d’autres questions si besoin
];

// Variables
let currentQuestionIndex = 0;
let score = 0;
let bestScore = 0;
let timeLeft = 0;
let timerId = null;

// DOM
const introScreen = document.getElementById("intro-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");

const bestScoreValue = document.getElementById("best-score-value");
const bestScoreEnd = document.getElementById("best-score-end");

const questionText = document.getElementById("question-text");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const scoreText = document.getElementById("score-text");
const timeLeftSpan = document.getElementById("time-left");

const currentQuestionIndexSpan = document.getElementById(
  "current-question-index"
);
const totalQuestionsSpan = document.getElementById("total-questions");

// On init
window.addEventListener("DOMContentLoaded", () => {
  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", restartQuiz);

  loadBestScore();
  bestScoreValue.textContent = bestScore;
});

function loadBestScore() {
  const stored = localStorage.getItem("bestScore");
  if (stored) {
    bestScore = parseInt(stored, 10);
  }
}

function saveBestScore() {
  localStorage.setItem("bestScore", bestScore.toString());
}

function startQuiz() {
  introScreen.style.display = "none";
  questionScreen.style.display = "block";

  currentQuestionIndex = 0;
  score = 0;

  totalQuestionsSpan.textContent = questions.length;

  showQuestion();
}

function showQuestion() {
  // Stop any previous timer
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  questionText.textContent = q.text;

  currentQuestionIndexSpan.textContent = currentQuestionIndex + 1;

  // Refresh answers
  answersDiv.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.addEventListener("click", () => selectAnswer(index, btn));
    answersDiv.appendChild(btn);
  });

  // Hide "Question suivante" until user responds or time is up
  nextBtn.classList.add("hidden");

  // Timer
  timeLeft = q.timeLimit;
  timeLeftSpan.textContent = timeLeft;

  timerId = setInterval(() => {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      lockAnswers();
      clearInterval(timerId);
      nextBtn.classList.remove("hidden");
    }
  }, 1000);
}

function selectAnswer(index, btnClicked) {
  const q = questions[currentQuestionIndex];

  clearInterval(timerId);

  // Vérification
  if (index === q.correct) {
    score++;
    btnClicked.classList.add("correct");
  } else {
    btnClicked.classList.add("wrong");
  }

  // Marquer la vraie réponse
  const allButtons = answersDiv.querySelectorAll("button");
  if (q.correct < allButtons.length) {
    allButtons[q.correct].classList.add("correct");
  }

  lockAnswers();
  nextBtn.classList.remove("hidden");
}

function lockAnswers() {
  const allButtons = answersDiv.querySelectorAll("button");
  allButtons.forEach((b) => {
    b.disabled = true;
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  questionScreen.style.display = "none";
  resultScreen.style.display = "block";

  scoreText.textContent = `Votre score : ${score} / ${questions.length}`;

  if (score > bestScore) {
    bestScore = score;
    saveBestScore();
  }
  bestScoreEnd.textContent = bestScore;
}

function restartQuiz() {
  resultScreen.style.display = "none";
  introScreen.style.display = "block";

  bestScoreValue.textContent = bestScore;
}
