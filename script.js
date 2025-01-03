class CountdownTimer {
    constructor(containerId, duration) {
      // Select container and set timer properties
      this.container = document.getElementById(containerId);
      this.duration = duration;
      this.timeLeft = duration;
      this.totalTime = duration;
  
      // Create HTML structure inside the container
      this.container.innerHTML = `
        <div class="participants" id="${containerId}-participants">Participants: 0</div>
        <div class="countdown" id="${containerId}-countdown">00:00:00:00</div>
        <div class="pool-prize" id="${containerId}-pool-prize">Pool Prize 0</div>
        <div class="progress-container">
          <div class="progress-bar" id="${containerId}-progress"></div>
        </div>
        <div class="divider"></div>
        <div class="pick-numbers">Pick Your 3 Numbers</div>
        <div class="number-buttons" id="${containerId}-buttons"></div>
      `;
  
      // Generate number buttons dynamically
      this.generateNumberButtons(containerId);
  
      // Select countdown and progress bar elements
      this.countdownElement = document.getElementById(`${containerId}-countdown`);
      this.progressBar = document.getElementById(`${containerId}-progress`);
  
      // Start the countdown
      this.startCountdown();
    }
  
    // Function to format time as days:hours:minutes:seconds
    formatTime(seconds) {
      const days = Math.floor(seconds / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const secs = seconds % 60;
  
      return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  
    // Function to start the countdown timer
    startCountdown() {
      const interval = setInterval(() => {
        this.timeLeft--;
  
        // Update countdown and progress bar
        this.countdownElement.textContent = this.formatTime(this.timeLeft);
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        this.progressBar.style.width = `${progress}%`;
  
        // Reset timer when it reaches 0
        if (this.timeLeft <= 0) {
          clearInterval(interval);
          setTimeout(() => {
            this.timeLeft = this.totalTime;
            this.progressBar.style.width = '0%';
            this.countdownElement.textContent = this.formatTime(this.timeLeft);
            this.startCountdown(); // Restart countdown
          }, 1000); // 1-second pause before restarting
        }
      }, 1000); // Update every 1 second
    }
  
    // Function to generate 60 circular number buttons dynamically
    generateNumberButtons(containerId) {
      const buttonsContainer = document.getElementById(`${containerId}-buttons`);
      for (let i = 1; i <= 60; i++) {
        const button = document.createElement('button');
        button.classList.add('number-button');
        button.textContent = i; // Set button number
        buttonsContainer.appendChild(button); // Add button to container
      }
    }
  }
  
  // Create instances of CountdownTimer for each timer
  new CountdownTimer('timer1', 60);                       // 1 minute
  new CountdownTimer('timer2', 60 * 60);                  // 1 hour
  new CountdownTimer('timer3', 24 * 60 * 60);             // 1 day
  new CountdownTimer('timer4', 7 * 24 * 60 * 60);         // 1 week
  new CountdownTimer('timer5', 30 * 24 * 60 * 60);        // 1 month
  new CountdownTimer('timer6', 365 * 24 * 60 * 60);       // 1 year
  