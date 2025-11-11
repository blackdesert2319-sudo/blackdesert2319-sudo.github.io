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
    // --- CÔNG TẮC CHÍNH (Đang tải Dạng 1c để chạy thử) ---
    loadQuestion('template_1c_cam.json'); 

    /* --- NGÂN HÀNG CÂU HỎI (Tạm thời tắt) ---
    const questionBank = [
        'master_template_dang_1.json'
        // Thêm 'template_1c_cam.json' vào đây khi bạn muốn chạy ngẫu nhiên
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
    
    // Xóa giao diện cũ trước khi vẽ giao diện mới
    // (Quan trọng vì Dạng 1c có HTML khác Dạng 1)
    document.getElementById('scene-box').innerHTML = '';
    document.getElementById('prompt-area').innerHTML = '';

    switch (question.type) {
        
        case 'FILL_IN_BLANK_MASTER': 
            renderFillInBlank_Master(question.payload);
            break;

        // --- DẠNG 1C MỚI ---
        case 'SELECT_GROUP_BY_COUNT':
            renderSelectGroupByCount(question.payload);
            break;
        // --- KẾT THÚC DẠNG 1C ---

        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
    }
}


// --- 🚀 BỘ NÃO CHO DẠNG 1 (MASTER) 🚀 ---
function renderFillInBlank_Master(payload) {
    // (Code cho Dạng 1... không thay đổi)
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'block'; // Đảm bảo scene-box hiển thị
    
    // (Toàn bộ code logic của Dạng 1... từ Giai đoạn 1 đến 7)
    // ... (Giữ nguyên code renderFillInBlank_Master cũ) ...
    // ... (Tôi ẩn đi cho gọn, bạn cứ giữ nguyên code cũ của bạn) ...

    // --- 1. GIAI ĐOẠN CHỌN CHỦ ĐỀ (THEME SELECTION) ---
    const rules = payload.scene_rules;
    const actorPool = payload.actor_pool;
    const allGroups = [...new Set(actorPool.map(actor => actor.group))];
    const chosenGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);

    // --- 2. GIAI ĐOẠN CHỌN CON VẬT (ACTOR SELECTION) ---
    const generatedAnswers = {}; const sceneObjectsToDraw = []; const promptsToGenerate = []; const finalCorrectAnswers = {};
    const chosenActors = [];
    const shuffledActors = shuffleArray(filteredActorPool);
    const numToPick = Math.min(rules.num_actors_to_pick, shuffledActors.length);
    for (let i = 0; i < numToPick; i++) { chosenActors.push(shuffledActors.pop()); }

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
    }
    if (promptRules.add_zero_trap && payload.group_traps && payload.group_traps[chosenGroup]) {
        const trapPool = payload.group_traps[chosenGroup]; 
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
                const maxTop = sceneBox.clientHeight - imgSize;
                const maxLeft = sceneBox.clientWidth - imgSize;
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

    // --- 7. GIAI ĐOẠN GỬI ĐÁP ÁN ĐÚNG CHO "MÁY CHẤM" ---
    setupSubmitButton(finalCorrectAnswers);
}


// --- 🚀 BỘ NÃO MỚI CHO DẠNG 1C (SELECT GROUP) 🚀 ---
function renderSelectGroupByCount(payload) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none'; // Dạng 1c không dùng "hộp rơi ngẫu nhiên"

    const rules = payload.rules;
    const actor = payload.actor;
    const groups = shuffleArray([...payload.groups]); // Xáo trộn nhóm A, B

    const finalCorrectAnswers = {};
    const groupContents = {}; // { A: 10, B: 5 }

    // --- 1. TẠO SỐ LƯỢNG VÀ ĐÁP ÁN ---
    // Nhóm đầu tiên (sau khi xáo trộn) sẽ là đáp án đúng
    const correctGroupId = groups[0].id;
    groupContents[groups[0].id] = rules.target_count;

    // Các nhóm còn lại là "bẫy"
    for (let i = 1; i < groups.length; i++) {
        const distractorCount = getRandomInt(rules.distractor_count_min, rules.distractor_count_max);
        groupContents[groups[i].id] = distractorCount;
    }
    
    finalCorrectAnswers['group_select'] = correctGroupId;

    // --- 2. VẼ GIAO DIỆN HTML (Bên trong promptArea) ---
    const container = document.createElement('div');
    container.className = 'group-select-container';

    // a. Vẽ các "Hộp" (Hình A, Hình B)
    groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-box';

        const label = document.createElement('div');
        label.className = 'group-label';
        label.innerText = group.label; // "Hình A"
        groupDiv.appendChild(label);

        const itemCount = groupContents[group.id]; // 10 hoặc 5
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';

        // "Công cụ Sắp xếp" mới: Xếp hàng
        for (let i = 0; i < itemCount; i++) {
            const img = document.createElement('img');
            img.src = `./assets/${actor.image_url}`;
            img.alt = actor.name_vi;
            img.className = 'item-in-group';
            itemContainer.appendChild(img);
        }
        groupDiv.appendChild(itemContainer);
        container.appendChild(groupDiv);
    });

    // b. Vẽ câu hỏi và Menu thả xuống
    const questionLine = document.createElement('div');
    questionLine.className = 'prompt-line';
    
    const questionText = `Hình có ${rules.target_count} ${actor.name_vi} là hình`;
    questionLine.appendChild(document.createTextNode(questionText));

    // Tạo menu <select>
    const selectMenu = document.createElement('select');
    selectMenu.id = 'group_select_input'; // ID để "Máy chấm" đọc
    selectMenu.dataset.promptId = 'group_select'; // Liên kết với đáp án

    // Thêm lựa chọn "Chọn" (mặc định)
    const defaultOption = document.createElement('option');
    defaultOption.value = ""; // Giá trị rỗng
    defaultOption.innerText = "Chọn";
    selectMenu.appendChild(defaultOption);

    // Thêm các lựa chọn (Hình A, Hình B)
    payload.groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id; // "A" hoặc "B"
        option.innerText = group.label; // "Hình A" hoặc "Hình B"
        selectMenu.appendChild(option);
    });

    questionLine.appendChild(selectMenu);
    container.appendChild(questionLine);
    
    promptArea.appendChild(container);

    // --- 3. GỬI ĐÁP ÁN ĐÚNG CHO "MÁY CHẤM" ---
    setupSubmitButton(finalCorrectAnswers);
}



// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - ĐÃ NÂNG CẤP 🚀 ---
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
                allCorrect = false;
                input.style.backgroundColor = '#FFDDE0';
            } else {
                input.style.backgroundColor = '#DDFEE0';
            }
        });

        // 2. ĐỌC TỪ MENU THẢ XUỐNG (CHO DẠNG 1C MỚI)
        const selectInputs = document.querySelectorAll('#prompt-area select');
        selectInputs.forEach(select => {
            const promptId = select.dataset.promptId; // 'group_select'
            const userAnswer = select.value; // 'A' hoặc 'B'
            const realAnswer = correctAnswer[promptId]; // 'A'
            
            if (userAnswer !== realAnswer) {
                allCorrect = false;
                select.style.backgroundColor = '#FFDDE0';
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