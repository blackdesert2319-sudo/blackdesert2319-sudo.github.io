// -------------------------------
// Trạng thái trò chơi
// -------------------------------
let boardSize = 3;
let board = [];
let currentPlayer = "X";
let gameOver = false;

// DOM elements
const boardEl = document.getElementById("board");
const startGameBtn = document.getElementById("startGameBtn");
const resetGameBtn = document.getElementById("resetGameBtn");
const overlayRestartBtn = document.getElementById("overlayRestartBtn");
const resultOverlay = document.getElementById("resultOverlay");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const currentPlayerLabel = document.getElementById("currentPlayerLabel");
const gameStatusLabel = document.getElementById("gameStatusLabel");
const trackingStatusLabel = document.getElementById("trackingStatusLabel");
const gazeCellLabel = document.getElementById("gazeCellLabel");
const dwellSlider = document.getElementById("dwellSlider");
const dwellLabel = document.getElementById("dwellLabel");
const headCursor = document.getElementById("headCursor");
const toggleCursorCheckbox = document.getElementById("toggleCursorCheckbox");
const toggleMouseCheckbox = document.getElementById("toggleMouseCheckbox");
const sizeButtons = Array.from(document.querySelectorAll(".size-btn"));

const headVideo = document.getElementById("headVideo");

// -------------------------------
// Tham số Head tracking
// -------------------------------
let dwellThreshold = parseInt(dwellSlider.value, 10);
let trackingStarted = false;
let allowMouseClick = false;

// Smoothing cho tâm mặt
let smoothX = null;
let smoothY = null;
const SMOOTH_ALPHA = 0.7;

// Dwell trên 1 ô
let currentGazeCell = null;
let gazeStartTime = 0;
let gazeLocked = false;

// MediaPipe
let faceMesh = null;
let camera = null;

// -------------------------------
// Khởi tạo
// -------------------------------
function init() {
  initBoard(boardSize);
  setupUIEvents();
  updateDwellLabel();
}

document.addEventListener("DOMContentLoaded", init);

// -------------------------------
// Bàn cờ & logic
// -------------------------------
function initBoard(size) {
  boardSize = size;
  board = Array.from({ length: size }, () => Array(size).fill(null));
  boardEl.innerHTML = "";
  boardEl.classList.remove("size-3", "size-4", "size-5");
  boardEl.classList.add(`size-${size}`);
  gameOver = false;
  resultOverlay.classList.add("hidden");
  boardEl.classList.remove("win-state");

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.dataset.value = "";

      // click bằng chuột (dự phòng)
      cell.addEventListener("mouseenter", () => {
        if (allowMouseClick) cell.classList.add("mouse-hover");
      });
      cell.addEventListener("mouseleave", () => {
        cell.classList.remove("mouse-hover");
      });
      cell.addEventListener("click", () => {
        if (!allowMouseClick) return;
        handleCellSelection(cell);
      });

      boardEl.appendChild(cell);
    }
  }

  currentPlayer = "X";
  updateCurrentPlayerLabel();
  gameStatusLabel.textContent = "Bấm BẮT ĐẦU ĐIỀU KHIỂN để dùng đầu chọn ô.";
  gazeCellLabel.textContent = "–";
}

function updateCurrentPlayerLabel() {
  currentPlayerLabel.textContent = currentPlayer;
  currentPlayerLabel.classList.toggle("badge-x", currentPlayer === "X");
  currentPlayerLabel.classList.toggle("badge-o", currentPlayer === "O");
}

function handleCellSelection(cell) {
  if (!cell) return;
  if (gameOver) return;
  if (cell.dataset.value) return;

  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);

  board[row][col] = currentPlayer;
  cell.dataset.value = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "x-cell" : "o-cell");

  const winInfo = checkWin(row, col, currentPlayer);
  if (winInfo.won) {
    handleWin(winInfo);
  } else if (isBoardFull()) {
    handleDraw();
  } else {
    switchPlayer();
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateCurrentPlayerLabel();
  gameStatusLabel.textContent = `Đến lượt người chơi ${currentPlayer}`;
}

function checkWin(r, c, player) {
  const lines = [];

  // row
  lines.push(Array.from({ length: boardSize }, (_, j) => [r, j]));
  // col
  lines.push(Array.from({ length: boardSize }, (_, i) => [i, c]));
  // diag chính
  if (r === c) {
    lines.push(Array.from({ length: boardSize }, (_, i) => [i, i]));
  }
  // diag phụ
  if (r + c === boardSize - 1) {
    lines.push(Array.from({ length: boardSize }, (_, i) => [i, boardSize - 1 - i]));
  }

  for (const line of lines) {
    if (line.every(([rr, cc]) => board[rr][cc] === player)) {
      return { won: true, cells: line };
    }
  }
  return { won: false, cells: [] };
}

function isBoardFull() {
  return board.every(row => row.every(cell => cell !== null));
}

function handleWin(winInfo) {
  gameOver = true;
  gameStatusLabel.textContent = `Người chơi ${currentPlayer} đã chiến thắng!`;
  resultTitle.textContent = `Người chơi ${currentPlayer} thắng! 🎉`;
  resultMessage.textContent = "Nhấn “Chơi lại” để bắt đầu ván mới.";
  resultOverlay.classList.remove("hidden");
  boardEl.classList.add("win-state");

  const cells = boardEl.querySelectorAll(".cell");
  winInfo.cells.forEach(([r, c]) => {
    const idx = r * boardSize + c;
    const cell = cells[idx];
    if (cell) cell.classList.add("win");
  });
}

function handleDraw() {
  gameOver = true;
  gameStatusLabel.textContent = "Hết chỗ đánh – Hòa!";
  resultTitle.textContent = "Hòa! 🤝";
  resultMessage.textContent = "Bàn cờ đã kín, không ai chiến thắng. Hãy thử lại ván mới.";
  resultOverlay.classList.remove("hidden");
  boardEl.classList.add("win-state");
}

function resetGame() {
  initBoard(boardSize);
}

// -------------------------------
// UI events
// -------------------------------
function setupUIEvents() {
  // Chọn kích thước bàn
  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const size = parseInt(btn.dataset.size, 10);
      sizeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      boardSize = size;
      resetGame();
    });
  });

  // Bắt đầu điều khiển bằng đầu
  startGameBtn.addEventListener("click", () => {
    resetGame();
    startHeadTracking();
  });

  resetGameBtn.addEventListener("click", () => {
    resetGame();
  });

  overlayRestartBtn.addEventListener("click", () => {
    resultOverlay.classList.add("hidden");
    resetGame();
  });

  dwellSlider.addEventListener("input", () => {
    dwellThreshold = parseInt(dwellSlider.value, 10);
    updateDwellLabel();
  });

  toggleCursorCheckbox.addEventListener("change", () => {
    const show = toggleCursorCheckbox.checked;
    headCursor.classList.toggle("hidden", !show);
  });

  toggleMouseCheckbox.addEventListener("change", () => {
    allowMouseClick = toggleMouseCheckbox.checked;
  });
}

function updateDwellLabel() {
  dwellLabel.textContent = (dwellThreshold / 1000).toFixed(1) + "s";
}

// -------------------------------
// MediaPipe Head Tracking
// -------------------------------
function startHeadTracking() {
  if (trackingStarted) {
    gameStatusLabel.textContent = "Head tracking đã bật. Di chuyển đầu để chọn ô.";
    return;
  }
  trackingStarted = true;

  // Khởi tạo FaceMesh
  faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(onFaceResults);

  // Khởi tạo Camera
  camera = new Camera(headVideo, {
    onFrame: async () => {
      await faceMesh.send({ image: headVideo });
    },
    width: 640,
    height: 480
  });

  camera.start();

  trackingStatusLabel.textContent = "Đang theo dõi";
  trackingStatusLabel.classList.remove("badge-off");
  trackingStatusLabel.classList.add("badge-on");
  gameStatusLabel.textContent = "Camera đã bật. Di chuyển đầu nhẹ để con trỏ di chuyển trên bàn cờ.";
}

// Callback khi có kết quả từ FaceMesh
function onFaceResults(results) {
  const faces = results.multiFaceLandmarks;
  if (!faces || faces.length === 0) {
    gazeCellLabel.textContent = "–";
    clearGazeCell();
    return;
  }

  const landmarks = faces[0];
  if (!landmarks || landmarks.length === 0) {
    gazeCellLabel.textContent = "–";
    clearGazeCell();
    return;
  }

  // Tính tâm mặt = trung bình tất cả landmarks (x, y chuẩn hóa)
  let sumX = 0;
  let sumY = 0;
  const n = landmarks.length;
  for (let i = 0; i < n; i++) {
    sumX += landmarks[i].x;
    sumY += landmarks[i].y;
  }
  let cx = sumX / n; // 0..1 (x từ trái sang phải)
  let cy = sumY / n; // 0..1 (y từ trên xuống dưới)

  // Làm mượt
  if (smoothX === null || smoothY === null) {
    smoothX = cx;
    smoothY = cy;
  } else {
    smoothX = SMOOTH_ALPHA * smoothX + (1 - SMOOTH_ALPHA) * cx;
    smoothY = SMOOTH_ALPHA * smoothY + (1 - SMOOTH_ALPHA) * cy;
  }

  // Vị trí trên bàn cờ (pixel)
  const rect = boardEl.getBoundingClientRect();
  const px = rect.left + smoothX * rect.width;
  const py = rect.top + smoothY * rect.height;

  updateHeadCursor(px, py);

  // Tính ô tương ứng theo tọa độ chuẩn hóa
  let col = Math.floor(smoothX * boardSize);
  let row = Math.floor(smoothY * boardSize);

  // Chặn vượt biên
  col = Math.max(0, Math.min(boardSize - 1, col));
  row = Math.max(0, Math.min(boardSize - 1, row));

  const index = row * boardSize + col;
  const cells = boardEl.querySelectorAll(".cell");
  const cell = cells[index];

  if (!cell) {
    clearGazeCell();
    return;
  }

  handleHeadOnCell(cell, row, col);
}

// Cập nhật vị trí con trỏ vòng tròn trên bàn cờ
function updateHeadCursor(px, py) {
  if (!toggleCursorCheckbox.checked) return;
  headCursor.classList.remove("hidden");
  headCursor.style.transform = `translate(${px}px, ${py}px)`;
}

// Xử lý dwell trên 1 ô với đầu
function handleHeadOnCell(cell, row, col) {
  if (!cell) {
    clearGazeCell();
    return;
  }

  gazeCellLabel.textContent = `(${row + 1}, ${col + 1})`;

  if (currentGazeCell !== cell) {
    if (currentGazeCell) {
      currentGazeCell.classList.remove("hovered");
    }
    currentGazeCell = cell;
    gazeStartTime = performance.now();
    gazeLocked = false;
    cell.classList.add("hovered");
    return;
  }

  const now = performance.now();
  const elapsed = now - gazeStartTime;

  if (!gazeLocked && elapsed >= dwellThreshold) {
    gazeLocked = true;
    if (!cell.dataset.value && !gameOver) {
      handleCellSelection(cell);
    }
  }
}

// Khi mặt rời xa / không xác định rõ
function clearGazeCell() {
  if (currentGazeCell) {
    currentGazeCell.classList.remove("hovered");
  }
  currentGazeCell = null;
  gazeStartTime = 0;
  gazeLocked = false;
  gazeCellLabel.textContent = "–";
}

// -------------------------------
// Dọn dẹp khi đóng trang
// -------------------------------
window.addEventListener("beforeunload", () => {
  if (camera) {
    camera.stop();
  }
});
