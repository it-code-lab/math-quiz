// Global variables
let age, duration, selectedTypes = [];
let totalTime, timerInterval;
let questions = [];
let currentIndex = 0;

// Pre-defined logical reasoning questions
const logicalQuestionsPool = [
  {
    question: "What comes next in the sequence? 2, 4, 8, 16, ___",
    options: ["18", "32", "20", "24"],
    answer: "32"
  },
  {
    question: "Find the missing number: 1, 3, 6, 10, __, 21",
    options: ["13", "14", "15", "16"],
    answer: "15"
  },
  {
    question: "If the pattern is AB, BC, CD, DE, what comes next?",
    options: ["EF", "FG", "HI", "AC"],
    answer: "EF"
  },
  {
    question: "Odd One Out: Apple, Banana, Carrot, Grape",
    options: ["Apple", "Banana", "Carrot", "Grape"],
    answer: "Carrot"
  },
  {
    question: "Odd One Out: Dog, Cat, Horse, Sparrow",
    options: ["Dog", "Cat", "Horse", "Sparrow"],
    answer: "Sparrow"
  },
  {
    question: "Odd One Out: Sun, Moon, Star, Clock",
    options: ["Sun", "Moon", "Star", "Clock"],
    answer: "Clock"
  },
  {
    question: "Odd One Out: Square, Triangle, Rectangle, Circle",
    options: ["Square", "Triangle", "Rectangle", "Circle"],
    answer: "Circle"
  },
  {
    question: "What comes next? 3, 9, 27, 81, ___",
    options: ["108", "243", "162", "324"],
    answer: "243"
  },
  {
    question: "A train travels 60 km in 1 hour. How far will it travel in 3 hours?",
    options: ["180 km", "120 km", "200 km", "150 km"],
    answer: "180 km"
  },
  {
    question: "If 3 pencils cost $1.50, how much do 6 pencils cost?",
    options: ["$3.00", "$2.50", "$3.50", "$4.00"],
    answer: "$3.00"
  },
  {
    question: "A clock shows 3:15. What is the angle between the hands?",
    options: ["7.5°", "22.5°", "45°", "90°"],
    answer: "7.5°"
  },
  {
    question: "If a pizza is cut into 8 slices and 3 are eaten, how many are left?",
    options: ["3", "5", "6", "4"],
    answer: "5"
  },
  {
    question: "If 4x = 12, what is x?",
    options: ["2", "3", "4", "6"],
    answer: "3"
  }
];

// Handle setup form submission
document.getElementById("setupForm").addEventListener("submit", function(e) {
  e.preventDefault();
  age = parseInt(document.getElementById("age").value);
  duration = parseInt(document.getElementById("duration").value);
  totalTime = duration * 60; // seconds

  // Get selected question types
  const checkboxes = document.querySelectorAll('input[name="qType"]:checked');
  checkboxes.forEach(cb => selectedTypes.push(cb.value));

  // Hide setup, show test screen
  document.getElementById("setupScreen").classList.add("hidden");
  document.getElementById("testScreen").classList.remove("hidden");

  // Start timer and load first question
  startTimer();
  loadQuestion(currentIndex);
});

// Timer functions
function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    totalTime--;
    updateTimerDisplay();
    if (totalTime <= 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  document.getElementById("timerDisplay").textContent = `Time Remaining: ${minutes}m ${seconds}s`;
}

// Navigation buttons
document.getElementById("prevBtn").addEventListener("click", function() {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion(currentIndex);
  }
});

document.getElementById("nextBtn").addEventListener("click", function() {
  // If at the end of our questions array, generate a new one
  if (currentIndex === questions.length - 1) {
    questions.push(generateQuestion());
  }
  currentIndex++;
  loadQuestion(currentIndex);
});

document.getElementById("submitBtn").addEventListener("click", finishTest);

// Load a question (with navigation support and answer persistence)
function loadQuestion(index) {
  const container = document.getElementById("questionContainer");
  container.innerHTML = "";
  const q = questions[index] || generateQuestion();
  // Save question in case it was newly generated
  questions[index] = q;

  const qElem = document.createElement("div");
  qElem.innerHTML = `<h2>Question ${index + 1}</h2><p>${q.question}</p>`;

  const optionsList = document.createElement("ul");
  optionsList.className = "options";
  q.options.forEach(option => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "option";
    radio.value = option;
    // Pre-select if already answered
    if (q.selectedAnswer === option) {
      radio.checked = true;
    }
    radio.addEventListener("change", () => {
      q.selectedAnswer = radio.value;
    });
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + option));
    li.appendChild(label);
    optionsList.appendChild(li);
  });
  qElem.appendChild(optionsList);
  container.appendChild(qElem);
}

// Function to generate a new question based on selected types
function generateQuestion() {
  // Randomly pick one of the selected types
  const type = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];
  if (type === "logical") {
    // Pick a random logical reasoning question from the pool
    const poolIndex = Math.floor(Math.random() * logicalQuestionsPool.length);
    // Clone the object to avoid reference issues
    return Object.assign({}, logicalQuestionsPool[poolIndex]);
  } else {
    // For arithmetic types: addition, subtraction, multiplication
    // Determine max number based on age
    let maxNumber;
    if (age >= 5 && age <= 7) {
      maxNumber = 70;
    } else if (age >= 8 && age <= 10) {
      maxNumber = 900;
    } else {
      maxNumber = 100; // default/fallback
    }
    const num1 = Math.floor(Math.random() * maxNumber) + 1;
    const num2 = Math.floor(Math.random() * maxNumber) + 1;
    let questionText = "";
    let correctAnswer;
    if (type === "addition") {
      questionText = `${num1} + ${num2} = ?`;
      correctAnswer = (num1 + num2).toString();
    } else if (type === "subtraction") {
      // Ensure non-negative result
      const a = Math.max(num1, num2);
      const b = Math.min(num1, num2);
      questionText = `${a} - ${b} = ?`;
      correctAnswer = (a - b).toString();
    } else if (type === "multiplication") {
      questionText = `${num1} × ${num2} = ?`;
      correctAnswer = (num1 * num2).toString();
    }
    // Generate multiple choices (correct answer + 3 distractors)
    const options = generateOptions(correctAnswer);
    return {
      question: questionText,
      options: options,
      answer: correctAnswer
    };
  }
}

// Function to generate options (random order, ensuring one correct answer)
function generateOptions(correctAnswer) {
  const opts = new Set();
  opts.add(correctAnswer);
  while (opts.size < 4) {
    // Generate a random variation: add or subtract a small random value
    const variation = Math.floor(Math.random() * 10) + 1;
    const addOrSubtract = Math.random() < 0.5 ? -1 : 1;
    const distractor = (parseInt(correctAnswer) + addOrSubtract * variation).toString();
    // Avoid duplicate answers
    opts.add(distractor);
  }
  // Shuffle the options array
  return shuffleArray(Array.from(opts));
}

// Utility: Shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Finish the test: stop timer and show results
function finishTest() {
  clearInterval(timerInterval);
  document.getElementById("testScreen").classList.add("hidden");
  document.getElementById("resultsScreen").classList.remove("hidden");
  showResults();
}

// Calculate score and show each question's outcome
function showResults() {
  let score = 0;
  const resultsDiv = document.getElementById("resultsList");
  resultsDiv.innerHTML = "";
  questions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.className = "result";
    const userAnswer = q.selectedAnswer ? q.selectedAnswer : "No answer";
    const isCorrect = userAnswer === q.answer;
    if (isCorrect) score++;
    qDiv.classList.add(isCorrect ? "correct" : "incorrect");
    qDiv.innerHTML = `<strong>Question ${index + 1}:</strong> ${q.question}<br>
      <strong>Your answer:</strong> ${userAnswer}<br>
      <strong>Correct answer:</strong> ${q.answer}`;
    resultsDiv.appendChild(qDiv);
  });
  document.getElementById("scoreDisplay").innerHTML = `<h3>Your Score: ${score} / ${questions.length}</h3>`;
}
