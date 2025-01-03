// Countdown Timer Class
class CountdownTimer {
    /**
     * Constructor to initialize the countdown timer
     * @param {string} containerId - The ID of the countdown-wrapper container
     * @param {number} duration - The countdown duration in seconds
     */
    constructor(containerId, duration) {
      // Get the container element where the timer will be displayed
      this.container = document.getElementById(containerId);
  
      // Set the duration and remaining time for the countdown
      this.duration = duration; // Total countdown duration
      this.timeLeft = duration; // Remaining time
      this.totalTime = duration; // Store total time for progress bar calculation
  
      // Dynamically create HTML structure inside the container
      this.container.innerHTML = `
        <!-- Top-left: Participants text -->
        <div class="participants" id="${containerId}-participants">Participants: 0</div>
  
        <!-- Top-right: Countdown timer -->
        <div class="countdown" id="${containerId}-countdown">00:00:00:00</div>
  
        <!-- Centered: Pool prize display -->
        <div class="pool-prize" id="${containerId}-pool-prize">Pool Prize 0</div>
  
        <!-- Progress bar container -->
        <div class="progress-container">
          <div class="progress-bar" id="${containerId}-progress"></div>
        </div>
  
        <!-- Divider line -->
        <div class="divider"></div>
  
        <!-- Headline under divider -->
        <div class="pick-numbers">Pick Your 3 Numbers</div>
      `;
  
      // Select key elements for updating later
      this.countdownElement = document.getElementById(`${containerId}-countdown`);
      this.progressBar = document.getElementById(`${containerId}-progress`);
  
      // Start the countdown when the component is initialized
      this.startCountdown();
    }
  
    /**
     * Format the remaining time into days, hours, minutes, and seconds
     * @param {number} seconds - The total remaining time in seconds
     * @returns {string} - Formatted time string as days:hours:minutes:seconds
     */
    formatTime(seconds) {
      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(seconds / (24 * 60 * 60)); // Days
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)); // Hours
      const minutes = Math.floor((seconds % (60 * 60)) / 60); // Minutes
      const secs = seconds % 60; // Seconds
  
      // Format numbers to always have 2 digits
      return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  
    /**
     * Start the countdown and update the display and progress bar every second
     */
    startCountdown() {
      // Use setInterval to decrease the timer every 1 second
      const interval = setInterval(() => {
        // Decrease the remaining time by 1 second
        this.timeLeft--;
  
        // Update the countdown display
        this.countdownElement.textContent = this.formatTime(this.timeLeft);
  
        // Update the progress bar based on remaining time
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        this.progressBar.style.width = `${progress}%`;
  
        // Check if the countdown has reached 0
        if (this.timeLeft <= 0) {
          // Stop the interval when time runs out
          clearInterval(interval);
  
          // Wait 1 second before resetting the timer
          setTimeout(() => {
            // Reset time and progress bar for the next cycle
            this.timeLeft = this.totalTime;
            this.progressBar.style.width = '0%';
  
            // Reset the countdown display
            this.countdownElement.textContent = this.formatTime(this.timeLeft);
  
            // Restart the countdown
            this.startCountdown(); // Recursive call to start again
          }, 1000); // 1-second pause before restart
        }
      }, 1000); // Update every 1 second
    }
  }
  
  // Create instances of CountdownTimer for each timer with different durations
  new CountdownTimer('timer1', 60);                       // Timer 1: 1 minute
  new CountdownTimer('timer2', 60 * 60);                  // Timer 2: 1 hour
  new CountdownTimer('timer3', 24 * 60 * 60);             // Timer 3: 1 day
  new CountdownTimer('timer4', 7 * 24 * 60 * 60);         // Timer 4: 1 week
  new CountdownTimer('timer5', 30 * 24 * 60 * 60);        // Timer 5: 1 month (approx)
  new CountdownTimer('timer6', 365 * 24 * 60 * 60);       // Timer 6: 1 year
  