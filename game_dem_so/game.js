document.addEventListener('DOMContentLoaded', () => {
    // 1. Bắt đầu tải câu hỏi
    loadQuestion('question_101.json'); 
});

// "Vỏ Chung": Hàm tải "mảng lệnh" (JSON)
async function loadQuestion(questionFile) {
    try {
        const response = await fetch(questionFile);
        if (!response.ok) {
            throw new Error('Không thể tải file câu hỏi!');
        }
        const question = await response.json();
        
        // 2. Gọi "Bộ Điều Phối" (Renderer Switch)
        renderQuestion(question);

    } catch (error) {
        console.error(error);
        document.getElementById('instruction-text').innerText = 'Lỗi tải câu hỏi. Vui lòng thử lại.';
    }
}

// "Bộ Điều Phối" (Renderer Switch)
function renderQuestion(question) {
    document.getElementById('instruction-text').innerText = question.instruction;
    switch (question.type) {
        case 'FILL_IN_BLANK':
            renderFillInBlank(question.payload);
            setupSubmitButton(question.correctAnswer);
            break;
        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
    }
}

// "Khuôn" (Template) của dạng FILL_IN_BLANK
function renderFillInBlank(payload) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');
    sceneBox.innerHTML = '';
    promptArea.innerHTML = '';

    // --- CÔNG CỤ SẮP XẾP NGẪU NHIÊN (PHIÊN BẢN HOÀN CHỈNH) ---
    payload.scene_objects.forEach(object => {
        for (let i = 0; i < object.count; i++) {
            const img = document.createElement('img');
            
            img.src = `./assets/${object.image_url}`; 
            img.alt = object.image_url;

            // 1. SỬA LỖI "MẤT CUA"
            // Lấy kích thước ảnh (phải khớp với CSS)
            const imgSize = 60; 
            // Tính toán lề tối đa mà ảnh có thể được đặt
            const maxTop = sceneBox.clientHeight - imgSize;
            const maxLeft = sceneBox.clientWidth - imgSize;

            // 2. TÍNH VỊ TRÍ
            // Tính toán vị trí ngẫu nhiên không bao giờ bị ra ngoài lề
            const randomTop = Math.random() * maxTop;
            const randomLeft = Math.random() * maxLeft;

            img.style.top = `${randomTop}px`;
            img.style.left = `${randomLeft}px`;

            // 3. THÊM ĐỘ NGHIÊNG (TÍNH NĂNG MỚI)
            const randomRotation = (Math.random() - 0.5) * 30; // Tạo số ngẫu nhiên từ -15 đến 15 độ
            img.style.transform = `rotate(${randomRotation}deg)`;

            // 4. VẼ RA MÀN HÌNH
            sceneBox.appendChild(img);
        }
    });
    // --- KẾT THÚC CÔNG CỤ SẮP XẾP ---

    // "Công cụ tạo ô điền"
    payload.prompts.forEach(prompt => {
        const line = document.createElement('div');
        line.className = 'prompt-line';
        const textBefore = document.createTextNode(`${prompt.text_before} `);
        const objectName = document.createElement('strong');
        objectName.innerText = prompt.object_name;
        const textAfter = document.createTextNode(` ${prompt.text_after} `);
        const unit = document.createTextNode(` ${prompt.unit}`);
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.dataset.promptId = prompt.id; 
        line.appendChild(textBefore);
        line.appendChild(objectName);
        line.appendChild(textAfter);
        line.appendChild(input);
        line.appendChild(unit);
        promptArea.appendChild(line);
    });
}

// "Máy Chấm Điểm" (Grader)
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