// --- 1. DỮ LIỆU CÂU HỎI (TỔNG CỘNG 160 CÂU) ---
// "let" cho phép file game.html xáo trộn các câu hỏi
let questions = [

    // --- Dạng 5: NHẬN BIẾT (60 CÂU TỪ DANH SÁCH MỚI) ---
    // (12 câu s/x)
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "... e đạp.", 
        options: ["s", "x"], 
        correctAnswer: "x" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "... e lu.", 
        options: ["s", "x"], 
        correctAnswer: "x" 
    },
 {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "Xứ ...ở", 
        options: ["s", "x"], 
        correctAnswer: "s" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "thị ...ã.", 
        options: ["s", "x"], 
        correctAnswer: "x" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "...ứ sở.", 
        options: ["s", "x"], 
        correctAnswer: "x" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "phố ...á.", 
        options: ["s", "x"], 
        correctAnswer: "x" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "bầy ...ẻ.", 
        options: ["s", "x"], 
        correctAnswer: "s" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "... u ...u.", 
        sentence: "... u su.", // Sửa theo chú ý 1 dấu ...
        options: ["s", "x"], 
        correctAnswer: "s" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "chữ ...ố.", 
        options: ["s", "x"], 
        correctAnswer: "s" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "củ ...ả.", 
        options: ["s", "x"], 
        correctAnswer: "s" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "cửa ...ổ.", 
        options: ["s", "x"], 
        correctAnswer: "s" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "...a ...a.", 
        sentence: "...a xa.", // Sửa theo chú ý 1 dấu ...
        options: ["s", "x"], 
        correctAnswer: "x" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "s" hay "x":', 
        sentence: "củ ...ắn.", 
        options: ["s", "x"], 
        correctAnswer: "s" 
    },
    
    // (12 câu ch/tr)
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...ú khỉ.",
        options: ["ch", "tr"], 
        correctAnswer: "ch" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...ợ cá.",
        options: ["ch", "tr"], 
        correctAnswer: "ch" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...ị có.",
        options: ["ch", "tr"], 
        correctAnswer: "ch" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...ứng gà.",
        options: ["ch", "tr"], 
        correctAnswer: "tr" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "cây ...e.",
        options: ["ch", "tr"], 
        correctAnswer: "tr" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "bức ...anh.",
        options: ["ch", "tr"], 
        correctAnswer: "tr" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "cá ...ê.",
        options: ["ch", "tr"], 
        correctAnswer: "tr" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...e ngà.",
        options: ["ch", "tr"], 
        correctAnswer: "tr" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...ia quà.",
        options: ["ch", "tr"], 
        correctAnswer: "ch" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...ú hề.",
        options: ["ch", "tr"], 
        correctAnswer: "ch" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...e ô.",
        options: ["ch", "tr"], 
        correctAnswer: "ch" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "bàn ...ân.",
        options: ["ch", "tr"], 
        correctAnswer: "ch" 
    },
    {
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ch" hay "tr":', 
        sentence: "...ăm ...ỉ.", 
        sentence: "...ăm chỉ.", // Sửa theo chú ý 1 dấu ...
        options: ["ch", "tr"], 
        correctAnswer: "ch" 
    },
    
    // (12 câu g/gh)
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "...à gô.",
        options: ["g", "gh"], 
        correctAnswer: "g" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "đồ ...ỗ.",
        options: ["g", "gh"], 
        correctAnswer: "g" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "chú ...à.",
        options: ["g", "gh"], 
        correctAnswer: "g" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "...é nhà.",
        options: ["g", "gh"], 
        correctAnswer: "gh" 
    },
 { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ng" hay "ngh":', 
        sentence: "củ ...ệ",
        options: ["ng", "ngh"], 
        correctAnswer: "ngh" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "...ế đá.",
        options: ["g", "gh"], 
        correctAnswer: "gh" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "...ẹ đỏ.",
        options: ["g", "gh"], 
        correctAnswer: "gh" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "nhà ...ỗ.",
        options: ["g", "gh"], 
        correctAnswer: "g" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "...ế nhỏ.",
        options: ["g", "gh"], 
        correctAnswer: "gh" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "nhà ...a.",
        options: ["g", "gh"], 
        correctAnswer: "g" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "gà ...ô.",
        options: ["g", "gh"], 
        correctAnswer: "g" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "g" hay "gh":', 
        sentence: "tấm ...ỗ.",
        options: ["g", "gh"], 
        correctAnswer: "g" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "k" hay "c":', 
        sentence: "...ờ đỏ.",
        options: ["k", "c"], 
        correctAnswer: "c" 
    },
    
    // (12 câu ng/ngh)
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "...õ nhỏ.",
        options: ["ngh", "ng"], 
        correctAnswer: "ng" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "...é con.",
        options: ["ngh", "ng"], 
        correctAnswer: "ngh" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "ra ...õ.",
        options: ["ngh", "ng"], 
        correctAnswer: "ng" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "...ã ba.",
        options: ["ngh", "ng"], 
        correctAnswer: "ng" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "củ ...ệ.",
        options: ["ngh", "ng"], 
        correctAnswer: "ngh" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "...ỉ hè.",
        options: ["ngh", "ng"], 
        correctAnswer: "ngh" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "...é ngủ.",
        options: ["ngh", "ng"], 
        correctAnswer: "ngh" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "tre ...à.",
        options: ["ngh", "ng"], 
        correctAnswer: "ng" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "...ủ mơ.",
        options: ["ngh", "ng"], 
        correctAnswer: "ng" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "...ắm ...ía.", 
        sentence: "...ắm nghĩa.", // Sửa theo chú ý
        options: ["ngh", "ng"], 
        correctAnswer: "ng" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "...ọn cỏ.",
        options: ["ngh", "ng"], 
        correctAnswer: "ng" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "ngh" hay "ng":', 
        sentence: "bỡ ...ỡ.",
        options: ["ngh", "ng"], 
        correctAnswer: "ng" 
    },
    
    // (12 câu th/tr/ch)
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "...ung thu",
        options: ["th", "tr", "ch"], 
        correctAnswer: "tr" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "...ia quà.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "ch" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "...ủ đô.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "th" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "lá ...ư.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "th" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "...ìa dĩa.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "th" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "...ú hề.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "ch" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "...e ô.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "ch" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "lưa ...ưa.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "th" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "rễ ...e.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "tr" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "mùa ...u.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "th" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "khế ...ua.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "ch" 
    },
    { 
        qType: 'SELECT', 
        type: "Nhận biết", 
        question: 'Viết vào chỗ ba chấm "th" hay "tr" hay "ch":', 
        sentence: "...ăm chỉ.",
        options: ["th", "tr", "ch"], 
        correctAnswer: "ch" 
    },

    // --- Dạng 2: Gạch chân (20 câu) ---
    {
        qType: 'CLICKABLE', 
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "o":',
        sentence: "Bò có cỏ để ăn",
        targetSound: "o" 
    },
    {
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "ch":',
        sentence: "Chú cho con trong chuồng",
        targetSound: "ch"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "e":',
        sentence: "Bé kể mẹ nghe về bạn bè",
        targetSound: "e"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "ô":',
        sentence: "Nam và bố câu cá",
        targetSound: "ô"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "a":',
        sentence: "Nam và Hà ca hát",
        targetSound: "a"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "b":',
        sentence: "Bà cho bé búp bê",
        targetSound: "b"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "nh":',
        sentence: "Nhà bà ở ngõ nhỏ",
        targetSound: "nh"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "gh":',
        sentence: "Hà ghé nhà bà",
        targetSound: "gh"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "th":',
        sentence: "Nhà bà có thị",
        targetSound: "th"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "nh":',
        sentence: "Bé chia thìa cho cả nhà",
        targetSound: "nh"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "k":',
        sentence: "Kì đà bò ở kẽ đá",
        targetSound: "k"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "l":',
        sentence: "Le le bơi trên hồ",
        targetSound: "l"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "u":',
        sentence: "Đu đủ chín ngọt lừ",
        targetSound: "u"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "i":',
        sentence: "Bầy sẻ non ríu rít",
        targetSound: "i"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "ă":',
        sentence: "Dung dăng dung dẻ",
        targetSound: "ă"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "â":',
        sentence: "Đàn gà tha thẩn",
        targetSound: "â"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "m":',
        sentence: "Sen nở thắm hồ",
        targetSound: "m"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "n":',
        sentence: "Cún con nhìn thấy",
        targetSound: "n"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "d":',
        sentence: "Dế mèn trên tàu lá",
        targetSound: "d"
    },
    { 
        qType: 'CLICKABLE',
        type: "Gạch chân",
        question: 'Em hãy gạch chân các tiếng có âm "qu":',
        sentence: "Bà cho bé quà quê",
        targetSound: "qu"
    },

    // --- Dạng 4: Chính tả (20 câu) ---
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "k" có thể đi với nguyên âm', 
        sentence: "", 
        options: ["e", "u", "a", "ư"], 
        correctAnswer: "e" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Nguyên âm nào không đi với âm "k"', 
        sentence: "", 
        options: ["i", "e", "ê", "a"], 
        correctAnswer: "a" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "c" có thể đi với nguyên âm', 
        sentence: "", 
        options: ["i", "o", "e", "ê"], 
        correctAnswer: "o" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Nguyên âm nào không đi với âm "c"', 
        sentence: "", 
        options: ["e", "a", "o", "u"], 
        correctAnswer: "e" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "gh" có thể đi với nguyên âm', 
        sentence: "", 
        options: ["a", "o", "ê", "u"], 
        correctAnswer: "ê" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Nguyên âm nào không đi với âm "gh"', 
        sentence: "", 
        options: ["i", "e", "o", "ê"], 
        correctAnswer: "o" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "g" có thể đi với nguyên âm', 
        sentence: "", 
        options: ["i", "e", "ê", "a"], 
        correctAnswer: "a" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Nguyên âm nào không đi với âm "g"', 
        sentence: "", 
        options: ["a", "o", "u", "i"], 
        correctAnswer: "i" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "ngh" có thể đi với nguyên âm', 
        sentence: "", 
        options: ["a", "i", "o", "u"], 
        correctAnswer: "i" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Nguyên âm nào không đi với âm "ngh"', 
        sentence: "", 
        options: ["i", "e", "ê", "a"], 
        correctAnswer: "a" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "ng" có thể đi với nguyên âm', 
        sentence: "", 
        options: ["e", "i", "o", "ê"], 
        correctAnswer: "o" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Nguyên âm nào không đi với âm "ng"', 
        sentence: "", 
        options: ["a", "e", "u", "o"], 
        correctAnswer: "e" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "k" chỉ đi với', 
        sentence: "", 
        options: ["a, o, u", "i, e, ê", "o, ô, ơ", "a, ă, â"], 
        correctAnswer: "i, e, ê" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "c" chỉ đi với', 
        sentence: "", 
        options: ["a, o, u...", "i, e, ê", "i, o, u", "e, ê, a"], 
        correctAnswer: "a, o, u..." 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "gh" chỉ đi với', 
        sentence: "", 
        options: ["a, o, u", "i, e, ê", "o, ô, ơ", "a, ă, â"], 
        correctAnswer: "i, e, ê" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "g" chỉ đi với', 
        sentence: "", 
        options: ["a, o, u...", "i, e, ê", "i, o, u", "e, ê, a"], 
        correctAnswer: "a, o, u..." 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "ngh" chỉ đi với', 
        sentence: "", 
        options: ["a, o, u", "i, e, ê", "o, ô, ơ", "a, ă, â"], 
        correctAnswer: "i, e, ê" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Âm "ng" chỉ đi với', 
        sentence: "", 
        options: ["a, o, u...", "i, e, ê", "i, o, u", "e, ê, a"], 
        correctAnswer: "a, o, u..." 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Nguyên âm "i" đi với', 
        sentence: "", 
        options: ["g", "gh"], 
        correctAnswer: "gh" 
    },
    {
        qType: 'SELECT', 
        type: "Chính tả", 
        question: 'Nguyên âm "a" đi với', 
        sentence: "", 
        options: ["g", "gh"], 
        correctAnswer: "g" 
    },
    
    // --- Dạng 3: Tìm chữ trong tiếng (20 câu) ---
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "r" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["na", "rắn", "dặm", "su"], 
        correctAnswer: "rắn" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "r" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["ra", "rắn", "dặm", "run"], 
        correctAnswer: "dặm" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "s" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["xa", "sữa", "xi", "xôi"], 
        correctAnswer: "sữa" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "s" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["su su", "sẻ", "sao", "xe"], 
        correctAnswer: "xe" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "x" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["sông", "sâu", "sả", "xe"], 
        correctAnswer: "xe" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "x" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["xa", "xi", "xô", "sẻ"], 
        correctAnswer: "sẻ" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "v" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["dễ", "giò", "vè", "run"], 
        correctAnswer: "vè" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "ch" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["cha", "tre", "chợ", "chuối"], 
        correctAnswer: "tre" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "tr" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["cha", "tre", "chợ", "chuối"], 
        correctAnswer: "tre" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "th" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["thị", "thỏ", "tre", "thơ"], 
        correctAnswer: "tre" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "h" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["Hà", "An", "ba", "cá"], 
        correctAnswer: "Hà" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "b" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["Bà", "bố", "bé", "Hà"], 
        correctAnswer: "Hà" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "k" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["cá", "cò", "kẽ", "cụ"], 
        correctAnswer: "kẽ" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "n" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["Nam", "non", "bò", "Nghé"], 
        correctAnswer: "bò" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "ng" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["ngõ", "nhỏ", "nhà", "nghỉ"], 
        correctAnswer: "ngõ" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "ngh" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["ngõ", "nhỏ", "ngủ", "nghé"], 
        correctAnswer: "nghé" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "gi" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["gió", "gà", "giỏ", "giữa"], 
        correctAnswer: "gà" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "qu" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["rùa", "cá", "quà", "vịt"], 
        correctAnswer: "quà" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào không chứa âm "ph" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["phố", "phở", "bò", "phà"], 
        correctAnswer: "bò" 
    },
    {
        qType: 'SELECT',
        type: "Tìm chữ trong tiếng",
        question: 'Em hãy cho biết tiếng nào chứa âm "d" trong tiếng dưới đây:', 
        sentence: "", 
        options: ["Dế", "rắn", "cá", "bò"], 
        correctAnswer: "Dế" 
    },
    
    // --- Dạng 1: Đếm chữ cái (20 câu) ---
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "k" trong các tiếng sau đây:', 
        sentence: "Kì đà bò ở kẽ đá.",
        options: ["2", "1", "3", "4"], 
        correctAnswer: "2" 
    },
    {
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "k" trong các tiếng sau đây:',
        sentence: "kì đà, cổ cò, kể truyện, kéo co, cá cờ",
        options: ["2", "1", "3", "4"], 
        correctAnswer: "3" 
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "b" trong các tiếng sau đây:',
        sentence: "Bà cho bé búp bê.",
        options: ["2", "3", "4", "5"], 
        correctAnswer: "4"
    },
    {
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "h" trong các tiếng sau đây:',
        sentence: "Hà tả hồ cá. Hồ to có cá.",
        options: ["2", "3", "4", "5"], 
        correctAnswer: "3"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "ô" trong các tiếng sau đây:',
        sentence: "Bố và Hà đi bộ.",
        options: ["2", "3", "4", "1"], 
        correctAnswer: "2"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "đ" trong các tiếng sau đây:',
        sentence: "Bà có đỗ đỏ.",
        options: ["2", "3", "1", "4"], 
        correctAnswer: "2"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "gi" trong các tiếng sau đây:',
        sentence: "Hà có giỏ trứng gà.",
        options: ["1", "2", "3", "0"], 
        correctAnswer: "1"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "th" trong các tiếng sau đây:',
        sentence: "Nhà bà có thị. Hương cốm thơm thôn xóm.",
        options: ["4", "2", "3", "1"], 
        correctAnswer: "3"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "s" trong các tiếng sau đây:',
        sentence: "Bầy sẻ non ríu rít. Sơn ca véo von.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "2"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "x" trong các tiếng sau đây:',
        sentence: "Hà vẽ xe đạp. Sen nở thắm hồ. Hương cốm thơm thôn xóm.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "2"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "a" trong các tiếng sau đây:',
        sentence: "Nam và Hà ca hát.",
        options: ["3", "4", "5", "6"], 
        correctAnswer: "5"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "e" trong các tiếng sau đây:',
        sentence: "Bé kể mẹ nghe về bạn bè.",
        options: ["4", "5", "6", "7"], 
        correctAnswer: "4"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "o" trong các tiếng sau đây:',
        sentence: "Đàn bò gặm cỏ.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "2"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "ngh" trong các tiếng sau đây:',
        sentence: "Nghé theo mẹ ra ngõ. Nghé đã no cỏ. Nghé ngủ ở bờ đê.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "3"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "nh" trong các tiếng sau đây:',
        sentence: "Nhà bà ở ngõ nhỏ.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "2"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "ch" trong các tiếng sau đây:',
        sentence: "Mấy chú khỉ ăn chuối. Chị cho bé cá cờ.",
        options: ["2", "3", "4", "5"], 
        correctAnswer: "4"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "tr" trong các tiếng sau đây:',
        sentence: "Nam tô màu bức tranh cây tre.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "2"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "ă" trong các tiếng sau đây:',
        sentence: "Dung dăng dung dẻ.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "1"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "â" trong các tiếng sau đây:',
        sentence: "Đàn gà tha thẩn.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "1"
    },
    { 
        qType: 'SELECT',
        type: "Đếm chữ cái",
        question: 'Em hãy cho biết có bao nhiêu tiếng chứa âm "qu" trong các tiếng sau đây:',
        sentence: "Bà cho bé quà quê. Quả là chậm như rùa.",
        options: ["1", "2", "3", "4"], 
        correctAnswer: "3"
    },

    // --- Dạng 6: Sắp xếp câu (20 câu) ---
    {
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['bé.', 'Bà', 'bế'], 
        correctAnswer: "Bà bế bé." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['hát.', 'Nam', 'và', 'Hà', 'ca'], 
        correctAnswer: "Nam và Hà ca hát." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['bê.', 'Bà', 'cho', 'bé', 'búp'], 
        correctAnswer: "Bà cho bé búp bê." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['bè.', 'Bé', 'kể', 'mẹ', 'nghe', 'về', 'bạn'], 
        correctAnswer: "Bé kể mẹ nghe về bạn bè." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['cỏ.', 'Đàn', 'bò', 'gặm'], 
        correctAnswer: "Đàn bò gặm cỏ." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['cá.', 'Bố', 'bê', 'bể'], 
        correctAnswer: "Bố bê bể cá." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['đỏ.', 'Bé', 'có', 'ô'], 
        correctAnswer: "Bé có ô đỏ." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['dế.', 'Bờ', 'đê', 'có'], 
        correctAnswer: "Bờ đê có dế." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['đá.', 'Kì', 'đà', 'bò', 'ở', 'kẽ'], 
        correctAnswer: "Kì đà bò ở kẽ đá." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['dữ.', 'Cá', 'hổ', 'là', 'cá'], 
        correctAnswer: "Cá hổ là cá dữ." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['hẹ.', 'Bà', 'có', 'lá'], 
        correctAnswer: "Bà có lá hẹ." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['khế.', 'Chị', 'có', 'cá', 'kho'], 
        correctAnswer: "Chị có cá kho khế." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['Hà.', 'Mẹ', 'mua', 'nơ', 'cho'], 
        correctAnswer: "Mẹ mua nơ cho Hà." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['bà.', 'Hà', 'ghé', 'nhà'], 
        correctAnswer: "Hà ghé nhà bà." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['nhỏ.', 'Nhà', 'bà', 'ở', 'ngõ'], 
        correctAnswer: "Nhà bà ở ngõ nhỏ." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['cỏ.', 'Nghé', 'đã', 'no'], 
        correctAnswer: "Nghé đã no cỏ." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['ri.', 'Chợ', 'có', 'cá'], 
        correctAnswer: "Chợ có cá ri." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['mè.', 'Hồ', 'to', 'có', 'cá'], 
        correctAnswer: "Hồ to có cá mè." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['múa.', 'Mẹ', 'đưa', 'Hà', 'đến', 'lớp', 'học'], 
        correctAnswer: "Mẹ đưa Hà đến lớp học múa." 
    },
    { 
        qType: 'ORDER', 
        type: "Sắp xếp câu",
        question: 'Em hãy sắp xếp các tiếng sau đây thành câu có nghĩa:',
        words: ['quê.', 'Bà', 'cho', 'bé', 'quà'], 
        correctAnswer: "Bà cho bé quà quê." 
    }
];