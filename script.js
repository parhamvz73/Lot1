// Countdown Timer Variables
const countdownElement = document.getElementById('countdown');
const progressBar = document.getElementById('progress-bar');

let timeLeft = 60; // Initial countdown time in seconds
const totalTime = 60; // Total countdown time (used for reset)

function startCountdown() {
  const interval = setInterval(() => {
    timeLeft--;

    // Update countdown display
    countdownElement.textContent = timeLeft;

    // Update progress bar
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;

    // Reset timer when it reaches 0
    if (timeLeft <= 0) {
      clearInterval(interval);
      setTimeout(() => {
        timeLeft = totalTime;
        progressBar.style.width = '0%';
        countdownElement.textContent = timeLeft;
        startCountdown(); // Restart countdown
      }, 1000); // 1-second pause before restarting
    }
  }, 1000); // Update every 1 second
}

// Start the countdown when the page loads
startCountdown();
