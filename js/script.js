let numberToGuess;
let attempts;
let guessList = [];
let timerInterval;
let timeLeft;
const leaderboard = [];
let playerName = '';

function setDifficulty() {
    const difficulty = document.getElementById('difficultySelect').value;
    switch (difficulty) {
        case 'easy':
            numberToGuess = Math.floor(Math.random() * 50) + 1;
            attempts = 10;
            timeLeft = 60; // 1 minute for easy
            break;
        case 'medium':
            numberToGuess = Math.floor(Math.random() * 100) + 1;
            attempts = 7;
            timeLeft = 45; // 45 seconds for medium
            break;
        case 'hard':
            numberToGuess = Math.floor(Math.random() * 200) + 1;
            attempts = 5;
            timeLeft = 30; // 30 seconds for hard
            break;
    }
    resetGame();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = (attempts === 10) ? 60 : (attempts === 7) ? 45 : 30; // Adjust timer based on difficulty
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('message').innerText = `Time's up! The number was ${numberToGuess}.`;
            document.getElementById('attemptsRemaining').innerText = '';
        }
    }, 1000);
}

function checkGuess() {
    const guess = parseInt(document.getElementById('guessInput').value);
    playerName = document.getElementById('playerName').value || 'Player';
    
    if (isNaN(guess) || guess < 1 || guess > 200) {
        document.getElementById('message').innerText = "Please enter a valid number!";
        return;
    }

    guessList.push(guess);
    document.getElementById('guessList').innerHTML += `<li>${guess}</li>`;
    document.getElementById('lastGuess').innerText = `Last Guess: ${guess}`;
    attempts--;

    if (guess === numberToGuess) {
        clearInterval(timerInterval);
        document.getElementById('message').innerText = "Congratulations! You guessed the number!";
        document.getElementById('correctSound').play();
        updateLeaderboard(guessList.length);
        document.getElementById('attemptsRemaining').innerText = '';
    } else if (attempts === 0) {
        clearInterval(timerInterval);
        document.getElementById('message').innerText = `Game Over! The number was ${numberToGuess}.`;
        document.getElementById('incorrectSound').play();
    } else {
        document.getElementById('message').innerText = guess < numberToGuess ? "Too low!" : "Too high!";
        document.getElementById('attemptsRemaining').innerText = `Attempts remaining: ${attempts}`;
        
        // Provide hints after certain attempts
        if (guessList.length === 3) {
            document.getElementById('message').innerText += " Hint: The number is " + (numberToGuess % 2 === 0 ? "even." : "odd.");
        }
        if (guessList.length === 5) {
            document.getElementById('message').innerText += ` Hint: The number is between ${numberToGuess - 10} and ${numberToGuess + 10}.`;
        }
    }
}

function resetGame() {
    document.getElementById('guessInput').value = '';
    document.getElementById('guessList').innerHTML = '';
    document.getElementById('message').innerText = '';
    document.getElementById('attemptsRemaining').innerText = '';
    document.getElementById('lastGuess').innerText = '';
    document.getElementById('timer').innerText = '';
    guessList = [];
    setDifficulty();
    startTimer();
    changeBackgroundColor();
}

function updateLeaderboard(attemptsUsed) {
    leaderboard.push({ name: playerName, attempts: attemptsUsed });
    leaderboard.sort((a, b) => a.attempts - b.attempts);
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.name}: ${entry.attempts} attempts`;
        leaderboardList.appendChild(li);
    });
}

function resetLeaderboard() {
    leaderboard.length = 0; // Clear the leaderboard
    document.getElementById('leaderboard').innerHTML = ''; // Clear displayed leaderboard
}

function changeBackgroundColor() {
    const colors = ['#f4f4f4', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6'];
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}

// Initialize the game on page load
window.onload = function() {
    setDifficulty();
    changeBackgroundColor();
};