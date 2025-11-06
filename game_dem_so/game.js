// Chờ cho toàn bộ trang HTML tải xong rồi mới chạy
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
    
    // 3. "Vỏ Chung" lo phần Lời dẫn
    document.getElementById('instruction-text').innerText = question.instruction;

    // 4. "Bộ Điều Phối" chọn "Khuôn"
    switch (question.type) {
        case 'FILL_IN_BLANK':
            // 5. Giao việc cho "Khuôn" FILL_IN_BLANK
            renderFillInBlank(question.payload);
            
            // 6. Giao việc cho "Máy Chấm Điểm" (Grader)
            setupSubmitButton(question.correctAnswer);
            break;
        
        // (Bạn có thể thêm các "case" khác ở đây sau này)
        // case 'MULTIPLE_CHOICE_SINGLE':
        //     renderMultipleChoice(question.payload);
        //     break;
        
        default:
            console.error('Không nhận diện được type câu hỏi:', question.type);
    }
}

// "Khuôn" (Template) của dạng FILL_IN_BLANK
function renderFillInBlank(payload) {
    const sceneBox = document.getElementById('scene-box');
    const promptArea = document.getElementById('prompt-area');

    // Xóa dữ liệu cũ (nếu có)
    sceneBox.innerHTML = '';
    promptArea.innerHTML = '';

    // --- 7. "Công cụ Sắp xếp Ngẫu nhiên" (Random Layout Engine) ---
    // (Đây là phiên bản đơn giản, không kiểm tra đè nhau)
    payload.scene_objects.forEach(object => {
        for (let i = 0; i < object.count; i++) {
            const img = document.createElement('img');
            
            // Đường dẫn đến thư mục ảnh của bạn
            img.src = `./assets/${object.image_url}`; 
            img.alt = object.image_url;

            // Tính toán vị trí ngẫu nhiên (chừa 70px lề cho ảnh)
            const randomTop = Math.random() * (sceneBox.clientHeight - 70);
            const randomLeft = Math.random() * (sceneBox.clientWidth - 70);

            img.style.top = `${randomTop}px`;
            img.style.left = `${randomLeft}px`;

            sceneBox.appendChild(img);
        }
    });
    // --- Kết thúc "Công cụ Sắp xếp" ---

    // --- 8. Công cụ tạo ô điền (Prompt Renderer) ---
    payload.prompts.forEach(prompt => {
        const line = document.createElement('div');
        line.className = 'prompt-line';

        // Tạo văn bản
        const textBefore = document.createTextNode(`${prompt.text_before} `);
        const objectName = document.createElement('strong');
        objectName.innerText = prompt.object_name;
        const textAfter = document.createTextNode(` ${prompt.text_after} `);
        const unit = document.createTextNode(` ${prompt.unit}`);

        // Tạo ô điền
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        
        // QUAN TRỌNG: Dùng 'data-id' để liên kết ô input với đáp án
        input.dataset.promptId = prompt.id; 

        // Ghép tất cả lại
        line.appendChild(textBefore);
        line.appendChild(objectName);
        line.appendChild(textAfter);
        line.appendChild(input); // Ô điền ở đây
        line.appendChild(unit);
        
        promptArea.appendChild(line);
    });
    // --- Kết thúc "Công cụ tạo ô điền" ---
}

// "Máy Chấm Điểm" (Grader)
function setupSubmitButton(correctAnswer) {
    const submitButton = document.getElementById('submit-button');
    
    // Phải xóa listener cũ đi để tránh lỗi
    const newButton = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(newButton, submitButton);

    newButton.addEventListener('click', () => {
        // 1. Lấy tất cả các ô input
        const inputs = document.querySelectorAll('#prompt-area input');
        
        let allCorrect = true; // Giả định là đúng hết
        
        // 2. So sánh từng ô
        inputs.forEach(input => {
            const promptId = input.dataset.promptId; // Lấy 'prompt_crab'
            const userAnswer = parseInt(input.value) || 0; // Lấy số hs nhập
            const realAnswer = correctAnswer[promptId];   // Lấy 10 (từ JSON)

            if (userAnswer !== realAnswer) {
                allCorrect = false; // Sai!
                input.style.backgroundColor = '#FFDDE0'; // Bôi đỏ ô bị sai
            } else {
                input.style.backgroundColor = '#DDFEE0'; // Bôi xanh ô đúng
            }
        });

        // 3. Thông báo kết quả
        if (allCorrect) {
            alert('🎉 Tuyệt vời! Bạn đã trả lời đúng hết!');
            // (Sau này sẽ cộng điểm và tải câu hỏi tiếp theo)
            document.getElementById('score').innerText = '10'; // Ví dụ cộng điểm
        } else {
            alert('☹️ Sai rồi! Hãy kiểm tra lại các ô màu đỏ nhé.');
        }
    });
}