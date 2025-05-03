const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAX_COMMITS = 20;
const MIN_COMMITS = 5;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeDummyChange(commitNumber) {
  const filePath = path.join(__dirname, 'dummy.txt');
  const content = `Commit ${commitNumber} at ${new Date().toISOString()}\n`;
  fs.appendFileSync(filePath, content);
}

function makeCommit(commitNumber) {
  makeDummyChange(commitNumber);
  execSync('git add .');
  execSync(`git commit -m "Auto commit ${commitNumber}"`);
  execSync('git push');
  console.log(`Committed ${commitNumber}`);
}

async function scheduleCommits() {
  const totalCommits = getRandomInt(MIN_COMMITS, MAX_COMMITS);
  console.log(`Scheduling ${totalCommits} commits today...`);

  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const msUntilEndOfDay = endOfDay - now;
  const interval = msUntilEndOfDay / totalCommits;

  for (let i = 0; i < totalCommits; i++) {
    setTimeout(() => {
      try {
        makeCommit(i + 1);
      } catch (err) {
        console.error('Commit failed:', err);
      }
    }, i * interval);
  }
}

const msInDay = 24 * 60 * 60 * 1000;
scheduleCommits();
setInterval(scheduleCommits, msInDay);