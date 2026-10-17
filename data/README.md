# Chỉnh sửa thông tin cá nhân

Mở `data/personal.json` và sửa các giá trị trong dấu ngoặc kép. Có thể chỉnh tên, câu giới thiệu, các đoạn About, lĩnh vực quan tâm và thông tin liên hệ. Giữ nguyên tên các khóa JSON để trang biết nội dung nào cần cập nhật.

Để thêm email, nhập địa chỉ vào trường `email`. Khi trường này không rỗng, trang sẽ tự tạo liên kết email.

## Nội dung từng dự án Content Social

Mỗi dự án có một trang riêng và một file JSON để điền nội dung:

| Dự án | Trang | File cần sửa |
| --- | --- | --- |
| All Beans Coffee | `projects/social/all-beans-coffee.html` | `data/projects/all-beans-coffee.json` |
| Lạc Đà Podcast | `projects/social/lac-da-podcast.html` | `data/projects/lac-da-podcast.json` |
| TTDPTPTIT | `projects/social/ttdptptit.html` | `data/projects/ttdptptit.json` |

## Nội dung TVC Production

Sửa danh sách TVC ngay trong `data/tvc-projects.js`. Mỗi mục có các trường `id`, `title`, `brand`, `category`, `thumbnail`, `videoUrl`, `overview`, `myRole` và `roleTags`. Đường dẫn ảnh/video tính từ thư mục gốc portfolio. `category` là nhãn phân loại nhỏ phía trên tiêu đề; có thể để trống. Để trống `overview` thì phần Project Overview sẽ được ẩn; chỉ điền `myRole` và `roleTags` khi vai trò đã được xác nhận. Nếu chưa có `videoUrl`, trang sẽ hiển thị placeholder.

Video dùng trình phát trực tiếp trên trang, không tự phát. Đặt ảnh poster thật vào `assets/images/tvc/<id-dự-án>/` rồi điền đường dẫn vào `thumbnail`.

Trong từng JSON, điền `overview.context` và `overview.objective`; `myRole.role` và `myRole.responsibilities`; `results.summary`; và danh sách `learnings`. Giữ nguyên tên trường để trang có thể hiển thị dữ liệu.

Thêm đầu ra thông thường vào mảng `selectedOutputs`. Mỗi mục có `type` (`image`, `video`, `audio`, `article` hoặc `link`), `title`, `src` (đường dẫn tính từ thư mục gốc portfolio, ví dụ `assets/images/social/all-beans-coffee/cover.jpg`) và `caption`. Với ảnh dọc, thêm `"orientation": "portrait"`; với ảnh bảng ngang, dùng `"orientation": "landscape"`. Có thể đặt nhãn bằng `label`. Với bài viết hoặc liên kết, dùng `url` thay cho `src`.

Để tạo nhiều gallery riêng trên cùng một trang, dùng `selectedOutputGroups`: mỗi nhóm có một `id` khớp với phần tử HTML `data-project-output-group` và một mảng `items` theo cấu trúc đầu ra ở trên. Trang TTDPTPTIT dùng hai nhóm trong Selected Outputs: `workSheets` cho sheet công việc và `channelGallery` cho ảnh tổng hợp kênh; gallery thumbnail video nằm trong `results.featuredVideos`. Các chỉ số trong `results.metrics` chỉ hiển thị khi có đủ `label`, `value` và `evidence`; `icon` nhận `videos`, `views`, `followers` hoặc `likes`. Ảnh chụp chứng minh số liệu có thể thêm trong `results.evidenceImages`.

Ví dụ một đầu ra ảnh:

```json
{
  "type": "image",
  "title": "Tên sản phẩm",
  "src": "assets/images/social/all-beans-coffee/thumbnail-01.jpg",
  "caption": "Mô tả ngắn về sản phẩm"
}
```

Khi thêm nội dung, giữ JSON đúng cú pháp (dấu phẩy giữa các mục, không có dấu phẩy sau mục cuối).

## Xem thay đổi

Trang dùng `fetch()` để nạp JSON. Vì trình duyệt thường chặn đọc file JSON riêng khi mở `index.html` bằng địa chỉ `file://`, hãy chạy máy chủ tĩnh từ thư mục portfolio:

```sh
python3 -m http.server 8000
```

Sau đó mở `http://localhost:8000`. Không cần cài thêm thư viện hay framework.
