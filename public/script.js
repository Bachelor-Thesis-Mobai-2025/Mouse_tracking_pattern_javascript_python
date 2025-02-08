const questions = [
  "Do you enjoy outdoor activities?",
  "Do you prefer working in a team?",
  "Are you interested in technology?",
  "Do you like reading book?",
  "Do you exercise regularly?",
  "Do you enjoy cooking?",
  "Are you a morning person?",
  "Do you like traveling?",
  "Do you prefer cats over dogs?",
  "Do you enjoy learning new skills?"
];

let currentQuestionIndex = 0;
let mouseData = [];
let startTime = null;
let lastPosition = { x: 0, y: 0 };
let lastTime = null;
let isTracking = false;
let sessionId = null;

const startBtn = document.getElementById("start-btn");
const questionScreen = document.getElementById("question-screen");
const questionText = document.getElementById("question-text");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const nextBtn = document.getElementById("next-btn");
const resultScreen = document.getElementById("result-screen");

startBtn.addEventListener("click", startQuestionnaire);
yesBtn.addEventListener("click", () => handleAnswer("Yes"));
noBtn.addEventListener("click", () => handleAnswer("No"));
nextBtn.addEventListener("click", showNextQuestion);

function startQuestionnaire() {
  document.getElementById("start-screen").style.display = "none";
  questionScreen.style.display = "block";
  showQuestion();
  startTracking();
  sessionId = Date.now(); // Unique session ID
}

function showQuestion() {
  questionText.textContent = questions[currentQuestionIndex];
  nextBtn.style.display = "none";
}

function showNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    startTracking();
  } else {
    questionScreen.style.display = "none";
    resultScreen.style.display = "block";
  }
}

function handleAnswer(answer) {
  stopTracking();
  const endTime = Date.now();
  const totalTime = (endTime - startTime) / 1000; // Convert to seconds
  const speed = calculateSpeed(mouseData);

  const sessionData = {
    question: questions[currentQuestionIndex],
    answer: answer,
    mouseMovements: mouseData.map(point => [point.x, point.y]), // Store as [x, y] arrays
    totalTime: totalTime,
    averageSpeed: speed
  };

  // Send data to the backend to save as a .json file
  saveDataToFile(sessionData);
  nextBtn.style.display = "block";
}

function startTracking() {
  startTime = Date.now();
  lastTime = startTime;
  lastPosition = { x: 0, y: 0 };
  mouseData = [];
  isTracking = true;
  document.addEventListener("mousemove", trackMouse);
}

function stopTracking() {
  isTracking = false;
  document.removeEventListener("mousemove", trackMouse);
}

function trackMouse(event) {
  if (!isTracking) return;

  const currentTime = Date.now();
  const timeDiff = (currentTime - lastTime) / 1000; // Convert to seconds
  const currentPosition = { x: event.clientX, y: event.clientY };

  if (timeDiff > 0) {
    const speed = calculateSpeedBetweenPoints(lastPosition, currentPosition, timeDiff);
    mouseData.push({
      x: currentPosition.x,
      y: currentPosition.y,
      time: currentTime - startTime,
      speed: speed
    });
    lastPosition = currentPosition;
    lastTime = currentTime;
  }
}

function calculateSpeedBetweenPoints(startPos, endPos, time) {
  const distance = Math.sqrt(
    Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
  );
  return distance / time; // Speed in pixels per second
}

function calculateSpeed(mouseData) {
  if (mouseData.length < 2) return 0;

  let totalDistance = 0;
  let totalTime = 0;

  for (let i = 1; i < mouseData.length; i++) {
    const prev = mouseData[i - 1];
    const curr = mouseData[i];
    const distance = Math.sqrt(
      Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
    );
    totalDistance += distance;
    totalTime += (curr.time - prev.time) / 1000; // Convert to seconds
  }

  return totalDistance / totalTime; // Average speed in pixels per second
}

function saveDataToFile(data) {
  fetch("/save-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, data }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Data saved successfully:", result);
    })
    .catch((error) => {
      console.error("Error saving data:", error);
    });
}