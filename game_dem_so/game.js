// HÀM TIỆN ÍCH: Tạo số nguyên ngẫu nhiên trong khoảng [min, max]
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Bắt đầu tải "Khuôn Mẫu" (Template)
    loadQuestion('template_fill_in_blank.json'); 
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
        
        // CHÚ Ý: Đổi tên 'type' để gọi "Khuôn" mới
        case 'FILL_IN_BLANK_GENERATOR': 
            renderFillInBlank_Generator(question.payload);
            break;
        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
    }
}

// "Khuôn" (Template) MỚI của dạng FILL_IN_BLANK
// (Bây giờ là "Bộ não" tạo câu hỏi)
function renderFillInBlank_Generator(payload) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.innerHTML = '';
    promptArea.innerHTML = '';

    // "Trí nhớ" để lưu các đáp án được tạo ra
    const generatedAnswers = {};
    // "Mảng lệnh" để gửi cho "Công cụ Sắp xếp"
    const sceneObjectsToDraw = [];

    // --- 1. GIAI ĐOẠN TẠO SỐ NGẪU NHIÊN ---
    payload.actors.forEach(actor => {
        // a. Quyết định số lượng
        const count = getRandomInt(actor.min, actor.max);
        
        // b. Lưu đáp án vào "trí nhớ"
        generatedAnswers[actor.id] = count; // Ví dụ: generatedAnswers['crab'] = 7
        
        // c. Nếu > 0, thêm vào danh sách cần vẽ
        if (count > 0) {
            sceneObjectsToDraw.push({
                image_url: actor.image_url,
                count: count
            });
        }
    });

    // --- 2. GIAI ĐOẠN VẼ CÁC CON VẬT ---
    // (Gọi "Công cụ Sắp xếp" - code này không đổi)
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
    // --- KẾT THÚC CÔNG CỤ SẮP XẾP ---


    // --- 3. GIAI ĐOẠN TẠO CÂU HỎI VÀ ĐÁP ÁN ---
    const finalCorrectAnswers = {}; // Đáp án cuối cùng để gửi cho "Máy chấm"

    payload.prompts.forEach(prompt => {
        const line = document.createElement('div');
        line.className = 'prompt-line';
        
        // a. Lấy thông tin từ "Khuôn Mẫu" (Template)
        const textBefore = document.createTextNode(`${prompt.text_before} `);
        const objectName = document.createElement('strong');
        objectName.innerText = prompt.object_name;
        const textAfter = document.createTextNode(` ${prompt.text_after} `);
        const unit = document.createTextNode(` ${prompt.unit}`);
        
        // b. Tạo ô điền
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.dataset.promptId = prompt.id; // Gán ID của prompt (ví dụ: 'prompt_1')

        // c. Tìm đáp án đúng cho prompt này
        const sourceId = prompt.answer_source; // Ví dụ: 'crab' hoặc 'crocodile'
        
        if (generatedAnswers.hasOwnProperty(sourceId)) {
            // Tìm thấy! (ví dụ: 'crab' có 7 con)
            finalCorrectAnswers[prompt.id] = generatedAnswers[sourceId];
        } else {
            // Không tìm thấy "actor" (ví dụ: 'crocodile') -> Đáp án là 0
            finalCorrectAnswers[prompt.id] = 0;
        }

        // d. Ghép tất cả lại
        line.appendChild(textBefore);
        line.appendChild(objectName);
        line.appendChild(textAfter);
        line.appendChild(input);
        line.appendChild(unit);
        promptArea.appendChild(line);
    });

    // --- 4. GIAI ĐOẠN GỬI ĐÁP ÁN ĐÚNG CHO "MÁY CHẤM" ---
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
            const promptId = input.dataset.promptId; // Lấy 'prompt_1'
            const userAnswer = parseInt(input.value) || 0;
            const realAnswer = correctAnswer[promptId]; // Lấy đáp án (ví dụ: 7)
            
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