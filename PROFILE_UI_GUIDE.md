# Profile UI – ghi chú học tập

## 1. Luồng chạy của trang

1. Người dùng bấm avatar ở `Header` hoặc `ProfileCard`.
2. React Router đổi URL sang `/profile`.
3. `ProtectedRoute` kiểm tra `accessToken`; không có token thì quay về trang đăng nhập.
4. `ProfilePage` render lần đầu với `currentUser = null`.
5. Sau lần render đầu, `useEffect` gọi `GET /users/me`.
6. Khi API trả dữ liệu, `setCurrentUser` làm component render lại.
7. `ProfileHeader` nhận người dùng qua props; `Feed` nhận `currentUser.id` và chỉ giữ các post có cùng `user_id`.
8. Khi state bài viết đổi (đăng, xóa, reaction), React render lại danh sách tương ứng.

## 2. Kiến thức cần hiểu

- Figma: đọc frame, Auto Layout, spacing, typography, màu, radius và responsive intent.
- HTML semantic: `header`, `main`, `section`, `aside`, `nav`, button và ảnh có `alt`.
- CSS/Tailwind: Flexbox, Grid 12 cột, breakpoint, `object-cover`, overflow, shadow và stacking.
- React component: chia trang thành component theo trách nhiệm, tái sử dụng `Feed`, `CreatePost`, `PostList`.
- Props: dữ liệu cha truyền xuống con; ví dụ `currentUser` từ `ProfilePage` xuống `ProfileHeader`.
- State: dữ liệu thay đổi làm UI render lại; ví dụ `setCurrentUser` và `setPosts`.
- `useEffect`: chạy tác vụ sau render để lấy dữ liệu API; dependency quyết định khi chạy lại.
- TypeScript: khai báo kiểu props và dữ liệu API để phát hiện sai cấu trúc trước khi chạy.
- React Router: route công khai, route được bảo vệ và điều hướng bằng `Link`.
- Axios/JWT: interceptor gắn token vào request và xử lý response 401.
- Mapping dữ liệu: chuyển cấu trúc API thành cấu trúc UI, lọc bài theo `user_id`.
- Loading/error/empty state: không hiển thị nhầm dữ liệu khi API chưa hoàn tất hoặc thất bại.
- Responsive và accessibility: giao diện desktop/mobile, focus, nhãn nút và tương phản màu.

## 3. Dữ liệu thật và dữ liệu tạm

- Đã lấy từ API: tên, username, avatar và bài viết của người đang đăng nhập.
- Đang là dữ liệu UI tạm: ảnh bìa, tiểu sử, nghề nghiệp, trường học, số bạn bè/người theo dõi, thư viện ảnh và danh sách bạn bè.
- Khi backend profile hoàn thành, thay các hằng tạm bằng response API; cấu trúc giao diện không cần viết lại.

## 4. Câu hỏi nên tự trả lời khi phỏng vấn

- Vì sao không gọi API trực tiếp trong phần thân component?
- Vì sao phải đợi có `currentUser.id` rồi mới tải/lọc bài profile?
- Props khác state thế nào?
- Vì sao dùng `Link` thay cho thẻ `a` khi điều hướng nội bộ?
- Khi component unmount trong lúc request đang chạy thì nên xử lý thế nào?
- Tại sao nên tách UI profile thành nhiều component nhỏ?

## 5. Luồng cập nhật hồ sơ

```text
Người dùng bấm Chỉnh sửa hồ sơ
→ ProfilePage đổi isEditModalOpen thành true
→ EditProfileModal được render và khởi tạo form từ profile
→ Người dùng bấm Lưu thay đổi
→ form gọi onSave(data)
→ ProfilePage gọi PATCH /users/me/profile
→ backend xác thực JWT, validate và upsert database
→ API trả profile vừa cập nhật
→ setProfile ghép dữ liệu mới vào state hiện tại
→ React render lại ProfileHeader và ProfileDetails
→ đóng modal
```

Form được đặt trong component riêng để phần hiển thị hồ sơ không phải quản lý từng ô nhập. `ProfilePage` giữ trách nhiệm gọi API và cập nhật state vì đây là component đang sở hữu dữ liệu `profile`.

## 6. Luồng avatar và ảnh bìa

```text
Người dùng chọn file ảnh
→ frontend tạo FormData
→ PATCH /users/me/avatar hoặc /users/me/cover-image
→ JWT xác định người đang đăng nhập
→ Multer kiểm tra loại file và giới hạn 10 MB
→ file được giữ tạm trong RAM
→ storage service upload file lên S3
→ service upsert profiles và lưu URL thật
→ avatar đồng thời được cập nhật trong users.avatar
→ backend xóa ảnh cũ thuộc bucket profiles
→ frontend nhận URL mới và cập nhật state
```

Không lưu nội dung ảnh vào MySQL. Database chỉ lưu URL; file thật nằm trong S3/MinIO.
