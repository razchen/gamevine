const canvas = document.getElementById('game');
const statusLabel = document.getElementById('status-label');

if (!(canvas instanceof HTMLCanvasElement) || !(statusLabel instanceof HTMLElement)) {
  throw new Error('Arcade canvas template failed to initialize');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('2D canvas context is unavailable');
}

const messageLines = [
  'Gamevine POC starter',
  'The generation flow should replace this with Breakout.',
  'The feature-update flow should patch the generated game.',
];

function drawTemplateState() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#020617');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  context.lineWidth = 2;
  context.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  context.fillStyle = '#38bdf8';
  context.font = 'bold 38px sans-serif';
  context.fillText('Arcade Canvas Starter', 48, 96);

  context.fillStyle = '#e2e8f0';
  context.font = '22px sans-serif';
  messageLines.forEach((line, index) => {
    context.fillText(line, 48, 160 + index * 36);
  });

  context.fillStyle = '#94a3b8';
  context.font = '18px sans-serif';
  context.fillText('Editable files: index.html, main.js, styles.css', 48, canvas.height - 64);
}

statusLabel.textContent = 'Starter loaded. Awaiting AI generation.';
drawTemplateState();
