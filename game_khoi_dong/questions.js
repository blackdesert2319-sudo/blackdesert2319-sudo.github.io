// questions.js

// Mảng câu hỏi dùng chung cho cả game
// Bạn chỉ cần sửa file này khi muốn thay đổi đề.
export const QUESTIONS = [
  {
    type: "choice",              // trắc nghiệm ABCD
    text: "Giá trị của 2 + 3 · 4 là:",
    options: {
      A: "20",
      B: "14",
      C: "24",
      D: "18"
    },
    correctOption: "B",
    imageUrl: ""                 // nếu có ảnh: "https://...."
  },
  {
    type: "text",                // câu điền vào ô trống
    text: "Căn bậc hai của 8 được nhập là:",
    correctAnswer: "can(8)",     // học sinh phải gõ đúng y chang
    imageUrl: ""
  },
  {
    type: "text",
    text: "Tọa độ của vectơ \\(\\vec{a}\\) là (1;2;-5). Nhập đúng dạng: (1;2;-5)",
    correctAnswer: "(1;2;-5)",
    imageUrl: ""
  },
  {
    type: "choice",
    text: "Phân số nào bằng 1/2?",
    options: {
      A: "2/4",
      B: "3/5",
      C: "4/8",
      D: "2/3"
    },
    correctOption: "A",          // có thể cho nhiều câu cùng đáp án, không sao
    imageUrl: ""
  },

  // Thêm các câu khác...
  {
    type: "choice",
    text: "Giá trị của (−1)^2 là:",
    options: { A: "-1", B: "1", C: "0", D: "2" },
    correctOption: "B",
    imageUrl: ""
  },
  {
    type: "choice",
    text: "Trong không gian Oxyz, điểm A(1;2;3) có tung độ là:",
    options: { A: "1", B: "2", C: "3", D: "5" },
    correctOption: "B",
    imageUrl: ""
  },
  {
    type: "text",
    text: "Nhập kết quả: 5^2 = ? (nhập số nguyên)",
    correctAnswer: "25",
    imageUrl: ""
  },
  {
    type: "choice",
    text: "Độ dài vectơ \\(\\vec{a}=(3;4)\\) là:",
    options: { A: "5", B: "7", C: "25", D: "12" },
    correctOption: "A",
    imageUrl: ""
  },
  {
    type: "choice",
    text: "Số nghiệm của phương trình x^2 = 0 là:",
    options: { A: "0", B: "1", C: "2", D: "vô số" },
    correctOption: "B",
    imageUrl: ""
  },
  {
    type: "text",
    text: "Nhập số nguyên: 10 - 7 = ?",
    correctAnswer: "3",
    imageUrl: ""
  },
  {
    type: "choice",
    text: "Giá trị gần đúng của can(9) là:",
    options: { A: "2", B: "3", C: "4", D: "5" },
    correctOption: "B",
    imageUrl: ""
  },
  {
    type: "choice",
    text: "Nếu AB là một vectơ thì ký hiệu đúng là:",
    options: {
      A: "AB",
      B: "BA",
      C: "→AB",
      D: "|AB|"
    },
    correctOption: "C",
    imageUrl: ""
  }
];
