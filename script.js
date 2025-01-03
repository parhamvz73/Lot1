// Global array to store combinations shared across all timers
let globalCombinations = [];
let selectedCombination = {}; // Track selected combination per dropdown


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

        // Automated participation variables
        this.autoParticipationEnabled = false; // Tracks if automated participation is enabled
        this.autoParticipationCombination = null; // Stores combination for automated participation

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
            <!-- Combination Labels -->
            <div class="combination-labels" id="${containerId}-labels"></div>
            <!-- Divider -->
            <div class="divider"></div>
            <!-- Row: Pick Your 3 Numbers and Dropdown -->
            <div class="pick-numbers-container">
                <!-- Left: Pick Your 3 Numbers -->
                <div class="pick-numbers">Pick Your 3 Numbers</div>
                <!-- Right: Dropdown for Stored Combinations -->
                <div class="stored-combinations">
                    <select id="${containerId}-combinations">
                        <option value="none">Stored Combinations</option>
                    </select>
                    <!-- Remove Link -->
                    <div class="remove-link" id="${containerId}-remove-link" style="display: none;">
                        <img src="assets/bin.svg" alt="Remove" class="remove-icon" />
                        <span>Remove this combination</span>
                    </div>
                    <!-- Automated Participation Link -->
                    <div class="auto-participation-link" id="${containerId}-auto-participation" style="display: none; color: yellow; cursor: pointer;">
                        Automated Participation
                    </div>
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
      this.removeLink = document.getElementById(`${containerId}-remove-link`);
      this.autoParticipationLink = document.getElementById(`${containerId}-auto-participation`);
      this.ticketsInput = document.getElementById(`${containerId}-tickets`);
      this.labelsContainer = document.getElementById(`${containerId}-labels`);

        // Populate dropdown initially with global combinations
        this.updateAllDropdowns();
      // Start the countdown
      this.startCountdown();
       // Join Pool Button
       const joinButton = document.getElementById(`${containerId}-join-pool`);
       joinButton.addEventListener('click', () => this.showCombinationLabel());
      // Add event listener for store button
      this.storeButton.addEventListener('click', () => this.storeCombination());

      // Dropdown change
      this.dropdown.addEventListener('change', () => {
        const selected = this.dropdown.value;
        if (selected !== "none") {
            this.applyStoredCombination(selected); // Apply the combination
            this.removeLink.style.display = 'flex';
            this.autoParticipationLink.style.display = 'block'; // Show auto participation link
            selectedCombination[containerId] = selected;

            // Add click event to remove the combination
            this.removeLink.addEventListener('click', () => this.removeCombination(containerId));
        } else {
            this.removeLink.style.display = 'none';
            this.autoParticipationLink.style.display = 'none';
        }
    });

    // Auto participation click event
    this.autoParticipationLink.addEventListener('click', () => this.toggleAutoParticipation());
}
  applyStoredCombination(combination) {
    // Extract numbers and ticket count
    const [numbers, tickets] = combination.split(' - ');
    const selectedNumbers = numbers.split(',').map(Number); // Convert numbers to integers
    const ticketCount = parseInt(tickets); // Extract ticket count

    // Clear existing selections
    this.selectedNumbers = [];

    // Update number buttons
    const buttons = this.container.querySelectorAll('.number-button');
    buttons.forEach(button => {
        const number = parseInt(button.textContent); // Get button number

        // Highlight selected numbers
        if (selectedNumbers.includes(number)) {
            button.classList.add('selected');
            if (!this.selectedNumbers.includes(number)) {
                this.selectedNumbers.push(number); // Add to selected numbers
            }
        } else {
            button.classList.remove('selected');
        }
    });

    // Update ticket count
    this.ticketsInput.value = ticketCount;

    // Display tickets container
    const ticketsContainer = document.getElementById(`${this.container.id}-tickets-container`);
    ticketsContainer.style.display = 'flex';

    // Update join pool button text
    const joinButton = document.getElementById(`${this.container.id}-join-pool`);
    joinButton.textContent = `Join Pool with ${ticketCount} USD`;
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
// Toggle automated participation
toggleAutoParticipation() {
    if (this.dropdown.value === "none") {
        alert("Please select a combination first!");
        return;
    }

    this.autoParticipationEnabled = !this.autoParticipationEnabled; // Toggle state

    if (this.autoParticipationEnabled) {
        this.autoParticipationCombination = this.dropdown.value; // Store combination
        this.autoParticipationLink.style.color = 'green';
        this.autoParticipationLink.textContent = 'Automated Participation (Enabled)';
    } else {
        this.autoParticipationCombination = null;
        this.autoParticipationLink.style.color = 'yellow';
        this.autoParticipationLink.textContent = 'Automated Participation';
    }
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
                this.clearLabels(); // Clear combination labels

                setTimeout(() => {
                    this.timeLeft = this.totalTime;
                    this.progressBar.style.width = '0%';
                    this.countdownElement.textContent = this.formatTime(this.timeLeft);

                    // Apply automated participation
                    if (this.autoParticipationEnabled && this.autoParticipationCombination) {
                        this.applyStoredCombination(this.autoParticipationCombination);
                        this.showCombinationLabel();
                    }

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

    // Display combination label
    showCombinationLabel() {
        if (this.selectedNumbers.length === 3) {
            const combination = this.selectedNumbers.sort((a, b) => a - b).join(',');

            // Create a label
            const label = document.createElement('div');
            label.classList.add('combination-label');
            label.textContent = combination;

            // Append to labels container
            this.labelsContainer.appendChild(label);
        } else {
            alert('Select 3 numbers first!');
        }
    }

    // Clear combination labels when timer resets
    clearLabels() {
        this.labelsContainer.innerHTML = ''; // Remove all labels
    }

    // Store combinations globally
    storeCombination() {
        const totalTickets = parseInt(this.ticketsInput.value);
        const combination = `${this.selectedNumbers.sort((a, b) => a - b).join(',')} - ${totalTickets} USD`;
        if (!globalCombinations.includes(combination)) {
            globalCombinations.push(combination);
            this.updateAllDropdowns();
        } else {
            alert('This combination already exists!');
        }
    }

    updateAllDropdowns() {
        const dropdowns = document.querySelectorAll('[id$="-combinations"]');
        dropdowns.forEach(dropdown => {
            dropdown.innerHTML = '<option value="none">Stored Combinations</option>';
            globalCombinations.forEach(combination => {
                const option = document.createElement('option');
                option.value = combination;
                option.textContent = combination;
                dropdown.appendChild(option);
            });
        });
    }

    removeCombination(containerId) {
        const selected = selectedCombination[containerId];
        if (selected) {
            globalCombinations = globalCombinations.filter(combo => combo !== selected);
            this.updateAllDropdowns();
            this.removeLink.style.display = 'none';
        }
    }

    storeCombination() {
        const totalTickets = parseInt(this.ticketsInput.value);
        const combination = `${this.selectedNumbers.sort((a, b) => a - b).join(',')} - ${totalTickets} USD`;
        if (!globalCombinations.includes(combination)) {
            globalCombinations.push(combination);
            this.updateAllDropdowns();
        } else {
            alert('This combination already exists!');
        }
    }
}

// Create all timers
new CountdownTimer('timer1', 60, '1 Minute');
new CountdownTimer('timer2', 3600, '1 Hour');
new CountdownTimer('timer3', 86400, '1 Day');
new CountdownTimer('timer4', 604800, '1 Week');
new CountdownTimer('timer5', 2592000, '1 Month');
new CountdownTimer('timer6', 31536000, '1 Year');
