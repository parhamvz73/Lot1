class CountdownTimer {
    constructor(containerId, duration, label) {
      // Select container and set timer properties
      this.container = document.getElementById(containerId);
      this.duration = duration; // Countdown duration in seconds
      this.timeLeft = duration; // Remaining time
      this.totalTime = duration; // Total time for progress calculation
      this.label = label; // Label for Pool unique ID
      this.instanceCount = 0; // Start instance count at 0
  
      // Create HTML structure inside the container
      this.container.innerHTML = `
        <!-- Pool unique ID -->
        <div class="pool-id" id="${containerId}-pool-id">${this.getPoolId()}</div>
        <!-- Participants -->
        <div class="participants" id="${containerId}-participants">Participants: 0</div>
        <!-- Countdown Timer -->
        <div class="countdown" id="${containerId}-countdown">00:00:00:00</div>
        <!-- Pool Prize -->
        <div class="pool-prize" id="${containerId}-pool-prize">Pool Prize 0</div>
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar" id="${containerId}-progress"></div>
        </div>
        <!-- Divider -->
        <div class="divider"></div>
        <!-- Headline -->
        <div class="pick-numbers">Pick Your 3 Numbers</div>
        <!-- Number Buttons -->
        <div class="number-buttons" id="${containerId}-buttons"></div>
        <!-- Input and Button -->
        <div class="tickets-container" id="${containerId}-tickets-container" style="display: none;">
          <label for="${containerId}-tickets">Total Tickets:</label>
          <input type="number" id="${containerId}-tickets" value="1" min="1" />
          <button class="btn-primary" id="${containerId}-join-pool">Join Pool with 1 USD</button>
        </div>
      `;
  
      // Generate number buttons dynamically
      this.generateNumberButtons(containerId);
  
      // Select countdown and progress bar elements
      this.countdownElement = document.getElementById(`${containerId}-countdown`);
      this.progressBar = document.getElementById(`${containerId}-progress`);
      this.poolIdElement = document.getElementById(`${containerId}-pool-id`);
  
      // Start the countdown
      this.startCountdown();
    }
  
    /**
     * Generate the Pool unique ID text
     */
    getPoolId() {
      return `Pool unique ID: ${this.label} #${this.instanceCount}`;
    }
  
    /**
     * Format the remaining time as days:hours:minutes:seconds
     */
    formatTime(seconds) {
      const days = Math.floor(seconds / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const secs = seconds % 60;
  
      return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  
    /**
     * Start the countdown and reset when it reaches 0
     */
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
  
          // Increment instance count for the new loop
          this.instanceCount++;
          this.poolIdElement.textContent = this.getPoolId(); // Update Pool ID
  
          setTimeout(() => {
            this.timeLeft = this.totalTime;
            this.progressBar.style.width = '0%';
            this.countdownElement.textContent = this.formatTime(this.timeLeft);
            this.startCountdown(); // Restart countdown
          }, 1000); // 1-second pause before restarting
        }
      }, 1000); // Update every 1 second
    }
  
    /**
     * Generate 60 circular number buttons dynamically
     */
    generateNumberButtons(containerId) {
      const buttonsContainer = document.getElementById(`${containerId}-buttons`);
      const ticketsContainer = document.getElementById(`${containerId}-tickets-container`);
      const ticketsInput = document.getElementById(`${containerId}-tickets`);
      const joinButton = document.getElementById(`${containerId}-join-pool`);
      const selectedNumbers = []; // Store selected numbers
  
      for (let i = 1; i <= 60; i++) {
        const button = document.createElement('button');
        button.classList.add('number-button');
        button.textContent = i;
  
        // Event listener for button selection
        button.addEventListener('click', () => {
          if (button.classList.contains('selected')) {
            button.classList.remove('selected');
            selectedNumbers.splice(selectedNumbers.indexOf(i), 1);
          } else if (selectedNumbers.length < 3) {
            button.classList.add('selected');
            selectedNumbers.push(i);
          }
  
          // Show input and button if 3 numbers are selected
          ticketsContainer.style.display = selectedNumbers.length === 3 ? 'flex' : 'none';
          joinButton.textContent = `Join Pool with 1 USD`;
        });
  
        buttonsContainer.appendChild(button);
      }
  
      ticketsInput.addEventListener('input', () => {
        let value = parseInt(ticketsInput.value);
        joinButton.textContent = `Join Pool with ${value} USD`;
      });
    }
  }
  
  // Create instances
  new CountdownTimer('timer1', 60, '1 Minute');
  new CountdownTimer('timer2', 60 * 60, '1 Hour');
  
new CountdownTimer('timer3', 24 * 60 * 60, '1 Day');    // Timer 3: 1 day
  new CountdownTimer('timer4', 7 * 24 * 60 * 60, '1 Week');         // 1 week
  new CountdownTimer('timer5', 30 * 24 * 60 * 60, '1 Month');        // 1 month
  new CountdownTimer('timer6', 365 * 24 * 60 * 60, '1 Year');       // 1 year