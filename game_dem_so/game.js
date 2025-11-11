// --- HÀM TIỆN ÍCH ---
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- 🚀 BỘ MÁY ĐỌC GIỌNG NÓI (TTS) 🚀 ---
const tts = window.speechSynthesis;
let voices = []; // Biến toàn cục để lưu giọng đọc
function loadVoices() {
    // Tải danh sách giọng đọc
    voices = tts.getVoices().filter(voice => voice.lang === 'vi-VN');
    if (voices.length === 0) {
        // Một số trình duyệt (như Chrome) cần sự kiện này để tải giọng đọc
        tts.onvoiceschanged = () => {
            voices = tts.getVoices().filter(voice => voice.lang === 'vi-VN');
            console.log("Đã tải giọng đọc tiếng Việt:", voices);
        };
    } else {
        console.log("Tìm thấy giọng đọc tiếng Việt:", voices);
    }
}
function speakMessage(text) {
    // Dừng mọi âm thanh đang phát (nếu có)
    tts.cancel();
    
    // Tạo một "câu nói" mới
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Thiết lập ngôn ngữ là Tiếng Việt
    utterance.lang = 'vi-VN';
    
    // Nếu tìm thấy giọng đọc 'vi-VN' chuẩn, hãy dùng nó
    if (voices.length > 0) {
        utterance.voice = voices[0]; // Dùng giọng đầu tiên tìm thấy
    }
    
    utterance.rate = 1.0; // Tốc độ (1.0 là bình thường)
    utterance.pitch = 1.0; // Cao độ
    
    // Bắt đầu nói
    tts.speak(utterance);
}
// --- KẾT THÚC BỘ MÁY ĐỌC ---


// --- "KHO DỮ LIỆU" VÀ "TRẠNG THÁI" TOÀN CỤC ---
let GAME_DATABASE = null; 
let QUESTION_BANK = []; 
let LAST_QUESTION_TYPE = null; 
let CURRENT_SCORE = 0;
let QUESTION_NUMBER = 1;

// --- 🚀 NGÂN HÀNG THÔNG BÁO (THEO YÊU CẦU CỦA BẠN) 🚀 ---
const PRAISE_MESSAGES = [
    "🎉 Tuyệt vời!",
    "Con giỏi quá!",
    "Chính xác!",
    "Làm tốt lắm!",
    "Đúng rồi!"
];
const WARNING_MESSAGES = [
    "☹️ Chưa đúng rồi, con đếm lại nhé.",
    "Ôi, sai mất rồi! Con thử lại nào.",
    "Cố lên, con xem lại kỹ hơn nhé.",
    "Vẫn chưa chính xác."
];

// --- TRÌNH TỰ KHỞI ĐỘNG (BOOT SEQUENCE) ---
document.addEventListener('DOMContentLoaded', () => {
    loadVoices(); // Tải giọng đọc ngay khi bắt đầu
    initializeApp();
});

async function initializeApp() {
    try {
        // --- BƯỚC 1: Tải "KHO DỮ LIỆU" TRUNG TÂM (CHỈ 1 LẦN) ---
        const response = await fetch('kho_du_lieu.json');
        if (!response.ok) throw new Error('Không thể tải kho_du_lieu.json!');
        GAME_DATABASE = await response.json();
        console.log("Đã tải Kho Dữ Liệu.");

        // --- BƯỚC 2: KHAI BÁO "NGÂN HÀNG CÂU HỎI" ---
        QUESTION_BANK = [
            'master_template_dang_1.json', // Dạng 1
            'master_template_1c.json'      // Dạng 1c
        ];
        
        // --- BƯỚC 3: TẢI CÂU HỎI ĐẦU TIÊN ---
        // (Đã xóa listener của nút "Next")
        loadNextQuestion();

    } catch (error) {
        console.error("Lỗi khởi động nghiêm trọng:", error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải KHO DỮ LIỆU. Không thể bắt đầu.';
    }
}

// --- "BỘ NÃO" CHỌN CÂU HỎI (ĐÃ NÂNG CẤP) ---
function loadNextQuestion() {
    // 1. Reset giao diện
    const submitButton = document.getElementById('submit-button');
    submitButton.style.display = 'block'; // Hiện nút Trả lời
    submitButton.disabled = false; // Cho phép bấm
    
    const feedbackMessage = document.getElementById('feedback-message');
    feedbackMessage.innerText = ''; // Xóa thông báo cũ
    feedbackMessage.className = ''; // Xóa class 'correct'/'wrong'
    
    // 2. Cập nhật số câu
    document.getElementById('question-count').innerText = QUESTION_NUMBER;
    QUESTION_NUMBER++;

    let chosenTemplateFile;

    // 3. Logic "CHỐNG LẶP DẠNG BÀI"
    if (QUESTION_BANK.length > 1) {
        let attempts = 0;
        do {
            chosenTemplateFile = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
            attempts++;
        } while (chosenTemplateFile === LAST_QUESTION_TYPE && attempts < 5);
    } else {
        chosenTemplateFile = QUESTION_BANK[0];
    }

    LAST_QUESTION_TYPE = chosenTemplateFile;
    console.log("Tải câu hỏi:", chosenTemplateFile);
    
    // 4. Tải "Khuôn Mẫu" (Luật chơi)
    loadQuestionTemplate(chosenTemplateFile);
}


// "Vỏ Chung": Hàm tải "mảng lệnh" (JSON)
async function loadQuestionTemplate(questionFile) {
    try {
        const response = await fetch(questionFile);
        if (!response.ok) throw new Error(`Không thể tải file câu hỏi: ${questionFile}`);
        const questionTemplate = await response.json();
        
        renderQuestion(questionTemplate, GAME_DATABASE);

    } catch (error) {
        console.error(error);
        // Sửa lỗi "Giao diện ma"
        document.getElementById('instruction-text').innerText = 'Lỗi tải câu hỏi. Vui lòng thử lại.';
        document.getElementById('scene-box').innerHTML = '';
        document.getElementById('prompt-area').innerHTML = '';
        document.getElementById('submit-button').style.display = 'none';
    }
}

// "Bộ Điều Phối" (Renderer Switch)
function renderQuestion(question, database) {
    document.getElementById('instruction-text').innerText = question.instruction;
    
    document.getElementById('scene-box').innerHTML = '';
    document.getElementById('prompt-area').innerHTML = '';
    document.getElementById('scene-box').style.display = 'block';

    let payload = question.payload; 
    let correctAnswers; 

    switch (question.type) {
        case 'FILL_IN_BLANK_MASTER': 
            correctAnswers = generateFillInBlank(payload, database);
            break;
        case 'SELECT_GROUP_MASTER':
            correctAnswers = generateSelectGroupMaster(payload, database);
            break;
        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
            return;
    }

    setupSubmitButton(correctAnswers);
}


// --- 🚀 BỘ NÃO DẠNG 1 (MASTER) 🚀 ---
function generateFillInBlank(payload, database) {
    // (Toàn bộ code logic của Dạng 1... từ Giai đoạn 1 đến 7)
    // ... (Giữ nguyên code generateFillInBlank cũ của bạn) ...
    const sceneBox = document.getElementById('scene-box'); const promptArea = document.getElementById('prompt-area');
    const generatedAnswers = {}; const sceneObjectsToDraw = []; const promptsToGenerate = []; const finalCorrectAnswers = {};
    const rules = payload.scene_rules; const actorPool = database.actor_pool; 
    const allGroups = [...new Set(actorPool.map(actor => actor.group))];
    const chosenGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);
    const chosenActors = []; const shuffledActors = shuffleArray(filteredActorPool);
    const numToPick = Math.min(rules.num_actors_to_pick, shuffledActors.length);
    for (let i = 0; i < numToPick; i++) { chosenActors.push(shuffledActors.pop()); }
    chosenActors.forEach(actor => {
        const count = getRandomInt(rules.count_min, rules.count_max);
        generatedAnswers[actor.id] = count; 
        sceneObjectsToDraw.push({ image_url: actor.image_url, count: count });
    });
    const promptRules = payload.prompt_rules;
    if (promptRules.ask_about_all_actors) {
        chosenActors.forEach((actor, index) => {
            promptsToGenerate.push({ id: `prompt_actor_${index}`, name_vi: actor.name_vi, answer_source: actor.id });
        });
    }
    if (promptRules.add_zero_trap && database.group_traps && database.group_traps[chosenGroup]) {
        const trapPool = database.group_traps[chosenGroup]; 
        if (trapPool.length > 0) {
            const randomTrap = trapPool[Math.floor(Math.random() * trapPool.length)];
            promptsToGenerate.push({ id: 'prompt_trap_0', name_vi: randomTrap.name_vi, answer_source: randomTrap.id });
        }
    }
    shuffleArray(promptsToGenerate);
    const placedPositions = []; const imgSize = 60; const retryLimit = 20; const minSafeDistance = imgSize * 0.9; 
    sceneObjectsToDraw.forEach(object => {
        for (let i = 0; i < object.count; i++) {
            const img = document.createElement('img');
            img.src = `./assets/${object.image_url}`; 
            img.alt = object.image_url;
            let newTop, newLeft, isOverlapping, attempts = 0;
            do {
                const maxTop = sceneBox.clientHeight - imgSize; const maxLeft = sceneBox.clientWidth - imgSize;
                newTop = Math.random() * maxTop; newLeft = Math.random() * maxLeft;
                isOverlapping = false; attempts++;
                for (const pos of placedPositions) {
                    const deltaX = Math.abs(newLeft - pos.left); const deltaY = Math.abs(newTop - pos.top);
                    if (deltaX < minSafeDistance && deltaY < minSafeDistance) { isOverlapping = true; break; }
                }
            } while (isOverlapping && attempts < retryLimit);
            placedPositions.push({ top: newTop, left: newLeft });
            img.style.top = `${newTop}px`; img.style.left = `${newLeft}px`;
            const randomRotation = (Math.random() - 0.5) * 30; 
            img.style.transform = `rotate(${randomRotation}deg)`;
            sceneBox.appendChild(img);
        }
    });
    promptsToGenerate.forEach(prompt => {
        const line = document.createElement('div');
        line.className = 'prompt-line';
        const textBefore = document.createTextNode(`Hình trên có số `);
        const objectName = document.createElement('strong'); objectName.innerText = prompt.name_vi; 
        const textAfter = document.createTextNode(` là`);
        const unit = document.createTextNode(` con.`);
        const input = document.createElement('input');
        input.type = 'number'; input.min = '0'; input.dataset.promptId = prompt.id; 
        const sourceId = prompt.answer_source; 
        if (generatedAnswers.hasOwnProperty(sourceId)) { finalCorrectAnswers[prompt.id] = generatedAnswers[sourceId]; }
        else { finalCorrectAnswers[prompt.id] = 0; }
        line.appendChild(textBefore); line.appendChild(objectName); line.appendChild(textAfter);
        line.appendChild(input); line.appendChild(unit);
        promptArea.appendChild(line);
    });
    return finalCorrectAnswers;
}

// --- 🚀 BỘ NÃO DẠNG 1C (MASTER) 🚀 ---
function generateSelectGroupMaster(payload, database) {
    // (Toàn bộ code logic của Dạng 1c... giữ nguyên y hệt)
    // ... (Giữ nguyên code generateSelectGroupMaster cũ của bạn) ...
    const sceneBox = document.getElementById('scene-box'); const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none'; 
    const rules = payload.rules; const groups = shuffleArray([...payload.groups]); 
    const finalCorrectAnswers = {}; const groupContents = {};
    let targetCount, targetGroup, actorName;
    const actorPool = database.actor_pool; 
    const allGroups = [...new Set(actorPool.map(actor => actor.group))];
    const chosenGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);
    const chosenActor = filteredActorPool[Math.floor(Math.random() * filteredActorPool.length)];
    actorName = chosenActor.name_vi; 
    const n = getRandomInt(rules.count_min, rules.count_max);
    let m;
    do { m = getRandomInt(rules.count_min, rules.count_max); } while (m === n); 
    groupContents[groups[0].id] = n; 
    groupContents[groups[1].id] = m; 
    if (Math.random() < 0.5) { targetCount = n; targetGroup = groups[0].id; }
    else { targetCount = m; targetGroup = groups[1].id; }
    finalCorrectAnswers['group_select'] = targetGroup;
    const container = document.createElement('div');
    container.className = 'group-select-container';
    payload.groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-box';
        const label = document.createElement('div');
        label.className = 'group-label';
        label.innerText = group.label; 
        groupDiv.appendChild(label);
        const itemCount = groupContents[group.id];
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';
        for (let i = 0; i < itemCount; i++) {
            const img = document.createElement('img');
            img.src = `./assets/${chosenActor.image_url}`;
            img.alt = chosenActor.name_vi;
            img.className = 'item-in-group';
            itemContainer.appendChild(img);
        }
        groupDiv.appendChild(itemContainer);
        container.appendChild(groupDiv);
    });
    const questionLine = document.createElement('div');
    questionLine.className = 'prompt-line';
    const questionText = `Hình có ${targetCount} ${actorName} là hình`; 
    questionLine.appendChild(document.createTextNode(questionText));
    const selectMenu = document.createElement('select');
    selectMenu.id = 'group_select_input'; 
    selectMenu.dataset.promptId = 'group_select'; 
    const defaultOption = document.createElement('option');
    defaultOption.value = ""; 
    defaultOption.innerText = "Chọn";
    selectMenu.appendChild(defaultOption);
    payload.groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id; 
        option.innerText = group.label; 
        selectMenu.appendChild(option);
    });
    questionLine.appendChild(selectMenu);
    container.appendChild(questionLine);
    promptArea.appendChild(container);
    return finalCorrectAnswers;
}


// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - NÂNG CẤP "AUTO-NEXT" & "BIẾT NÓI" 🚀 ---
function setupSubmitButton(correctAnswer) {
    const submitButton = document.getElementById('submit-button');
    const feedbackMessage = document.getElementById('feedback-message');
    
    // Phải xóa listener cũ đi để tránh lỗi
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, newButton);

    newButton.addEventListener('click', () => {
        // Vô hiệu hóa nút ngay lập tức
        newButton.disabled = true;
        let allCorrect = true; 

        // 1. ĐỌC TỪ Ô NHẬP SỐ (CHO DẠNG 1)
        const numberInputs = document.querySelectorAll('#prompt-area input[type="number"]');
        numberInputs.forEach(input => {
            const promptId = input.dataset.promptId;
            const userAnswer = parseInt(input.value) || 0;
            const realAnswer = correctAnswer[promptId];
            if (userAnswer !== realAnswer) {
                allCorrect = false; input.style.backgroundColor = '#FFDDE0';
            } else {
                input.style.backgroundColor = '#DDFEE0';
            }
        });

        // 2. ĐỌC TỪ MENU THẢ XUỐNG (CHO DẠNG 1C)
        const selectInputs = document.querySelectorAll('#prompt-area select');
        selectInputs.forEach(select => {
            const promptId = select.dataset.promptId; 
            const userAnswer = select.value; 
            const realAnswer = correctAnswer[promptId];
            if (userAnswer !== realAnswer) {
                allCorrect = false; select.style.backgroundColor = '#FFDDE0';
            } else {
                select.style.backgroundColor = '#DDFEE0';
            }
        });

        // 3. XỬ LÝ KẾT QUẢ (ĐÚNG HOẶC SAI)
        if (allCorrect) {
            // ---- TRẢ LỜI ĐÚNG ----
            
            // Lấy 1 lời khen ngẫu nhiên
            const message = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
            feedbackMessage.innerText = message;
            feedbackMessage.className = 'visible correct'; // Hiện ra và có màu xanh
            speakMessage(message); // <-- 🚀 GỌI BỘ MÁY ĐỌC
            
            // Cập nhật điểm
            CURRENT_SCORE += 10;
            document.getElementById('score').innerText = CURRENT_SCORE;

            // Ẩn nút "Trả lời"
            newButton.style.display = 'none';

            // HẸN GIỜ 2 GIÂY TỰ ĐỘNG CHUYỂN CÂU
            setTimeout(() => {
                loadNextQuestion(); // Tải câu tiếp theo
            }, 2000); // 2000ms = 2 giây

        } else {
            // ---- TRẢ LỜI SAI ----
            
            // Lấy 1 cảnh báo ngẫu nhiên
            const message = WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)];
            feedbackMessage.innerText = message;
            feedbackMessage.className = 'visible wrong'; // Hiện ra và có màu đỏ
            speakMessage(message); // <-- 🚀 GỌI BỘ MÁY ĐỌC

            // Cho phép nút "Trả lời" hoạt động trở lại
            newButton.disabled = false;
        }
    });
}