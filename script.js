// Global array to store combinations shared across all timers
let globalCombinations = [];

class CountdownTimer {
    constructor(containerId, duration, label) {
      // Select container and set timer properties
      this.container = document.getElementById(containerId);
      this.duration = duration; // Countdown duration in seconds
      this.timeLeft = duration; // Remaining time
      this.totalTime = duration; // Total time for progress calculation
      this.label = label; // Label for Pool unique ID
      this.instanceCount = 0; // Start instance count at 0
      this.selectedNumbers = []; // Store selected numbers

      // Create HTML structure inside the container
      this.container.innerHTML = `
  <!-- Pool Unique ID -->
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
  <!-- Row: Pick Your 3 Numbers and Dropdown -->
  <div class="pick-numbers-container">
    <!-- Left: Pick Your 3 Numbers -->
    <div class="pick-numbers">Pick Your 3 Numbers</div>
    <!-- Right: Dropdown for Stored Combinations -->
    <div class="stored-combinations">
      <label for="${containerId}-combinations">Stored Combinations:</label>
      <select id="${containerId}-combinations">
        <option value="none">Select</option>
      </select>
    </div>
  </div>
  <!-- Number Buttons -->
  <div class="number-buttons" id="${containerId}-buttons"></div>
  <!-- Input and Buttons -->
  <div class="tickets-container" id="${containerId}-tickets-container" style="display: none;">
    <!-- Store Combination Button -->
    <button class="btn-secondary" id="${containerId}-store-combination">Store Combination</button>
    <label for="${containerId}-tickets">Total Tickets:</label>
    <input type="number" id="${containerId}-tickets" value="1" min="1" />
    <button class="btn-primary" id="${containerId}-join-pool">Join Pool with 1 USD</button>
  </div>
`;

      // Generate number buttons dynamically
      this.generateNumberButtons(containerId);

      // Select elements
      this.countdownElement = document.getElementById(`${containerId}-countdown`);
      this.progressBar = document.getElementById(`${containerId}-progress`);
      this.poolIdElement = document.getElementById(`${containerId}-pool-id`);
      this.storeButton = document.getElementById(`${containerId}-store-combination`);
      this.dropdown = document.getElementById(`${containerId}-combinations`);
      this.ticketsInput = document.getElementById(`${containerId}-tickets`);

      // Populate dropdown initially with global combinations
      this.updateAllDropdowns(); // <-- FIX to initialize dropdowns globally

      // Start the countdown
      this.startCountdown();

      // Add event listener for store button
      this.storeButton.addEventListener('click', () => this.storeCombination());
    }

    getPoolId() {
      return `Pool unique ID: ${this.label} #${this.instanceCount}`;
    }

    formatTime(seconds) {
      const days = Math.floor(seconds / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const secs = seconds % 60;
      return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    startCountdown() {
      const interval = setInterval(() => {
        this.timeLeft--;
        this.countdownElement.textContent = this.formatTime(this.timeLeft);
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        this.progressBar.style.width = `${progress}%`;

        if (this.timeLeft <= 0) {
          clearInterval(interval);
          this.instanceCount++;
          this.poolIdElement.textContent = this.getPoolId();
          setTimeout(() => {
            this.timeLeft = this.totalTime;
            this.progressBar.style.width = '0%';
            this.countdownElement.textContent = this.formatTime(this.timeLeft);
            this.startCountdown();
          }, 1000);
        }
      }, 1000);
    }

    generateNumberButtons(containerId) {
      const buttonsContainer = document.getElementById(`${containerId}-buttons`);
      const ticketsContainer = document.getElementById(`${containerId}-tickets-container`);
      const joinButton = document.getElementById(`${containerId}-join-pool`);
      this.selectedNumbers = [];

      for (let i = 1; i <= 60; i++) {
        const button = document.createElement('button');
        button.classList.add('number-button');
        button.textContent = i;

        button.addEventListener('click', () => {
          if (button.classList.contains('selected')) {
            button.classList.remove('selected');
            this.selectedNumbers.splice(this.selectedNumbers.indexOf(i), 1);
          } else if (this.selectedNumbers.length < 3) {
            button.classList.add('selected');
            this.selectedNumbers.push(i);
          }

          ticketsContainer.style.display = this.selectedNumbers.length === 3 ? 'flex' : 'none';
          joinButton.textContent = `Join Pool with 1 USD`;
        });

        buttonsContainer.appendChild(button);
      }
    }

    storeCombination() {
      if (this.selectedNumbers.length === 3) {
        const totalTickets = parseInt(this.ticketsInput.value);
        const combination = `${this.selectedNumbers.sort((a, b) => a - b).join(',')} - ${totalTickets} USD`;

        if (!globalCombinations.includes(combination)) {
          globalCombinations.push(combination);
          this.updateAllDropdowns();
        } else {
          alert('This combination already exists!');
        }
      } else {
        alert('Please select 3 numbers first!');
      }
    }

    updateAllDropdowns() {
      const dropdowns = document.querySelectorAll('[id$="-combinations"]');
      dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="none">Select</option>';
        globalCombinations.forEach(combination => {
          const option = document.createElement('option');
          option.value = combination;
          option.textContent = combination;
          dropdown.appendChild(option);
        });
      });
    }
}

// Create all timers
new CountdownTimer('timer1', 60, '1 Minute');
new CountdownTimer('timer2', 3600, '1 Hour');
new CountdownTimer('timer3', 86400, '1 Day');
new CountdownTimer('timer4', 604800, '1 Week');
new CountdownTimer('timer5', 2592000, '1 Month');
new CountdownTimer('timer6', 31536000, '1 Year');
