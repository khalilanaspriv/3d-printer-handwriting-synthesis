const canvas = document.getElementById('hwCanvas');
const ctx = canvas.getContext('2d');
const stats = document.getElementById('stats');
const sentenceText = document.getElementById('sentenceText');

let sentences = [];
let currentIdx = 0;
let strokes = []; 
let isDrawing = false;
let lastX = 0;
let lastY = 0;

async function loadSentences() {
  try {
    const response = await fetch('assets/sentences.json');
    sentences = await response.json();
    updateUI();
  } catch (error) {
    sentenceText.innerText = "Error loading sentences file.";
  };
};

function updateUI() {
  if (sentences.length > 0) {
    sentenceText.innerText = sentences[currentIdx];
    stats.innerHTML = `(Stylus Only. Landscape Mode Locked.) <br> Sample: ${currentIdx + 1}/${sentences.length} | Pts: ${strokes.length}`;
  };
};

function resize() {
  const ratio = window.devicePixelRatio || 1;
  const container = document.getElementById('canvas-container');
  canvas.width = container.clientWidth * ratio;
  canvas.height = container.clientHeight * ratio;
  canvas.style.width = container.clientWidth + 'px';
  canvas.style.height = container.clientHeight + 'px';
  ctx.scale(ratio, ratio);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
};

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

window.addEventListener('resize', resize);
resize();
loadSentences();

canvas.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'pen') return;
  isDrawing = true;
  const coords = getCanvasCoords(e);
  lastX = coords.x;
  lastY = coords.y;
  addPoint(0, 0, 0, e.pressure);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
});

canvas.addEventListener('pointermove', (e) => {
  if (!isDrawing || e.pointerType !== 'pen') return;
  const coords = getCanvasCoords(e);
  const dx = Math.round(coords.x - lastX);
  const dy = Math.round(coords.y - lastY);
  
  addPoint(dx, dy, 0, e.pressure);
  
  ctx.lineWidth = 1 + (e.pressure * 6);
  ctx.strokeStyle = `rgb(var(--color-primary-accent))`;
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
  
  lastX = coords.x;
  lastY = coords.y;
});

canvas.addEventListener('pointerup', (e) => {
  if (!isDrawing || e.pointerType !== 'pen') return;
  isDrawing = false;
  const coords = getCanvasCoords(e);
  const dx = Math.round(coords.x - lastX);
  const dy = Math.round(coords.y - lastY);
  addPoint(dx, dy, 1, e.pressure);
});

function addPoint(dx, dy, p1, pressure) {
  if (strokes.length > 0 && dx === 0 && dy === 0 && p1 === 0) {
    const lastPoint = strokes[strokes.length - 1];
    if (lastPoint[2] === 0 && lastPoint[0] === 0 && lastPoint[1] === 0) {
      return;
    };
  };

  strokes.push([dx, dy, p1, parseFloat(pressure.toFixed(4))]);
  updateUI();
};

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes = [];
  lastX = 0; lastY = 0;
  updateUI();
};

function downloadData() {
  if (strokes.length === 0) {
    alert("Can't download JSON data for empty canvas.");
    return;
  };

  const dataPayload = {
    text: sentences[currentIdx],
    strokes: strokes
  };

  const dataStr = JSON.stringify(dataPayload);
  const blob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sample_${(currentIdx + 1).toString().padStart(2, '0')}_${Date.now()}.json`;
  link.click();

  if (currentIdx < sentences.length - 1) {
    currentIdx++;
    clearCanvas();
  } else {
    alert("Sampling Done! All sentences completed.");
    currentIdx = 0;
    clearCanvas();
  };
};