let [hours, minutes, seconds, milliseconds] = [0, 0, 0, 0];
let timer = null;
let isRunning = false;
let laps = [];

let isCountdown = false;
let countdownTime = 0;

const display = document.getElementById("display");
const lapsList = document.getElementById("laps");
const modeToggle = document.getElementById("modeToggle");
const countdownInput = document.getElementById("countdownInput");

modeToggle.addEventListener("change", () => {
  resetTimer();
  isCountdown = modeToggle.checked;
  countdownInput.style.display = isCountdown ? "block" : "none";
  display.innerText = isCountdown ? "00:00:00:000" : "00:00:00:000";
});

function updateDisplay() {
  let h = hours < 10 ? "0" + hours : hours;
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;
  let ms = milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds;
  display.innerText = `${h}:${m}:${s}:${ms}`;
}

function stopwatch() {
  milliseconds += 10;
  if (milliseconds === 1000) {
    milliseconds = 0;
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
    }
  }
  updateDisplay();
}

function countdown() {
  if (countdownTime <= 0) {
    clearInterval(timer);
    isRunning = false;
    alert("⏳ Countdown Finished!");
    return;
  }
  countdownTime -= 10;

  let totalMs = countdownTime;
  hours = Math.floor(totalMs / 3600000);
  minutes = Math.floor((totalMs % 3600000) / 60000);
  seconds = Math.floor((totalMs % 60000) / 1000);
  milliseconds = totalMs % 1000;

  updateDisplay();
}

function startTimer() {
  if (!isRunning) {
    if (isCountdown) {
      timer = setInterval(countdown, 10);
    } else {
      timer = setInterval(stopwatch, 10);
    }
    isRunning = true;
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  [hours, minutes, seconds, milliseconds] = [0, 0, 0, 0];
  updateDisplay();
  isRunning = false;
  laps = [];
  lapsList.innerHTML = "";
}

function recordLap() {
  if (isRunning && !isCountdown) {
    let lapTime = display.innerText;
    laps.push(lapTime);

    let li = document.createElement("li");
    li.innerText = `Lap ${laps.length}: ${lapTime}`;
    lapsList.appendChild(li);

    highlightLaps();
  }
}

function highlightLaps() {
  let times = laps.map(t => {
    let [h, m, s, ms] = t.split(":").map(Number);
    return h * 3600000 + m * 60000 + s * 1000 + ms;
  });

  let min = Math.min(...times);
  let max = Math.max(...times);

  [...lapsList.children].forEach((li, index) => {
    li.classList.remove("fastest", "slowest");
    if (times[index] === min) li.classList.add("fastest");
    if (times[index] === max) li.classList.add("slowest");
  });
}

function setCountdown() {
  let h = parseInt(document.getElementById("countHours").value) || 0;
  let m = parseInt(document.getElementById("countMinutes").value) || 0;
  let s = parseInt(document.getElementById("countSeconds").value) || 0;

  countdownTime = (h * 3600 + m * 60 + s) * 1000;
  hours = h;
  minutes = m;
  seconds = s;
  milliseconds = 0;
  updateDisplay();
}
