export const QUESTIONS = [
  // Câu 1 – điền tọa độ OA
  {
    type: "text",
    text: "Câu 1. Cho điểm A(1;2;3). Tọa độ $\\overrightarrow{OA}$ bằng (viết dưới dạng (x;y;z)):",
    correctAnswer: "(1;2;3)",
    timeLimit: 40
  },

  // Câu 2 – vector đơn vị, phát hiện mệnh đề sai
  {
    type: "choice",
    text: "Câu 2. Khẳng định nào sau đây SAI?",
    options: {
      A: "$|\\vec{i}|$ bằng 1.",
      B: "$|\\vec{k}|$ bằng 1.",
      C: "Điểm O có tọa độ (0;0;0).",
      D: "$|\\vec{i}+\\vec{j}+\\vec{k}|$=1."
    },
    correctOption: "D", // vì ||3i + j + k|| = sqrt(11) ≠ 1
    timeLimit: 40
  },

  // Câu 3 – quy tắc ba điểm
  {
    type: "choice",
    text: "Câu 3. Cho ba điểm A, B, C và gốc tọa độ O. Khẳng định nào sau đây ĐÚNG (quy tắc ba điểm)?",
    options: {
      A: "$\\overrightarrow{AB} = \\overrightarrow{AO} - \\overrightarrow{BO}$",
      B: "$\\overrightarrow{AB} = \\overrightarrow{OB} - \\overrightarrow{OA}$",
      C: "$\\overrightarrow{AB} = \\overrightarrow{AO} + \\overrightarrow{OB}$",
      D: "$\\overrightarrow{AB} = \\overrightarrow{OA} + \\overrightarrow{BO}$"
    },
    correctOption: "B", // AB = OB - OA
    timeLimit: 40
  },

  // Câu 4 – quy tắc hình bình hành
  {
    type: "choice",
    text: "Câu 4. Cho hình bình hành ABCD. Khẳng định nào sau đây ĐÚNG (quy tắc hình bình hành)?",
    options: {
      A: "$\\overrightarrow{AC} = \\overrightarrow{AB} - \\overrightarrow{AD}$",
      B: "$\\overrightarrow{AC} = \\overrightarrow{AB} + \\overrightarrow{AD}$",
      C: "$\\overrightarrow{AC} = \\overrightarrow{CB} + \\overrightarrow{CD}$",
      D: "$\\overrightarrow{AC} = \\overrightarrow{DA} + \\overrightarrow{DC}$"
    },
    correctOption: "B",
    timeLimit: 40
  },

  // Câu 5 – tìm D của hình bình hành
  {
    type: "choice",
    text: "Câu 5. Cho hình bình hành ABCD với A(1;2;3), B(-2;4;0), C(0;1;-2). Tọa độ điểm D là:",
    options: {
      A: "(3;-1;1)",        // đúng: D = A + C - B
      B: "(-3;5;-5)",       // gây nhiễu: lấy B + C - A
      C: "(1;1;-2)",        // gây nhiễu: quên dùng B, chỉ lấy trung bình A,C
      D: "(-1;7;1)"         // gây nhiễu: cộng nhầm dấu
    },
    correctOption: "A",
    timeLimit: 40
  },

  // Câu 6 – độ dài, tích vô hướng, cùng phương
  {
    type: "choice",
    text: "Câu 6. Cho hai vector $\\vec{a} = (1;2;-3)$ và $\\vec{b} = (0;3;-1)$. Khẳng định nào sau đây SAI?",
    options: {
      A: "Độ dài của $\\vec{a}$ bằng $\\sqrt{14}$.",
      B: "Độ dài của $\\vec{b}$ bằng $\\sqrt{10}$.",
      C: "Tích vô hướng của $\\vec{a}$ và $\\vec{b}$ là một số dương.",
      D: "$\\vec{a}$ và $\\vec{b}$ cùng phương."
    },
    correctOption: "D", // a,b không cùng phương
    timeLimit: 40
  },

  // Câu 7 – trung điểm đoạn AB
  {
    type: "text",
    text: "Câu 7. Cho đoạn thẳng AB với A(-2;0;3), B(2;-2;3). Tọa độ trung điểm của AB là (viết dưới dạng (x;y;z)):",
    correctAnswer: "(0;-1;3)", // (xM,yM,zM) = ((-2+2)/2, (0-2)/2, (3+3)/2)
    timeLimit: 40
  },

  // Câu 8 – trọng tâm tam giác, tìm C
  {
    type: "choice",
    text: "Câu 8. Cho tam giác ABC có trọng tâm G(1;1;-1) và A(1;0;1), B(-1;1;0). Tọa độ đỉnh C bằng:",
    options: {
      A: "(3;2;-4)",   // đúng: C = 3G - A - B
      B: "(1;2;-2)",   // gây nhiễu: dùng 2G - A - B
      C: "(1;0;-2)",   // gây nhiễu: cộng thiếu 1 tọa độ
      D: "(3;0;-2)"    // gây nhiễu: sai ở cả y và z
    },
    correctOption: "A",
    timeLimit: 40
  },

  // Câu 9 – đổi từ dạng i,j,k sang tọa độ
  {
    type: "choice",
    text: "Câu 9. Cho $\\vec{a} = 2\\vec{j} - 3\\vec{k} - 5\\vec{i}$. Tọa độ của $\\vec{a}$ là:",
    options: {
      A: "(-5;2;-3)",  // đúng: hệ số của i,j,k
      B: "(2;-5;-3)",  // gây nhiễu: hoán vị x,y
      C: "(-5;-3;2)",  // gây nhiễu: nhầm thứ tự j,k
      D: "(5;2;-3)"    // gây nhiễu: quên dấu trừ ở i
    },
    correctOption: "A",
    timeLimit: 40
  },

  // Câu 10 – chiếu điểm lên trục/mặt, tìm mệnh đề sai
  {
    type: "choice",
    text: "Câu 10. Trong hệ trục Oxyz, khẳng định nào sau đây SAI? Khi chiếu điểm M(1;2;3) lên:",
    options: {
      A: "Trục Ox được A(1;0;0).",
      B: "Trục Oy được B(0;2;0).",
      C: "Mặt phẳng tọa độ (Oxy) được C(1;2;0).",
      D: "Mặt phẳng tọa độ (Oyz) được D(1;0;3)."
    },
    correctOption: "D", // đúng phải là (0;2;3)
    timeLimit: 40
  },

  // Câu 11 – đối xứng qua trục Ox
  {
    type: "text",
    text: "Câu 11. Trong hệ trục Oxyz, cho điểm M(-1;2;-4). Tìm tọa độ điểm N đối xứng với M qua trục Ox (viết dưới dạng (x;y;z)):",
    correctAnswer: "(-1;-2;4)", // (x,-y,-z)
    timeLimit: 40
  },

  // Câu 12 – biểu thức tọa độ, tìm mệnh đề sai
  {
    type: "choice",
    text: "Câu 12. Cho $\\vec{a} = (1;1;3)$, $\\vec{b} = (2;-1;0)$. Khẳng định nào sau đây SAI?",
    options: {
      A: "$\\vec{a} + \\vec{b} = (3;0;3)$.",
      B: "$\\vec{a} - \\vec{b} = (-1;2;3)$.",
      C: "$2\\vec{a} = (2;2;4)$.",
      D: "$\\vec{a} \\cdot \\vec{b} = 1$."
    },
    correctOption: "C", // đúng phải là (2;2;6)
    timeLimit: 40
  },

  // Câu 13 – độ dài đoạn MN
  {
    type: "choice",
    text: "Câu 13. Trong hệ trục Oxyz, cho điểm M(-1;2;-4) và N(2;0;1). Độ dài đoạn thẳng MN bằng:",
    options: {
      A: "$\\sqrt{38}$", // đúng: (3,-2,5)
      B: "$\\sqrt{29}$", // gây nhiễu: nhầm 3^2+2^2+2^2
      C: "$\\sqrt{35}$", // gây nhiễu: nhầm 3^2+2^2+4^2
      D: "$\\sqrt{39}$"  // gây nhiễu: cộng nhầm 10 thành 11
    },
    correctOption: "A",
    timeLimit: 40
  },

  // Câu 14 – góc giữa hai vector
  {
    type: "choice",
    text: "Câu 14. Góc giữa hai vector $\\vec{a} = (3;1;-4)$, $\\vec{b} = (2;2;-1)$ bằng:",
    options: {
      A: "$\\dfrac{\\pi}{3}$",
      B: "$\\dfrac{\\pi}{2}$",
      C: "$30^\\circ$",
      D: "$120^\\circ$"
    },
    // Giữ theo đáp án trong đề gốc: B
    correctOption: "B",
    timeLimit: 40
  }
];
