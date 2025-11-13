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

        // --- BƯỚC 2: KHAI BÁO "NGÂN HÀNG CÂU HỎI" (ĐẦY ĐỦ) ---
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
            'ch_dang_11.json', 
            'ch_dang_12.json',
            'ch_dang_13.json',
            'ch_dang_14.json',
            'ch_dang_15.json',
            'ch_dang_16.json',
            'ch_dang_17.json',
            'ch_dang_18.json',
            'ch_dang_19.json'
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

// "Bộ Điều Phối" (Renderer Switch) - (*** ĐÃ SỬA LỖI DỌN DẸP DẠNG 11 & THÊM 5 DẠNG MỚI ***)
function renderQuestion(question, database) {

    // --- BƯỚC DỌN DẸP MỚI (SỬA LỖI) ---
    const oldContainerScene = document.querySelector('.container-scene');
    if (oldContainerScene) {
        oldContainerScene.remove();
    }
    document.getElementById('instruction-text').innerText = question.instruction;
    document.getElementById('scene-box').innerHTML = ''; 
    document.getElementById('prompt-area').innerHTML = ''; 
    document.getElementById('scene-box').style.display = 'block'; 
    // --- KẾT THÚC SỬA LỖI ---

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
        case 'ADD_SUBTRACT_PICTORIAL':
            correctAnswers = generateAddSubtractPictorial(payload, database);
            useMainSubmitButton = false;
            break;
        case 'MATCH_EQUATION_EXAMPLE': 
            correctAnswers = generateMatchEquationExample(payload, database);
            useMainSubmitButton = false;
            break;
        case 'MATCH_EQUATION_TO_GROUP': 
            correctAnswers = generateMatchEquationToGroup(payload, database);
            useMainSubmitButton = false;
            break;
        
        // --- 5 DẠNG MỚI ---
        case 'GOP_BLANK':
            correctAnswers = generateGopBlank(payload, database);
            useMainSubmitButton = true;
            break;
        case 'TACH_GOP_BLANK':
            correctAnswers = generateTachGopBlank(payload, database);
            useMainSubmitButton = true;
            break;
        case 'SELECT_ACTOR_BY_COUNT':
            correctAnswers = generateSelectActorByCount(payload, database);
            useMainSubmitButton = false;
            break;
        case 'COUNT_IN_CONTAINER':
            correctAnswers = generateCountInContainer(payload, database);
            useMainSubmitButton = false;
            break;
        case 'MULTI_SELECT_MULTI_GROUP_COUNT':
            correctAnswers = generateMultiSelectMultiGroupCount(payload, database);
            useMainSubmitButton = true;
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
// ... (Giữ nguyên)
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
// ... (Các Dạng 4, 5, 6, 7, 8, 9, 10, 18, 11, 12, 19 giữ nguyên) ...
// ... (Rất nhiều code, chỉ dán phần bị thay đổi) ...

// --- 🚀 BỘ NÃO DẠNG 17 (MULTI-SELECT COUNT) (*** ĐÃ SỬA LỖI LOGIC ***) 🚀 ---
function generateMultiSelectMultiGroupCount(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none';
    
    const rules = payload.rules;
    const numGroups = payload.num_groups;
    const labels = payload.labels;
    const groupIds = payload.ids;
    const finalCorrectAnswers = {};

    // 1. Chọn 1 actor
    const actorPool = database.actor_pool;
    const chosenActor = actorPool[Math.floor(Math.random() * actorPool.length)];
    const actorName = chosenActor.name_vi;
    const actorImg = chosenActor.image_url;

    // 2. Tạo 3 số lượng (n, m, s) KHÁC NHAU
    let counts = []; // Mảng chứa các số đếm (ví dụ: [2, 5, 9])
    while (counts.length < numGroups) {
        let n = getRandomInt(rules.count_min, rules.count_max);
        if (!counts.includes(n)) {
            counts.push(n); 
        }
    }
    
    // 3. Vẽ 3 Hộp
    const container = document.createElement('div');
    container.className = 'multi-group-container';
    
    let allStatements = []; // Mảng chứa các phát biểu (đúng và sai)
    
    for (let i = 0; i < numGroups; i++) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'multi-group-box';

        const label = document.createElement('div');
        label.className = 'group-label';
        label.innerText = labels[i]; // "Hình 1"
        groupDiv.appendChild(label);

        const itemGrid = document.createElement('div');
        itemGrid.className = 'item-grid-container';
        for (let j = 0; j < counts[i]; j++) {
            const img = document.createElement('img');
            img.src = `./assets/${actorImg}`;
            itemGrid.appendChild(img);
        }
        groupDiv.appendChild(itemGrid);
        container.appendChild(groupDiv);
        
        // Tạo 1 phát biểu ĐÚNG cho hình này
        allStatements.push({
            id: `correct_${i}`,
            text: `${labels[i]} có ${counts[i]} ${actorName}`,
            isCorrect: true
        });
        
        // Tạo 1 phát biểu SAI cho hình này
        let wrongCount;
        do {
            wrongCount = getRandomInt(rules.count_min, rules.count_max);
        } while (wrongCount === counts[i]); // Đảm bảo số sai khác số đúng
        
        allStatements.push({
            id: `wrong_${i}`,
            text: `${labels[i]} có ${wrongCount} ${actorName}`,
            isCorrect: false
        });
    }
    promptArea.appendChild(container);
    
    // 4. Tạo 4 lựa chọn (2 đúng, 2 sai)
    shuffleArray(allStatements);
    
    let options = [];
    let correctStmts = allStatements.filter(s => s.isCorrect);
    let wrongStmts = allStatements.filter(s => !s.isCorrect);
    
    options.push(correctStmts.pop()); // Lấy 1 câu đúng
    options.push(correctStmts.pop()); // Lấy 1 câu đúng nữa
    options.push(wrongStmts.pop());   // Lấy 1 câu sai
    options.push(wrongStmts.pop());   // Lấy 1 câu sai nữa
    
    shuffleArray(options); // Xáo trộn 4 đáp án

    // 5. Vẽ câu hỏi và đáp án
    const questionEl = document.createElement('p');
    questionEl.className = 'question-prompt';
    questionEl.innerText = 'Câu nào dưới đây đúng?';
    promptArea.appendChild(questionEl);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'multi-choice-container';
    
    options.forEach(opt => {
        finalCorrectAnswers[opt.id] = opt.isCorrect; // Gửi cho máy chấm
        
        const choiceButton = document.createElement('div');
        choiceButton.className = 'choice-button-multi text-with-number';
        choiceButton.innerText = opt.text;
        choiceButton.dataset.choiceId = opt.id;

        choiceButton.addEventListener('click', () => {
            choiceButton.classList.toggle('selected');
        });
        choiceContainer.appendChild(choiceButton);
    });
    
    promptArea.appendChild(choiceContainer);

    return finalCorrectAnswers;
}


// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - (*** ĐÃ NÂNG CẤP DẠNG 8/17 ***) 🚀 ---
// ... (Giữ nguyên)
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

        // 2.1. ĐỌC TỪ Ô NHẬP SỐ (CHO DẠNG 1, 2, 3, 13, 14)
        numberInputs.forEach(input => {
            const promptId = input.dataset.promptId;
            const userAnswer = parseInt(input.value); // Bỏ || 0 để cho phép ô trống
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

        // 2.3. ĐỌC TỪ NÚT CHỌN NHIỀU (CHO DẠNG 8, 17)
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