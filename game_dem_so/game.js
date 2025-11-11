// HÀM TIỆN ÍCH: Tạo số nguyên ngẫu nhiên trong khoảng [min, max]
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// HÀM TIỆN ÍCH: Xáo trộn một mảng (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


document.addEventListener('DOMContentLoaded', () => {
    // --- CÔNG TẮC CHÍNH (Đang tải Dạng 1c MỚI để chạy thử) ---
    loadQuestion('master_template_1c.json'); 

    /* --- NGÂN HÀNG CÂU HỎI (Tạm thời tắt) ---
    const questionBank = [
        'master_template_dang_1.json', // Dạng 1
        'master_template_1c.json'      // Dạng 1c MỚI
    ];
    const chosenTemplate = questionBank[Math.floor(Math.random() * questionBank.length)];
    loadQuestion(chosenTemplate); 
    */
});

// "Vỏ Chung": Hàm tải "mảng lệnh" (JSON)
async function loadQuestion(questionFile) {
    try {
        const response = await fetch(questionFile);
        if (!response.ok) {
            throw new Error('Không thể tải file câu hỏi!');
        }
        const questionTemplate = await response.json();
        renderQuestion(questionTemplate);
    } catch (error) {
        console.error(error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải câu hỏi. Vui lòng thử lại.';
    }
}

// "Bộ Điều Phối" (Renderer Switch)
function renderQuestion(question) {
    document.getElementById('instruction-text').innerText = question.instruction;
    
    // Xóa giao diện cũ
    document.getElementById('scene-box').innerHTML = '';
    document.getElementById('prompt-area').innerHTML = '';
    // Đảm bảo scene-box (của Dạng 1) hiển thị lại nếu cần
    document.getElementById('scene-box').style.display = 'block';

    switch (question.type) {
        
        case 'FILL_IN_BLANK_MASTER': 
            renderFillInBlank_Master(question.payload);
            break;

        // --- DẠNG 1C MỚI (MASTER) ---
        case 'SELECT_GROUP_MASTER':
            renderSelectGroupMaster(question.payload);
            break;
        // --- KẾT THÚC DẠNG 1C ---

        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
    }
}


// --- 🚀 BỘ NÃO CHO DẠNG 1 (MASTER) 🚀 ---
function renderFillInBlank_Master(payload) {
    // (Toàn bộ code logic của Dạng 1... từ Giai đoạn 1 đến 7)
    // ... (Giữ nguyên code renderFillInBlank_Master cũ của bạn) ...

    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    
    const generatedAnswers = {}; const sceneObjectsToDraw = []; const promptsToGenerate = []; const finalCorrectAnswers = {};
    const rules = payload.scene_rules;
    const actorPool = payload.actor_pool;
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
    if (promptRules.add_zero_trap && payload.group_traps && payload.group_traps[chosenGroup]) {
        const trapPool = payload.group_traps[chosenGroup]; 
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

    setupSubmitButton(finalCorrectAnswers);
}


// --- 🚀 BỘ NÃO MỚI CHO DẠNG 1C (MASTER) 🚀 ---
function renderSelectGroupMaster(payload) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none'; // Dạng 1c không dùng "hộp rơi ngẫu nhiên"

    const rules = payload.rules;
    const actorPool = payload.actor_pool;
    const groups = shuffleArray([...payload.groups]); // Xáo trộn nhóm A, B

    const finalCorrectAnswers = {};
    const groupContents = {}; // { A: n, B: m }
    let targetCount, targetGroup, actorName;

    // --- 1. CHỌN 1 "DIỄN VIÊN" (ACTOR) NGẪU NHIÊN ---
    // (Logic này giống hệt Dạng 1: Chọn chủ đề -> Chọn 1 con vật)
    const allGroups = [...new Set(actorPool.map(actor => actor.group))];
    const chosenGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);
    const chosenActor = filteredActorPool[Math.floor(Math.random() * filteredActorPool.length)];
    actorName = chosenActor.name_vi; // ví dụ: "con cá"

    // --- 2. TẠO SỐ LƯỢNG n, m (n KHÁC m) ---
    const n = getRandomInt(rules.count_min, rules.count_max);
    let m;
    do {
        m = getRandomInt(rules.count_min, rules.count_max);
    } while (m === n); // Đảm bảo m khác n

    // Gán số lượng cho Hình A, Hình B (đã xáo trộn)
    groupContents[groups[0].id] = n; // ví dụ: Hình B = 7
    groupContents[groups[1].id] = m; // ví dụ: Hình A = 4

    // --- 3. QUYẾT ĐỊNH CÂU HỎI (Hỏi n hay m?) ---
    if (Math.random() < 0.5) {
        // Hỏi về n
        targetCount = n; 
        targetGroup = groups[0].id; // ví dụ: "B"
    } else {
        // Hỏi về m
        targetCount = m;
        targetGroup = groups[1].id; // ví dụ: "A"
    }
    
    finalCorrectAnswers['group_select'] = targetGroup;

    // --- 4. VẼ GIAO DIỆN HTML (Bên trong promptArea) ---
    // (Tái sử dụng 100% code vẽ của lần trước)
    const container = document.createElement('div');
    container.className = 'group-select-container';

    // a. Vẽ các "Hộp" (Hình A, Hình B)
    payload.groups.forEach(group => { // Dùng payload.groups để giữ đúng thứ tự A, B
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-box';

        const label = document.createElement('div');
        label.className = 'group-label';
        label.innerText = group.label; // "Hình A"
        groupDiv.appendChild(label);

        const itemCount = groupContents[group.id]; // 4 hoặc 7
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

    // b. Vẽ câu hỏi và Menu thả xuống (DYNAMIC TEXT)
    const questionLine = document.createElement('div');
    questionLine.className = 'prompt-line';
    
    // VÍ DỤ: "Hình có 7 con cá là hình"
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
    setupSubmitButton(finalCorrectAnswers);
}


// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - KHÔNG THAY ĐỔI 🚀 ---
// (Máy chấm điểm này đã đủ thông minh để xử lý cả Dạng 1 và Dạng 1c)
function setupSubmitButton(correctAnswer) {
    const submitButton = document.getElementById('submit-button');
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

        // 3. THÔNG BÁO KẾT QUẢ
        if (allCorrect) {
            alert('🎉 Tuyệt vời! Bạn đã trả lời đúng hết!');
            document.getElementById('score').innerText = '10';
        } else {
            alert('☹️ Sai rồi! Hãy kiểm tra lại các ô màu đỏ nhé.');
        }
    });
}