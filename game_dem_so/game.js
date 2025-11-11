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

// --- "KHO DỮ LIỆU TRUNG TÂM" (CACHE) ---
// Biến toàn cục (global) để lưu trữ kho dữ liệu
// "Bộ não" sẽ chỉ tải kho này 1 LẦN DUY NHẤT
let GAME_DATABASE = null;


// --- TRÌNH TỰ KHỞI ĐỘNG (BOOT SEQUENCE) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Bắt đầu "khởi động" bộ não
    initializeApp();
});

async function initializeApp() {
    try {
        // --- BƯỚC 1: Tải "KHO DỮ LIỆU" TRUNG TÂM ---
        const response = await fetch('kho_du_lieu.json');
        if (!response.ok) throw new Error('Không thể tải kho_du_lieu.json!');
        GAME_DATABASE = await response.json();
        console.log("Đã tải Kho Dữ Liệu Trung Tâm:", GAME_DATABASE);

        // --- BƯỚC 2: Tải "CÔNG TẮC" NGÂN HÀNG CÂU HỎI ---
        const questionBank = [
            'master_template_dang_1.json', // Dạng 1
            'master_template_1c.json'      // Dạng 1c
        ];
        
        // (Bạn có thể bỏ comment khối 'Ngân hàng Câu hỏi' này để chạy ngẫu nhiên)
        // const chosenTemplateFile = questionBank[Math.floor(Math.random() * questionBank.length)];
        
        // (Hoặc chỉ định 1 file để chạy thử)
        const chosenTemplateFile = 'master_template_dang_1.json'; 
        // const chosenTemplateFile = 'master_template_1c.json';

        // --- BƯỚC 3: Tải "KHUÔN MẪU" (LUẬT CHƠI) ---
        await loadQuestion(chosenTemplateFile);

    } catch (error) {
        console.error("Lỗi khởi động nghiêm trọng:", error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải KHO DỮ LIỆU. Không thể bắt đầu.';
    }
}

// "Vỏ Chung": Hàm tải "mảng lệnh" (JSON)
async function loadQuestion(questionFile) {
    try {
        // (Không cần tải kho dữ liệu ở đây nữa)
        const response = await fetch(questionFile);
        if (!response.ok) throw new Error(`Không thể tải file câu hỏi: ${questionFile}`);
        const questionTemplate = await response.json();
        
        // 3. Gọi "Bộ Điều Phối" (Renderer Switch)
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

    switch (question.type) {
        
        case 'FILL_IN_BLANK_MASTER': 
            // "Bộ não" Dạng 1 nhận cả "Luật chơi" (payload) và "Kho" (database)
            renderFillInBlank_Master(question.payload, database);
            break;

        case 'SELECT_GROUP_MASTER':
            // "Bộ não" Dạng 1c cũng vậy
            renderSelectGroupMaster(question.payload, database);
            break;

        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
    }
}


// --- 🚀 BỘ NÃO CHO DẠNG 1 (Đã nâng cấp) 🚀 ---
function renderFillInBlank_Master(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    
    const generatedAnswers = {}; const sceneObjectsToDraw = []; const promptsToGenerate = []; const finalCorrectAnswers = {};
    
    // --- 1. CHỌN CHỦ ĐỀ (THEME SELECTION) ---
    const rules = payload.scene_rules;
    const actorPool = database.actor_pool; // <-- LẤY TỪ "KHO"
    const allGroups = [...new Set(actorPool.map(actor => actor.group))];
    const chosenGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);

    // (Code Giai đoạn 2, 3, 4, 5, 6, 7... giữ nguyên y hệt)
    // ...
    // --- 2. GIAI ĐOẠN CHỌN CON VẬT (ACTOR SELECTION) ---
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
    // LẤY "BẪY" TỪ "KHO"
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

    // --- 7. GIAI ĐOẠN GỬI ĐÁP ÁN ĐÚNG CHO "MÁY CHẤM" ---
    setupSubmitButton(finalCorrectAnswers);
}


// --- 🚀 BỘ NÃO CHO DẠNG 1C (Đã nâng cấp) 🚀 ---
function renderSelectGroupMaster(payload, database) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.style.display = 'none'; 

    const rules = payload.rules;
    const groups = shuffleArray([...payload.groups]); 

    const finalCorrectAnswers = {};
    const groupContents = {};
    let targetCount, targetGroup, actorName;

    // --- 1. CHỌN 1 "DIỄN VIÊN" (ACTOR) NGẪU NHIÊN ---
    const actorPool = database.actor_pool; // <-- LẤY TỪ "KHO"
    const allGroups = [...new Set(actorPool.map(actor => actor.group))];
    const chosenGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);
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
    setupSubmitButton(finalCorrectAnswers);
}


// --- 🚀 MÁY CHẤM ĐIỂM (GRADER) - KHÔNG THAY ĐỔI 🚀 ---
function setupSubmitButton(correctAnswer) {
    // (Code Máy chấm điểm của bạn giữ nguyên y hệt)
    const submitButton = document.getElementById('submit-button');
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton);
    newButton.addEventListener('click', () => {
        let allCorrect = true; 
        const numberInputs = document.querySelectorAll('#prompt-area input[type="number"]');
        numberInputs.forEach(input => {
            const promptId = input.dataset.promptId;
            const userAnswer = parseInt(input.value) || 0;
            const realAnswer = correctAnswer[promptId];
            if (userAnswer !== realAnswer) { allCorrect = false; input.style.backgroundColor = '#FFDDE0'; }
            else { input.style.backgroundColor = '#DDFEE0'; }
        });
        const selectInputs = document.querySelectorAll('#prompt-area select');
        selectInputs.forEach(select => {
            const promptId = select.dataset.promptId; 
            const userAnswer = select.value; 
            const realAnswer = correctAnswer[promptId];
            if (userAnswer !== realAnswer) { allCorrect = false; select.style.backgroundColor = '#FFDDE0'; }
            else { select.style.backgroundColor = '#DDFEE0'; }
        });
        if (allCorrect) {
            alert('🎉 Tuyệt vời! Bạn đã trả lời đúng hết!');
            document.getElementById('score').innerText = '10';
        } else {
            alert('☹️ Sai rồi! Hãy kiểm tra lại các ô màu đỏ nhé.');
        }
    });
}