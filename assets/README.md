# Thư mục tư liệu portfolio

Đặt ảnh và âm thanh vào thư mục của dự án tương ứng. Ưu tiên tên file viết thường, không dấu, dùng dấu gạch ngang. Đường dẫn trong dữ liệu dự án được tính từ thư mục gốc portfolio.

## Ảnh

| Tư liệu | Đường dẫn |
| --- | --- |
| Ảnh chân dung dùng trên website | `assets/web/images/profile/IMG_3483.jpg` |
| Ảnh All Beans Coffee | `assets/images/social/all-beans-coffee/` |
| Ảnh Lạc Đà Podcast | `assets/web/images/social/lac-da-podcast/` và `assets/images/social/lac-da-podcast/` |
| Ảnh TTDPTPTIT | `assets/web/images/social/ttdptptit/` và `assets/images/social/ttdptptit/` |
| Poster TVC | `assets/images/tvc/tvc-01/` đến `assets/images/tvc/tvc-04/` |

Các bản JPG trong `assets/web/images/` đã được tối ưu kích thước cho website. Khi thay ảnh, cập nhật đường dẫn trong `index.html`, JSON dự án hoặc `data/tvc-projects.js` tùy nơi sử dụng.

## Video

Video TVC gốc được lưu trong thư mục Google Drive `TVC` và phát trong website bằng liên kết xem trước. Cập nhật trường `videoUrl` tương ứng trong `data/tvc-projects.js` khi thay video. Trang không tự phát video khi tải.

Các video social hoặc nội dung âm thanh có thể lưu tại `assets/videos/social/<tên-dự-án>/` và `assets/audio/`; khai báo đường dẫn tương đối từ thư mục gốc trong JSON dự án.

## Cây thư mục chính

```text
assets/
├── images/
│   ├── social/
│   └── tvc/
├── web/
│   └── images/       # Ảnh tối ưu dùng trên website
├── videos/
│   └── social/       # Video social; TVC gốc nằm trên Drive
└── audio/
    ├── social/
    ├── tvc/
    └── shared/
```
