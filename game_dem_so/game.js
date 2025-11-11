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
    // 1. Bắt đầu tải "Khuôn Mẫu Chủ"
    loadQuestion('master_template_dang_1.json'); 
});

// "Vỏ Chung": Hàm tải "mảng lệnh" (JSON)
async function loadQuestion(questionFile) {
    try {
        const response = await fetch(questionFile);
        if (!response.ok) {
            throw new Error('Không thể tải file câu hỏi!');
        }
        const questionTemplate = await response.json();
        
        // 2. Gọi "Bộ Điều Phối" (Renderer Switch)
        renderQuestion(questionTemplate);

    } catch (error) {
        console.error(error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải câu hỏi. Vui lòng thử lại.';
    }
}

// "Bộ Điều Phối" (Renderer Switch)
function renderQuestion(question) {
    document.getElementById('instruction-text').innerText = question.instruction;
    switch (question.type) {
        
        case 'FILL_IN_BLANK_MASTER': 
            renderFillInBlank_Master(question.payload);
            break;

        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
    }
}


// --- 🚀 BỘ NÃO NÂNG CẤP "BẪY THEO CHỦ ĐỀ" 🚀 ---
function renderFillInBlank_Master(payload) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.innerHTML = '';
    promptArea.innerHTML = '';

    const generatedAnswers = {};    
    const sceneObjectsToDraw = [];  
    const promptsToGenerate = [];   
    const finalCorrectAnswers = {}; 

    // --- 1. GIAI ĐOẠN CHỌN CHỦ ĐỀ (THEME SELECTION) ---
    const rules = payload.scene_rules;
    const actorPool = payload.actor_pool;

    // a. "Quét kho" để tìm các nhóm (group) duy nhất
    const allGroups = [...new Set(actorPool.map(actor => actor.group))];
    
    // b. Bốc thăm ngẫu nhiên 1 nhóm
    const chosenGroup = allGroups[Math.floor(Math.random() * allGroups.length)];
    console.log("Đã chọn chủ đề:", chosenGroup); // Giúp bạn kiểm tra

    // c. Lọc "kho" chỉ lấy các con vật thuộc nhóm đó
    const filteredActorPool = actorPool.filter(actor => actor.group === chosenGroup);

    // --- 2. GIAI ĐOẠN CHỌN CON VẬT (ACTOR SELECTION) ---
    const chosenActors = [];
    const shuffledActors = shuffleArray(filteredActorPool);
    const numToPick = Math.min(rules.num_actors_to_pick, shuffledActors.length);
    for (let i = 0; i < numToPick; i++) {
        chosenActors.push(shuffledActors.pop());
    }

    // --- 3. GIAI ĐOẠN TẠO CẢNH (SCENE GENERATION) ---
    chosenActors.forEach(actor => {
        const count = getRandomInt(rules.count_min, rules.count_max);
        generatedAnswers[actor.id] = count; 
        sceneObjectsToDraw.push({
            image_url: actor.image_url,
            count: count
        });
    });

    // --- 4. GIAI ĐOẠN TẠO CÂU HỎI (PROMPT GENERATION) ---
    const promptRules = payload.prompt_rules;

    // a. Hỏi về các con vật đã chọn
    if (promptRules.ask_about_all_actors) {
        chosenActors.forEach((actor, index) => {
            promptsToGenerate.push({
                id: `prompt_actor_${index}`,
                name_vi: actor.name_vi,
                answer_source: actor.id
            });
        });
    }

    // b. Thêm "Bẫy 0" (ĐÃ NÂNG CẤP)
    if (promptRules.add_zero_trap && payload.group_traps && payload.group_traps[chosenGroup]) {
        
        // Chỉ lấy "bẫy" từ nhóm đã chọn (ví dụ: "hoc_tap")
        const trapPool = payload.group_traps[chosenGroup]; 
        
        if (trapPool.length > 0) {
            // Bốc thăm ngẫu nhiên 1 "bẫy" trong nhóm đó
            const randomTrap = trapPool[Math.floor(Math.random() * trapPool.length)];
            
            promptsToGenerate.push({
                id: 'prompt_trap_0',
                name_vi: randomTrap.name_vi, // (ví dụ: "cái com-pa")
                answer_source: randomTrap.id // (ví dụ: "compass")
            });
        }
    }

    // Xáo trộn thứ tự các câu hỏi
    shuffleArray(promptsToGenerate);

    // --- 5. GIAI ĐOẠN VẼ CẢNH (SCENE DRAWING) ---
    // (Không thay đổi - "Công cụ Sắp xếp Trí nhớ" y như cũ)
    const placedPositions = []; 
    const imgSize = 60; 
    const retryLimit = 20; 
    const minSafeDistance = imgSize * 0.9; 
    sceneObjectsToDraw.forEach(object => {
        for (let i = 0; i < object.count; i++) {
            const img = document.createElement('img');
            img.src = `./assets/${object.image_url}`; 
            img.alt = object.image_url;
            let newTop, newLeft, isOverlapping, attempts = 0;
            do {
                const maxTop = sceneBox.clientHeight - imgSize;
                const maxLeft = sceneBox.clientWidth - imgSize;
                newTop = Math.random() * maxTop;
                newLeft = Math.random() * maxLeft;
                isOverlapping = false;
                attempts++;
                for (const pos of placedPositions) {
                    const deltaX = Math.abs(newLeft - pos.left);
                    const deltaY = Math.abs(newTop - pos.top);
                    if (deltaX < minSafeDistance && deltaY < minSafeDistance) {
                        isOverlapping = true;
                        break;
                    }
                }
            } while (isOverlapping && attempts < retryLimit);
            placedPositions.push({ top: newTop, left: newLeft });
            img.style.top = `${newTop}px`;
            img.style.left = `${newLeft}px`;
            const randomRotation = (Math.random() - 0.5) * 30; 
            img.style.transform = `rotate(${randomRotation}deg)`;
            sceneBox.appendChild(img);
        }
    });

    // --- 6. GIAI ĐOẠN VẼ CÂU HỎI & TÌM ĐÁP ÁN (PROMPT RENDERING) ---
    // (Không thay đổi)
    promptsToGenerate.forEach(prompt => {
        const line = document.createElement('div');
        line.className = 'prompt-line';
        const textBefore = document.createTextNode(`Hình trên có số `);
        const objectName = document.createElement('strong');
        objectName.innerText = prompt.name_vi; 
        const textAfter = document.createTextNode(` là`);
        const unit = document.createTextNode(` con.`);
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.dataset.promptId = prompt.id; 
        const sourceId = prompt.answer_source; 
        if (generatedAnswers.hasOwnProperty(sourceId)) {
            finalCorrectAnswers[prompt.id] = generatedAnswers[sourceId];
        } else {
            finalCorrectAnswers[prompt.id] = 0;
        }
        line.appendChild(textBefore);
        line.appendChild(objectName);
        line.appendChild(textAfter);
        line.appendChild(input);
        line.appendChild(unit);
        promptArea.appendChild(line);
    });

    // --- 7. GIAI ĐOẠN GỬI ĐÁP ÁN ĐÚNG CHO "MÁY CHẤM" ---
    // (Không thay đổi)
    setupSubmitButton(finalCorrectAnswers);
}


// "Máy Chấm Điểm" (Grader) - KHÔNG CẦN THAY ĐỔI
function setupSubmitButton(correctAnswer) {
    const submitButton = document.getElementById('submit-button');
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton);

    newButton.addEventListener('click', () => {
        const inputs = document.querySelectorAll('#prompt-area input');
        let allCorrect = true;
        
        inputs.forEach(input => {
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

        if (allCorrect) {
            alert('🎉 Tuyệt vời! Bạn đã trả lời đúng hết!');
            document.getElementById('score').innerText = '10';
        } else {
            alert('☹️ Sai rồi! Hãy kiểm tra lại các ô màu đỏ nhé.');
        }
    });
}