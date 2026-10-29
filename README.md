# 🚀 Nex Chat - Frontend (Web Client)
<p align="center">
  <strong>Nền tảng mạng xã hội và liên lạc thời gian thực thế hệ mới</strong><br>
  Tích hợp Bảng tin thông minh, Nhắn tin Real-time, Cuộc gọi Video/Audio WebRTC chất lượng cao và Đăng nhập Google OAuth 2.0.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Socket.io-v4-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/LiveKit-WebRTC-20232A?style=for-the-badge" alt="LiveKit WebRTC" />
</p>

---

## 📖 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Công nghệ sử dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
- [Cấu trúc thư mục dự án](#-cấu-trúc-thư-mục-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt và Khởi chạy](#-cài-đặt-và-khởi-chạy)
- [Cấu hình biến môi trường (.env)](#-cấu-hình-biến-môi-trường-env)
- [Điểm nổi bật về Kiến trúc & Tối ưu hiệu năng](#-điểm-nổi-bật-về-kiến-trúc--tối-ưu-hiệu-năng)
- [Đóng góp & Giấy phép](#-đóng-góp--giấy-phép)

---

## 🌟 Giới thiệu

**Nex Chat Frontend** là ứng dụng web client hiện đại được xây dựng trên nền tảng **React 19**, **TypeScript** và **Vite**. Dự án mang đến trải nghiệm mạng xã hội toàn diện với thiết kế phẳng sang trọng (kết hợp phong cách KeenIcons Metronic 9), hỗ trợ chế độ Dark/Light mode, hiệu năng mượt mà và khả năng đồng bộ dữ liệu thời gian thực.

---

## ✨ Tính năng nổi bật

### 1. 🔐 Xác thực người dùng (Authentication & Security)
- **Đăng nhập linh hoạt**: Hỗ trợ đăng nhập truyền thống (Email/Mật khẩu) và **Google OAuth 2.0 Single Sign-On** (`@react-oauth/google`).
- **Bảo mật phiên đăng nhập**: Kết hợp JWT Access Token lưu trữ bảo mật và HttpOnly Refresh Token.
- **Dọn dẹp phiên triệt để**: Tự động xóa toàn bộ bộ nhớ đệm (`queryClient.clear()`) và reset các Zustand stores khi đăng xuất hoặc token hết hạn (401), ngăn rò rỉ dữ liệu giữa các tài khoản.
- **Form Validation**: Kiểm tra tính hợp lệ của dữ liệu đầu vào với **Formik** và **Yup**.

### 2. 📰 Bảng tin thông minh (Newsfeed & Posts)
- **Cuộn vô tận (Infinite Scrolling)**: Phân trang dựa trên con trỏ (Cursor-based pagination) tối ưu hóa qua TanStack Query v5.
- **Tải trước mượt mà (Skeleton Waves)**: Hiển thị bộ khung placeholder (`PostSkeleton`) và hình ảnh lazy loading khi đang nạp dữ liệu.
- **Đa dạng tương tác (Reactions)**: 6 trạng thái cảm xúc (Like, Love, Haha, Wow, Sad, Angry) kèm cơ chế **Optimistic Update** (cập nhật giao diện lập tức trước khi server phản hồi).
- **Đăng tải bài viết & Media**: Hỗ trợ đính kèm nhiều hình ảnh/video, thiết lập quyền riêng tư bài viết (*Công khai, Bạn bè, Riêng tư*).
- **Đồng bộ thời gian thực**: Cập nhật bài viết mới và reaction qua kết nối Socket.IO.

### 3. ⏱️ Khoảnh khắc 24h (Stories)
- **Tạo & Xem Story**: Trải nghiệm xem tin theo từng slide với thanh tiến trình tự động, hỗ trợ hình ảnh và video tồn tại trong 24 giờ.

### 4. 💬 Tin nhắn thời gian thực (Real-time Messaging)
- **Khung chat nổi (Chat Popup)**: Hộp thoại trò chuyện đa nhiệm có thể kéo thả, thu nhỏ hoặc mở rộng linh hoạt.
- **Trò chuyện trực tiếp**: Gửi nhận tin nhắn tức thì qua Socket.IO, thông báo đã xem/chưa xem, tích hợp bộ chọn biểu tượng cảm xúc (`emoji-picker-react`).
- **Thả cảm xúc tin nhắn**: Tương tác reaction trực tiếp trên từng tin nhắn.

### 5. 📹 Gọi Video & Âm thanh WebRTC (Voice/Video Call)
- **Công nghệ LiveKit**: Truyền tải âm thanh/hình ảnh chất lượng cao với độ trễ cực thấp (< 200ms).
- **Trình điều khiển cuộc gọi**: Bật/tắt camera, tắt tiếng micro, chuyển đổi chế độ xem toàn màn hình hoặc Overlay cửa sổ nổi kéo thả (`react-draggable`).

### 6. 👥 Mạng lưới Bạn bè & Gợi ý (Social Graph)
- **Gợi ý kết bạn thông minh (Friends-of-Friends)**: Thuật toán tính toán số lượng bạn chung trực tiếp từ hệ thống.
- **Quản lý quan hệ**: Gửi lời mời, chấp nhận, từ chối, hủy kết bạn.
- **Trạng thái trực tuyến (Real-time Presence)**: Hiển thị trạng thái đang hoạt động (Online/Offline) và thời gian hoạt động gần nhất của bạn bè.

### 7. 🔔 Thông báo tức thời (Live Notifications)
- **Notification Popover**: Xem danh sách thông báo tương tác (like, comment, kết bạn) ngay trên thanh điều hướng.
- **Badge đếm số lượng**: Tự động tăng/giảm số lượng thông báo chưa đọc theo thời gian thực.

### 8. 👤 Trang cá nhân & Tùy biến (Profile & Theming)
- **Quản lý trang cá nhân**: Thay đổi ảnh đại diện, cập nhật tiểu sử, duyệt danh sách bài viết cá nhân và số lượng bạn bè.
- **Chế độ Sáng/Tối (Dark/Light Mode)**: Chuyển đổi giao diện tức thì với `next-themes` và hệ màu tối ưu cho mắt.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

| Hạng mục | Công nghệ | Phiên bản | Mục đích |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | 19.x | Thư viện xây dựng giao diện người dùng |
| **Language** | TypeScript | ~6.0 | Ngôn ngữ tĩnh an toàn kiểu dữ liệu |
| **Build Tool** | Vite | 8.x | Trình đóng gói siêu nhanh với HMR tức thì |
| **Styling** | Tailwind CSS v4 | 4.x | Utility-first CSS framework thế hệ mới |
| **Styling** | SASS / SCSS | 1.x | Hỗ trợ hệ thống theme Metronic 9 |
| **Data Fetching** | TanStack Query | v5 | Quản lý Server State, Caching & Infinite Query |
| **Global State** | Zustand | v5 | Client state nhẹ cho Chat, Call, Presence, Feed |
| **Realtime Gateway** | Socket.IO Client | 4.x | Kết nối Websocket hai chiều thời gian thực |
| **Audio / Video Call**| LiveKit Client | 2.x | Hạ tầng WebRTC phục vụ cuộc gọi video/audio |
| **Social Login** | React OAuth Google| 0.13.x | Đăng nhập một chạm với tài khoản Google |
| **Form Management** | Formik + Yup | 2.x / 1.x | Quản lý form và kiểm thực dữ liệu đầu vào |
| **Routing** | React Router | v8 | Quản lý điều hướng và phân luồng Private Route |
| **Icons & UI** | Lucide React / KeenIcons | - | Bộ icon vector hiện đại, tối giản |

---

## 📁 Cấu trúc thư mục dự án

```text
nex-chat-fe/
├── public/                 # Tệp tĩnh, favicon, logo SVG
├── src/
│   ├── _metronic/          # Hệ thống icon KeenIcons, tài nguyên giao diện Metronic
│   ├── api/                # Cấu hình Axios Interceptors và các tệp API service
│   │   ├── auth.api.ts     # API xác thực (Login, Register, Logout)
│   │   ├── call.api.ts     # API tạo phòng và lấy token LiveKit
│   │   ├── chat.api.ts     # API hội thoại và tin nhắn
│   │   ├── friend.api.ts   # API quan hệ bạn bè, gợi ý kết bạn
│   │   ├── post.api.ts     # API bài viết, reactions, phân trang
│   │   └── user.api.ts     # API thông tin người dùng, profile
│   ├── assets/             # Hình ảnh mặc định, minh họa giao diện
│   ├── component/          # UI Components dùng chung (Button, Input, Modal...)
│   ├── features/           # Module hóa theo tính năng nghiệp vụ (Feature-based)
│   │   ├── call/           # LiveKit client, CallOverlay, media participants
│   │   ├── chat/           # ChatPopup, message input/list, chat store
│   │   ├── feed/           # Bảng tin, PostCard, PostSkeleton, story, reaction
│   │   ├── friends/        # Tab bạn bè, lời mời, gợi ý kết bạn
│   │   ├── notifications/  # Popover thông báo, notification store
│   │   ├── presence/       # Store theo dõi danh sách online/offline
│   │   └── profile/        # Trang cá nhân, modal chỉnh sửa hồ sơ
│   ├── layouts/            # Layout chính (Header, Sidebar, Navigation)
│   ├── lib/                # Khởi tạo QueryClient, cấu hình tái sử dụng
│   ├── page/               # Các trang chính (Home, Friends, Profile, Login, Register)
│   ├── router/             # Cấu hình luồng định tuyến (AppRouters, ProtectedRoute)
│   ├── socket/             # SocketManager, quản lý kết nối Socket.IO toàn cục
│   ├── utils/              # Các hàm tiện ích (Date time, SweetAlert, String helper)
│   ├── App.tsx             # Root Component kết nối Socket và Router
│   ├── main.tsx            # Điểm khởi chạy React DOM, Provider bọc ngoài
│   └── index.css           # Cấu hình Tailwind CSS v4 toàn cục
├── .env                    # Biến môi trường cục bộ
├── package.json            # Khai báo phụ thuộc và kịch bản npm
├── tsconfig.json           # Cấu hình TypeScript compiler
└── vite.config.ts          # Cấu hình máy chủ Vite và Proxy
```

---

## ⚙️ Yêu cầu hệ thống

- **Node.js**: Phiên bản `>= 18.x` (khuyến nghị `20.x` LTS hoặc mới hơn)
- **Trình quản lý gói**: `npm` (hoặc `yarn`, `pnpm`)
- **Backend API**: Máy chủ `nex-chat-be` đang chạy (mặc định cổng 8080)
- **LiveKit Server**: Máy chủ LiveKit phục vụ tính năng cuộc gọi (tùy chọn)

---

## 🚀 Cài đặt và Khởi chạy

### 1. Tải mã nguồn về máy
```bash
git clone https://github.com/your-username/nex-chat-fe.git
cd nex-chat-fe
```

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Cấu hình tệp biến môi trường
Tạo tệp `.env` tại thư mục gốc của frontend:
```bash
cp .env.example .env
```
*(Nếu chưa có `.env.example`, bạn có thể tạo tệp `.env` với nội dung ở mục bên dưới).*

### 4. Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### 5. Đóng gói cho Production
```bash
npm run build
```
Kiểm tra bản build thử nghiệm:
```bash
npm run preview
```

---

## 🔧 Cấu hình biến môi trường (.env)

| Tên biến | Giá trị mẫu | Giải thích |
| :--- | :--- | :--- |
| `VITE_PORT` | `3000` | Cổng chạy của máy chủ phát triển Vite |
| `VITE_ALLOWED_HOST` | `localhost` | Host được phép truy cập Vite server |
| `VITE_API_BASE_URL` | `http://localhost:8080` | URL đích của Backend API (dùng cho Vite Proxy `/api`) |
| `VITE_LIVEKIT_URL` | `ws://localhost:7880` | Địa chỉ kết nối máy chủ LiveKit WebRTC |
| `VITE_GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Google OAuth 2.0 Client ID xác thực SSO |

Ví dụ tệp `.env`:
```ini
VITE_PORT=3000
VITE_ALLOWED_HOST=localhost
VITE_API_BASE_URL=http://localhost:8080

## LiveKit WebRTC Server
VITE_LIVEKIT_URL=ws://localhost:7880

## Google OAuth 2.0 Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 💡 Điểm nổi bật về Kiến trúc & Tối ưu hiệu năng

1. **Quản lý Cache thông minh (TanStack Query v5)**:
   - Sử dụng `cursor-based pagination` kết hợp `useInfiniteQuery` giúp tải bảng tin mượt mà, không xảy ra hiện tượng trùng lặp dữ liệu khi bài viết mới liên tục xuất hiện.
   - Cơ chế `Optimistic Updates` cho lượt thả cảm xúc (Love, Haha...) cập nhật ngay lập tức trên UI với độ trễ 0ms.
   - Tự động gọi `queryClient.clear()` khi đăng xuất để dọn sạch hoàn toàn bộ nhớ cache, ngăn chặn rò rỉ dữ liệu giữa các phiên tài khoản.

2. **Kiến trúc State phân tầng rõ ràng**:
   - **Server State**: Giao hoàn toàn cho `TanStack Query` (tự động deduping, refetch, stale-while-revalidate).
   - **Client/UI State**: Giao cho `Zustand` (bộ nhớ nhẹ, tốc độ cao, không gây re-render diện rộng như React Context) cho Chat, Audio/Video Call, Realtime Feed và Presence.

3. **Tối ưu hiển thị hình ảnh & Media**:
   - Sử dụng thuộc tính `loading="lazy"` và `decoding="async"` trên tất cả các thẻ hình ảnh đa phương tiện của bài viết.
   - Tích hợp hiệu ứng sóng skeleton placeholder giữ nguyên tỷ lệ khung hình (`aspect-ratio`), ngăn chặn hiện tượng vỡ bố cục (CLS - Cumulative Layout Shift).

---
