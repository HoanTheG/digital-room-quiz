let quizData = [
  {
    question: "What is the most important thing to find first when you are lost in the wilderness?",
    options: [
      { answer: "Water", points: 5 },
      { answer: "Food", points: 2 },
      { answer: "Shelter", points: 3 },
      { answer: "WiFi", points: 0 }
    ],
    correct: "Water",
    explanation: "Water is essential for survival as dehydration can occur quickly in the wilderness. Without water, you can become dehydrated, which can lead to severe health issues and even death within a few days."
  },
  {
    question: "Which of these is a good source of protein in the wild?",
    options: [
      { answer: "Berries", points: 1 },
      { answer: "Freshwater fish", points: 5 },
      { answer: "Tree bark", points: 0 },
      { answer: "Grass", points: 0 }
    ],
    correct: "Freshwater fish",
    explanation: "Freshwater fish are a rich source of protein and essential nutrients. Protein is crucial for maintaining energy levels and muscle function, which are vital for survival in the wild."
  },
  {
    question: "What should you do if you encounter a bear?",
    options: [
      { answer: "Run away", points: 0 },
      { answer: "Play dead", points: 3 },
      { answer: "Climb a tree", points: 2 },
      { answer: "Make loud noises", points: 5 }
    ],
    correct: "Make loud noises",
    explanation: "Making loud noises can scare the bear away and prevent an attack. Bears are often more afraid of humans than we are of them, and loud noises can deter them from approaching."
  },
  {
    question: "How can you signal for help if you are lost?",
    options: [
      { answer: "Start a fire", points: 5 },
      { answer: "Yell loudly", points: 3 },
      { answer: "Wave your arms", points: 1 },
      { answer: "Do an elaborate TikTok dance", points: 0 }
    ],
    correct: "Start a fire",
    explanation: "Starting a fire creates smoke, which is a visible signal that can attract rescuers. Smoke can be seen from a distance and is a universal distress signal."
  },
  {
    question: "What is the best way to purify water in the wild?",
    options: [
      { answer: "Boil it", points: 5 },
      { answer: "Filter it through your shirt", points: 2 },
      { answer: "Drink it as is", points: 0 },
      { answer: "Add salt", points: 0 }
    ],
    correct: "Boil it",
    explanation: "Boiling water kills harmful pathogens and makes it safe to drink. Drinking untreated water can lead to waterborne diseases, which can be life-threatening in a survival situation."
  },
  {
    question: "How can you start a fire without matches?",
    options: [
      { answer: "Use a magnifying glass", points: 5 },
      { answer: "Rub two sticks together", points: 4 },
      { answer: "Use a flashlight", points: 0 },
      { answer: "Wait for lightning", points: 0 }
    ],
    correct: "Use a magnifying glass",
    explanation: "Using a magnifying glass to focus sunlight is an effective way to start a fire. Fire is essential for warmth, cooking food, and signaling for help."
  },
  {
    question: "What should you do if you are caught in a thunderstorm?",
    options: [
      { answer: "Stand under a tree", points: 0 },
      { answer: "Lie flat on the ground", points: 3 },
      { answer: "Seek shelter in a low area", points: 5 },
      { answer: "Hold a metal object", points: 0 }
    ],
    correct: "Seek shelter in a low area",
    explanation: "Seeking shelter in a low area reduces the risk of being struck by lightning. High points and tall objects, like trees, are more likely to be struck by lightning."
  },
  {
    question: "What is the best way to treat a wound in the wild?",
    options: [
      { answer: "Clean it with water", points: 5 },
      { answer: "Cover it with leaves", points: 0 },
      { answer: "Apply mud", points: 0 },
      { answer: "Leave it open", points: 2 }
    ],
    correct: "Clean it with water",
    explanation: "Cleaning a wound with water helps prevent infection and promotes healing. Using unclean materials like leaves or mud can introduce bacteria and worsen the wound."
  },
];

const quizContainer = document.querySelector(".quiz-container");
const question = document.querySelector(".quiz-container .question");
const options = document.querySelector(".quiz-container .options");
const nextBtn = document.querySelector(".quiz-container .next-btn");
const quizResult = document.querySelector(".quiz-result");
const startBtnContainer = document.querySelector(".start-btn-container");
const startBtn = document.querySelector(".start-btn-container .start-btn");

let questionNumber = 0;
let score = 0;
const MAX_QUESTIONS = quizData.length; // Update to reflect the actual number of questions
let timerInterval;
let answerSelected = false;

const shuffleArray = (array) => {
  return array.slice().sort(() => Math.random() - 0.5);
};

quizData = shuffleArray(quizData);

const resetLocalStorage = () => {
  for (i = 0; i < MAX_QUESTIONS; i++) {
    localStorage.removeItem(`userAnswer_${i}`);
  }
};

resetLocalStorage();

const checkAnswer = (e) => {
  let userAnswer = e.target.textContent;
  let selectedOption = quizData[questionNumber].options.find(option => option.answer === userAnswer);
  score += selectedOption.points;

  // Remove the selected class from any previously selected option
  let allOptions = document.querySelectorAll(".quiz-container .option");
  allOptions.forEach((o) => {
    o.classList.remove("selected");
  });

  e.target.classList.add("selected");

  localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);
  answerSelected = true;

  // Enable all options to allow changing the answer
  allOptions.forEach((o) => {
    o.classList.remove("disabled");
  });

  nextBtn.style.display = "block"; // Show the next button
};

const createQuestion = () => {
  clearInterval(timerInterval);
  answerSelected = false;

  let secondsLeft = 14; // Adjust the timer to 15 seconds
  const timerDisplay = document.querySelector(".quiz-container .timer");
  timerDisplay.classList.remove("danger");

  timerDisplay.textContent = `Time Left: 15 seconds`;

  timerInterval = setInterval(() => {
    timerDisplay.textContent = `Time Left: ${secondsLeft
      .toString()
      .padStart(2, "0")} seconds`;
    secondsLeft--;

    if (secondsLeft < 3) {
      timerDisplay.classList.add("danger");
    }

    if (secondsLeft < 0) {
      clearInterval(timerInterval);
      if (!answerSelected) {
        localStorage.setItem(`userAnswer_${questionNumber}`, "Not Answered");
      }
      displayNextQuestion();
    }
  }, 1000);

  options.innerHTML = "";
  question.innerHTML = `<span class='question-number'>${
    questionNumber + 1
  }/${MAX_QUESTIONS}</span>${quizData[questionNumber].question}`;

  const shuffledOptions = shuffleArray(quizData[questionNumber].options);

  shuffledOptions.forEach((o) => {
    const option = document.createElement("button");
    option.classList.add("option");
    option.innerHTML = o.answer;
    option.addEventListener("click", (e) => {
      checkAnswer(e);
    });
    options.appendChild(option);
  });

  nextBtn.style.display = "none"; // Hide the next button initially
};

const restartQuiz = () => {
  questionNumber = 0;
  score = 0;
  quizData = shuffleArray(quizData);
  resetLocalStorage();

  startBtnContainer.style.display = "flex";
  quizResult.style.display = "none";
};

const displayQuizResult = () => {
  quizResult.style.display = "flex";
  quizContainer.style.display = "none";
  quizResult.innerHTML = "";

  const accordion = document.createElement("div");
  accordion.classList.add("accordion");

  const maxScore = 40; // Maximum possible score is 40 points
  const survivalMessage = document.createElement("p");
  survivalMessage.classList.add("survival-message");
  survivalMessage.innerHTML = `You scored: ${score} out of ${maxScore} points`;
  quizResult.appendChild(survivalMessage);

  for (let i = 0; i < MAX_QUESTIONS; i++) {
    const resultItem = document.createElement("div");
    resultItem.classList.add("question-container");

    const userAnswer = localStorage.getItem(`userAnswer_${i}`);
    const correctAnswer = quizData[i].correct;
    const explanation = quizData[i].explanation;
    const selectedOption = quizData[i].options.find(option => option.answer === userAnswer);

    let answeredCorrectly = userAnswer === correctAnswer;

    if (answeredCorrectly) {
      resultItem.classList.add("correct");
    } else if (selectedOption && selectedOption.points >= 3) {
      resultItem.classList.add("almost-correct");
    } else {
      resultItem.classList.add("incorrect");
    }

    resultItem.innerHTML = `
      <div class="question">Q${i + 1}: ${quizData[i].question}</div>
      <div class="user-answer">Your answer: ${userAnswer || "Not Answered"} (${selectedOption ? selectedOption.points : 0} points)</div>
      <div class="correct-answer">Correct: ${correctAnswer} (${quizData[i].options.find(option => option.answer === correctAnswer).points} points)</div>
      <div class="explanation">Explanation: ${explanation}</div>
    `;

    resultItem.addEventListener("click", () => {
      resultItem.classList.toggle("active");
    });

    accordion.appendChild(resultItem);
  }

  quizResult.appendChild(accordion);

  const restartBtn = document.createElement("button");
  restartBtn.classList.add("restart-btn");
  restartBtn.innerHTML = "Restart Quiz";
  restartBtn.addEventListener("click", restartQuiz);
  quizResult.appendChild(restartBtn);
};

const displayNextQuestion = () => {
  if (questionNumber >= MAX_QUESTIONS - 1) {
    displayQuizResult();
    return;
  }

  questionNumber++;
  createQuestion();
};

nextBtn.addEventListener("click", displayNextQuestion);

startBtn.addEventListener("click", () => {
  startBtnContainer.style.display = "none";
  quizContainer.style.display = "block";
  createQuestion();
});
