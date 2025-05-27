// Sky Jumper - scores.js
// Displays recent and top scores from localStorage

const recentScore = localStorage.getItem('skyjumper_score') || 0;
const topScoresKey = 'skyjumper_top_scores';

// Get or initialize top scores
let topScores = JSON.parse(localStorage.getItem(topScoresKey)) || [];

// Add recent score to top scores and sort
topScores.push(Number(recentScore));
topScores.sort((a, b) => b - a);
topScores = topScores.slice(0, 5); // Keep top 5

// Save updated top scores
localStorage.setItem(topScoresKey, JSON.stringify(topScores));

// Display recent score
document.getElementById('recent-score').textContent = recentScore;

// Display top 5 scores
const topScoresList = document.getElementById('top-scores');
topScores.forEach(score => {
  const li = document.createElement('li');
  li.textContent = score;
  topScoresList.appendChild(li);
});
