// -------------------------------
// Trạng thái trò chơi
// -------------------------------
let boardSize = 3;
let board = [];
let currentPlayer = "X";
let gameOver = false;

// Các phần tử DOM
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
const gazeCursor = document.getElementById("gazeCursor");
const toggleCursorCheckbox = document.getElementById("toggleCursorCheckbox");
const toggleMouseCheckbox = document.getElementById("toggleMouseCheckbox");
const sizeButtons = Array.from(document.querySelectorAll(".size-btn"));

// Huấn luyện
const trainBtn = document.getElementById("trainBtn");
const trainingOverlay = document.getElementById("trainingOverlay");
const trainingDot = document.getElementById("trainingDot");
const trainingStepText = document.getElementById("trainingStepText");
const finishTrainingBtn = document.getElementById("finishTrainingBtn");

// Thời gian giữ mắt để chọn ô (ms)
let dwellThreshold = parseInt(dwellSlider.value, 10);

// -------------------------------
// Trạng thái eye-tracking & huấn luyện
// -------------------------------
let trackingStarted = false;
let allowMouseClick = false;

// Để xử lý dwell
let currentGazeCell = null;
let gazeStartTime = 0;
let gazeLocked = false;

// Huấn luyện
let isTraining = false;
const trainingPoints = [
  { x: 0.5, y: 0.5 }, // giữa
  { x: 0.15, y: 0.15 },
  { x: 0.85, y: 0.15 },
  { x: 0.15, y: 0.85 },
  { x: 0.85, y: 0.85 },
  { x: 0.5, y: 0.15 },
  { x: 0.5, y: 0.85 },
  { x: 0.15, y: 0.5 },
  { x: 0.85, y: 0.5 }
];
let trainingIndex = 0;

// -------------------------------
// Làm mượt tọa độ nhìn (smoothing)
// -------------------------------
let smoothX = null;
let smoothY = null;
const SMOOTH_ALPHA = 0.75; // càng gần 1 càng mượt (nhưng chậm phản ứng)

// -------------------------------
// Khởi tạo
// -------------------------------
function init() {
  initBoard(boardSize);
  setupUIEvents();
  updateDwellLabel();
  setupWebGazer();
}

document.addEventListener("DOMContentLoaded", init);

// -------------------------------
// Bàn cờ & logic trò chơi
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

      // click bằng chuột (nếu bật)
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
  gameStatusLabel.textContent = "Bàn cờ đã sẵn sàng. Hãy huấn luyện rồi bấm BẮT ĐẦU để chơi bằng mắt.";
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
  if (cell.dataset.value) return; // ô đã có giá trị

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

  // dòng r
  lines.push(
    Array.from({ length: boardSize }, (_, j) => [r, j])
  );

  // cột c
  lines.push(
    Array.from({ length: boardSize }, (_, i) => [i, c])
  );

  // đường chéo chính (nếu thuộc)
  if (r === c) {
    lines.push(
      Array.from({ length: boardSize }, (_, i) => [i, i])
    );
  }

  // đường chéo phụ (nếu thuộc)
  if (r + c === boardSize - 1) {
    lines.push(
      Array.from({ length: boardSize }, (_, i) => [i, boardSize - 1 - i])
    );
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
    if (cell) {
      cell.classList.add("win");
    }
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

  // Start game (kích hoạt eye tracking để chơi)
  startGameBtn.addEventListener("click", () => {
    resetGame();
    startTracking();
    gameStatusLabel.textContent = "Đã kích hoạt theo dõi mắt. Nhìn vào các ô để chọn.";
  });

  resetGameBtn.addEventListener("click", () => {
    resetGame();
  });

  overlayRestartBtn.addEventListener("click", () => {
    resultOverlay.classList.add("hidden");
    resetGame();
  });

  // Slider dwell
  dwellSlider.addEventListener("input", () => {
    dwellThreshold = parseInt(dwellSlider.value, 10);
    updateDwellLabel();
  });

  // Hiện/ẩn con trỏ ánh mắt
  toggleCursorCheckbox.addEventListener("change", () => {
    const show = toggleCursorCheckbox.checked;
    gazeCursor.classList.toggle("hidden", !show);
  });

  // Bật/tắt chọn ô bằng chuột
  toggleMouseCheckbox.addEventListener("change", () => {
    allowMouseClick = toggleMouseCheckbox.checked;
  });

  // Nút HUẤN LUYỆN
  trainBtn.addEventListener("click", () => {
    startTracking();
    startTraining();
  });

  trainingDot.addEventListener("click", () => {
    if (!isTraining) return;
    nextTrainingPoint();
  });

  finishTrainingBtn.addEventListener("click", () => {
    stopTraining();
  });
}

function updateDwellLabel() {
  dwellLabel.textContent = (dwellThreshold / 1000).toFixed(1) + "s";
}

// -------------------------------
// WebGazer – Eye tracking
// -------------------------------
function setupWebGazer() {
  if (!window.webgazer) {
    console.warn("Không tìm thấy WebGazer. Kiểm tra lại link <script> trong HTML.");
    trackingStatusLabel.textContent = "Lỗi tải WebGazer";
    trackingStatusLabel.classList.add("badge-off");
    return;
  }

  webgazer
    .setRegression("ridge")
    .setTracker("clmtrackr")
    .showPredictionPoints(false)
    .setGazeListener(onGazeData)
    .saveDataAcrossSessions(false);

  // Cho phép WebGazer thu thập dữ liệu từ các lần click chuột
  if (webgazer.addMouseEventListeners) {
    webgazer.addMouseEventListeners();
  }

  trackingStatusLabel.textContent = "Sẵn sàng. Hãy bấm Huấn luyện trước.";
}

function startTracking() {
  if (!window.webgazer) return;

  if (!trackingStarted) {
    trackingStarted = true;

    // Bắt đầu thật sự – WebGazer dùng begin()
    webgazer.begin();

    // Hiện camera + khung mặt (đã được CSS thu nhỏ)
    if (webgazer.showVideo) {
      webgazer.showVideo(true);
    }
    if (webgazer.showFaceOverlay) {
      webgazer.showFaceOverlay(true);
    }
    if (webgazer.showFaceFeedbackBox) {
      webgazer.showFaceFeedbackBox(true);
    }
  }

  trackingStatusLabel.textContent = "Đang theo dõi";
  trackingStatusLabel.classList.remove("badge-off");
  trackingStatusLabel.classList.add("badge-on");
}

// Hàm callback nhận dữ liệu nhìn
function onGazeData(data, timestamp) {
  if (!data) {
    gazeCellLabel.textContent = "–";
    return;
  }

  const rawX = data.x;
  const rawY = data.y;

  // Làm mượt tọa độ
  if (smoothX === null || smoothY === null) {
    smoothX = rawX;
    smoothY = rawY;
  } else {
    smoothX = SMOOTH_ALPHA * smoothX + (1 - SMOOTH_ALPHA) * rawX;
    smoothY = SMOOTH_ALPHA * smoothY + (1 - SMOOTH_ALPHA) * rawY;
  }

  updateGazeCursorPosition(smoothX, smoothY);

  // Nếu đang huấn luyện → chỉ hiển thị cursor, không xử lý chọn ô
  if (isTraining) {
    clearGazeCell();
    return;
  }

  const rect = boardEl.getBoundingClientRect();
  const x = smoothX;
  const y = smoothY;

  if (
    x < rect.left ||
    x > rect.right ||
    y < rect.top ||
    y > rect.bottom
  ) {
    clearGazeCell();
    return;
  }

  const relX = x - rect.left;
  const relY = y - rect.top;
  const cellWidth = rect.width / boardSize;
  const cellHeight = rect.height / boardSize;
  const col = Math.floor(relX / cellWidth);
  const row = Math.floor(relY / cellHeight);

  const index = row * boardSize + col;
  const cells = boardEl.querySelectorAll(".cell");
  const cell = cells[index];

  if (!cell) {
    clearGazeCell();
    return;
  }

  handleGazeOnCell(cell, row, col);
}

// Hiển thị vòng tròn vị trí nhìn
function updateGazeCursorPosition(x, y) {
  if (!toggleCursorCheckbox.checked) return;
  gazeCursor.classList.remove("hidden");
  gazeCursor.style.transform = `translate(${x}px, ${y}px)`;
}

// Xử lý khi mắt nhìn vào 1 ô cụ thể
function handleGazeOnCell(cell, row, col) {
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

// Khi mắt ra khỏi bàn / không trỏ vào ô nào rõ ràng
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
// Chế độ HUẤN LUYỆN
// -------------------------------
function startTraining() {
  isTraining = true;
  trainingIndex = 0;
  trainingOverlay.classList.remove("hidden");
  moveTrainingDot();
  gameStatusLabel.textContent = "Chế độ huấn luyện: nhìn vào chấm và click chuột vào đó.";
}

function moveTrainingDot() {
  if (trainingIndex >= trainingPoints.length) {
    trainingStepText.textContent = "Đã thu thập đủ 9 điểm. Bạn có thể nhấn 'Kết thúc huấn luyện'.";
    trainingDot.style.display = "none";
    return;
  }

  const p = trainingPoints[trainingIndex];
  trainingDot.style.display = "block";

  trainingDot.style.left = (p.x * 100) + "%";
  trainingDot.style.top = (p.y * 100) + "%";

  trainingStepText.textContent =
    `Bước ${trainingIndex + 1}/${trainingPoints.length}: Nhìn vào chấm vàng và click chuột vào đó.`;
}

function nextTrainingPoint() {
  trainingIndex++;
  moveTrainingDot();
}

function stopTraining() {
  isTraining = false;
  trainingOverlay.classList.add("hidden");
  trainingDot.style.display = "none";
  gameStatusLabel.textContent = "Huấn luyện xong. Bây giờ hãy bấm BẮT ĐẦU và thử chơi bằng mắt.";
}

// -------------------------------
// Dọn dẹp khi đóng trang
// -------------------------------
window.addEventListener("beforeunload", () => {
  if (window.webgazer && trackingStarted) {
    webgazer.end();
  }
});
