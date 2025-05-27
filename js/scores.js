// Sky Jumper - scores.js

const recentScore = localStorage.getItem('skyjumper_score') || 0;
const topScoresKey = 'skyjumper_top_scores';

// Get or initialize top scores
let topScores = JSON.parse(localStorage.getItem(topScoresKey)) || [];

// Add recent score and keep top 5
topScores.push(Number(recentScore));
topScores.sort((a, b) => b - a);
topScores = topScores.slice(0, 5);

// Save updated top scores
localStorage.setItem(topScoresKey, JSON.stringify(topScores));

// Display recent score
document.getElementById('recent-score').textContent = recentScore;

// Display top scores
const topScoresList = document.getElementById('top-scores');
topScores.forEach(score => {
  const li = document.createElement('li');
  li.textContent = score;
  topScoresList.appendChild(li);
});
function animateScore(finalScore) {
  const display = document.getElementById('recent-score');
  let current = 0;
  const duration = 1000; // total animation time in ms
  const stepTime = Math.max(Math.floor(duration / finalScore), 20);

  const counter = setInterval(() => {
    current++;
    display.textContent = current;
    if (current >= finalScore) {
      clearInterval(counter);
    }
  }, stepTime);
}

animateScore(Number(recentScore));
