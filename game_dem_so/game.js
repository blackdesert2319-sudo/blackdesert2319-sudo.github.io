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

// --- "KHO DỮ LIỆU" VÀ "TRẠNG THÁI" TOÀN CỤC ---
let GAME_DATABASE = null; // Kho dữ liệu (cua, ếch, sách...)
let QUESTION_BANK = []; // Ngân hàng câu hỏi (các file JSON)
let LAST_QUESTION_TYPE = null; // "Trí nhớ" để chống lặp
let CURRENT_SCORE = 0;
let QUESTION_NUMBER = 1;

// --- TRÌNH TỰ KHỞI ĐỘNG (BOOT SEQUENCE) ---
document.addEventListener('DOMContentLoaded', () => {
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
        // (Sửa lỗi của bạn: giờ ngân hàng đã có cả Dạng 1 và 1c)
        QUESTION_BANK = [
            'master_template_dang_1.json', // Dạng 1
            'master_template_1c.json'      // Dạng 1c
        ];
        
        // --- BƯỚC 3: GẮN NÚT "CÂU TIẾP THEO" ---
        document.getElementById('next-button').addEventListener('click', () => {
            loadNextQuestion();
        });

        // --- BƯỚC 4: TẢI CÂU HỎI ĐẦU TIÊN ---
        loadNextQuestion();

    } catch (error) {
        console.error("Lỗi khởi động nghiêm trọng:", error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải KHO DỮ LIỆU. Không thể bắt đầu.';
    }
}

// --- "BỘ NÃO" CHỌN CÂU HỎI (ĐÃ NÂNG CẤP) ---
function loadNextQuestion() {
    // 1. Reset các nút
    document.getElementById('submit-button').style.display = 'block';
    document.getElementById('next-button').style.display = 'none';
    
    // 2. Cập nhật số câu
    document.getElementById('question-count').innerText = QUESTION_NUMBER;
    QUESTION_NUMBER++;

    let chosenTemplateFile;

    // 3. Logic "CHỐNG LẶP DẠNG BÀI" (Theo ý tưởng của bạn)
    if (QUESTION_BANK.length > 1) {
        let attempts = 0;
        do {
            // Bốc thăm ngẫu nhiên 1 file
            chosenTemplateFile = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
            attempts++;
            // Nếu file bốc thăm KHÁC file cũ -> OK
            // (hoặc nếu đã thử quá 5 lần mà vẫn trùng -> đành chịu)
        } while (chosenTemplateFile === LAST_QUESTION_TYPE && attempts < 5);
    
    } else {
        // Nếu ngân hàng chỉ có 1 câu thì cứ lấy câu đó
        chosenTemplateFile = QUESTION_BANK[0];
    }

    // 4. Ghi nhớ "Dạng" này lại
    LAST_QUESTION_TYPE = chosenTemplateFile;
    console.log("Tải câu hỏi:", chosenTemplateFile);
    
    // 5. Tải "Khuôn Mẫu" (Luật chơi)
    loadQuestionTemplate(chosenTemplateFile);
}


// "Vỏ Chung": Hàm tải "mảng lệnh" (JSON)
async function loadQuestionTemplate(questionFile) {
    try {
        const response = await fetch(questionFile);
        if (!response.ok) throw new Error(`Không thể tải file câu hỏi: ${questionFile}`);
        const questionTemplate = await response.json();
        
        // Gửi cả "Luật chơi" (template) VÀ "Kho dữ liệu" (database)
        renderQuestion(questionTemplate, GAME_DATABASE);

    } catch (error) {
        console.error(error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải câu hỏi. Vui lòng thử lại.';
    }
}

// "Bộ Điều Phối" (Renderer Switch)
function renderQuestion(question, database) {
    document.getElementById('instruction-text').innerText = question.instruction;
    
    // Xóa giao diện cũ
    document.getElementById('scene-box').innerHTML = '';
    document.getElementById('prompt-area').innerHTML = '';
    document.getElementById('scene-box').style.display = 'block';

    let payload = question.payload; // "Luật chơi"
    let correctAnswers; // Đáp án đúng sẽ được tính

    // "Bộ não" sẽ TỰ TẠO câu hỏi và đáp án
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

    // Sau khi "Bộ não" TẠO xong câu hỏi, nó gửi "Đáp án đúng"
    // cho "Máy chấm điểm"
    setupSubmitButton(correctAnswers);
}


// --- 🚀 BỘ NÃO CHO DẠNG 1 (MASTER) 🚀 ---
// (Lưu ý: Giờ hàm này "return" ra đáp án đúng)
function generateFillInBlank(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    
    const generatedAnswers = {}; const sceneObjectsToDraw = []; const promptsToGenerate = []; const finalCorrectAnswers = {};
    
    const rules = payload.scene_rules;
    const actorPool = database.actor_pool; 
    const allGroups = [...new Set(actorPool.map(actor => actor.group))];
    const chosenGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);

    const chosenActors = [];
    const shuffledActors = shuffleArray(filteredActorPool);
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

    return finalCorrectAnswers; // Trả về đáp án
}


// --- 🚀 BỘ NÃO CHO DẠNG 1C (MASTER) 🚀 ---
function generateSelectGroupMaster(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none'; 

    const rules = payload.rules;
    const groups = shuffleArray([...payload.groups]); 

    const finalCorrectAnswers = {};
    const groupContents = {};
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

    return finalCorrectAnswers; // Trả về đáp án
}


// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - NÂNG CẤP "NEXT QUESTION" 🚀 ---
function setupSubmitButton(correctAnswer) {
    const submitButton = document.getElementById('submit-button');
    
    // Phải xóa listener cũ đi để tránh lỗi (quan trọng!)
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton);

    newButton.addEventListener('click', () => {
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
            alert('🎉 Tuyệt vời! Bạn đã trả lời đúng hết!');
            
            // Cập nhật điểm
            CURRENT_SCORE += 10;
            document.getElementById('score').innerText = CURRENT_SCORE;

            // Ẩn nút "Trả lời", Hiện nút "Câu tiếp theo"
            newButton.style.display = 'none';
            document.getElementById('next-button').style.display = 'block';

        } else {
            alert('☹️ Sai rồi! Hãy kiểm tra lại các ô màu đỏ nhé.');
        }
    });
}