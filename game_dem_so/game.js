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
let GAME_DATABASE = null; 
let QUESTION_BANK = []; 
// let LAST_QUESTION_TYPE = null; // <-- Đã xóa, không cần nữa
let CURRENT_QUESTION_INDEX = 0; // <-- THAY ĐỔI 1: Biến mới để theo dõi thứ tự
let CURRENT_SCORE = 0;
let QUESTION_NUMBER = 1;

// --- NGÂN HÀNG THÔNG BÁO (ĐÃ BỎ EMOJI) ---
const PRAISE_MESSAGES = [
    "Tuyệt vời!", "Con giỏi quá!", "Chính xác!", "Làm tốt lắm!", "Đúng rồi!"
];
const WARNING_MESSAGES = [
    "Chưa đúng rồi, con đếm lại nhé.", "Ôi, sai mất rồi! Con thử lại nào.", "Cố lên, con xem lại kỹ hơn nhé.", "Vẫn chưa chính xác."
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

        // --- BƯỚC 2: KHAI BÁO "NGÂN HÀNG CÂU HỎI" ---
        // Mảng này PHẢI được sắp xếp theo đúng thứ tự bạn muốn
        QUESTION_BANK = [
            'ch_dang_1.json', // Index 0
            'ch_dang_2.json', // Index 1
            'ch_dang_3.json', // Index 2
            'ch_dang_4.json', // Index 3
            'ch_dang_5.json', // Index 4
            'ch_dang_6.json', // Index 5
            'ch_dang_7.json'  // Index 6
        ];
        
        // --- BƯỚC 3: TẢI CÂU HỎI ĐẦU TIÊN ---
        loadNextQuestion();

    } catch (error) {
        console.error("Lỗi khởi động nghiêm trọng:", error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải KHO DỮ LIỆU. Không thể bắt đầu.';
    }
}

// --- "BỘ NÃO" CHỌN CÂU HỎI (*** THAY ĐỔI 2: VIẾT LẠI HOÀN TOÀN ***) ---
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

    // 3. LOGIC MỚI: TẢI CÂU HỎI THEO THỨ TỰ (TUẦN TỰ)
    
    // Lấy tệp câu hỏi theo index hiện tại
    let chosenTemplateFile = QUESTION_BANK[CURRENT_QUESTION_INDEX];
    
    // Tăng index lên cho lần gọi tiếp theo
    CURRENT_QUESTION_INDEX++;
    
    // Nếu index vượt quá độ dài mảng, quay lại từ đầu (lặp lại)
    if (CURRENT_QUESTION_INDEX >= QUESTION_BANK.length) {
        CURRENT_QUESTION_INDEX = 0;
    }
    
    console.log("Tải câu hỏi tuần tự:", chosenTemplateFile);
    
    // 4. Tải "Khuôn Mẫu" (Luật chơi)
    loadQuestionTemplate(chosenTemplateFile);
}


// "Vỏ Chung": Hàm tải "mảng lệnh" (JSON)
async function loadQuestionTemplate(questionFile) {
    try {
        const response = await fetch('./templates/' + questionFile);
        if (!response.ok) throw new Error(`Không thể tải file câu hỏi: ${questionFile}`);
        const questionTemplate = await response.json();
        
        renderQuestion(questionTemplate, GAME_DATABASE);

    } catch (error) {
        console.error(error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải câu hỏi. Vui lòng thử lại.';
        document.getElementById('scene-box').innerHTML = '';
        document.getElementById('prompt-area').innerHTML = '';
        document.getElementById('submit-button').style.display = 'none';
    }
}

// "Bộ Điều Phối" (Renderer Switch) - (Đã thêm Dạng 5, 6, 7)
function renderQuestion(question, database) {
    document.getElementById('instruction-text').innerText = question.instruction;
    
    document.getElementById('scene-box').innerHTML = '';
    document.getElementById('prompt-area').innerHTML = '';
    document.getElementById('scene-box').style.display = 'block';

    let payload = question.payload; 
    let correctAnswers; 
    
    let useMainSubmitButton = true; 

    switch (question.type) {
        case 'FILL_IN_BLANK_MASTER': 
            correctAnswers = generateFillInBlank(payload, database);
            break;
        case 'SELECT_GROUP_MASTER':
            correctAnswers = generateSelectGroupMaster(payload, database);
            break;
        case 'COMPARE_GROUPS_MASTER':
            correctAnswers = generateCompareGroups(payload, database);
            useMainSubmitButton = false;
            break;
        case 'COMPARE_ITEMS_SELECT':
            correctAnswers = generateCompareItemsSelect(payload, database);
            useMainSubmitButton = true;
            break;
        case 'COMPARE_ITEMS_BUTTONS':
            correctAnswers = generateCompareItemsButtons(payload, database);
            useMainSubmitButton = false;
            break;
        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
            return;
    }

    if (useMainSubmitButton) {
        setupSubmitButton(correctAnswers);
    } else {
        document.getElementById('submit-button').style.display = 'none';
    }
}


// --- 🚀 BỘ NÃO DẠNG 1 (MASTER) - ĐÃ SỬA LỖI LOGIC 🚀 ---
function generateFillInBlank(payload, database) {
    const sceneBox = document.getElementById('scene-box'); const promptArea = document.getElementById('prompt-area');
    const generatedAnswers = {}; const sceneObjectsToDraw = []; const promptsToGenerate = []; const finalCorrectAnswers = {};
    
    const rules = payload.scene_rules;
    const actorPool = database.actor_pool; 
    const numToPick = rules.num_actors_to_pick;

    const groupCounts = {};
    actorPool.forEach(actor => {
        groupCounts[actor.group] = (groupCounts[actor.group] || 0) + 1;
    });

    const validGroups = Object.keys(groupCounts).filter(group => 
        groupCounts[group] >= numToPick
    );

    if (validGroups.length === 0) {
        console.error("Không tìm thấy nhóm nào đủ điều kiện!", rules);
        return;
    }
    
    const chosenGroup = validGroups[Math.floor(Math.random() * validGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);

    const chosenActors = [];
    const shuffledActors = shuffleArray(filteredActorPool);
    for (let i = 0; i < numToPick; i++) { 
        chosenActors.push(shuffledActors.pop()); 
    }
    
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

// --- 🚀 BỘ NÃO DẠNG 1C / DẠNG 4 (MASTER) 🚀 ---
function generateSelectGroupMaster(payload, database) {
    const sceneBox = document.getElementById('scene-box'); const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none'; 
    const rules = payload.rules; const groups = shuffleArray([...payload.groups]); 
    const finalCorrectAnswers = {}; const groupContents = {};
    let targetCount, targetGroup, actorName;

    const actorPool = database.actor_pool; 
    
    const groupCounts = {};
    actorPool.forEach(actor => {
        groupCounts[actor.group] = (groupCounts[actor.group] || 0) + 1;
    });
    const validGroups = Object.keys(groupCounts).filter(group => groupCounts[group] >= 1);
    
    const chosenGroup = validGroups[Math.floor(Math.random() * validGroups.length)];
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


// --- 🚀 BỘ NÃO DẠNG 5 (COMPARE GROUPS) 🚀 ---
function generateCompareGroups(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none';
    
    const rules = payload.rules;
    const groups = payload.groups;
    const finalCorrectAnswers = {};

    const actorPool = database.actor_pool; 
    const groupCounts = {};
    actorPool.forEach(actor => {
        groupCounts[actor.group] = (groupCounts[actor.group] || 0) + 1;
    });
    const validGroups = Object.keys(groupCounts).filter(group => groupCounts[group] >= 1);
    const chosenGroup = validGroups[Math.floor(Math.random() * validGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);
    const chosenActor = filteredActorPool[Math.floor(Math.random() * filteredActorPool.length)];
    const actorName = chosenActor.name_vi;
    const actorImg = chosenActor.image_url;

    const m_count = getRandomInt(rules.count_min, rules.count_max);
    let n_count;
    do {
        n_count = getRandomInt(rules.count_min, rules.count_max);
    } while (m_count === n_count);

    const groupContents = {
        [groups[0].id]: m_count,
        [groups[1].id]: n_count
    };

    const isMoreQuestion = Math.random() < 0.5;
    let questionText, correctGroupId;

    if (isMoreQuestion) {
        questionText = `Hỏi số ${actorName} ở hình nào nhiều hơn?`;
        correctGroupId = (m_count > n_count) ? groups[0].id : groups[1].id;
    } else {
        questionText = `Hỏi số ${actorName} ở hình nào ít hơn?`;
        correctGroupId = (m_count < n_count) ? groups[0].id : groups[1].id;
    }
    
    const container = document.createElement('div');
    container.className = 'group-select-container';

    groups.forEach(group => {
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
            img.src = `./assets/${actorImg}`;
            img.alt = actorName;
            img.className = 'item-in-group';
            itemContainer.appendChild(img);
        }
        groupDiv.appendChild(itemContainer);
        container.appendChild(groupDiv);
    });
    
    const questionEl = document.createElement('p');
    questionEl.className = 'question-prompt';
    questionEl.innerText = questionText;
    container.appendChild(questionEl);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'choice-container';
    
    groups.forEach(group => {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'choice-button';
        choiceButton.innerText = group.label;
        choiceButton.dataset.choiceId = group.id;

        choiceButton.addEventListener('click', () => {
            handleChoiceClick(group.id, correctGroupId, choiceContainer);
        });
        choiceContainer.appendChild(choiceButton);
    });
    
    container.appendChild(choiceContainer);
    promptArea.appendChild(container);

    return null; 
}

// Hàm xử lý "MÁY CHẤM ĐIỂM" của Dạng 5 (và 7)
function handleChoiceClick(userChoiceId, correctChoiceId, container) {
    const allButtons = container.querySelectorAll('.choice-button');
    const clickedButton = container.querySelector(`[data-choice-id="${userChoiceId}"]`);
    const feedbackMessage = document.getElementById('feedback-message');

    allButtons.forEach(btn => btn.disabled = true);

    if (userChoiceId === correctChoiceId) {
        clickedButton.classList.add('correct');
        const message = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
        feedbackMessage.innerText = message;
        feedbackMessage.className = 'visible correct';
        speakMessage(message);
        
        CURRENT_SCORE += 10;
        document.getElementById('score').innerText = CURRENT_SCORE;

        setTimeout(() => {
            loadNextQuestion(); 
        }, 2000);

    } else {
        clickedButton.classList.add('wrong');
        const correctButton = container.querySelector(`[data-choice-id="${correctChoiceId}"]`);
        if (correctButton) {
            correctButton.classList.add('correct');
        }
        
        const message = WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)];
        feedbackMessage.innerText = message;
        feedbackMessage.className = 'visible wrong';
        speakMessage(message);

        setTimeout(() => {
            allButtons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'wrong');
            });
            feedbackMessage.className = '';
        }, 2000);
    }
}


// --- 🚀 BỘ NÃO DẠNG 6 (COMPARE ITEMS SELECT) 🚀 ---
function generateCompareItemsSelect(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none';
    
    const rules = payload.rules;
    const options = payload.options;
    const finalCorrectAnswers = {};

    const actorPool = database.actor_pool;
    
    const groupCounts = {};
    actorPool.forEach(actor => {
        groupCounts[actor.group] = (groupCounts[actor.group] || 0) + 1;
    });
    const validGroups = Object.keys(groupCounts).filter(group => groupCounts[group] >= 2);
    
    if (validGroups.length === 0) {
        console.error("Không tìm thấy nhóm nào đủ 2 item cho Dạng 6!");
        return;
    }

    const chosenGroup = validGroups[Math.floor(Math.random() * validGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);
    
    const shuffledActors = shuffleArray(filteredActorPool);
    const actor1 = shuffledActors.pop();
    const actor2 = shuffledActors.pop();

    const m_count = getRandomInt(rules.count_min, rules.count_max);
    const n_count = getRandomInt(rules.count_min, rules.count_max);

    let correctOptionId;
    if (m_count > n_count) {
        correctOptionId = 'nhieu_hon';
    } else if (m_count < n_count) {
        correctOptionId = 'it_hon';
    } else {
        correctOptionId = 'bang';
    }
    finalCorrectAnswers['comparison_select'] = correctOptionId;

    const container = document.createElement('div');
    container.className = 'comparison-container';

    const row1 = document.createElement('div');
    row1.className = 'comparison-row';
    for (let i = 0; i < m_count; i++) {
        const img = document.createElement('img');
        img.src = `./assets/${actor1.image_url}`;
        img.alt = actor1.name_vi;
        row1.appendChild(img);
    }
    container.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'comparison-row';
    for (let i = 0; i < n_count; i++) {
        const img = document.createElement('img');
        img.src = `./assets/${actor2.image_url}`;
        img.alt = actor2.name_vi;
        row2.appendChild(img);
    }
    container.appendChild(row2);

    const questionLine = document.createElement('div');
    questionLine.className = 'prompt-line'; 
    
    questionLine.appendChild(document.createTextNode(`Từ hình trên, ta thấy số ${actor1.name_vi} `));
    
    const selectMenu = document.createElement('select');
    selectMenu.dataset.promptId = 'comparison_select';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = ""; 
    defaultOption.innerText = "Chọn";
    selectMenu.appendChild(defaultOption);
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.id;
        option.innerText = opt.text_vi; 
        selectMenu.appendChild(option);
    });
    
    questionLine.appendChild(selectMenu);
    questionLine.appendChild(document.createTextNode(` số ${actor2.name_vi}.`));
    
    container.appendChild(questionLine);
    promptArea.appendChild(container);

    return finalCorrectAnswers;
}


// --- 🚀 BỘ NÃO DẠNG 7 (COMPARE ITEMS BUTTONS) 🚀 ---
function generateCompareItemsButtons(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none';
    
    const rules = payload.rules;
    const finalCorrectAnswers = {};

    const actorPool = database.actor_pool;
    const groupCounts = {};
    actorPool.forEach(actor => {
        groupCounts[actor.group] = (groupCounts[actor.group] || 0) + 1;
    });
    const validGroups = Object.keys(groupCounts).filter(group => groupCounts[group] >= 2);
    
    if (validGroups.length === 0) {
        console.error("Không tìm thấy nhóm nào đủ 2 item cho Dạng 7!");
        return;
    }

    const chosenGroup = validGroups[Math.floor(Math.random() * validGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);
    
    const shuffledActors = shuffleArray(filteredActorPool);
    const actor1 = shuffledActors.pop();
    const actor2 = shuffledActors.pop();

    const m_count = getRandomInt(rules.count_min, rules.count_max);
    let n_count;
    do {
        n_count = getRandomInt(rules.count_min, rules.count_max);
    } while (m_count === n_count && rules.force_unequal);

    let correctText, wrongText;
    const text_more = `Số ${actor1.name_vi} nhiều hơn số ${actor2.name_vi}`;
    const text_less = `Số ${actor1.name_vi} ít hơn số ${actor2.name_vi}`;

    if (m_count > n_count) {
        correctText = text_more;
        wrongText = text_less;
    } else {
        correctText = text_less;
        wrongText = text_more;
    }

    let choices = [
        { id: 'correct', text: correctText },
        { id: 'wrong', text: wrongText }
    ];
    shuffleArray(choices);

    const container = document.createElement('div');
    container.className = 'comparison-container';

    const row1 = document.createElement('div');
    row1.className = 'comparison-row';
    for (let i = 0; i < m_count; i++) {
        const img = document.createElement('img');
        img.src = `./assets/${actor1.image_url}`;
        img.alt = actor1.name_vi;
        row1.appendChild(img);
    }
    container.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'comparison-row';
    for (let i = 0; i < n_count; i++) {
        const img = document.createElement('img');
        img.src = `./assets/${actor2.image_url}`;
        img.alt = actor2.name_vi;
        row2.appendChild(img);
    }
    container.appendChild(row2);

    const questionEl = document.createElement('p');
    questionEl.className = 'question-prompt';
    questionEl.innerText = 'Phát biểu nào dưới đây đúng?';
    container.appendChild(questionEl);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'choice-container';
    
    choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'choice-button';
        choiceButton.innerText = choice.text;
        choiceButton.dataset.choiceId = choice.id;

        choiceButton.addEventListener('click', () => {
            handleChoiceClick(choice.id, 'correct', choiceContainer);
        });
        choiceContainer.appendChild(choiceButton);
    });
    
    container.appendChild(choiceContainer);
    promptArea.appendChild(container);

    return null; 
}


// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - ĐÃ SỬA LỖI HOÀN CHỈNH 🚀 ---
function setupSubmitButton(correctAnswer) {
    const submitButton = document.getElementById('submit-button');
    const feedbackMessage = document.getElementById('feedback-message');
    
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton); 

    newButton.addEventListener('click', () => {
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

        // 2. ĐỌC TỪ MENU THẢ XUỐNG (CHO DẠNG 1C, DẠNG 6)
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
            feedbackMessage.className = 'visible correct';
            speakMessage(message);
            
            CURRENT_SCORE += 10;
            document.getElementById('score').innerText = CURRENT_SCORE;
            newButton.style.display = 'none';

            setTimeout(() => {
                loadNextQuestion(); 
            }, 2000);

        } else {
            // ---- TRẢ LỜI SAI ----
            const message = WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)];
            feedbackMessage.innerText = message;
            feedbackMessage.className = 'visible wrong';
            speakMessage(message);

            newButton.disabled = false;
        }
    });
}