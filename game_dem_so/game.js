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

// --- 🚀 BỘ MÁY ĐỌC GIỌNG NÓI (TTS) - ĐÃ SỬA LỖI 🚀 ---
const tts = window.speechSynthesis;
let voices = []; // Biến toàn cục để lưu giọng đọc
function loadVoices() {
    voices = tts.getVoices().filter(voice => voice.lang === 'vi-VN');
    if (voices.length === 0) {
        tts.onvoiceschanged = () => {
            voices = tts.getVoices().filter(voice => voice.lang === 'vi-VN');
            console.log("Đã tải giọng đọc tiếng Việt:", voices);
        };
        // THÊM LỆNH KÍCH HOẠT (THEO GỢI Ý CỦA BẠN)
        tts.getVoices(); 
    } else {
        console.log("Tìm thấy giọng đọc tiếng Việt:", voices);
    }
}
function speakMessage(text) {
    tts.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    if (voices.length > 0) { utterance.voice = voices[0]; }
    utterance.rate = 1.0; 
    utterance.pitch = 1.0; 
    tts.speak(utterance);
}
// --- KẾT THÚC BỘ MÁY ĐỌC ---


// --- "KHO DỮ LIỆU" VÀ "TRẠNG THÁI" TOÀN CỤC ---
let GAME_DATABASE = null; // "Kho dữ liệu" trung tâm
let QUESTION_BANK = []; 
let LAST_QUESTION_TYPE = null; 
let CURRENT_SCORE = 0;
let QUESTION_NUMBER = 1;

// --- NGÂN HÀNG THÔNG BÁO ---
const PRAISE_MESSAGES = [
    "🎉 Tuyệt vời!", "Con giỏi quá!", "Chính xác!", "Làm tốt lắm!", "Đúng rồi!"
];
const WARNING_MESSAGES = [
    "☹️ Chưa đúng rồi, con đếm lại nhé.", "Ôi, sai mất rồi! Con thử lại nào.", "Cố lên, con xem lại kỹ hơn nhé.", "Vẫn chưa chính xác."
];

// --- TRÌNH TỰ KHỞI ĐỘNG (BOOT SEQUENCE) ---
document.addEventListener('DOMContentLoaded', () => {
    loadVoices(); 
    initializeApp();
});

async function initializeApp() {
    try {
        // --- BƯỚC 1: Tải "KHO DỮ LIỆU" TRUNG TÂM ---
        const response = await fetch('kho_du_lieu.json');
        if (!response.ok) throw new Error('Không thể tải kho_du_lieu.json!');
        GAME_DATABASE = await response.json();
        console.log("Đã tải Kho Dữ Liệu.");

        // --- BƯỚC 2: KHAI BÁO "NGÂN HÀNG CÂU HỎI" (Đã "dọn dẹp") ---
        QUESTION_BANK = [
            'templates/dang_1/1a_dem_that.json',
            'templates/dang_1/1a_bay_0.json',
            'templates/dang_1/1b_nhieu_o.json',
            'templates/dang_1c/1c_chon_hinh.json'
        ];
        
        // --- BƯỚC 3: TẢI CÂU HỎI ĐẦU TIÊN ---
        loadNextQuestion();

    } catch (error) {
        console.error("Lỗi khởi động nghiêm trọng:", error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải KHO DỮ LIỆU. Không thể bắt đầu.';
    }
}

// --- "BỘ NÃO" CHỌN CÂU HỎI ---
function loadNextQuestion() {
    // 1. Reset giao diện
    const submitButton = document.getElementById('submit-button');
    submitButton.style.display = 'block'; 
    submitButton.disabled = false; 
    
    const feedbackMessage = document.getElementById('feedback-message');
    feedbackMessage.innerText = ''; 
    feedbackMessage.className = ''; 
    
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


// --- 🚀 BỘ NÃO DẠNG 1 (MASTER) - ĐÃ SỬA LỖI LOGIC "LOẠN NHÓM" 🚀 ---
function generateFillInBlank(payload, database) {
    const sceneBox = document.getElementById('scene-box'); const promptArea = document.getElementById('prompt-area');
    const generatedAnswers = {}; const sceneObjectsToDraw = []; const promptsToGenerate = []; const finalCorrectAnswers = {};
    
    // --- 1. GIAI ĐOẠN CHỌN CHỦ ĐỀ (THEME SELECTION) - ĐÃ NÂNG CẤP ---
    const rules = payload.scene_rules;
    const actorPool = database.actor_pool; 
    const numToPick = rules.num_actors_to_pick; 

    // a. "Quét kho" VÀ "Đếm"
    const groupCounts = {};
    actorPool.forEach(actor => {
        groupCounts[actor.group] = (groupCounts[actor.group] || 0) + 1;
    });

    // b. Lọc ra các nhóm (group) "Đủ điều kiện"
    const validGroups = Object.keys(groupCounts).filter(group => 
        groupCounts[group] >= numToPick
    );

    if (validGroups.length === 0) {
        console.error("Không tìm thấy nhóm nào đủ điều kiện!", rules);
        return; 
    }
    
    // c. Bốc thăm ngẫu nhiên 1 nhóm "Hợp lệ"
    const chosenGroup = validGroups[Math.floor(Math.random() * validGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);

    // --- 2. GIAI ĐOẠN CHỌN CON VẬT (ACTOR SELECTION) ---
    const chosenActors = [];
    const shuffledActors = shuffleArray(filteredActorPool);
    for (let i = 0; i < numToPick; i++) { 
        chosenActors.push(shuffledActors.pop()); 
    }
    
    // --- 3. GIAI ĐOẠN TẠO CẢNH (SCENE GENERATION) ---
    chosenActors.forEach(actor => {
        const count = getRandomInt(rules.count_min, rules.count_max);
        generatedAnswers[actor.id] = count; 
        sceneObjectsToDraw.push({ image_url: actor.image_url, count: count });
    });

    // --- 4. GIAI ĐOẠN TẠO CÂU HỎI (PROMPT GENERATION) ---
    const promptRules = payload.prompt_rules;
    if (promptRules.ask_about_all_actors) {
        chosenActors.forEach((actor, index) => {
            promptsToGenerate.push({ id: `prompt_actor_${index}`, name_vi: actor.name_vi, answer_source: actor.id });
        });
    } else if (promptRules.num_actors_to_ask > 0) {
        const shuffledToAsk = shuffleArray([...chosenActors]);
        const numToAsk = Math.min(promptRules.num_actors_to_ask, shuffledToAsk.length);
        for (let i = 0; i < numToAsk; i++) {
            const actor = shuffledToAsk.pop(); 
            promptsToGenerate.push({ id: `prompt_actor_${i}`, name_vi: actor.name_vi, answer_source: actor.id });
        }
    }
    if (promptRules.add_zero_trap && database.group_traps && database.group_traps[chosenGroup]) {
        const trapPool = database.group_traps[chosenGroup]; 
        if (trapPool.length > 0) {
            const randomTrap = trapPool[Math.floor(Math.random() * trapPool.length)];
            promptsToGenerate.push({ id: 'prompt_trap_0', name_vi: randomTrap.name_vi, answer_source: randomTrap.id });
        }
    }
    shuffleArray(promptsToGenerate);

    // --- 5. GIAI ĐOẠN VẼ CẢNH (SCENE DRAWING) ---
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

    // --- 6. GIAI ĐOẠN VẼ CÂU HỎI & TÌM ĐÁP ÁN (PROMPT RENDERING) ---
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

// --- 🚀 BỘ NÃO DẠNG 1C (MASTER) - ĐÃ SỬA LỖI LOGIC 🚀 ---
function generateSelectGroupMaster(payload, database) {
    const sceneBox = document.getElementById('scene-box'); const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none'; 
    const rules = payload.rules; const groups = shuffleArray([...payload.groups]); 
    const finalCorrectAnswers = {}; const groupContents = {};
    let targetCount, targetGroup, actorName;

    // --- 1. CHỌN "DIỄN VIÊN" (ACTOR) NGẪU NHIÊN - ĐÃ NÂNG CẤP ---
    const actorPool = database.actor_pool; 
    
    // a. "Quét kho" VÀ "Đếm" (Dạng 1c chỉ cần 1 actor, nên numToPick = 1)
    const groupCounts = {};
    actorPool.forEach(actor => {
        groupCounts[actor.group] = (groupCounts[actor.group] || 0) + 1;
    });
    // b. Lọc ra các nhóm "Đủ điều kiện" (có ít nhất 1 con vật)
    const validGroups = Object.keys(groupCounts).filter(group => groupCounts[group] >= 1);
    
    // c. Bốc thăm 1 nhóm "Hợp lệ"
    const chosenGroup = validGroups[Math.floor(Math.random() * validGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);
    
    // d. Bốc thăm 1 con vật
    const chosenActor = filteredActorPool[Math.floor(Math.random() * filteredActorPool.length)];
    actorName = chosenActor.name_vi; 
    
    // --- 2. TẠO SỐ LƯỢNG n, m (n KHÁC m) ---
    const n = getRandomInt(rules.count_min, rules.count_max);
    let m;
    do { m = getRandomInt(rules.count_min, rules.count_max); } while (m === n); 
    groupContents[groups[0].id] = n; 
    groupContents[groups[1].id] = m; 

    // --- 3. QUYẾT ĐỊNH CÂU HỎI (Hỏi n hay m?) ---
    if (Math.random() < 0.5) { targetCount = n; targetGroup = groups[0].id; }
    else { targetCount = m; targetGroup = groups[1].id; }
    finalCorrectAnswers['group_select'] = targetGroup;

    // --- 4. VẼ GIAO DIỆN HTML (Bên trong promptArea) ---
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

    // --- 5. GỬI ĐÁP ÁN ĐÚNG CHO "MÁY CHẤM" ---
    return finalCorrectAnswers;
}


// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - ĐÃ SỬA LỖI HOÀN CHỈNH 🚀 ---
function setupSubmitButton(correctAnswer) {
    const submitButton = document.getElementById('submit-button');
    const feedbackMessage = document.getElementById('feedback-message');
    
    // Phải xóa listener cũ đi (SỬA LỖI THEO HÌNH ẢNH CỦA BẠN)
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton); // Sửa 'newButton' thứ 2 thành 'submitButton'

    newButton.addEventListener('click', () => {
        newButton.disabled = true; // Vô hiệu hóa nút
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
            const message = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
            feedbackMessage.innerText = message;
            feedbackMessage.className = 'visible correct'; // Hiện ra
            speakMessage(message); // Đọc to
            
            CURRENT_SCORE += 10;
            document.getElementById('score').innerText = CURRENT_SCORE;
            newButton.style.display = 'none'; // Ẩn nút "Trả lời"

            // HẸN GIỜ 2 GIÂY TỰ ĐỘNG CHUYỂN CÂU
            setTimeout(() => {
                loadNextQuestion(); 
            }, 2000); // 2 giây

        } else {
            // ---- TRẢ LỜI SAI ----
            const message = WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)];
            feedbackMessage.innerText = message;
            feedbackMessage.className = 'visible wrong'; // Hiện ra
            speakMessage(message); // Đọc to

            // Cho phép nút "Trả lời" hoạt động trở lại
            newButton.disabled = false;
        }
    });
}