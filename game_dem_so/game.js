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
let CURRENT_QUESTION_INDEX = 0; // Biến theo dõi thứ tự
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

        // --- BƯỚC 2: KHAI BÁO "NGÂN HÀNG CÂU HỎI" (ĐÃ THÊM DẠNG 11) ---
        QUESTION_BANK = [
            'ch_dang_1.json',
            'ch_dang_2.json',
            'ch_dang_3.json',
            'ch_dang_4.json',
            'ch_dang_5.json',
            'ch_dang_6.json',
            'ch_dang_7.json',
            'ch_dang_8.json',
            'ch_dang_9.json',
            'ch_dang_10.json', 
            'ch_dang_11.json', // <--- THÊM MỚI
            'ch_dang_18.json'
        ];
        
        // --- BƯỚC 3: TẢI CÂU HỎI ĐẦU TIÊN ---
        loadNextQuestion();

    } catch (error) {
        console.error("Lỗi khởi động nghiêm trọng:", error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải KHO DỮ LIỆU. Không thể bắt đầu.';
    }
}

// --- "BỘ NÃO" CHỌN CÂU HỎI (CHẾ ĐỘ TUẦN TỰ) ---
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
    let chosenTemplateFile = QUESTION_BANK[CURRENT_QUESTION_INDEX];
    CURRENT_QUESTION_INDEX++;
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

// "Bộ Điều Phối" (Renderer Switch) - (ĐÃ THÊM DẠNG 11)
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
        case 'MULTI_SELECT_COMPARE':
            correctAnswers = generateMultiSelectCompare(payload, database);
            useMainSubmitButton = true;
            break;
        case 'SELECT_NUMBER_COMPARE':
            correctAnswers = generateSelectNumberCompare(payload, database);
            useMainSubmitButton = false;
            break;
        case 'COMPARE_PAIRS_MULTI_GROUP':
            correctAnswers = generateComparePairsMultiGroup(payload, database);
            useMainSubmitButton = false;
            break;
        case 'COMPARE_MULTI_GROUPS':
            correctAnswers = generateCompareMultiGroups(payload, database);
            useMainSubmitButton = false;
            break;
        // --- CASE MỚI CHO DẠNG 11 ---
        case 'ADD_SUBTRACT_PICTORIAL':
            correctAnswers = generateAddSubtractPictorial(payload, database);
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


// --- 🚀 BỘ NÃO DẠNG 1 (MASTER) ---
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

// Hàm xử lý "MÁY CHẤM ĐIỂM" của Dạng 5, 7, 9, 10, 11, 18
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


// --- 🚀 BỘ NÃO DẠNG 8 (MULTI-SELECT COMPARE) 🚀 ---
function generateMultiSelectCompare(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none';
    
    const rules = payload.rules;
    const finalCorrectAnswers = {};

    if (!database.item_pairs || database.item_pairs.length === 0) {
        console.error("Không tìm thấy 'item_pairs' trong kho_du_lieu.json!");
        return;
    }
    const randomPair = database.item_pairs[Math.floor(Math.random() * database.item_pairs.length)];
    const actor1_id = randomPair[0];
    const actor2_id = randomPair[1];

    const actor1 = database.actor_pool.find(actor => actor.id === actor1_id);
    const actor2 = database.actor_pool.find(actor => actor.id === actor2_id);
    
    if (!actor1 || !actor2) {
        console.error(`Không tìm thấy actor cho cặp ${actor1_id}, ${actor2_id}`);
        return;
    }

    const m_count = getRandomInt(rules.count_min, rules.count_max);
    let n_count;
    do {
        n_count = getRandomInt(rules.count_min, rules.count_max);
    } while (m_count === n_count && rules.force_unequal);

    const statements = [
        { id: 'choice_0', text: `Số ${actor1.name_vi} ít hơn số ${actor2.name_vi}`, isCorrect: m_count < n_count },
        { id: 'choice_1', text: `Số ${actor2.name_vi} nhiều hơn số ${actor1.name_vi}`, isCorrect: n_count > m_count },
        { id: 'choice_2', text: `Số ${actor1.name_vi} nhiều hơn số ${actor2.name_vi}`, isCorrect: m_count > n_count },
        { id: 'choice_3', text: `Số ${actor2.name_vi} ít hơn số ${actor1.name_vi}`, isCorrect: n_count < m_count }
    ];

    statements.forEach(stmt => {
        finalCorrectAnswers[stmt.id] = stmt.isCorrect;
    });

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
    questionEl.innerText = 'Từ hình vẽ trên, các nhận định nào dưới đây đúng?';
    container.appendChild(questionEl);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'multi-choice-container';
    
    statements.forEach(stmt => {
        const choiceButton = document.createElement('div');
        choiceButton.className = 'choice-button-multi';
        choiceButton.innerText = stmt.text;
        choiceButton.dataset.choiceId = stmt.id;

        choiceButton.addEventListener('click', () => {
            choiceButton.classList.toggle('selected');
        });
        choiceContainer.appendChild(choiceButton);
    });
    
    container.appendChild(choiceContainer);
    promptArea.appendChild(container);

    return finalCorrectAnswers;
}


// --- 🚀 BỘ NÃO DẠNG 9 (ĐÃ SỬA LỖI LOGIC) 🚀 ---
function generateSelectNumberCompare(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none';
    
    const rules = payload.rules;

    const actorPool = database.actor_pool;
    const chosenActor = actorPool[Math.floor(Math.random() * actorPool.length)];
    const actorName = chosenActor.name_vi;
    const actorImg = chosenActor.image_url;

    const m_count = getRandomInt(rules.count_min, rules.count_max); 

    const isMoreQuestion = Math.random() < 0.5;
    let questionText;
    let options = []; 

    let possibleCorrect = [];
    let possibleWrong = [];

    if (isMoreQuestion) {
        questionText = `Số nào lớn hơn số ${actorName} trong hình?`;
        for (let i = m_count + 1; i <= rules.option_max; i++) {
            possibleCorrect.push(i);
        }
        for (let i = rules.option_min; i <= m_count; i++) {
            possibleWrong.push(i);
        }
    } else {
        questionText = `Số nào nhỏ hơn số ${actorName} trong hình?`;
        for (let i = rules.option_min; i < m_count; i++) {
            possibleCorrect.push(i);
        }
        for (let i = m_count; i <= rules.option_max; i++) {
            possibleWrong.push(i);
        }
    }

    shuffleArray(possibleCorrect);
    shuffleArray(possibleWrong);

    if (possibleCorrect.length > 0) {
        options.push({ id: 'correct', number: possibleCorrect.pop() });
    } else {
        console.error("Không tìm thấy đáp án đúng cho Dạng 9!");
        options.push({ id: 'correct', number: isMoreQuestion ? m_count + 1 : m_count - 1 });
    }

    for (let i = 0; i < 3; i++) {
        if (possibleWrong.length > 0) {
            options.push({ id: 'wrong', number: possibleWrong.pop() });
        } else {
            console.warn("Không đủ đáp án sai cho Dạng 9, đang tạo ngẫu nhiên");
            let randomWrong;
            do {
                randomWrong = getRandomInt(rules.option_min, rules.option_max);
            } while (randomWrong === options[0].number);
            options.push({ id: 'wrong', number: randomWrong });
        }
    }
    
    shuffleArray(options);


    const itemGrid = document.createElement('div');
    itemGrid.className = 'item-grid-container';
    for (let i = 0; i < m_count; i++) {
        const img = document.createElement('img');
        img.src = `./assets/${actorImg}`;
        img.alt = actorName;
        itemGrid.appendChild(img);
    }
    promptArea.appendChild(itemGrid);

    const questionEl = document.createElement('p');
    questionEl.className = 'question-prompt';
    questionEl.innerText = questionText;
    promptArea.appendChild(questionEl);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'multi-choice-container';
    
    options.forEach(opt => {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'choice-button';
        choiceButton.innerText = opt.number; 
        choiceButton.dataset.choiceId = opt.id; 

        choiceButton.addEventListener('click', () => {
            handleChoiceClick(opt.id, 'correct', choiceContainer);
        });
        choiceContainer.appendChild(choiceButton);
    });
    
    promptArea.appendChild(choiceContainer);

    return null; 
}


// --- 🚀 BỘ NÃO DẠNG 10 (MỚI - Sóc/Thông) 🚀 ---
function generateComparePairsMultiGroup(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none';
    
    const rules = payload.rules;
    const numGroups = payload.num_groups;
    const labels = payload.labels;
    const groupIds = payload.ids;

    if (!database.item_pairs || database.item_pairs.length === 0) {
        console.error("Không tìm thấy 'item_pairs' trong kho_du_lieu.json!");
        return;
    }
    const randomPairIds = database.item_pairs[Math.floor(Math.random() * database.item_pairs.length)];
    const actor1 = database.actor_pool.find(actor => actor.id === randomPairIds[0]);
    const actor2 = database.actor_pool.find(actor => actor.id === randomPairIds[1]);

    if (!actor1 || !actor2) {
        console.error(`Không tìm thấy actor cho cặp ${randomPairIds[0]}, ${randomPairIds[1]}`);
        return;
    }

    let groupContents = [];
    let correctGroupId = groupIds[Math.floor(Math.random() * numGroups)]; 

    for (let i = 0; i < numGroups; i++) {
        let count1, count2;
        if (groupIds[i] === correctGroupId) {
            count1 = getRandomInt(rules.count_min, rules.count_max);
            count2 = count1;
        } else {
            count1 = getRandomInt(rules.count_min, rules.count_max);
            do {
                count2 = getRandomInt(rules.count_min, rules.count_max);
            } while (count1 === count2);
        }
        groupContents.push({ id: groupIds[i], count1: count1, count2: count2 });
    }

    const container = document.createElement('div');
    container.className = 'multi-group-container';

    groupContents.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'multi-group-box';

        const label = document.createElement('div');
        label.className = 'group-label';
        label.innerText = labels[index]; 
        groupDiv.appendChild(label);

        const itemGrid = document.createElement('div');
        itemGrid.className = 'item-grid-container';
        for (let j = 0; j < group.count1; j++) {
            const img = document.createElement('img');
            img.src = `./assets/${actor1.image_url}`;
            img.alt = actor1.name_vi;
            itemGrid.appendChild(img);
        }
        for (let j = 0; j < group.count2; j++) {
            const img = document.createElement('img');
            img.src = `./assets/${actor2.image_url}`;
            img.alt = actor2.name_vi;
            itemGrid.appendChild(img);
        }
        groupDiv.appendChild(itemGrid);
        container.appendChild(groupDiv);
    });
    promptArea.appendChild(container);

    const questionText = `Trong các hình dưới đây, hình nào có số ${actor1.name_vi} bằng số ${actor2.name_vi}?`;
    const questionEl = document.createElement('p');
    questionEl.className = 'question-prompt';
    questionEl.innerText = questionText;
    promptArea.appendChild(questionEl);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'multi-choice-container'; 
    
    groupIds.forEach((id, index) => {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'choice-button'; 
        choiceButton.innerText = labels[index]; 
        choiceButton.dataset.choiceId = id; 

        choiceButton.addEventListener('click', () => {
            handleChoiceClick(id, correctGroupId, choiceContainer);
        });
        choiceContainer.appendChild(choiceButton);
    });
    
    promptArea.appendChild(choiceContainer);

    return null;
}


// --- 🚀 BỘ NÃO DẠNG 18 (CŨ - Cupcake) 🚀 ---
function generateCompareMultiGroups(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none';
    
    const rules = payload.rules;
    const numGroups = payload.num_groups;
    const labels = payload.labels;
    const groupIds = payload.ids;

    const actorPool = database.actor_pool;
    const chosenActor = actorPool[Math.floor(Math.random() * actorPool.length)];
    const actorName = chosenActor.name_vi;
    const actorImg = chosenActor.image_url;

    let counts = [];
    while (counts.length < numGroups) {
        let n = getRandomInt(rules.count_min, rules.count_max);
        if (!counts.includes(n)) {
            counts.push(n); 
        }
    }

    const isMoreQuestion = Math.random() < 0.5;
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    
    let correctCount, questionText, correctGroupId;

    if (isMoreQuestion) {
        questionText = `Trong các hình sau, hình nào có nhiều ${actorName} nhất?`;
        correctCount = maxCount;
    } else {
        questionText = `Trong các hình sau, hình nào có ít ${actorName} nhất?`;
        correctCount = minCount;
    }

    for (let i = 0; i < numGroups; i++) {
        if (counts[i] === correctCount) {
            correctGroupId = groupIds[i];
            break;
        }
    }

    const container = document.createElement('div');
    container.className = 'multi-group-container';

    for (let i = 0; i < numGroups; i++) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'multi-group-box';

        const label = document.createElement('div');
        label.className = 'group-label';
        label.innerText = labels[i];
        groupDiv.appendChild(label);

        const itemGrid = document.createElement('div');
        itemGrid.className = 'item-grid-container';
        const itemCount = counts[i];
        for (let j = 0; j < itemCount; j++) {
            const img = document.createElement('img');
            img.src = `./assets/${actorImg}`;
            img.alt = actorName;
            itemGrid.appendChild(img);
        }
        groupDiv.appendChild(itemGrid);
        container.appendChild(groupDiv);
    }
    promptArea.appendChild(container);

    const questionEl = document.createElement('p');
    questionEl.className = 'question-prompt';
    questionEl.innerText = questionText;
    promptArea.appendChild(questionEl);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'multi-choice-container';
    
    for (let i = 0; i < numGroups; i++) {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'choice-button';
        choiceButton.innerText = labels[i];
        choiceButton.dataset.choiceId = groupIds[i];

        choiceButton.addEventListener('click', () => {
            handleChoiceClick(groupIds[i], correctGroupId, choiceContainer);
        });
        choiceContainer.appendChild(choiceButton);
    }
    
    promptArea.appendChild(choiceContainer);

    return null; 
}


// --- 🚀 BỘ NÃO DẠNG 11 (ADD/SUBTRACT PICTORIAL) 🚀 ---
function generateAddSubtractPictorial(payload, database) {
    // 1. Thay scene-box bằng container-scene
    const sceneBox = document.getElementById('scene-box');
    sceneBox.style.display = 'none';
    const containerScene = document.createElement('div');
    containerScene.className = 'container-scene';
    document.getElementById('question-area').insertBefore(containerScene, document.getElementById('prompt-area'));
    
    const promptArea = document.getElementById('prompt-area');
    const rules = payload.rules;

    // 2. Chọn 1 container (ví dụ: rổ)
    if (!database.containers || database.containers.length === 0) {
        console.error("Không tìm thấy 'containers' trong kho_du_lieu.json!");
        return;
    }
    const chosenContainer = database.containers[Math.floor(Math.random() * database.containers.length)];
    
    // 3. Chọn 1 item (ví dụ: táo)
    const allowedGroup = chosenContainer.allowed_group;
    const actorPool = database.actor_pool.filter(actor => actor.group === allowedGroup);
    if (actorPool.length === 0) {
        console.error(`Không tìm thấy actor nào thuộc nhóm '${allowedGroup}'`);
        return;
    }
    const chosenActor = actorPool[Math.floor(Math.random() * actorPool.length)];
    const actorName = chosenActor.name_vi;
    const actorImg = chosenActor.image_url;

    // 4. Tạo số lượng n (ban đầu) và m (kết quả)
    const n = getRandomInt(rules.n_min, rules.n_max); // 1-5
    const m = getRandomInt(rules.m_min, rules.m_max); // 6-10
    
    // 5. Tính toán câu hỏi và đáp án
    let questionText = "";
    let correctAnswer = 0;
    
    if (payload.question_type === 'add') {
        correctAnswer = m - n; // 10 - 5 = 5
        questionText = `Trên ${chosenContainer.name_vi} có ${n} ${actorName}. Cần cho thêm bao nhiêu ${actorName} vào ${chosenContainer.name_vi} để có ${m} ${actorName}?`;
    } else {
        // (Logic cho câu hỏi "bớt đi" sẽ ở đây)
    }

    // 6. Tạo 3 lựa chọn (1 đúng, 2 sai)
    let options = [];
    options.push({ id: 'correct', number: correctAnswer });
    
    let wrongAnswer1;
    do { wrongAnswer1 = getRandomInt(1, 9); } while (wrongAnswer1 === correctAnswer);
    options.push({ id: 'wrong1', number: wrongAnswer1 });
    
    let wrongAnswer2;
    do { wrongAnswer2 = getRandomInt(1, 9); } while (wrongAnswer2 === correctAnswer || wrongAnswer2 === wrongAnswer1);
    options.push({ id: 'wrong2', number: wrongAnswer2 });
    
    shuffleArray(options);

    // 7. VẼ CẢNH (Rổ + Táo)
    // Vẽ rổ
    const bgImg = document.createElement('img');
    bgImg.src = `./assets/${chosenContainer.image_url}`;
    bgImg.className = 'container-bg';
    containerScene.appendChild(bgImg);
    
    // Vẽ n quả táo
    for (let i = 0; i < n; i++) {
        const itemImg = document.createElement('img');
        itemImg.src = `./assets/${actorImg}`;
        itemImg.className = 'item-in-container';
        
        // Đặt vị trí ngẫu nhiên bên trong rổ (giả định rổ chiếm 60% giữa)
        itemImg.style.top = `${getRandomInt(20, 70)}%`;
        itemImg.style.left = `${getRandomInt(20, 70)}%`;
        itemImg.style.transform = `rotate(${(Math.random() - 0.5) * 40}deg)`;
        containerScene.appendChild(itemImg);
    }

    // 8. VẼ CÂU HỎI VÀ ĐÁP ÁN
    const questionEl = document.createElement('p');
    questionEl.className = 'question-prompt';
    questionEl.innerText = questionText;
    promptArea.appendChild(questionEl);

    // Tái sử dụng .multi-choice-container (Dạng 8)
    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'multi-choice-container'; 
    
    options.forEach(opt => {
        const choiceButton = document.createElement('button');
        choiceButton.className = 'choice-button'; // Tái sử dụng style Dạng 5/9
        choiceButton.dataset.choiceId = opt.id; 

        // Thêm hình ảnh vào nút
        for (let i = 0; i < opt.number; i++) {
            const img = document.createElement('img');
            img.src = `./assets/${actorImg}`;
            choiceButton.appendChild(img);
        }

        choiceButton.addEventListener('click', () => {
            handleChoiceClick(opt.id, 'correct', choiceContainer);
        });
        choiceContainer.appendChild(choiceButton);
    });
    
    promptArea.appendChild(choiceContainer);

    return null;
}


// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - (*** ĐÃ NÂNG CẤP DẠNG 8 ***) 🚀 ---
function setupSubmitButton(correctAnswer) {
    const submitButton = document.getElementById('submit-button');
    const feedbackMessage = document.getElementById('feedback-message');
    
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton); 

    newButton.addEventListener('click', () => {
        newButton.disabled = true;
        let allCorrect = true; 

        // --- BƯỚC 1: DỌN DẸP MÀU SẮC PHẢN HỒI CŨ ---
        const numberInputs = document.querySelectorAll('#prompt-area input[type="number"]');
        numberInputs.forEach(input => input.style.backgroundColor = '');
        
        const selectInputs = document.querySelectorAll('#prompt-area select');
        selectInputs.forEach(select => select.style.backgroundColor = '');
        
        const multiSelectButtons = document.querySelectorAll('#prompt-area .choice-button-multi');
        multiSelectButtons.forEach(btn => btn.classList.remove('correct', 'wrong'));

        // --- BƯỚC 2: CHẤM ĐIỂM ---

        // 2.1. ĐỌC TỪ Ô NHẬP SỐ (CHO DẠNG 1, 2, 3)
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

        // 2.2. ĐỌC TỪ MENU THẢ XUỐNG (CHO DẠNG 4, 6)
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

        // 2.3. ĐỌC TỪ NÚT CHỌN NHIỀU (CHO DẠNG 8)
        multiSelectButtons.forEach(button => {
            const choiceId = button.dataset.choiceId;
            const isSelected = button.classList.contains('selected');
            const isCorrectAnswer = correctAnswer[choiceId]; // true hoặc false

            // Chấm điểm
            if (isSelected !== isCorrectAnswer) {
                allCorrect = false;
            }

            // Hiển thị phản hồi
            if (isCorrectAnswer) {
                button.classList.add('correct'); // Luôn tô xanh đáp án đúng
            } else if (isSelected) {
                button.classList.add('wrong'); // Tô đỏ đáp án chọn sai
            }
        });

        // --- BƯỚC 3: XỬ LÝ KẾT QUẢ (ĐÚNG HOẶC SAI) ---
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

            newButton.disabled = false; // Cho phép thử lại
        }
    });
}