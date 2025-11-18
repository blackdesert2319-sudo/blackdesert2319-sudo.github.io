export const QUESTIONS = [
  // 2 CÂU CHƠI THỬ
  {
    type: "choice",
    text: "Cho $\\vec{a} = (2; -1; 3)$. Độ dài của $\\vec{a}$ bằng:",
    options: {
      A: "$\\sqrt{14}$",
      B: "$\\sqrt{10}$",
      C: "$\\sqrt{12}$",
      D: "$\\sqrt{9}$"
    },
    correctOption: "A",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Cho A(2; 4; -2), B(6; -2; 4). Tọa độ trung điểm M của đoạn AB là:",
    options: {
      A: "$(4; 1; 1)$",
      B: "$(2; 1; 1)$",
      C: "$(4; 3; 2)$",
      D: "$(8; 2; 2)$"
    },
    correctOption: "A",
    timeLimit: 40
  },

  // 12 CÂU CHÍNH THỨC
  {
    type: "choice",
    text: "Cho hai điểm A(2; 1; -1), B(1; -3; 4). Vector $\\overrightarrow{AB}$ bằng:",
    options: {
      A: "$(1; 4; -5)$",
      B: "$(-1; -4; 5)$",
      C: "$(-1; -4; -5)$",
      D: "$(1; -4; 3)$"
    },
    correctOption: "B",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Trong hình bình hành ABCD, biết $\\overrightarrow{AB} = (3; -1; 2)$ và $\\overrightarrow{AD} = (-1; 4; 0)$. Tọa độ $\\overrightarrow{AC}$ là:",
    options: {
      A: "$(2; 3; 2)$",
      B: "$(-2; 3; 2)$",
      C: "$(4; -5; 2)$",
      D: "$(3; 3; 2)$"
    },
    correctOption: "A",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Hai vector $\\vec{a} = (3; -1; 2)$ và $\\vec{b} = (3; -1; 2)$ là:",
    options: {
      A: "Cùng hướng, độ dài khác nhau",
      B: "Ngược hướng",
      C: "Bằng nhau",
      D: "Không cùng phương"
    },
    correctOption: "C",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Cho $\\vec{a} = (2; -4; 6)$, $\\vec{b} = (-1; 2; -3)$. Khẳng định đúng là:",
    options: {
      A: "$\\vec{a}$ và $\\vec{b}$ không cùng phương",
      B: "$\\vec{a}$ và $\\vec{b}$ cùng phương",
      C: "$\\vec{a}$ và $\\vec{b}$ vuông góc",
      D: "$\\vec{a}$ và $\\vec{b}$ bằng nhau"
    },
    correctOption: "B",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Cho A(1; 2; 3) và B(3; 6; 9). Điểm C nào sau đây để A, B, C thẳng hàng?",
    options: {
      A: "$(2; 4; 6)$",
      B: "$(4; 8; 13)$",
      C: "$(2; 5; 8)$",
      D: "$(-1; 1; -3)$"
    },
    correctOption: "A",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Cho M là trung điểm của đoạn AB với A(-2; 6; 4), M(1; 2; -1). Tọa độ điểm B là:",
    options: {
      A: "$(4; -2; -6)$",
      B: "$(3; -2; -6)$",
      C: "$(3; -2; -4)$",
      D: "$(4; -2; -4)$"
    },
    correctOption: "A",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Trong tam giác ABC có A(0; 1; 2), B(3; -1; 4), C(6; 2; -1). Tọa độ trọng tâm G của tam giác ABC là:",
    options: {
      A: "$(3; \\tfrac{2}{3}; \\tfrac{5}{3})$",
      B: "$(3; 1; 2)$",
      C: "$(3; 0,67; 1,67)$",
      D: "$(3; -1; 5)$"
    },
    correctOption: "A",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Điểm M(4; -3; 5) đối xứng với M qua trục Oy là:",
    options: {
      A: "$(4; -3; -5)$",
      B: "$(-4; -3; -5)$",
      C: "$(-4; -3; 5)$",
      D: "$(4; 3; 5)$"
    },
    correctOption: "B",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Cho hai vector $\\vec{a} = (1; -2; 3)$ và $\\vec{b} = (-3; 4; 1)$. Tính $\\vec{a} + \\vec{b}$:",
    options: {
      A: "$(-2; 2; 4)$",
      B: "$(-2; 6; 4)$",
      C: "$(4; -6; 3)$",
      D: "$(-2; 6; 2)$"
    },
    correctOption: "A",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Cho $\\vec{a} = (-1; 3; -2)$. Tọa độ vector $2\\vec{a}$ là:",
    options: {
      A: "$(-1; 3; -2)$",
      B: "$(-2; 6; -4)$",
      C: "$(1; -3; 2)$",
      D: "$(-3; 9; -6)$"
    },
    correctOption: "B",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Cho $\\vec{a} = (2; -1; 3)$, $\\vec{b} = (-1; 4; 0)$. Tích vô hướng $\\vec{a} \\cdot \\vec{b}$ bằng:",
    options: {
      A: "$-6$",
      B: "$-2$",
      C: "$2$",
      D: "$6$"
    },
    correctOption: "A",
    timeLimit: 40
  },
  {
    type: "choice",
    text: "Cho A(1; 2; -1), B(4; -2; 1). Độ dài đoạn thẳng AB là:",
    options: {
      A: "$\\sqrt{20}$",
      B: "$\\sqrt{24}$",
      C: "$\\sqrt{29}$",
      D: "$\\sqrt{32}$"
    },
    correctOption: "C",
    timeLimit: 40
  }
];
