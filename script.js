class CountdownTimer {
    constructor(containerId, duration) {
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
      `;
  
      // Select elements for this instance
      this.countdownElement = document.getElementById(`${containerId}-countdown`);
      this.progressBar = document.getElementById(`${containerId}-progress`);
  
      // Start countdown
      this.startCountdown();
    }
  
    // Format time as days:hours:minutes:seconds
    formatTime(seconds) {
      const days = Math.floor(seconds / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const secs = seconds % 60;
  
      return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  
    // Start countdown
    startCountdown() {
      const interval = setInterval(() => {
        this.timeLeft--;
  
        // Update countdown display
        this.countdownElement.textContent = this.formatTime(this.timeLeft);
  
        // Update progress bar
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
  }
  
  // Create instances of the countdown timer with different durations
  new CountdownTimer('timer1', 60);                       // 1 minute
  new CountdownTimer('timer2', 60 * 60);                  // 1 hour
  new CountdownTimer('timer3', 24 * 60 * 60);             // 1 day
  new CountdownTimer('timer4', 7 * 24 * 60 * 60);         // 1 week
  new CountdownTimer('timer5', 30 * 24 * 60 * 60);        // 1 month
  new CountdownTimer('timer6', 365 * 24 * 60 * 60);       // 1 year
  