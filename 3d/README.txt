HƯỚNG DẪN CHẠY DỰ ÁN VẼ HÌNH KHÔNG GIAN 3D

1. YÊU CẦU
- Chỉ cần trình duyệt (Chrome, Edge, Firefox...) mới là chạy được, không cần cài thêm gì.
- Máy có kết nối Internet để tải thư viện Three.js từ CDN.

2. CÁCH CHẠY
Bước 1: Giải nén file .zip này ra một thư mục trên máy.
Bước 2: Mở thư mục đó, tìm file: index.html
Bước 3: Nhấp đúp chuột vào index.html để mở bằng trình duyệt.
Bước 4: Giao diện web sẽ hiện ra:
        - Bên trái: ô nhập đề bài và nút "Vẽ hình 3D"
        - Bên phải: vùng không gian 3D, có trục toạ độ và lưới.

3. CÚ PHÁP NHẬP ĐỀ BÀI
Mỗi dòng mô tả một đối tượng hình học, dùng 3 lệnh chính:

(1) Điểm – POINT (điểm trong không gian)
Cú pháp:
  POINT Tên x y z

Ví dụ:
  POINT A 0 0 0
  POINT B 2 1 3

(2) Đường thẳng – LINE (đi qua 2 điểm đã khai báo)
Cú pháp:
  LINE Tên Điểm1 Điểm2

Ví dụ:
  LINE d A B

Lưu ý: A, B phải là các điểm đã khai báo bằng lệnh POINT trước đó.

(3) Mặt phẳng – PLANE (qua 1 điểm, có vector pháp tuyến cho trước)
Cú pháp:
  PLANE Tên Điểm nx ny nz

Trong đó:
  - Điểm: tên điểm đã khai báo trước (POINT)
  - (nx, ny, nz): toạ độ vector pháp tuyến (normal vector)

Ví dụ:
  PLANE (P) A 0 1 0

Mặt phẳng (P) đi qua điểm A, có vector pháp tuyến (0, 1, 0)
→ tức là mặt phẳng song song với trục XZ (vuông góc với trục Y).

4. VÍ DỤ HOÀN CHỈNH
Bạn có thể copy nguyên khối sau (hoặc bấm nút Preset trong giao diện):

  # Ví dụ cơ bản: 2 điểm, 1 đường, 1 mặt phẳng
  POINT A 0 0 0
  POINT B 2 1 3
  LINE d A B
  PLANE (P) A 0 1 0

Hoặc:

  # Tam giác ABC và mặt phẳng qua A có pháp tuyến (1,1,1)
  POINT A 0 0 0
  POINT B 2 0 0
  POINT C 1 2 1
  LINE AB A B
  LINE BC B C
  LINE CA C A
  PLANE (Q) A 1 1 1

5. ĐIỀU KHIỂN KHÔNG GIAN 3D
- Giữ chuột trái và kéo: xoay quanh hình.
- Lăn chuột (scroll): phóng to / thu nhỏ (zoom).
- Giữ chuột phải và kéo: tịnh tiến toàn bộ khung nhìn.

6. GỢI Ý MỞ RỘNG (CÓ THỂ LÀM THÊM SAU)
- Thêm nhãn chữ (label) tên điểm, tên đường, tên mặt phẳng.
- Cho phép nhập mặt phẳng dạng phương trình: ax + by + cz + d = 0
- Tô màu khác nhau cho từng đối tượng theo tên.
- Xuất hình ra dạng ảnh (PNG) để chèn vào Word/PDF.

Nếu bạn muốn, mình có thể giúp bạn nâng cấp tiếp:
- Hỗ trợ nhập đề bài gần với tiếng Việt tự nhiên hơn.
- Thêm chức năng kiểm tra quan hệ (song song, vuông góc, cắt nhau...).
