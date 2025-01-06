// Global array to store combinations shared across all timers
let globalCombinations = [];
let selectedCombination = {}; // Track selected combination per dropdown
let userBalance = 100; // Starting balance

// Update balance display
function updateBalanceDisplay() {
    const balanceText = document.querySelector('.balance-text');
    balanceText.textContent = `Your Balance: ${userBalance} USDT`;
}

// Call this initially to display the balance
updateBalanceDisplay();


class CountdownTimer {
    constructor(containerId, duration, label) {
        // Select container and set timer properties
        this.container = document.getElementById(containerId);
        this.duration = duration; // Countdown duration in seconds
        this.timeLeft = duration; // Remaining time
        this.totalTime = duration; // Total time for progress calculation
        this.label = label; // Label for Pool unique ID
        this.instanceCount = 0; // Start instance count at 0
        this.participantsCount = 0; // Tracks participants for each pool
        this.selectedNumbers = []; // Store selected numbers
        this.prizePoolAmount = 0; // Track prize pool amount


        // Automated participation variables
        this.autoParticipationEnabled = false; // Tracks if automated participation is enabled
        this.autoParticipationCombination = null; // Stores combination for automated participation

        // Create HTML structure inside the container
        this.container.querySelector('.dynamic-content').innerHTML = `
            <!-- Pool Unique ID -->
            <div class="pool-id" id="${containerId}-pool-id">${this.getPoolId()}</div>
            <!-- Participants -->
            <div class="participants">
            <img src="assets/users.svg" alt="Users" class="users-icon" />
            <span id="${containerId}-participants-text">Participants: 0</span>
            </div>
            </div>
            <!-- Countdown Timer -->
            <div class="countdown">
            <img src="assets/timer.svg" alt="Timer" class="timer-icon" />
            <span id="${containerId}-countdown-text">00:00:00:00</span>
            </div>
            <!-- Pool Prize -->
            <div class="pool-prize" id="${containerId}-pool-prize">Pool Prize 0</div>
            <!-- Draw History Section -->
<div class="draw-history-section">
    <!-- Headline -->
    <div class="draw-history-title">Previous Drawn Numbers</div>
    <!-- Tertiary Button at the Right -->
    <button class="btn-tertiary">
        <img src="assets/history.svg" alt="History" class="history-icon" />
        See History
    </button>
</div>
<!-- Draw History Container -->
<div class="draw-history" id="${containerId}-draw-history"></div>

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
                <button class="btn-primary" id="${containerId}-join-pool">Join Pool with 1 USDT</button>
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
       const ticketsInput = document.getElementById(`${containerId}-tickets`);

       // Update button text dynamically based on input field value
ticketsInput.addEventListener('input', () => {
    const value = parseInt(ticketsInput.value) || 1; // Default to 1 if empty or invalid
    joinButton.textContent = `Join Pool with ${value} USDT`;
});

       joinButton.addEventListener('click', () => {
        const amount = parseInt(this.ticketsInput.value); // Get the entered amount
        if (amount > 0 && userBalance >= amount) {
            this.updatePrizePool(amount); // Add to prize pool
            this.showCombinationLabel(); // Show the combination label
            // Deduct the amount from the balance
        userBalance -= amount;
        updateBalanceDisplay(); // Update balance in the header
        // **Increment Participants Count**
        this.participantsCount++;
        this.updateParticipantsDisplay(); // Update the UI
    } else if (userBalance < amount) {
        alert('Insufficient balance to join the pool!');
    } else {
        alert('Enter a valid ticket amount!');
    }
    });
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
    joinButton.textContent = `Join Pool with ${ticketCount} USDT`;
}

    getPoolId() {
      return `Pool unique ID: ${this.label}${this.instanceCount}`;
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
            const timerText = document.getElementById(`${this.container.id}-countdown-text`);
            timerText.textContent = this.formatTime(this.timeLeft);
            const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
            this.progressBar.style.width = `${progress}%`;

            if (this.timeLeft <= 0) {
                clearInterval(interval);
                this.instanceCount++;
                this.poolIdElement.textContent = this.getPoolId();
                // **RESET Participants Count**
                this.participantsCount = 0; // Reset to 0
this.updateParticipantsDisplay(false); // Pass 'false' to skip animation during reset

                this.clearLabels(); // Clear combination labels
            
                // Reset the prize pool to 0
                this.prizePoolAmount = 0;
                const prizeElement = document.getElementById(`${this.container.id}-pool-prize`);
                prizeElement.textContent = `Pool Prize 0 USDT`;
                // **Draw Random Numbers and Display Them**
    const drawnNumbers = this.generateRandomNumbers(); // Generate 3 numbers
    this.displayDrawnNumbers(drawnNumbers); // Show numbers in UI

    
                setTimeout(() => {
                    this.timeLeft = this.totalTime;
this.progressBar.style.width = '0%';
const timerText = document.getElementById(`${this.container.id}-countdown-text`);
timerText.textContent = this.formatTime(this.timeLeft);
                    // Apply automated participation
if (this.autoParticipationEnabled && this.autoParticipationCombination) {
    this.applyStoredCombination(this.autoParticipationCombination);

    // Extract numbers and tickets from the stored combination
    const [numbers, tickets] = this.autoParticipationCombination.split(' - ');
    const ticketCount = parseInt(tickets);
    
    // Check if user has enough balance
    if (userBalance >= ticketCount) {
        // Deduct balance for automated participation
        userBalance -= ticketCount;
        updateBalanceDisplay(); // Update balance display

        // Update prize pool dynamically
        this.updatePrizePool(ticketCount);
        this.showCombinationLabel(); // Show label
        // **Increment Participants Count for Automated Participation**
        this.participantsCount++;
        this.updateParticipantsDisplay(); // Update UI
    } else {
        // If balance is not enough, disable automated participation
        alert('Insufficient balance for automated participation! Disabling it.');
        this.autoParticipationEnabled = false; // Disable auto participation
        this.autoParticipationLink.style.color = 'yellow';
        this.autoParticipationLink.textContent = 'Automated Participation';
    }
}

            
                    // Restart the countdown immediately
this.startCountdown(); // Restart the interval loop
                }, 1000);
            }
            
        }, 1000);
    }
     // Update the prize pool amount dynamically
updatePrizePool(amount) {
    // Add the entered amount to the prize pool
    this.prizePoolAmount += amount;

    // Update the pool prize display
    const prizeElement = document.getElementById(`${this.container.id}-pool-prize`);
    prizeElement.textContent = `Pool Prize ${this.prizePoolAmount} USDT`;
// Add the highlight class for animation
prizeElement.classList.add('highlight');

// Remove the highlight class after 500ms (match animation duration)
setTimeout(() => {
    prizeElement.classList.remove('highlight');
}, 500);
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

// Maintain input value or default to 1
const ticketCount = parseInt(this.ticketsInput.value) || 1;

// Update button dynamically based on input value
joinButton.textContent = `Join Pool with ${ticketCount} USD`;

        });

        buttonsContainer.appendChild(button);
      }
    }

    // Display combination label with Ticket Icon
showCombinationLabel() {
    if (this.selectedNumbers.length === 3) {
        const combination = this.selectedNumbers.sort((a, b) => a - b).join(',');

        // Create a container for the label
        const label = document.createElement('div');
        label.classList.add('combination-label'); // Apply the CSS for labels

        // Create the ticket icon
        const icon = document.createElement('img');
        icon.src = 'assets/ticket.svg'; // Path to the ticket icon
        icon.alt = 'Ticket';
        icon.classList.add('ticket-icon'); // Apply the CSS for the ticket icon

        // Create text for the numbers
        const text = document.createElement('span');
        text.textContent = combination; // Display numbers

        // Append the icon and text inside the label
        label.appendChild(icon);
        label.appendChild(text);

        // Append the label to the labels container
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
        const combination = `${this.selectedNumbers.sort((a, b) => a - b).join(',')} - ${totalTickets} USDT`;
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
        const combination = `${this.selectedNumbers.sort((a, b) => a - b).join(',')} - ${totalTickets} USDT`;
        if (!globalCombinations.includes(combination)) {
            globalCombinations.push(combination);
            this.updateAllDropdowns();
        } else {
            alert('This combination already exists!');
        }
    }
    // Generate 3 unique random numbers between 1 and 60
generateRandomNumbers() {
    const numbers = [];
    while (numbers.length < 3) {
        const num = Math.floor(Math.random() * 60) + 1; // Random number between 1–60
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers.sort((a, b) => a - b); // Sort in ascending order
}
// Display the drawn numbers in a gray box at the top
displayDrawnNumbers(numbers) {
    const drawHistory = document.getElementById(`${this.container.id}-draw-history`);

    // Create a container for the icon and numbers
    const drawBox = document.createElement('div');
    drawBox.classList.add('draw-box');

    // Add the dice icon
    const icon = document.createElement('img');
    icon.src = 'assets/dice.svg'; // Path to the dice icon
    icon.alt = 'Dice';
    icon.classList.add('dice-icon'); // Apply the CSS for the dice icon

    // Create a span for the drawn numbers
    const numbersText = document.createElement('span');
    numbersText.textContent = numbers.join(", "); // Show numbers sorted

    // Append the icon and numbers to the drawBox
    drawBox.appendChild(icon);
    drawBox.appendChild(numbersText);

    // Add the new draw box to the history (prepend to show newest first)
    drawHistory.prepend(drawBox);
}

updateParticipantsDisplay(applyAnimation = true) {
    const participantsText = document.getElementById(`${this.container.id}-participants-text`);
    participantsText.textContent = `Participants: ${this.participantsCount}`;

    // Apply animation only if the flag is true
    if (applyAnimation) {
        participantsText.classList.add('highlight');

        // Remove the highlight class after 500ms (match animation duration)
        setTimeout(() => {
            participantsText.classList.remove('highlight');
        }, 500);
    }
}
}

// Create all timers
new CountdownTimer('timer1', 60, '1', 10);         // Starts at #10
new CountdownTimer('timer2', 3600, '60', 600);     // Starts at #600
new CountdownTimer('timer3', 86400, '24', 240);    // Starts at #240
new CountdownTimer('timer4', 604800, '7', 70);     // Starts at #70
new CountdownTimer('timer5', 2592000, '30', 300);  // Starts at #300
new CountdownTimer('timer6', 31536000, '12', 120); // Starts at #120
// Modal Elements
const modal = document.getElementById('wallet-modal'); // Modal
const closeModal = document.querySelector('.close-btn'); // Close Button
const phantomBtn = document.getElementById('phantom-wallet-btn'); // Phantom Wallet Button
// Select the close button with the new close icon
const closeModalBtn = document.getElementById('close-modal-btn');

// Close modal when clicking the close icon
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal
});

// Create Login and Signup Buttons Dynamically
const loginBtn = document.createElement('button');
loginBtn.textContent = 'Log In';
loginBtn.id = 'login-btn';
loginBtn.classList.add('btn');

const signupBtn = document.createElement('button');
signupBtn.textContent = 'Sign Up';
signupBtn.id = 'signup-btn';
signupBtn.classList.add('btn');

// Append Buttons to Header
const headerRight = document.querySelector('.header-right');
headerRight.appendChild(loginBtn);
headerRight.appendChild(signupBtn);

// Show Modal
function openModal() {
    modal.style.display = 'block';
}

// Hide Modal
function closeModalHandler() {
    modal.style.display = 'none';
}

// Close Modal when clicking outside the modal
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Event Listeners
loginBtn.addEventListener('click', openModal); // Open modal on Login
signupBtn.addEventListener('click', openModal); // Open modal on Signup
closeModal.addEventListener('click', closeModalHandler); // Close modal on X click

// Handle Phantom Wallet Connection (Placeholder for Integration)
phantomBtn.addEventListener('click', () => {
    alert('Phantom wallet connection will be integrated later.');
    modal.style.display = 'none'; // Close modal after selecting Phantom
});

async function connectToPhantom() {
    // Check if Phantom Wallet is installed
    if (window.solana && window.solana.isPhantom) {
        try {
            // Attempt to connect to Phantom Wallet
            const response = await window.solana.connect({ onlyIfTrusted: false });
            const walletAddress = response.publicKey.toString(); // Get connected wallet address
            
            // Alert the connected address or use it in your app
            alert(`Connected to Phantom Wallet: ${walletAddress}`);
            
            // Log the wallet address
            console.log('Connected Wallet:', walletAddress);

            // Close modal after connection
            modal.style.display = 'none';
        } catch (err) {
            console.error('Connection failed!', err);
            alert('Failed to connect to Phantom Wallet!');
        }
    } else {
        // Show alert if Phantom is not installed
        alert('Phantom Wallet not installed! Please install it from https://phantom.app/');
    }
}

// Add Phantom Wallet Event Listeners
if (window.solana && window.solana.isPhantom) {
    window.solana.on("connect", () => {
        console.log("Wallet connected!");
    });

    window.solana.on("disconnect", () => {
        console.log("Wallet disconnected!");
    });
}

// Add event listener to Phantom wallet button
phantomBtn.addEventListener('click', connectToPhantom);
