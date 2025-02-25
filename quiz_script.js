// Global variables
let age, duration, selectedTypes = [];
let totalTime, quiz_timerInterval;
let questions = [];
let currentIndex = 0;

// Pre-defined logical reasoning questions
const logicalQuestionsPool = [
  {
    question: "What comes next in the sequence? 2, 4, 8, 16, ___",
    quiz_options: ["18", "32", "20", "24"],
    answer: "32"
  },
  {
    question: "Find the missing number: 1, 3, 6, 10, __, 21",
    quiz_options: ["13", "14", "15", "16"],
    answer: "15"
  },
  {
    question: "If the pattern is AB, BC, CD, DE, what comes next?",
    quiz_options: ["EF", "FG", "HI", "AC"],
    answer: "EF"
  },
  {
    question: "Odd One Out: Apple, Banana, Carrot, Grape",
    quiz_options: ["Apple", "Banana", "Carrot", "Grape"],
    answer: "Carrot"
  },
  {
    question: "Odd One Out: Dog, Cat, Horse, Sparrow",
    quiz_options: ["Dog", "Cat", "Horse", "Sparrow"],
    answer: "Sparrow"
  },
  {
    question: "Odd One Out: Sun, Moon, Star, Clock",
    quiz_options: ["Sun", "Moon", "Star", "Clock"],
    answer: "Clock"
  },
  {
    question: "Odd One Out: Square, Triangle, Rectangle, Circle",
    quiz_options: ["Square", "Triangle", "Rectangle", "Circle"],
    answer: "Circle"
  },
  {
    question: "What comes next? 3, 9, 27, 81, ___",
    quiz_options: ["108", "243", "162", "324"],
    answer: "243"
  },
  {
    question: "A train travels 60 km in 1 hour. How far will it travel in 3 hours?",
    quiz_options: ["180 km", "120 km", "200 km", "150 km"],
    answer: "180 km"
  },
  {
    question: "If 3 pencils cost $1.50, how much do 6 pencils cost?",
    quiz_options: ["$3.00", "$2.50", "$3.50", "$4.00"],
    answer: "$3.00"
  },
  {
    question: "A clock shows 3:15. What is the angle between the hands?",
    quiz_options: ["7.5°", "22.5°", "45°", "90°"],
    answer: "7.5°"
  },
  {
    question: "If a pizza is cut into 8 slices and 3 are eaten, how many are left?",
    quiz_options: ["3", "5", "6", "4"],
    answer: "5"
  },
  {
    question: "If 4x = 12, what is x?",
    quiz_options: ["2", "3", "4", "6"],
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

  // Hide setup, show test quizScreen
  document.getElementById("setupquizScreen").classList.add("quizHidden");
  document.getElementById("testquizScreen").classList.remove("quizHidden");

  // Start quiz-timer and load first question
  startquiz_timer();
  loadQuestion(currentIndex);
});

// quiz-timer functions
function startquiz_timer() {
  updatequiz_timerDisplay();
  quiz_timerInterval = setInterval(() => {
    totalTime--;
    updatequiz_timerDisplay();
    if (totalTime <= 0) {
      clearInterval(quiz_timerInterval);
      finishTest();
    }
  }, 1000);
}

function updatequiz_timerDisplay() {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  document.getElementById("quiz-timerDisplay").textContent = `Time Remaining: ${minutes}m ${seconds}s`;
}

// quiz-navigation buttons
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

// Load a question (with quiz-navigation support and answer persistence)
function loadQuestion(index) {
  const quizContainer = document.getElementById("questionquizContainer");
  quizContainer.innerHTML = "";
  const q = questions[index] || generateQuestion();
  // Save question in case it was newly generated
  questions[index] = q;

  const qElem = document.createElement("div");
  qElem.innerHTML = `<h2>Question ${index + 1}</h2><p>${q.question}</p>`;

  const quiz_optionsList = document.createElement("ul");
  quiz_optionsList.className = "quiz_options";
  q.quiz_options.forEach(option => {
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
    quiz_optionsList.appendChild(li);
  });
  qElem.appendChild(quiz_optionsList);
  quizContainer.appendChild(qElem);
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
    let quiz_correctAnswer;
    if (type === "addition") {
      questionText = `${num1} + ${num2} = ?`;
      quiz_correctAnswer = (num1 + num2).toString();
    } else if (type === "subtraction") {
      // Ensure non-negative quiz-result
      const a = Math.max(num1, num2);
      const b = Math.min(num1, num2);
      questionText = `${a} - ${b} = ?`;
      quiz_correctAnswer = (a - b).toString();
    } else if (type === "multiplication") {
      questionText = `${num1} × ${num2} = ?`;
      quiz_correctAnswer = (num1 * num2).toString();
    }
    // Generate multiple choices (quiz-correct answer + 3 distractors)
    const quiz_options = generatequiz_options(quiz_correctAnswer);
    return {
      question: questionText,
      quiz_options: quiz_options,
      answer: quiz_correctAnswer
    };
  }
}

// Function to generate quiz_options (random order, ensuring one quiz-correct answer)
function generatequiz_options(quiz_correctAnswer) {
  const opts = new Set();
  opts.add(quiz_correctAnswer);
  while (opts.size < 4) {
    // Generate a random variation: add or subtract a small random value
    const variation = Math.floor(Math.random() * 10) + 1;
    const addOrSubtract = Math.random() < 0.5 ? -1 : 1;
    const distractor = (parseInt(quiz_correctAnswer) + addOrSubtract * variation).toString();
    // Avoid duplicate answers
    opts.add(distractor);
  }
  // Shuffle the quiz_options array
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

// Finish the test: stop quiz-timer and show quiz-results
function finishTest() {
  clearInterval(quiz_timerInterval);
  document.getElementById("testquizScreen").classList.add("quizHidden");
  document.getElementById("quiz-resultsquizScreen").classList.remove("quizHidden");
  showquiz_results();
}

// Calculate score and show each question's outcome
function showquiz_results() {
  let score = 0;
  const quiz_resultsDiv = document.getElementById("quiz-resultsList");
  quiz_resultsDiv.innerHTML = "";
  questions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.className = "quiz-result";
    const userAnswer = q.selectedAnswer ? q.selectedAnswer : "No answer";
    const isquiz_correct = userAnswer === q.answer;
    if (isquiz_correct) score++;
    qDiv.classList.add(isquiz_correct ? "quiz-correct" : "quiz-incorrect");
    qDiv.innerHTML = `<strong>Question ${index + 1}:</strong> ${q.question}<br>
      <strong>Your answer:</strong> ${userAnswer}<br>
      <strong>quiz-correct answer:</strong> ${q.answer}`;
    quiz_resultsDiv.appendChild(qDiv);
  });
  document.getElementById("scoreDisplay").innerHTML = `<h3>Your Score: ${score} / ${questions.length}</h3>`;
}

// Function to share certificate via social media
function shareCertificate(name, age, score, rank, percentile) {
  const shareText = `🎉 Congratulations ${name}! 🎉\n
  I scored ${score} in my Math Practice Test (Age Group: ${age}).
  Rank: ${rank} | Percentile: ${percentile}%
  Can you beat my score? Try now!`;

  const encodedText = encodeURIComponent(shareText);
  const url = encodeURIComponent("http://yourwebsite.com"); // Update with actual site URL

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`;
  const whatsappShare = `https://api.whatsapp.com/send?text=${encodedText}`;
  const emailShare = `mailto:?subject=My Math Practice Score!&body=${encodedText}`;

  document.getElementById("shareLinks").innerHTML = `
      <a href="${facebookShare}" target="_blank">Share on Facebook</a> |
      <a href="${twitterShare}" target="_blank">Share on Twitter</a> |
      <a href="${whatsappShare}" target="_blank">Share on WhatsApp</a> |
      <a href="${emailShare}" target="_blank">Email Certificate</a>
  `;
}

// Function to fetch and display certificate with sharing quiz_options
function fetchCertificate(name, age, score, rank, percentile) {
  fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
          action: "generateCertificate",
          name: name,
          age: age,
          score: score,
          rank: rank,
          percentile: percentile
      })
  }).then(response => response.json())
  .then(data => {
      document.getElementById("certificatequizContainer").innerHTML = `
          <iframe src="data:text/html;base64,${data.certificate}" width="100%" height="400px"></iframe>
          <button onclick="downloadCertificate('${data.certificate}')">Download</button>
          <button onclick="shareCertificate('${name}', '${age}', '${score}', '${rank}', '${percentile}')">Share</button>
          <div id="shareLinks"></div>
      `;
  });
}
