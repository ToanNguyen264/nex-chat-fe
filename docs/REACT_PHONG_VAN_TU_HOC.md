# GIÁO TRÌNH REACT & FRONT-END ĐỂ TỰ HỌC VÀ ĐI PHỎNG VẤN

> Tài liệu này được viết dựa trên chính dự án `nex-chat-fe`.
> Mục tiêu không chỉ là “biết dùng thư viện”, mà là hiểu bản chất, giải thích được bằng lời và áp dụng được vào code.

---

## Mục lục

1. [Cách học với tài liệu này](#1-cách-học-với-tài-liệu-này)
2. [Bản đồ công nghệ của dự án](#2-bản-đồ-công-nghệ-của-dự-án)
3. [Nền tảng Web bắt buộc](#3-nền-tảng-web-bắt-buộc)
4. [JavaScript cốt lõi](#4-javascript-cốt-lõi)
5. [TypeScript cốt lõi](#5-typescript-cốt-lõi)
6. [Vite và quy trình chạy ứng dụng](#6-vite-và-quy-trình-chạy-ứng-dụng)
7. [React là gì và mô hình tư duy đúng](#7-react-là-gì-và-mô-hình-tư-duy-đúng)
8. [JSX và React Element](#8-jsx-và-react-element)
9. [Component, Props và Composition](#9-component-props-và-composition)
10. [State, Render và tính bất biến](#10-state-render-và-tính-bất-biến)
11. [Xử lý sự kiện trong React](#11-xử-lý-sự-kiện-trong-react)
12. [Conditional Rendering, List và Key](#12-conditional-rendering-list-và-key)
13. [Hooks quan trọng](#13-hooks-quan-trọng)
14. [Form, Formik và Yup](#14-form-formik-và-yup)
15. [React Router](#15-react-router)
16. [HTTP, REST API và Axios](#16-http-rest-api-và-axios)
17. [Authentication và Authorization](#17-authentication-và-authorization)
18. [TanStack React Query](#18-tanstack-react-query)
19. [Zustand và Global State](#19-zustand-và-global-state)
20. [Socket.IO và ứng dụng chat thời gian thực](#20-socketio-và-ứng-dụng-chat-thời-gian-thực)
21. [CSS, Tailwind CSS và SCSS](#21-css-tailwind-css-và-scss)
22. [Kiến trúc thư mục và Clean Code](#22-kiến-trúc-thư-mục-và-clean-code)
23. [Hiệu năng React](#23-hiệu-năng-react)
24. [Testing](#24-testing)
25. [Accessibility, UX và Security](#25-accessibility-ux-và-security)
26. [Phân tích dự án hiện tại](#26-phân-tích-dự-án-hiện-tại)
27. [Câu hỏi phỏng vấn và câu trả lời mẫu](#27-câu-hỏi-phỏng-vấn-và-câu-trả-lời-mẫu)
28. [Bài tập thực hành theo dự án](#28-bài-tập-thực-hành-theo-dự-án)
29. [Lộ trình học 8 tuần](#29-lộ-trình-học-8-tuần)
30. [Glossary và Flashcard](#30-glossary-và-flashcard)
31. [Phụ lục A – Mẫu tự ghi chú một lỗi](#phụ-lục-a--mẫu-tự-ghi-chú-một-lỗi)
32. [Phụ lục B – Mẫu trình bày một feature](#phụ-lục-b--mẫu-trình-bày-một-feature)
33. [Phụ lục C – Nguyên tắc ghi nhớ cuối cùng](#phụ-lục-c--nguyên-tắc-ghi-nhớ-cuối-cùng)
34. [Phụ lục D – JavaScript nâng cao thường gặp khi phỏng vấn](#phụ-lục-d--javascript-nâng-cao-thường-gặp-khi-phỏng-vấn)
35. [Phụ lục E – React chuyên sâu và React hiện đại](#phụ-lục-e--react-chuyên-sâu-và-react-hiện-đại)

---

## 1. Cách học với tài liệu này

### 1.1. Chu trình học một kiến thức

Với mỗi chủ đề, hãy học theo 5 bước:

1. **Định nghĩa:** Nó là gì?
2. **Lý do:** Nó giải quyết vấn đề nào?
3. **Cơ chế:** Nó hoạt động như thế nào?
4. **Áp dụng:** Dùng ở đâu trong dự án?
5. **Phản biện:** Khi nào không nên dùng? Lỗi thường gặp là gì?

Nếu chỉ nhớ cú pháp, bạn có thể làm bài theo mẫu nhưng dễ bị bí khi phỏng vấn hỏi sâu. Nếu hiểu đủ 5 bước trên, bạn có thể trả lời ngay cả khi câu hỏi được diễn đạt theo cách khác.

### 1.2. Công thức trả lời phỏng vấn

Một câu trả lời kỹ thuật tốt thường có cấu trúc:

> **Định nghĩa ngắn → cơ chế chính → ví dụ thực tế → lưu ý hoặc trade-off.**

Ví dụ với `useState`:

> `useState` là Hook dùng để lưu state cục bộ của function component. Khi gọi hàm setter, React lên lịch cập nhật state và render lại component. State ở mỗi lần render là một snapshot, nên việc đọc state ngay sau setter vẫn có thể thấy giá trị cũ. Trong trang Login, em dùng `useState` để quản lý việc hiện hoặc ẩn mật khẩu. Nếu state mới phụ thuộc state cũ, em ưu tiên functional update như `setShow(prev => !prev)`.

### 1.3. Ba mức độ phải đạt

- **Mức 1 – Nhận biết:** đọc code và biết nó đang làm gì.
- **Mức 2 – Thực hành:** tự viết được mà không sao chép hoàn toàn.
- **Mức 3 – Giải thích:** trình bày được bản chất, trade-off và cách sửa lỗi.

Muốn đi phỏng vấn ổn, các phần React core, JavaScript, TypeScript, Router và API nên đạt mức 3.

---

## 2. Bản đồ công nghệ của dự án

### 2.1. Stack hiện tại

| Công nghệ | Vai trò trong dự án |
|---|---|
| React 19 | Xây dựng giao diện bằng component |
| React DOM | Gắn cây React vào DOM của trình duyệt |
| TypeScript | Kiểm tra kiểu dữ liệu khi phát triển |
| Vite | Dev server và build tool |
| React Router | Điều hướng giữa các trang phía client |
| Formik | Quản lý trạng thái form |
| Yup | Khai báo quy tắc validation |
| Axios | Gửi HTTP request đến backend |
| Tailwind CSS | Viết utility class để tạo giao diện |
| SCSS | Viết stylesheet có cú pháp mở rộng |
| SweetAlert2 | Hiển thị toast và dialog |
| TanStack React Query | Quản lý server state; đã cài nhưng chưa dùng |
| Zustand | Quản lý global client state; đã cài nhưng chưa dùng |
| Socket.IO Client | Giao tiếp realtime; đã cài nhưng chưa dùng |

### 2.2. Luồng chạy hiện tại

```text
index.html
   ↓ chứa <div id="root">
src/main.tsx
   ↓ createRoot(...).render(...)
BrowserRouter
   ↓
App
   ↓
AppRouters
   ↓ route "/"
LoginPage
   ↓ submit form
Axios POST /api/auth/login
   ↓ Vite proxy trong môi trường development
Backend API
```

### 2.3. Phân loại state trong một ứng dụng chat

| Loại state | Ví dụ | Công cụ phù hợp |
|---|---|---|
| Local UI state | hiện mật khẩu, mở modal | `useState` |
| Form state | email, password, errors | Formik hoặc React Hook Form |
| URL state | trang hiện tại, conversation ID | React Router |
| Server state | user, danh sách tin nhắn | React Query |
| Global client state | theme, sidebar, draft toàn cục | Zustand/Context |
| Realtime event | tin nhắn mới, typing | Socket.IO; sau đó đồng bộ vào cache/store |

Điểm quan trọng khi phỏng vấn: **không phải state nào cũng nên đưa vào global store**. Hãy đặt state ở nơi gần nhất với các component thật sự cần nó.

---

## 3. Nền tảng Web bắt buộc

## 3.1. Browser, DOM và JavaScript

Trình duyệt nhận HTML, CSS và JavaScript:

- HTML mô tả cấu trúc và ý nghĩa nội dung.
- CSS quyết định cách trình bày.
- JavaScript tạo hành vi động.
- DOM là mô hình đối tượng mà trình duyệt tạo ra từ HTML.

Khi JavaScript gọi `document.getElementById("root")`, nó đang tìm một node DOM. React dùng node đó làm nơi quản lý giao diện của ứng dụng.

### Câu trả lời phỏng vấn mẫu

> DOM là biểu diễn dạng cây của tài liệu HTML trong bộ nhớ. JavaScript có thể đọc và thay đổi cây này. React không thay thế DOM; React quản lý việc mô tả giao diện và cập nhật DOM thật một cách có tổ chức thông qua quá trình render và commit.

## 3.2. SPA là gì?

SPA – Single Page Application – thường tải một trang HTML gốc, sau đó JavaScript thay đổi nội dung khi người dùng điều hướng mà không tải lại toàn bộ tài liệu.

Ưu điểm:

- Chuyển trang mượt.
- Có thể giữ state trên client.
- Trải nghiệm giống ứng dụng desktop/mobile.

Nhược điểm:

- Bundle JavaScript ban đầu có thể lớn.
- SEO cần được xử lý cẩn thận.
- Routing, cache và authentication phía client phức tạp hơn.
- Nếu JavaScript lỗi nặng, phần lớn ứng dụng có thể không hoạt động.

## 3.3. Client-side rendering và server-side rendering

- **CSR:** trình duyệt tải JavaScript và render nội dung chính ở client. Dự án hiện tại dùng hướng này.
- **SSR:** server tạo HTML cho mỗi request, sau đó client hydrate để thêm tương tác.
- **SSG:** HTML được tạo trước ở thời điểm build.
- **Hydration:** React gắn logic và event handler lên HTML đã được server render.

Vite + React thuần thường là CSR. Framework như Next.js cung cấp thêm SSR/SSG và nhiều chiến lược render khác.

## 3.4. HTTP cơ bản

Một HTTP request thường có:

- Method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- URL.
- Headers.
- Body, nếu cần.

Một response thường có:

- Status code.
- Headers.
- Body.

Các status code hay gặp:

- `200 OK`: thành công.
- `201 Created`: tạo mới thành công.
- `204 No Content`: thành công, không có body.
- `400 Bad Request`: request không hợp lệ.
- `401 Unauthorized`: chưa xác thực hoặc token không hợp lệ.
- `403 Forbidden`: đã xác thực nhưng không có quyền.
- `404 Not Found`: không tìm thấy tài nguyên.
- `409 Conflict`: xung đột dữ liệu.
- `422 Unprocessable Content`: dữ liệu đúng cú pháp nhưng không hợp lệ nghiệp vụ.
- `500 Internal Server Error`: lỗi phía server.

---

## 4. JavaScript cốt lõi

## 4.1. `let`, `const` và `var`

- `const`: không thể gán lại biến; nên dùng mặc định.
- `let`: dùng khi cần gán lại.
- `var`: function-scoped và có cơ chế hoisting dễ gây nhầm; tránh trong code hiện đại.

`const` không làm object bất biến:

```ts
const user = { name: "An" };
user.name = "Bình"; // hợp lệ
// user = {}         // không hợp lệ vì gán lại biến
```

## 4.2. Primitive và Reference value

Primitive gồm `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Object, array và function là reference value.

```ts
const a = { count: 1 };
const b = a;
b.count = 2;
// a.count cũng bằng 2 vì a và b trỏ tới cùng object
```

Điều này liên quan trực tiếp đến React: nếu mutation object cũ rồi truyền lại cùng reference, React và các cơ chế memoization có thể không nhận biết thay đổi như bạn mong muốn.

## 4.3. Equality

- `===`: so sánh nghiêm ngặt, không tự ép kiểu.
- `==`: có ép kiểu, dễ tạo kết quả bất ngờ.
- `Object.is`: gần giống `===`, nhưng xử lý `NaN` và `-0` khác.

Trong code ứng dụng, ưu tiên `===`.

## 4.4. Scope, Closure và Lexical Environment

**Scope** xác định nơi một biến có thể được truy cập. JavaScript có global scope, function scope và block scope.

**Closure** là khả năng một function ghi nhớ và truy cập lexical environment nơi nó được tạo, kể cả khi function bên ngoài đã chạy xong.

```ts
function createCounter() {
  let count = 0;

  return () => {
    count += 1;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
```

Closure liên quan đến React Hook và stale closure. Một event handler/effect “nhìn thấy” props và state của lần render tạo ra nó.

### Câu trả lời phỏng vấn mẫu

> Closure là việc function giữ quyền truy cập vào lexical scope tại nơi nó được khai báo. Trong React, callback và effect tạo closure trên state của từng render. Vì vậy callback chạy trễ có thể đọc state cũ nếu dependency hoặc cách cập nhật state không đúng.

## 4.5. Destructuring, Spread và Rest

```ts
const user = { id: 1, name: "An", role: "admin" };
const { id, ...profile } = user;

const oldItems = [1, 2];
const newItems = [...oldItems, 3];
```

- Spread trải phần tử/thuộc tính ra vị trí mới.
- Rest gom phần còn lại.
- Spread chỉ sao chép nông – shallow copy.

## 4.6. Các hàm Array quan trọng

- `map`: biến đổi từng phần tử và trả array mới.
- `filter`: giữ các phần tử thỏa điều kiện.
- `find`: lấy phần tử đầu tiên thỏa điều kiện.
- `some`: có ít nhất một phần tử thỏa điều kiện.
- `every`: mọi phần tử đều thỏa điều kiện.
- `reduce`: tích lũy thành một kết quả.

```ts
const visibleMessages = messages
  .filter(message => !message.deleted)
  .map(message => ({ ...message, selected: false }));
```

Không nên dùng `map` chỉ để tạo side effect; khi không cần array trả về, dùng `forEach` hoặc vòng lặp phù hợp.

## 4.7. Optional chaining và Nullish coalescing

```ts
const avatar = user?.profile?.avatarUrl;
const displayName = user.name ?? "Người dùng";
```

- `?.` dừng và trả `undefined` nếu giá trị trước nó là `null`/`undefined`.
- `??` dùng vế phải chỉ khi vế trái là `null`/`undefined`.
- `||` dùng vế phải với mọi falsy value như `0`, `""`, `false`; đây là khác biệt quan trọng.

## 4.8. Promise, `async/await` và xử lý lỗi

Promise có ba trạng thái:

- pending;
- fulfilled;
- rejected.

Một function `async` luôn trả về Promise. `await` tạm dừng riêng function async đó cho đến khi Promise settled; nó không chặn toàn bộ main thread theo nghĩa đồng bộ.

```ts
async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    // chuyển đổi/log/rethrow tùy tầng trách nhiệm
    throw error;
  }
}
```

Không nên bắt lỗi rồi bỏ qua hoàn toàn. UI cần biết request thất bại để hiển thị feedback phù hợp.

## 4.9. Event loop

JavaScript trên browser thường thực thi code ứng dụng trên main thread. Event loop phối hợp:

- Call stack.
- Web APIs của browser.
- Task/macrotask queue như `setTimeout`.
- Microtask queue như callback của Promise.

Microtask thường được xử lý sau khi stack trống và trước task tiếp theo.

```ts
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// A, D, C, B
```

## 4.10. Module

ES Module dùng `export` và `import`:

```ts
export const showError = () => {};
export default function Button() {}
```

Default export có thể được import bằng tên khác. Named export phải dùng đúng tên, trừ khi dùng alias. Khi dự án lớn, named export thường giúp refactor và tìm kiếm rõ hơn.

---

## 5. TypeScript cốt lõi

## 5.1. TypeScript giải quyết gì?

TypeScript là superset của JavaScript, bổ sung hệ thống kiểu tĩnh ở thời điểm phát triển. Sau khi biên dịch/transpile, type bị xóa; browser vẫn chạy JavaScript.

TypeScript giúp:

- phát hiện lỗi sớm;
- autocomplete tốt hơn;
- mô tả contract giữa các module;
- refactor an toàn hơn.

TypeScript không tự validate dữ liệu runtime từ API. Dữ liệu từ network vẫn cần kiểm tra bằng Yup, Zod hoặc logic runtime khác nếu độ tin cậy quan trọng.

## 5.2. Type inference và annotation

```ts
const name = "An"; // TypeScript suy luận string
let count: number = 0;
```

Đừng annotation mọi thứ khi TypeScript đã suy luận rõ. Hãy annotation ở boundary: props, API model, tham số/hàm public, store và dữ liệu phức tạp.

## 5.3. `type` và `interface`

```ts
interface User {
  id: string;
  name: string;
}

type Status = "idle" | "loading" | "success" | "error";
```

- Cả hai đều mô tả shape của object.
- `interface` hỗ trợ declaration merging và `extends` tự nhiên.
- `type` linh hoạt với union, intersection, tuple và mapped type.
- Trong dự án, quan trọng nhất là thống nhất convention, không phải tranh luận tuyệt đối cái nào tốt hơn.

## 5.4. Union, Literal và Narrowing

```ts
type ButtonType = "button" | "submit" | "reset";

function formatId(id: string | number) {
  if (typeof id === "number") {
    return id.toFixed(0);
  }
  return id.toUpperCase();
}
```

Narrowing là quá trình TypeScript thu hẹp union dựa trên điều kiện runtime.

## 5.5. `any`, `unknown` và `never`

- `any`: tắt phần lớn kiểm tra kiểu; dùng ít nhất có thể.
- `unknown`: chưa biết kiểu; phải kiểm tra trước khi sử dụng.
- `never`: giá trị không bao giờ tồn tại, thường dùng cho exhaustive checking hoặc function luôn throw.

```ts
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Đã có lỗi xảy ra";
}
```

Trong `catch`, `unknown` an toàn hơn `any`.

## 5.6. Generic

Generic cho phép viết logic dùng lại nhưng vẫn giữ thông tin kiểu:

```ts
type ApiResponse<T> = {
  data: T;
  message: string;
};

type LoginResponse = ApiResponse<{
  accessToken: string;
  user: User;
}>;
```

## 5.7. Utility types

- `Partial<T>`: mọi field thành optional.
- `Required<T>`: mọi field thành required.
- `Pick<T, K>`: chọn một số field.
- `Omit<T, K>`: bỏ một số field.
- `Record<K, V>`: object có key/value theo kiểu cho trước.
- `Readonly<T>`: field chỉ đọc ở compile time.

```ts
type UserPreview = Pick<User, "id" | "name">;
type UpdateUserInput = Partial<Omit<User, "id">>;
```

## 5.8. Typing React props

Trong `Input.tsx`, dự án có một props type. Nên đặt tên PascalCase:

```tsx
type InputProps = {
  label?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  rightIcon?: React.ReactNode;
};
```

- `React.ReactNode`: hầu hết nội dung có thể render.
- `React.ReactElement`: một React element cụ thể, hẹp hơn.
- `ChangeEventHandler<HTMLInputElement>`: kiểu handler cho sự kiện change của input.

Có thể kế thừa native props để component linh hoạt hơn:

```tsx
type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label?: string;
  error?: string;
};
```

## 5.9. Compile-time và runtime

```ts
const response = await fetch("/api/user");
const data = (await response.json()) as User;
```

`as User` chỉ nói với TypeScript “hãy tin tôi”; nó không biến dữ liệu sai thành đúng. Đây là câu hỏi phỏng vấn phổ biến.

---

## 6. Vite và quy trình chạy ứng dụng

## 6.1. Vite là gì?

Vite là build tool và development server. Trong development, nó tận dụng ES Module để khởi động nhanh và hỗ trợ HMR. Khi build production, Vite tối ưu và đóng gói tài nguyên.

Các script hiện tại:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

- `npm run dev`: chạy dev server.
- `npm run build`: type-check bằng TypeScript rồi build production.
- `npm run lint`: kiểm tra quy tắc code.
- `npm run preview`: xem thử bản build local; không phải production server đầy đủ.

## 6.2. Entry point

`index.html` chứa node `root`. `src/main.tsx` dùng:

```tsx
createRoot(document.getElementById("root")!).render(<App />);
```

Dấu `!` là non-null assertion: lập trình viên cam kết kết quả không phải `null`. Nếu HTML không có `#root`, ứng dụng vẫn lỗi runtime.

## 6.3. HMR

Hot Module Replacement cập nhật module trong khi phát triển mà thường không reload toàn trang. React Fast Refresh cố gắng giữ state khi chỉnh component, nhưng không phải mọi thay đổi đều giữ được state.

## 6.4. Environment variables

Với Vite, biến cần dùng ở client thường có prefix `VITE_` và được đọc qua `import.meta.env`. Mọi biến được đưa vào bundle client đều có thể bị người dùng xem; tuyệt đối không đặt secret phía server trong frontend env.

Dự án dùng `loadEnv` trong `vite.config.ts` để cấu hình port, allowed host và proxy.

## 6.5. Proxy `/api`

Trong development:

```text
Browser gọi /api/auth/login
        ↓
Vite dev server nhận request
        ↓ proxy
VITE_API_BASE_URL/auth/login
```

Proxy giúp tránh hard-code URL và có thể giảm vấn đề CORS khi phát triển. Proxy của Vite chỉ tồn tại ở dev server; khi deploy, reverse proxy hoặc server hosting cần cấu hình tương ứng.

## 6.6. CORS

CORS là chính sách của browser kiểm soát request từ một origin sang origin khác. CORS header phải được server đích trả về. Cài package `cors` ở frontend không tự giải quyết CORS; thường package đó thuộc phía Node.js backend.

---

## 7. React là gì và mô hình tư duy đúng

## 7.1. Định nghĩa

React là thư viện JavaScript dùng để xây dựng giao diện người dùng theo hướng khai báo và component.

- **Declarative:** mô tả UI nên trông như thế nào theo state hiện tại.
- **Component-based:** chia giao diện thành các khối có trách nhiệm rõ ràng và có thể tái sử dụng.

Thay vì tự ra lệnh “tìm node, đổi text, thêm class”, ta mô tả:

```tsx
return isLoading ? <Loading /> : <UserProfile user={user} />;
```

## 7.2. React không phải framework đầy đủ

React tập trung chủ yếu vào UI. Routing, data fetching, form, state management và build tool có thể cần giải pháp bổ sung. Dự án dùng Router, Axios, Formik, Yup, React Query và Zustand cho các phần đó.

## 7.3. UI là hàm của state

Mô hình tinh thần quan trọng:

```text
UI = f(state, props)
```

Với cùng props và state, một component thuần khiết nên trả về cùng mô tả UI, không sửa dữ liệu bên ngoài trong lúc render.

## 7.4. Render và Commit

Có thể hình dung update React qua ba bước:

1. **Trigger:** render ban đầu hoặc state update.
2. **Render:** React gọi component để tính cây UI mới.
3. **Commit:** React áp dụng thay đổi cần thiết lên DOM.

Render không đồng nghĩa toàn bộ DOM bị tạo lại. Component có thể được gọi lại để React tính toán, rồi React chỉ commit khác biệt cần thiết.

## 7.5. Reconciliation

Reconciliation là quá trình React so sánh cây element mới với cây trước để quyết định phần nào được giữ, cập nhật hoặc tháo bỏ. Type của element và `key` ảnh hưởng lớn đến việc React giữ hay reset state của component.

## 7.6. Strict Mode

Dự án bọc app bằng `<StrictMode>`. Trong development, Strict Mode có thể gọi lại một số logic/render/effect setup-cleanup để giúp phát hiện code không thuần khiết và thiếu cleanup. Điều này không có nghĩa production luôn chạy hai lần.

Nếu API bị gọi hai lần trong dev do effect, đừng vội xóa Strict Mode. Hãy kiểm tra effect có đúng trách nhiệm, có cleanup, có idempotent và có nên dùng data-fetching library hay không.

---

## 8. JSX và React Element

## 8.1. JSX là gì?

JSX là cú pháp mở rộng cho JavaScript, cho phép viết cấu trúc giống HTML trong code. JSX được biến đổi thành lời gọi tạo React element; browser không hiểu trực tiếp JSX.

```tsx
const element = <Button type="submit">Đăng nhập</Button>;
```

JSX không phải string HTML và React element không phải DOM node. React element là object mô tả thứ cần render.

## 8.2. Quy tắc JSX

- Component phải trả về một root chung hoặc Fragment.
- Dùng `className`, không dùng `class`.
- Biểu thức JavaScript đặt trong `{}`.
- Tên component tự tạo viết hoa.
- Attribute thường dùng camelCase như `onClick`, `tabIndex`.

## 8.3. Expression và Statement

Trong `{}` của JSX dùng expression:

```tsx
<p>{user.name}</p>
```

Không đặt trực tiếp statement như `if` hoặc `for` vào `{}`. Hãy xử lý trước `return`, dùng toán tử ba ngôi hoặc map.

## 8.4. Fragment

Fragment nhóm nhiều phần tử mà không tạo thêm DOM wrapper:

```tsx
return (
  <>
    <Header />
    <Main />
  </>
);
```

Khi render list và cần key trên Fragment, dùng dạng đầy đủ `<Fragment key={...}>`.

---

## 9. Component, Props và Composition

## 9.1. Component

Function component là function nhận props và trả JSX/React node:

```tsx
type GreetingProps = { name: string };

function Greeting({ name }: GreetingProps) {
  return <h1>Xin chào {name}</h1>;
}
```

Tên component phải viết hoa để React phân biệt với tag HTML.

## 9.2. Props

Props là dữ liệu component cha truyền xuống component con. Props là read-only từ góc nhìn component nhận nó.

Không nên sửa props:

```tsx
function Profile({ user }: { user: User }) {
  // user.name = "Khác"; // mutation dữ liệu do cha sở hữu
  return <p>{user.name}</p>;
}
```

## 9.3. `children`

`children` cho phép component bọc nội dung khác:

```tsx
<Button>
  <Icon />
  Đăng nhập
</Button>
```

Trong dự án, `Button` nhận `children: React.ReactNode`, nhờ đó nút có thể chứa text và icon.

## 9.4. Composition

Composition là ghép component nhỏ thành UI lớn. React ưu tiên composition hơn inheritance cho phần lớn bài toán UI.

Ví dụ, thay vì tạo rất nhiều boolean prop:

```tsx
<Card header={<CardHeader />} footer={<CardFooter />}>
  <MessageList />
</Card>
```

## 9.5. Presentational và Container component

- Presentational component tập trung hiển thị, nhận dữ liệu qua props.
- Container/page component điều phối query, mutation, navigation và business logic.

Đây không phải luật cứng, nhưng là cách phân tách trách nhiệm hữu ích. `Input` nên thiên về presentational; `LoginPage` điều phối form và gọi API.

## 9.6. Prop drilling

Prop drilling là việc truyền props qua nhiều tầng trung gian chỉ để đến component sâu. Không phải mọi prop drilling đều xấu. Khi quá sâu hoặc nhiều nhánh cần chung dữ liệu, cân nhắc composition, Context hoặc store.

---

## 10. State, Render và tính bất biến

## 10.1. State là gì?

State là dữ liệu riêng của component, có thể thay đổi theo thời gian và ảnh hưởng đến UI. Trong Login:

```tsx
const [showPassword, setShowPassword] = useState(false);
```

`showPassword` là giá trị của render hiện tại. `setShowPassword` yêu cầu React lên lịch render với giá trị mới.

## 10.2. State là snapshot

Mỗi render nhận một snapshot state. Setter không sửa biến state của render đang chạy:

```tsx
setCount(count + 1);
console.log(count); // vẫn là count của render hiện tại
```

## 10.3. Batching

React có thể gom nhiều state update trong cùng một lượt xử lý để giảm render không cần thiết.

```tsx
setCount(count + 1);
setCount(count + 1);
```

Cả hai cùng dùng một snapshot nên không đảm bảo tăng 2. Nếu phụ thuộc giá trị trước, dùng updater function:

```tsx
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

Trong dự án nên viết:

```tsx
setShowPassword(prev => !prev);
```

## 10.4. Immutability

Không mutation state object/array. Hãy tạo reference mới:

```tsx
setUser(prev => ({ ...prev, name: "Tên mới" }));

setMessages(prev => [
  ...prev,
  newMessage,
]);
```

Lợi ích:

- React dễ nhận biết thay đổi theo reference.
- Dễ debug và undo/redo.
- Memoization hoạt động đúng hơn.
- Tránh side effect ngoài ý muốn.

## 10.5. State tối thiểu

Không lưu vào state dữ liệu có thể suy ra từ props/state khác:

```tsx
const fullName = `${firstName} ${lastName}`;
```

Không cần `fullName` state + effect đồng bộ. Derived data nên được tính trong render; chỉ memoize nếu phép tính thực sự tốn kém.

## 10.6. Lifting state up

Khi hai component anh em cần chia sẻ state, đưa state lên component cha chung gần nhất, rồi truyền giá trị và callback xuống.

## 10.7. Controlled và uncontrolled

- Controlled input: React giữ `value` và xử lý `onChange`.
- Uncontrolled input: DOM giữ giá trị; có thể đọc qua ref hoặc form API.

Input email/password hiện tại là controlled thông qua Formik. Checkbox trong component `Input` hiện là uncontrolled vì chưa nhận `checked`/`onChange`.

---

## 11. Xử lý sự kiện trong React

## 11.1. Truyền function, không gọi ngay

```tsx
<button onClick={handleClick}>Đúng</button>
<button onClick={handleClick()}>Sai trong đa số trường hợp</button>
```

Dạng thứ hai gọi function ngay lúc render và truyền kết quả của nó làm handler.

## 11.2. Event object

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}
```

## 11.3. Bubbling và capturing

Event thường bubble từ phần tử con lên cha. Có thể gọi `event.stopPropagation()` khi thực sự cần chặn. `event.preventDefault()` ngăn hành vi mặc định như submit form hoặc điều hướng của link.

Đừng lạm dụng `stopPropagation`; đôi khi thiết kế component/event rõ hơn sẽ dễ bảo trì hơn.

## 11.4. Event handler và side effect

Side effect do hành động cụ thể của người dùng nên đặt trong event handler nếu có thể. Ví dụ submit login thuộc `onSubmit`, không cần effect “theo dõi form rồi tự login”.

---

## 12. Conditional Rendering, List và Key

## 12.1. Các cách render có điều kiện

```tsx
if (isLoading) return <Loading />;

return isLoggedIn ? <Home /> : <Login />;

return <>{error && <ErrorMessage message={error} />}</>;
```

Lưu ý với `&&`: giá trị như `0` có thể được render. Nếu muốn điều kiện boolean rõ ràng, hãy kiểm tra cụ thể.

## 12.2. Render list

```tsx
{messages.map(message => (
  <MessageItem key={message.id} message={message} />
))}
```

## 12.3. `key` là gì?

`key` giúp React nhận diện item ổn định giữa các render. Key chỉ cần unique trong nhóm sibling, không cần unique toàn ứng dụng.

Ưu tiên ID ổn định từ dữ liệu. Tránh index nếu list có thể thêm, xóa hoặc sắp xếp lại. Tránh `Math.random()` vì key đổi mỗi render, làm component bị remount và mất state.

`key` không được truyền tự động vào props; nếu con cần ID, truyền riêng `id={message.id}`.

## 12.4. Key và reset state

Thay đổi key khiến React xem đó là component khác, unmount component cũ và mount component mới. Có thể dùng có chủ đích để reset form theo user/conversation, nhưng không nên lạm dụng.

---

## 13. Hooks quan trọng

## 13.1. Hook là gì?

Hook là function cho phép function component sử dụng các khả năng của React như state, context, ref và effect.

### Rules of Hooks

1. Chỉ gọi Hook ở top level, không gọi trong `if`, loop hoặc function lồng thông thường.
2. Chỉ gọi Hook từ React function component hoặc custom Hook.

React dựa vào thứ tự gọi Hook ổn định giữa các render để liên kết đúng state.

## 13.2. `useState`

```tsx
const [value, setValue] = useState("");
```

Dùng cho state cục bộ ảnh hưởng render. Nếu giá trị khởi tạo tốn kém:

```tsx
const [data] = useState(() => expensiveInitialValue());
```

Function initializer chỉ nhằm tính initial state, thay vì chạy lại phép tính trên mỗi render.

## 13.3. `useEffect`

Effect dùng để đồng bộ component với **external system**, ví dụ:

- kết nối socket;
- subscription;
- timer;
- DOM API bên ngoài React;
- request thủ công trong một số trường hợp.

```tsx
useEffect(() => {
  const socket = connect(roomId);

  return () => {
    socket.disconnect();
  };
}, [roomId]);
```

Effect chạy sau khi React commit. Cleanup chạy trước lần setup tiếp theo khi dependency đổi và khi unmount.

### Dependency array

- Không truyền array: chạy sau mỗi commit.
- `[]`: setup theo vòng đời mount; trong dev Strict Mode có thể có chu trình kiểm tra setup/cleanup thêm.
- `[a, b]`: chạy lại khi dependency thay đổi theo so sánh `Object.is`.

### Khi không cần effect

Không dùng effect để:

- tính derived state đơn giản;
- xử lý click/submit cụ thể;
- đồng bộ hai state có thể gộp hoặc suy ra;
- biến đổi dữ liệu để render nếu có thể làm trực tiếp.

Effect quá nhiều thường là dấu hiệu mô hình state chưa tốt.

### Race condition khi fetch

Nếu tự fetch trong effect, request cũ có thể về sau request mới. Cần AbortController/ignore flag hoặc dùng React Query để quản lý tốt hơn.

## 13.4. `useRef`

`useRef` giữ một object ổn định qua các render. Thay đổi `.current` không trigger render.

Ứng dụng:

- truy cập DOM node;
- lưu timer ID;
- lưu giá trị mutable không cần hiển thị;
- tích hợp thư viện ngoài.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

function focusInput() {
  inputRef.current?.focus();
}
```

Nếu dữ liệu phải xuất hiện trên UI, dùng state thay vì ref.

## 13.5. `useMemo`

`useMemo` cache kết quả tính toán giữa các render cho đến khi dependency đổi:

```tsx
const sortedMessages = useMemo(
  () => expensiveSort(messages),
  [messages],
);
```

Đây là tối ưu hiệu năng, không phải đảm bảo logic. Đừng dùng cho phép tính rẻ hoặc để “sửa” dependency sai.

## 13.6. `useCallback`

`useCallback` cache reference của function:

```tsx
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);
```

Nó hữu ích khi:

- callback truyền vào component đã memo;
- callback là dependency của Hook khác;
- ổn định reference thực sự tránh được công việc đáng kể.

`useCallback` không ngăn function được viết/tạo về mặt cú pháp mỗi render; React trả lại cached function khi dependency không đổi. Lạm dụng có thể làm code phức tạp mà không nhanh hơn.

## 13.7. `useContext`

Context truyền dữ liệu qua cây component mà không phải truyền props qua mọi tầng.

Phù hợp với theme, locale, auth context hoặc dependency ổn định. Khi value thay đổi, consumer liên quan render lại. Context không tự động là giải pháp tối ưu cho mọi global state có tần suất cập nhật cao.

## 13.8. `useReducer`

`useReducer` phù hợp khi state transition phức tạp hoặc nhiều field liên quan:

```tsx
type Action =
  | { type: "start" }
  | { type: "success"; payload: User }
  | { type: "error"; payload: string };
```

Reducer nên thuần khiết: nhận state/action, trả state mới, không gọi API hay mutation dữ liệu cũ.

## 13.9. Custom Hook

Custom Hook đóng gói logic có sử dụng Hook:

```tsx
function useAuth() {
  // đọc auth state, cung cấp login/logout
}
```

Tên bắt đầu bằng `use` để linter và người đọc nhận biết rules of Hooks. Custom Hook chia sẻ logic, không tự động chia sẻ cùng một state instance; mỗi lần gọi có state riêng trừ khi nó kết nối tới Context/store chung.

## 13.10. `useTransition` và `useDeferredValue`

- `useTransition` đánh dấu một số update là không khẩn cấp, giúp tương tác khẩn cấp như nhập liệu vẫn phản hồi tốt.
- `useDeferredValue` tạo phiên bản trì hoãn của một value cho phần UI nặng.

Chúng không thay thế debounce và không làm tác vụ CPU nặng biến mất; chúng giúp React ưu tiên công việc render.

---

## 14. Form, Formik và Yup

## 14.1. Những state của form

Một form thường có:

- values;
- touched;
- errors;
- dirty;
- isValid;
- isSubmitting.

Formik quản lý các trạng thái này và kết nối chúng với input.

## 14.2. Luồng form hiện tại

```text
Người dùng nhập
  ↓ handleChange
Formik cập nhật values
  ↓ handleBlur
Formik cập nhật touched
  ↓ Yup validation
Formik tạo errors
  ↓ submit hợp lệ
onSubmit → Axios → navigate
```

## 14.3. `initialValues`

Mỗi field controlled nên có initial value phù hợp, thường là chuỗi rỗng. Tránh chuyển input từ uncontrolled sang controlled trong vòng đời component.

## 14.4. Validation schema

```ts
const schema = Yup.object({
  email: Yup.string()
    .email("Email không đúng định dạng")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});
```

Frontend validation giúp UX tốt hơn nhưng không thay thế backend validation. Client có thể bị bypass; server luôn phải kiểm tra lại.

## 14.5. `touched` và `errors`

Chỉ hiện lỗi khi field đã được tương tác giúp tránh hiển thị hàng loạt lỗi ngay khi form vừa mở:

```tsx
{formik.touched.email && formik.errors.email && (
  <div>{formik.errors.email}</div>
)}
```

## 14.6. Submit và loading

`isSubmitting` giúp disable nút để tránh gửi lặp. Cần đảm bảo trạng thái được kết thúc đúng. Với async `onSubmit`, Formik có thể theo dõi Promise; nếu dùng flow khác, có thể cần `setSubmitting(false)`.

Nên phân biệt:

- lỗi validation phía client;
- sai thông tin đăng nhập (`401`);
- mạng lỗi/timeout;
- lỗi server (`500`).

Không nên hiển thị “email hoặc mật khẩu sai” cho mọi loại lỗi.

## 14.7. Accessibility của form

`label` cần liên kết với input qua `htmlFor` và `id`. Error nên có `aria-describedby`; input lỗi nên có `aria-invalid="true"`. Nút hiện mật khẩu cần `aria-label` rõ ràng.

---

## 15. React Router

## 15.1. Client-side routing

Router ánh xạ URL sang UI mà không reload toàn trang. `BrowserRouter` dùng History API của browser.

```tsx
<Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/home" element={<HomePage />} />
</Routes>
```

## 15.2. Điều hướng khai báo và điều hướng bằng code

- Dùng `<Link>` cho liên kết người dùng có thể bấm.
- Dùng `useNavigate` sau một hành động như đăng nhập thành công.

Không nên dùng `<a href>` cho route nội bộ nếu muốn giữ client-side navigation, vì nó thường reload toàn trang. Dùng `Link` hoặc component router tương ứng.

## 15.3. Nested route và `Outlet`

Layout dùng chung có thể khai báo route cha:

```tsx
<Route element={<MainLayout />}>
  <Route path="/home" element={<HomePage />} />
  <Route path="/messages/:conversationId" element={<ChatPage />} />
</Route>
```

`MainLayout` render `<Outlet />` tại vị trí dành cho route con.

## 15.4. Route parameters và query string

- `/messages/:conversationId`: path parameter.
- `/search?q=react&page=2`: query/search parameters.

URL nên là nguồn sự thật cho state cần bookmark, chia sẻ hoặc back/forward như filter, page và selected conversation.

## 15.5. Protected Route

Protected route kiểm tra trạng thái xác thực trước khi render nội dung:

```tsx
function RequireAuth() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
```

Đây chỉ là bảo vệ UX phía client. Backend vẫn phải kiểm tra token và quyền trên mọi API nhạy cảm.

## 15.6. Route 404

Luôn nên có fallback:

```tsx
<Route path="*" element={<NotFoundPage />} />
```

## 15.7. Deployment fallback

Với SPA dùng BrowserRouter, truy cập trực tiếp `/home` khiến server nhận path đó. Hosting phải được cấu hình fallback về `index.html`, nếu không sẽ trả 404 dù điều hướng trong app hoạt động.

---

## 16. HTTP, REST API và Axios

## 16.1. Axios instance

Dự án tạo instance:

```ts
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
```

Lợi ích:

- gom base URL;
- dùng chung header;
- cấu hình timeout;
- thêm interceptor;
- thống nhất xử lý lỗi.

## 16.2. Request và response

```ts
const response = await api.post<LoginResponse>("/auth/login", {
  email,
  password,
});

const data = response.data;
```

Generic giúp TypeScript biết shape mong đợi, nhưng không runtime validate response.

## 16.3. Interceptor

Request interceptor có thể gắn token. Response interceptor có thể chuẩn hóa lỗi hoặc xử lý `401`.

Lưu ý:

- tránh tạo vòng lặp refresh token;
- tránh đăng ký interceptor nhiều lần do component render;
- không nuốt lỗi;
- logic redirect cần tránh phụ thuộc router sai tầng.

## 16.4. Cancel request

Khi search hoặc unmount, request cũ có thể không còn cần. Dùng `AbortController` nếu API/library hỗ trợ để hủy và tránh race condition/lãng phí.

## 16.5. REST cơ bản

REST thường mô hình hóa tài nguyên:

```text
GET    /conversations
GET    /conversations/:id
POST   /conversations
PATCH  /messages/:id
DELETE /messages/:id
```

- `PUT` thường thay thế toàn bộ representation.
- `PATCH` cập nhật một phần.
- GET nên idempotent và không thay đổi dữ liệu.
- Idempotent nghĩa là gửi cùng thao tác nhiều lần có hiệu ứng cuối tương đương một lần; không có nghĩa response luôn giống tuyệt đối.

## 16.6. Error handling theo tầng

Nên phân trách nhiệm:

- API layer: gửi request, typing, chuẩn hóa response/error.
- Query/mutation layer: cache, retry, invalidate.
- UI layer: thông báo phù hợp với ngữ cảnh.

Không nên để mọi component tự biết toàn bộ chi tiết Axios/backend.

---

## 17. Authentication và Authorization

## 17.1. Phân biệt

- **Authentication:** xác minh bạn là ai.
- **Authorization:** xác minh bạn được phép làm gì.

Ví dụ: đăng nhập là authentication; kiểm tra quyền xóa tin nhắn là authorization.

## 17.2. Session và Token

Hai hướng phổ biến:

- Session ID trong cookie; server lưu/truy xuất session.
- Access token, thường kèm refresh token.

Không có lựa chọn đúng cho mọi hệ thống. Cần cân nhắc kiến trúc backend, XSS, CSRF, multi-device, revoke và thời hạn token.

## 17.3. Cookie và Web Storage

- Cookie có thể được gửi tự động theo request và có cờ `HttpOnly`, `Secure`, `SameSite`.
- `localStorage` dễ dùng nhưng JavaScript đọc được; XSS có thể lấy token.
- Cookie HttpOnly giảm khả năng JavaScript đánh cắp token trực tiếp nhưng cần thiết kế chống CSRF và cấu hình đúng.

Không nói “localStorage luôn sai” hoặc “cookie luôn an toàn”. Hãy giải thích threat model và cấu hình.

## 17.4. Access token và refresh token

- Access token thường sống ngắn, dùng gọi API.
- Refresh token dùng lấy access token mới, cần bảo vệ chặt.

Khi nhiều request cùng gặp `401`, cơ chế refresh nên tránh gửi nhiều refresh request đồng thời và phải retry có kiểm soát.

## 17.5. Frontend không quyết định quyền cuối cùng

Ẩn nút xóa với user thường chỉ cải thiện UX. Hacker vẫn có thể gọi API trực tiếp. Backend bắt buộc kiểm tra authorization.

---

## 18. TanStack React Query

## 18.1. Server state khác client state

Server state:

- tồn tại ở server;
- có thể bị user khác thay đổi;
- có thể stale;
- cần fetch, cache, retry, refetch và đồng bộ.

React Query chuyên quản lý server state. Nó không phải lựa chọn mặc định cho modal open/close hoặc giá trị input.

## 18.2. Query

```tsx
const conversationsQuery = useQuery({
  queryKey: ["conversations"],
  queryFn: fetchConversations,
});
```

Query key xác định danh tính cache. Mọi biến mà query function phụ thuộc nên xuất hiện trong key:

```tsx
queryKey: ["messages", conversationId]
```

## 18.3. Các trạng thái quan trọng

- pending/loading ban đầu;
- error;
- success;
- fetching nền;
- stale/fresh.

UI cần phân biệt “chưa có dữ liệu và đang tải” với “đã có dữ liệu cũ và đang refetch”.

## 18.4. `staleTime` và garbage collection

- `staleTime`: thời gian dữ liệu được coi là fresh.
- thời gian garbage collection: cache không còn observer sẽ được giữ một thời gian trước khi xóa.

`staleTime` không đồng nghĩa dữ liệu tự bị xóa sau thời gian đó; nó chuyển sang stale và có thể được refetch theo trigger/config.

## 18.5. Mutation

```tsx
const sendMessageMutation = useMutation({
  mutationFn: sendMessage,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["messages", conversationId],
    });
  },
});
```

Mutation dùng cho thao tác làm thay đổi server. Sau mutation có thể invalidate, cập nhật cache trực tiếp hoặc optimistic update.

## 18.6. Optimistic update

Optimistic update cập nhật UI trước khi server xác nhận. Cần:

1. hủy refetch liên quan;
2. snapshot cache cũ;
3. cập nhật cache tạm;
4. rollback nếu lỗi;
5. đồng bộ lại khi settled.

Với chat, có thể thêm tin nhắn tạm có `clientId` và trạng thái `sending`, sau đó thay bằng dữ liệu server hoặc đánh dấu `failed`.

## 18.7. React Query và Socket.IO

HTTP query lấy snapshot ban đầu. Socket nhận event mới. Khi có event:

- cập nhật query cache trực tiếp nếu payload đủ;
- hoặc invalidate query nếu cần fetch lại;
- xử lý chống trùng theo message ID.

Không cần sao chép toàn bộ React Query cache sang Zustand chỉ để “dùng global”.

---

## 19. Zustand và Global State

## 19.1. Khi nào cần global state?

Ví dụ phù hợp:

- trạng thái auth client;
- theme;
- sidebar;
- selected workspace dùng ở nhiều nhánh;
- draft đặc thù cần chia sẻ rộng.

Không phù hợp mặc định:

- state chỉ một component dùng;
- dữ liệu server đã do React Query quản lý;
- URL state đáng ra nằm trong URL;
- form state cục bộ.

## 19.2. Store cơ bản

```ts
type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const useAuthStore = create<AuthStore>(set => ({
  user: null,
  setUser: user => set({ user }),
}));
```

Component nên chọn đúng slice:

```tsx
const user = useAuthStore(state => state.user);
```

Nếu subscribe cả store, component có thể render lại vì những field không liên quan.

## 19.3. Zustand so với Context

Context phù hợp với dependency hoặc dữ liệu thay đổi không quá thường xuyên, tích hợp tự nhiên vào cây React. Zustand cung cấp store ngoài React, selector và API cập nhật tiện cho global state phức tạp hơn.

Không phải dự án nào cũng cần Zustand. Quyết định nên dựa trên nhu cầu, không dựa trên việc package đã được cài.

---

## 20. Socket.IO và ứng dụng chat thời gian thực

## 20.1. Realtime là gì?

Ứng dụng realtime cập nhật gần như ngay khi event xảy ra mà client không phải liên tục bấm refresh. WebSocket cung cấp kết nối hai chiều lâu dài; Socket.IO là thư viện xây trên transport realtime với cơ chế event, reconnect và fallback riêng.

Socket.IO client không phải raw WebSocket client tương đương hoàn toàn; server và client cần dùng giao thức tương thích.

## 20.2. Các event có thể có trong chat

- `conversation:join`;
- `conversation:leave`;
- `message:send`;
- `message:new`;
- `message:read`;
- `typing:start`;
- `typing:stop`;
- `presence:update`.

Tên event nên có convention rõ và payload được type.

## 20.3. Lifecycle kết nối

```tsx
useEffect(() => {
  const socket = createSocket(token);

  socket.on("message:new", handleNewMessage);

  return () => {
    socket.off("message:new", handleNewMessage);
    socket.disconnect();
  };
}, [token]);
```

Phải cleanup listener. Nếu mỗi render đăng ký thêm một handler mà không gỡ, một event sẽ được xử lý nhiều lần và gây memory leak.

## 20.4. Reconnect và tính đúng đắn

Realtime không chỉ là `on` và `emit`. Cần xử lý:

- mất mạng;
- reconnect;
- event bị trùng;
- event đến sai thứ tự;
- missed event trong lúc offline;
- acknowledgement;
- quyền tham gia room;
- pagination lịch sử.

Giải pháp thường dựa trên ID ổn định, timestamp/sequence, deduplication và fetch lại snapshot sau reconnect.

## 20.5. Typing indicator

Typing event nên throttle/debounce để không emit theo từng phím vô hạn. Server/client cần timeout để tự tắt trạng thái nếu event stop bị mất.

## 20.6. Bảo mật Socket

Server phải xác thực connection và kiểm tra authorization khi join room/gửi event. Không tin conversation ID hoặc user ID client tự gửi.

---

## 21. CSS, Tailwind CSS và SCSS

## 21.1. Box model

Mỗi box gồm content, padding, border và margin. Với `box-sizing: border-box`, width/height bao gồm padding và border, thường dễ kiểm soát layout hơn.

## 21.2. Flexbox và Grid

- Flexbox phù hợp layout một chiều – hàng hoặc cột.
- Grid phù hợp layout hai chiều – hàng và cột.

Trong Login:

- `flex items-center justify-center` căn khối login giữa màn hình.
- `w-1/2` chia hai cột.
- `grid grid-cols-2` chia thống kê thành hai ô.

## 21.3. Responsive design

Thiết kế nên hoạt động từ màn hình nhỏ đến lớn. Khối `w-[900px]` và hai cột cố định hiện có thể tràn trên mobile. Có thể dùng:

```tsx
className="w-full max-w-[900px] flex flex-col md:flex-row"
```

## 21.4. Tailwind CSS

Tailwind cung cấp utility class. Ưu điểm:

- styling gần markup;
- constraint nhất quán;
- dễ responsive/state variants;
- giảm đặt tên CSS tùy ý.

Trade-off:

- JSX dài;
- cần quy ước cho class lặp;
- class động phải được tooling nhận diện đúng;
- không thay thế kiến thức CSS nền tảng.

## 21.5. SCSS

SCSS bổ sung nesting, variable, mixin và module trên CSS. Sau build nó trở thành CSS. Không nên nesting quá sâu vì selector khó kiểm soát và specificity tăng.

## 21.6. CSS variables

Dự án khai báo màu trong `:root`:

```css
:root {
  --color-primary: #2563eb;
}
```

CSS custom properties tồn tại runtime, tham gia cascade và có thể đổi theo theme. Đây là điểm khác với biến SCSS được xử lý ở build time.

## 21.7. Specificity

Khi nhiều rule cùng áp dụng, browser xét origin, importance, layer, specificity và thứ tự. Tránh giải quyết mọi xung đột bằng `!important`; hãy hiểu selector và cấu trúc stylesheet.

---

## 22. Kiến trúc thư mục và Clean Code

## 22.1. Cấu trúc gợi ý khi dự án lớn dần

```text
src/
├─ app/
│  ├─ router/
│  ├─ providers/
│  └─ store/
├─ features/
│  ├─ auth/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ schemas/
│  │  └─ types/
│  └─ chat/
├─ components/
│  └─ ui/
├─ layouts/
├─ lib/
├─ assets/
└─ styles/
```

Không cần đổi cấu trúc quá sớm. Khi code còn nhỏ, cấu trúc đơn giản dễ hiểu hơn. Khi feature tăng, co-locate code theo feature giúp giảm việc đi tìm file ở nhiều thư mục kỹ thuật.

## 22.2. Separation of concerns

Tách theo trách nhiệm:

- UI component không nên tự biết quá nhiều chi tiết backend.
- API function không nên hiển thị toast.
- Schema validation không nên nằm rải rác.
- Router không nên chứa business logic dài.

Separation không đồng nghĩa mỗi function phải ở một file riêng. Tách khi nó giúp hiểu, test hoặc tái sử dụng tốt hơn.

## 22.3. Naming

- Component/type/interface: PascalCase.
- Function/variable: camelCase.
- Boolean: `isLoading`, `hasPermission`, `canDelete`.
- Event handler nội bộ: `handleSubmit`; prop callback: `onSubmit`.

Trong code hiện tại có các typo như `LoginPgae`, `Approuters`, `lableRight`, `loadding`. Typo không làm code luôn hỏng nhưng giảm khả năng tìm kiếm, đọc hiểu và thể hiện độ chỉn chu khi phỏng vấn/code review.

## 22.4. Single Responsibility

Một module/component nên có một lý do chính để thay đổi. Nếu `LoginPage` vừa render hàng trăm dòng UI, định nghĩa validation, gọi API, xử lý token và analytics, hãy cân nhắc tách theo trách nhiệm.

## 22.5. Abstraction đúng lúc

Không trừu tượng hóa chỉ vì hai đoạn code “trông hơi giống”. Hãy xem chúng có cùng lý do thay đổi hay không. Abstraction sai tạo props phức tạp và nhiều điều kiện hơn duplication nhỏ.

---

## 23. Hiệu năng React

## 23.1. Đo trước khi tối ưu

Dùng React DevTools Profiler và browser Performance panel. Không kết luận “render lại là chậm” khi chưa đo; render là hoạt động bình thường của React.

## 23.2. `React.memo`

`memo` có thể bỏ qua render của component khi props không đổi theo so sánh nông. Nó hữu ích khi component render tốn kém và thường nhận cùng props.

`memo` ít tác dụng nếu props luôn tạo reference mới, component rất rẻ hoặc context/state nội bộ vẫn đổi.

## 23.3. Memoization có chi phí

`useMemo`, `useCallback`, `memo` làm tăng code và có chi phí so sánh/lưu cache. Chỉ dùng khi có lý do rõ ràng.

## 23.4. Code splitting

Lazy-load page/feature lớn để giảm bundle ban đầu:

```tsx
const HomePage = lazy(() => import("../page/HomePage"));
```

Component lazy cần Suspense fallback. Chia quá vụn có thể tạo nhiều request và UX loading phức tạp.

## 23.5. Virtualization

Danh sách hàng nghìn tin nhắn không nên render toàn bộ DOM cùng lúc. Virtualization chỉ render vùng đang nhìn thấy và một vùng đệm. Với chat còn phải xử lý scroll anchoring, tải lịch sử phía trên và chiều cao item động.

## 23.6. Debounce và Throttle

- Debounce: chỉ chạy sau khi dừng gọi một khoảng thời gian; hợp với search.
- Throttle: giới hạn tối đa số lần chạy trong khoảng thời gian; hợp với scroll/typing event.

Cần cleanup timer và tránh stale closure.

## 23.7. Network performance

Hiệu năng frontend không chỉ là React:

- pagination/infinite query;
- nén ảnh;
- cache HTTP;
- tránh request waterfall;
- preload/prefetch hợp lý;
- giảm payload;
- cancel request không cần.

---

## 24. Testing

## 24.1. Testing pyramid thực dụng

- Unit test: function thuần, reducer, formatter.
- Component/integration test: hành vi form, routing, query.
- End-to-end test: luồng login → chat → gửi tin.

Không cần tuyệt đối theo hình kim tự tháp; ưu tiên test đem lại độ tin cậy cao với chi phí hợp lý.

## 24.2. Test hành vi, không test implementation detail

Thay vì kiểm tra state nội bộ bằng bao nhiêu, hãy kiểm tra người dùng thấy gì và làm được gì:

```text
Given form chưa nhập email
When người dùng submit
Then thông báo lỗi email xuất hiện
And API không được gọi
```

## 24.3. Những test quan trọng cho Login

- render đủ field và nút;
- email sai định dạng hiển thị lỗi;
- password ngắn hiển thị lỗi;
- submit hợp lệ gọi API đúng payload;
- loading disable nút;
- API thành công điều hướng `/home`;
- `401` hiển thị lỗi credentials;
- lỗi mạng hiển thị thông báo khác;
- nút mắt thay đổi type password/text.

## 24.4. Mock

Mock ở boundary như network, thời gian hoặc browser API. Tránh mock quá nhiều module nội bộ vì test dễ bám implementation và vẫn pass dù feature thật bị hỏng.

---

## 25. Accessibility, UX và Security

## 25.1. Semantic HTML

Ưu tiên `button`, `a`, `label`, `nav`, `main`, `header` đúng ngữ nghĩa thay vì mọi thứ là `div` có click. Semantic giúp keyboard, screen reader và SEO.

## 25.2. Keyboard và focus

- Mọi thao tác chính phải dùng được bằng keyboard.
- Focus indicator không nên bị xóa nếu không có thay thế rõ.
- Modal cần focus trap và trả focus khi đóng.
- Sau navigation/error, cân nhắc quản lý focus cho UX.

## 25.3. XSS

React escape text expression theo mặc định, giúp giảm XSS khi render string. Nhưng vẫn có rủi ro khi:

- dùng `dangerouslySetInnerHTML`;
- đưa URL không tin cậy vào ngữ cảnh nhạy cảm;
- dùng thư viện DOM bên ngoài;
- lưu token có thể bị script độc hại đọc.

Nếu render HTML do user tạo, cần sanitize bằng giải pháp đáng tin cậy và policy phù hợp.

## 25.4. CSRF

CSRF lợi dụng việc browser tự gửi credential, thường liên quan cookie. Biện pháp gồm SameSite cookie, CSRF token, kiểm tra Origin/Referer và thiết kế API đúng. Cấu hình cụ thể phải đồng bộ với backend.

## 25.5. Không để secret ở frontend

API key bí mật, private key và database credential không được đặt trong source/env được bundle vào client. Người dùng có quyền xem JavaScript đã tải xuống.

## 25.6. UX trạng thái bất đồng bộ

Mỗi màn hình data nên nghĩ đến:

- initial loading;
- empty state;
- error state;
- retry;
- background refresh;
- partial data;
- offline/reconnect;
- success feedback.

---

## 26. Phân tích dự án hiện tại

## 26.1. `src/main.tsx`

Trách nhiệm:

- import global styles;
- tìm DOM root;
- tạo React root;
- bật Strict Mode;
- cung cấp BrowserRouter;
- render `App`.

Khi thêm React Query, thường `QueryClientProvider` sẽ nằm ở tầng provider gần đây để toàn app dùng cache chung.

## 26.2. `src/App.tsx`

Hiện chỉ render `AppRouters`. Đây là component root đơn giản. Sau này có thể giữ providers trong `main.tsx` hoặc gom vào `AppProviders` để dễ test.

## 26.3. `src/router/Approuters.tsx`

Hiện chỉ có route `/` trỏ tới Login. Sau login gọi `navigation("/home")`, nhưng chưa có route `/home`, nên luồng chưa hoàn chỉnh.

Cần bổ sung về sau:

- `/login` hoặc quy ước `/` rõ ràng;
- `/home`;
- route chat động;
- protected route;
- 404;
- layout route.

## 26.4. `src/page/Login.tsx`

Kiến thức đang được dùng:

- function component;
- `useState`;
- `useNavigate`;
- controlled form qua Formik;
- schema validation qua Yup;
- async/await và try/catch;
- composition với `Input`, `Button`, `KTIcon`;
- import SVG như module;
- conditional rendering cho errors;
- Tailwind utility classes.

Điểm cần cải thiện theo thứ tự:

1. Bổ sung route `/home` để điều hướng có đích.
2. Sửa typo tên component/prop/file khi có thể refactor an toàn.
3. Tách schema và API login khỏi page khi code phát triển.
4. Type response và xử lý các loại lỗi Axios.
5. Xử lý/lưu trạng thái authentication theo thiết kế backend.
6. Đổi link nội bộ sang `Link`.
7. Liên kết label/input và bổ sung accessibility.
8. Làm responsive cho mobile.
9. Đưa các chuỗi/text về encoding UTF-8 thống nhất nếu ký tự thực tế đang lỗi.
10. Tách các section giao diện lớn nếu Login tiếp tục dài.

## 26.5. `src/component/UI/Input/Input.tsx`

Điểm tốt:

- có TypeScript props;
- hỗ trợ icon và right content;
- tái sử dụng cho nhiều field.

Điểm cần hiểu sâu:

- Nhánh checkbox chưa truyền `name`, `checked`, `onChange`, nên chưa tích hợp đầy đủ với Formik.
- Label chưa có `htmlFor` và input chưa có `id`.
- Native input props còn bị giới hạn; có thể kế thừa `ComponentPropsWithoutRef<"input">`.
- `lableRight` nên là `labelRight`.
- Component có thể nhận `error` và mô tả ARIA thay vì page tự lặp markup error.

## 26.6. `src/component/UI/Button/Button.tsx`

Điểm tốt:

- type `children`;
- giới hạn native button type;
- disable khi loading.

Điểm có thể cải thiện:

- `loadding` → `loading`;
- có `aria-busy`;
- kế thừa native button props;
- hiển thị spinner/text Việt hóa;
- merge class mặc định nhất quán.

## 26.7. `src/api/axios.ts`

Hiện là API client tối thiểu. Có thể phát triển thêm:

- timeout;
- request/response type;
- chuẩn hóa error;
- credential/token theo chiến lược auth;
- interceptor có kiểm soát;
- tách function theo feature, ví dụ `features/auth/api/login.ts`.

## 26.8. Những package chưa được dùng

- React Query: phù hợp cho data fetching/cache.
- Zustand: chỉ dùng khi có global client state thật sự.
- Socket.IO Client: dùng khi backend realtime đã có protocol/event contract.
- `cors`: nhiều khả năng không cần ở frontend bundle; CORS phải được cấu hình ở server/proxy.

Đừng cố dùng mọi package chỉ vì đã cài. Mỗi dependency tăng bundle, bề mặt lỗi, công sức update và rủi ro bảo mật.

---

## 27. Câu hỏi phỏng vấn và câu trả lời mẫu

## 27.1. React là gì?

> React là thư viện JavaScript để xây dựng UI theo hướng khai báo và component. UI được mô tả từ props/state; khi state thay đổi, React render lại mô tả UI và commit những thay đổi cần thiết vào DOM. React tập trung vào view layer, nên routing, fetching hoặc form thường dùng thêm thư viện khác.

## 27.2. Virtual DOM là gì?

> “Virtual DOM” thường chỉ cấu trúc JavaScript mô tả UI. Khi có update, React tạo mô tả mới, reconcile với cây trước và commit thay đổi cần thiết vào DOM thật. Điểm chính không phải cứ “virtual DOM là nhanh hơn DOM”, mà là React cung cấp mô hình khai báo và chiến lược cập nhật nhất quán; hiệu năng thực tế vẫn phụ thuộc cấu trúc component và workload.

## 27.3. Props và state khác nhau thế nào?

> Props do component cha truyền xuống và component con không nên sửa. State do component sở hữu và thay đổi thông qua setter/reducer. Cả props lẫn state đều có thể làm component render lại. Em đặt state ở owner gần nhất cần quản lý nó và chỉ nâng lên/global hóa khi có nhu cầu chia sẻ thật sự.

## 27.4. Tại sao không mutate state?

> React và các cơ chế memoization thường dựa vào identity/reference để phát hiện thay đổi. Mutation giữ nguyên reference, dễ gây UI không cập nhật như mong đợi và tạo side effect lên dữ liệu cũ. Tạo object/array mới giúp state transition dễ dự đoán, debug và tối ưu hơn.

## 27.5. `useEffect` dùng để làm gì?

> `useEffect` dùng để đồng bộ React component với hệ thống bên ngoài sau commit, như subscription, timer, socket hoặc DOM API. Cleanup gỡ bỏ kết nối/listener trước lần effect tiếp theo và khi unmount. Em tránh dùng effect cho derived state hoặc event cụ thể vì các trường hợp đó thường xử lý trực tiếp trong render/handler rõ hơn.

## 27.6. Dependency array hoạt động thế nào?

> Effect dùng mọi reactive value từ component thì các value đó phải nằm trong dependency. React so sánh dependency giữa các render bằng `Object.is`. Array rỗng nghĩa effect không phụ thuộc reactive value thay đổi, chứ không phải cách để cố ép effect chỉ chạy một lần bất chấp code bên trong.

## 27.7. `useMemo` và `useCallback` khác gì?

> `useMemo` cache kết quả tính toán, còn `useCallback` cache reference của function. Cả hai là tối ưu hiệu năng dựa trên dependency, không phải công cụ sửa logic. Em chỉ dùng khi có phép tính đáng kể, component memo cần reference ổn định hoặc dependency ổn định thực sự có ích, và ưu tiên đo bằng profiler.

## 27.8. `useRef` và `useState` khác gì?

> Cả hai giữ dữ liệu qua render, nhưng đổi `state` sẽ lên lịch render còn đổi `ref.current` thì không. State dành cho dữ liệu ảnh hưởng UI; ref dành cho DOM node hoặc giá trị mutable không cần render như timer ID.

## 27.9. Tại sao cần `key`?

> Key giúp React xác định identity của item giữa các render để giữ đúng DOM và component state. Em dùng ID ổn định từ dữ liệu. Index chỉ an toàn khi list tĩnh, không chèn/xóa/sắp xếp; random key làm item remount mỗi render.

## 27.10. Controlled component là gì?

> Với controlled input, value được điều khiển bởi React state và thay đổi thông qua event handler. Nó thuận tiện cho validation và conditional UI. Uncontrolled input để DOM giữ giá trị và thường đọc bằng ref hoặc form API; có thể đơn giản hơn trong một số form lớn hoặc tích hợp thư viện.

## 27.11. Context có thay Redux/Zustand không?

> Context là cơ chế truyền value qua cây component. Nó không tự cung cấp mô hình action, selector hay tối ưu update như một số state library. Với theme/auth đơn giản Context có thể đủ; với global state thay đổi phức tạp và cần selector/devtools, Zustand hoặc giải pháp khác có thể phù hợp. Em chọn theo nhu cầu chứ không coi chúng thay thế tuyệt đối.

## 27.12. React Query khác Zustand thế nào?

> React Query tập trung server state: fetch, cache, stale, retry, refetch và mutation. Zustand tập trung client/global state do ứng dụng sở hữu. Em không sao chép server state sang Zustand nếu React Query đã là source of truth, vì sẽ phát sinh hai nguồn dữ liệu cần đồng bộ.

## 27.13. `async/await` có chặn thread không?

> `await` tạm dừng phần tiếp theo của function async cho đến khi Promise settled, nhưng không block toàn bộ JavaScript thread như vòng lặp đồng bộ nặng. Trong lúc chờ I/O, event loop vẫn có thể xử lý công việc khác.

## 27.14. TypeScript có đảm bảo response API đúng type không?

> Không. TypeScript kiểm tra ở compile time và type bị xóa khi runtime. Generic hoặc type assertion chỉ mô tả điều mình kỳ vọng. Với dữ liệu không tin cậy, cần runtime validation bằng schema hoặc kiểm tra cụ thể.

## 27.15. `401` và `403` khác nhau thế nào?

> `401` thường nghĩa là request chưa được xác thực hợp lệ, ví dụ thiếu hoặc hết hạn token. `403` nghĩa server hiểu danh tính nhưng từ chối vì không đủ quyền. Cách backend cụ thể dùng status cần nhất quán với API contract.

## 27.16. Authentication và Authorization khác gì?

> Authentication xác định người dùng là ai; authorization xác định người dùng được phép làm gì. Frontend có thể ẩn UI theo quyền nhưng backend phải là nơi kiểm tra quyền cuối cùng.

## 27.17. Debounce và throttle khác gì?

> Debounce chờ đến khi chuỗi gọi dừng một khoảng mới chạy, phù hợp ô tìm kiếm. Throttle giới hạn tần suất chạy trong một khoảng, phù hợp scroll hoặc typing indicator. Cả hai cần cleanup và chú ý closure trong React.

## 27.18. CSR và SSR khác nhau thế nào?

> CSR render phần chính ở browser sau khi tải JavaScript; SSR tạo HTML trên server cho request rồi hydrate ở client. SSR có thể cải thiện nội dung ban đầu và SEO nhưng tăng độ phức tạp server, hydration và data fetching. Dự án Vite React hiện tại là CSR.

## 27.19. Vì sao component render lại?

> Thường do state của nó đổi, parent render lại, context nó đọc đổi hoặc external store subscription phát update. Render lại không chắc DOM đổi; React còn reconcile trước khi commit. Em chỉ tối ưu khi profiler cho thấy render gây chi phí đáng kể.

## 27.20. Làm sao tránh gọi API hai lần?

> Đầu tiên em xác định nguyên nhân: double submit, effect dependency, Strict Mode dev hay retry của query library. Với submit em disable khi pending; với effect em bảo đảm dependency và cleanup đúng; với fetch em dùng cache/dedup của React Query khi phù hợp. Em không chỉ tắt Strict Mode để che side effect không an toàn.

## 27.21. Xử lý chat realtime thế nào?

> Em fetch lịch sử bằng HTTP/query cache, dùng socket cho event mới, deduplicate theo message ID và cập nhật cache. Khi reconnect em đồng bộ lại phần có thể bị bỏ lỡ. Listener phải được cleanup, typing event được throttle và server luôn xác thực quyền room. Tin gửi có thể dùng client ID và trạng thái sending/failed để optimistic UI.

## 27.22. Hãy giới thiệu dự án này trong phỏng vấn

> Em đang xây một frontend mạng xã hội/chat bằng React 19, TypeScript và Vite. Hiện em đã xây luồng đăng nhập với component Input/Button tái sử dụng, Formik và Yup để quản lý/validate form, Axios để gọi API và React Router để điều hướng. Giao diện dùng Tailwind kết hợp SCSS. Bước tiếp theo của em là hoàn thiện auth/protected route, dùng React Query cho server state, Zustand cho client state cần chia sẻ và Socket.IO cho tin nhắn realtime. Trong quá trình làm em tập trung phân tách UI, API và state theo đúng trách nhiệm.

## 27.23. Câu hỏi ngược nên hỏi nhà tuyển dụng

- Team đang dùng chiến lược state management nào và vì sao?
- Quy trình code review, testing và deploy hiện tại như thế nào?
- Frontend và backend thống nhất API contract bằng cách nào?
- Team đo hiệu năng và theo dõi lỗi production ra sao?
- Kỳ vọng cho vị trí này trong 3 tháng đầu là gì?

---

## 28. Bài tập thực hành theo dự án

## Cấp 1 – React và TypeScript cơ bản

1. Sửa typo `LoginPgae`, `Approuters`, `lableRight`, `loadding` một cách đồng bộ.
2. Tạo `HomePage` và route `/home`.
3. Tạo `NotFoundPage` cho `*`.
4. Đổi link nội bộ từ `<a>` sang `<Link>`.
5. Viết `UserAvatar` nhận typed props và fallback tên viết tắt.
6. Render danh sách conversation với key đúng.

Điều phải giải thích được sau bài:

- Props được type như thế nào?
- Khi nào component render lại?
- Vì sao key không nên là index?

## Cấp 2 – Form và Accessibility

1. Tách login schema ra file riêng.
2. Tạo type `LoginValues` và `LoginResponse`.
3. Hoàn thiện checkbox đồng ý chính sách thành controlled field.
4. Chỉ cho phép submit khi chấp nhận chính sách.
5. Thêm `id`, `htmlFor`, `aria-invalid`, `aria-describedby`.
6. Phân biệt lỗi credentials, network và server.

## Cấp 3 – API và Authentication

1. Tách `login()` thành API function riêng.
2. Thêm timeout và chuẩn hóa error.
3. Xây auth store/context tối thiểu.
4. Tạo protected route.
5. Khôi phục phiên đăng nhập khi reload theo contract backend.
6. Xử lý logout và token/session hết hạn.

Trước khi làm, quyết định rõ backend dùng cookie HttpOnly hay token do client quản lý.

## Cấp 4 – React Query

1. Thêm `QueryClientProvider`.
2. Fetch danh sách conversation.
3. Làm loading, error, empty state.
4. Fetch message theo `conversationId` trong query key.
5. Dùng mutation gửi tin nhắn.
6. Invalidate hoặc cập nhật cache đúng scope.
7. Làm pagination/infinite query cho lịch sử.

## Cấp 5 – Socket.IO

1. Tạo socket service có typing cho event.
2. Kết nối sau authentication.
3. Join/leave room theo conversation.
4. Cleanup listener.
5. Nhận message mới và update React Query cache.
6. Deduplicate message.
7. Làm typing indicator có throttle/timeout.
8. Xử lý reconnect và fetch missed data.

## Cấp 6 – Chất lượng production

1. Responsive trang Login.
2. Lazy-load page.
3. Viết test cho Login.
4. Test protected route.
5. Test optimistic message.
6. Đo render bằng Profiler.
7. Kiểm tra keyboard/accessibility.
8. Thêm error boundary/route error strategy phù hợp.

### Cách tự review mỗi bài

- Code có chạy đúng happy path không?
- Loading/error/empty/offline ra sao?
- Type có dùng `any` không cần thiết không?
- State có đặt đúng nơi không?
- Effect có cleanup không?
- Component có accessible không?
- Có test hành vi quan trọng không?
- Có thể giải thích trade-off trong 60 giây không?

---

## 29. Lộ trình học 8 tuần

## Tuần 1 – JavaScript sâu

- Scope, closure, this.
- Array/object và immutability.
- Promise, async/await, event loop.
- ES Module.

Đầu ra: tự giải thích event loop và viết API function có xử lý lỗi.

## Tuần 2 – TypeScript

- Type inference, union, narrowing.
- Interface/type, generic, utility type.
- Typing function, event và API.
- `unknown` thay cho `any`.

Đầu ra: type toàn bộ model auth/chat cơ bản.

## Tuần 3 – React core

- JSX, component, props, children.
- State snapshot, batching, immutable update.
- List/key, controlled input.
- Render/commit/reconciliation.

Đầu ra: tự viết component mà không nhìn mẫu và trả lời 10 câu React core.

## Tuần 4 – Hooks và Form

- `useState`, `useEffect`, `useRef`.
- Custom Hook.
- Formik/Yup.
- Accessibility form.

Đầu ra: hoàn thiện Login có test case và giải thích khi nào không cần effect.

## Tuần 5 – Router, API và Auth

- Route, nested route, params.
- Axios instance/interceptor.
- Status code.
- Authentication/authorization/protected route.

Đầu ra: luồng login/logout/restore session hoạt động.

## Tuần 6 – React Query và Zustand

- Query key, stale, cache.
- Mutation/invalidation/optimistic update.
- Server state vs client state.
- Selector trong Zustand.

Đầu ra: danh sách conversation/message có cache đúng.

## Tuần 7 – Realtime và hiệu năng

- Socket lifecycle, room, reconnect.
- Deduplication.
- Profiler, memoization, code splitting.
- Virtualized list.

Đầu ra: chat realtime tối thiểu và giải thích failure cases.

## Tuần 8 – Testing và luyện phỏng vấn

- Unit/component/E2E.
- Accessibility/security review.
- Viết README kiến trúc.
- Mock interview mỗi ngày.

Đầu ra: demo 10 phút, giới thiệu dự án 90 giây, trả lời mỗi câu theo định nghĩa → cơ chế → ví dụ → trade-off.

### Nhịp học mỗi ngày

- 30 phút đọc lý thuyết.
- 60–90 phút code.
- 15 phút tự nói lại không nhìn tài liệu.
- 15 phút viết flashcard và ghi lỗi đã gặp.

---

## 30. Glossary và Flashcard

## 30.1. Glossary ngắn

| Thuật ngữ | Định nghĩa nhớ nhanh |
|---|---|
| Component | Khối UI có logic và giao diện riêng |
| Props | Dữ liệu read-only từ cha xuống con |
| State | Dữ liệu thay đổi theo thời gian do component/store quản lý |
| Hook | API để function component dùng khả năng React |
| Render | React gọi component để tính mô tả UI |
| Commit | React áp dụng thay đổi cần thiết vào DOM |
| Reconciliation | So sánh cây element để quyết định cập nhật |
| Effect | Đồng bộ component với hệ thống bên ngoài |
| Closure | Function ghi nhớ lexical scope nơi nó được tạo |
| Mutation | Thay đổi trực tiếp dữ liệu/reference hiện có |
| Immutability | Tạo giá trị mới thay vì sửa giá trị cũ |
| Controlled input | Input có value do React state điều khiển |
| Server state | Dữ liệu nguồn sự thật nằm ở server |
| Client state | Dữ liệu giao diện/ứng dụng sở hữu ở client |
| Cache | Bản dữ liệu lưu để tái sử dụng và giảm fetch |
| Stale | Dữ liệu được coi là có thể cần làm mới |
| Invalidation | Đánh dấu cache cần được xem là cũ/refetch |
| Optimistic update | Cập nhật UI trước khi server xác nhận |
| Hydration | Gắn React behavior lên HTML do server render |
| HMR | Cập nhật module khi dev mà không reload hoàn toàn |
| Tree shaking | Loại code export không dùng khi build nếu điều kiện cho phép |
| Code splitting | Chia bundle và tải phần code khi cần |
| XSS | Chèn/thực thi script độc hại trong ngữ cảnh trang |
| CSRF | Lợi dụng credential tự gửi để thực hiện request ngoài ý muốn |
| Idempotent | Gọi lặp cho hiệu ứng cuối tương đương gọi một lần |
| Debounce | Chờ ngừng gọi rồi mới chạy |
| Throttle | Giới hạn tần suất chạy |

## 30.2. Flashcard tự kiểm tra

Hãy che phần trả lời và nói thành tiếng:

1. **Q:** React state có thay đổi ngay sau setter không?  
   **A:** Setter lên lịch update; biến state trong render hiện tại vẫn là snapshot cũ.

2. **Q:** Khi nào dùng functional update?  
   **A:** Khi state mới phụ thuộc state trước.

3. **Q:** Effect dùng cho mục đích cốt lõi nào?  
   **A:** Đồng bộ với external system sau commit.

4. **Q:** Ref đổi có render lại không?  
   **A:** Không.

5. **Q:** Key tốt cần gì?  
   **A:** Ổn định và unique trong sibling list.

6. **Q:** TypeScript có tồn tại ở runtime không?  
   **A:** Phần lớn type bị xóa; không tự validate API.

7. **Q:** React Query quản lý gì?  
   **A:** Server state và vòng đời fetch/cache của nó.

8. **Q:** Zustand nên quản lý mọi dữ liệu không?  
   **A:** Không; ưu tiên đúng loại state và owner gần nhất.

9. **Q:** `401` khác `403`?  
   **A:** 401 là chưa xác thực hợp lệ; 403 là không đủ quyền.

10. **Q:** Vì sao frontend protected route chưa đủ bảo mật?  
    **A:** Client có thể bị bypass; backend phải kiểm tra quyền.

11. **Q:** `useMemo` có phải semantic guarantee không?  
    **A:** Không; chủ yếu là tối ưu hiệu năng.

12. **Q:** Cleanup socket listener để làm gì?  
    **A:** Tránh handler trùng, memory leak và xử lý event nhiều lần.

13. **Q:** Proxy Vite có dùng ở production tự động không?  
    **A:** Không; production hosting/reverse proxy cần cấu hình riêng.

14. **Q:** CORS được sửa ở frontend bằng package `cors` không?  
    **A:** Không; server/proxy phải trả CORS header phù hợp.

15. **Q:** Tại sao không dùng index làm key cho list động?  
    **A:** Identity thay đổi khi chèn/xóa/sort, có thể ghép sai state/DOM.

## 30.3. Checklist trước phỏng vấn

- [ ] Giới thiệu bản thân trong 60 giây.
- [ ] Giới thiệu dự án trong 90 giây.
- [ ] Vẽ được luồng render React.
- [ ] Giải thích state snapshot và batching.
- [ ] Giải thích effect + cleanup + dependency.
- [ ] Phân biệt props/state/context/store/server state.
- [ ] Giải thích closure và event loop.
- [ ] Type được component props và API response.
- [ ] Phân biệt `any`, `unknown`, `never`.
- [ ] Giải thích Router và protected route.
- [ ] Giải thích HTTP status/auth.
- [ ] Giải thích React Query cache.
- [ ] Giải thích Socket reconnect/dedup.
- [ ] Nêu được một lỗi khó đã gặp, cách tìm nguyên nhân và bài học.
- [ ] Nêu được trade-off, không chỉ kể tên công nghệ.

---

## Phụ lục A – Mẫu tự ghi chú một lỗi

```md
### Tên lỗi

- Hiện tượng:
- Cách tái hiện:
- Giả thuyết ban đầu:
- Bằng chứng kiểm tra:
- Nguyên nhân gốc:
- Cách sửa:
- Vì sao cách sửa đúng:
- Test chống tái diễn:
- Bài học có thể áp dụng nơi khác:
```

Nhà tuyển dụng thường đánh giá cao cách bạn điều tra lỗi hơn việc bạn chưa từng gặp lỗi.

## Phụ lục B – Mẫu trình bày một feature

```text
1. Bài toán người dùng là gì?
2. Yêu cầu và edge case nào quan trọng?
3. Dữ liệu thuộc local, URL, server hay global state?
4. Component/API được chia như thế nào?
5. Loading/error/empty/offline xử lý ra sao?
6. Bảo mật và accessibility thế nào?
7. Test gì?
8. Trade-off và hướng cải thiện?
```

## Phụ lục C – Nguyên tắc ghi nhớ cuối cùng

Không học React như một danh sách API. Hãy luôn nối các khái niệm thành chuỗi:

```text
Người dùng tạo event
   ↓
Event handler cập nhật state hoặc gọi mutation
   ↓
React lên lịch render
   ↓
Component đọc snapshot props/state mới
   ↓
React reconcile
   ↓
React commit DOM cần đổi
   ↓
Effect cần thiết đồng bộ external system
```

Khi hiểu chuỗi này, phần lớn câu hỏi React cơ bản và trung cấp sẽ không còn là những mẩu kiến thức rời rạc.

---

## Phụ lục D – JavaScript nâng cao thường gặp khi phỏng vấn

### D.1. Hoisting và Temporal Dead Zone

Hoisting là cách thường dùng để mô tả việc declaration được môi trường thực thi xử lý trước khi chạy từng dòng code. Tuy nhiên từng loại declaration có hành vi khác nhau:

- Function declaration có thể được gọi trước dòng khai báo.
- `var` tồn tại từ đầu scope và có giá trị ban đầu `undefined`.
- `let`, `const`, `class` cũng được scope biết đến nhưng không thể truy cập trước declaration; khoảng này gọi là Temporal Dead Zone.

```ts
sayHello(); // hoạt động

function sayHello() {
  console.log("Hello");
}

console.log(value); // ReferenceError
const value = 10;
```

Câu trả lời nên tránh nói đơn giản rằng JavaScript “di chuyển code lên trên”. Engine không nhất thiết sửa lại source code; đó là mô hình giải thích quá trình tạo binding trước execution.

### D.2. `this`

Giá trị `this` của function thông thường phụ thuộc vào cách function được gọi, không chỉ nơi nó được viết:

```ts
const user = {
  name: "An",
  introduce() {
    return this.name;
  },
};

user.introduce(); // this là user
```

Arrow function không có `this` riêng; nó lấy `this` theo lexical scope. Vì vậy arrow function hữu ích cho callback, nhưng không mặc định phù hợp làm method cần dynamic `this`.

Các cách thiết lập `this` thường gặp:

- method call: `object.method()`;
- explicit binding: `call`, `apply`, `bind`;
- constructor call với `new`;
- lexical `this` của arrow function.

Trong React function component hiện đại, ta ít dựa vào `this`. Nhưng đây vẫn là kiến thức JavaScript phỏng vấn phổ biến và cần thiết khi đọc class component cũ.

### D.3. Prototype và kế thừa

JavaScript dùng prototype chain để tra cứu property. Khi property không có trên object, engine tìm trên prototype của nó và tiếp tục lên chuỗi.

`class` trong JavaScript cung cấp cú pháp rõ hơn trên cơ chế prototype; nó không biến JavaScript thành ngôn ngữ kế thừa class giống hoàn toàn Java/C#.

```ts
class Person {
  constructor(public name: string) {}

  introduce() {
    return this.name;
  }
}
```

Method `introduce` nằm trên prototype và được chia sẻ giữa các instance, thay vì tạo một function mới cho mỗi instance theo cách thông thường.

### D.4. Shallow copy và deep copy

Spread chỉ copy lớp ngoài cùng:

```ts
const original = {
  profile: { name: "An" },
};

const copied = { ...original };
copied.profile.name = "Bình";
// original.profile.name cũng bị đổi vì profile vẫn cùng reference
```

Khi update nested React state, phải copy từng tầng thay đổi:

```tsx
setUser(prev => ({
  ...prev,
  profile: {
    ...prev.profile,
    name: "Bình",
  },
}));
```

`structuredClone` hỗ trợ deep clone nhiều kiểu dữ liệu cloneable, nhưng deep clone toàn bộ state cho mỗi update thường không phải thiết kế tối ưu. Hãy cập nhật đúng nhánh hoặc chuẩn hóa dữ liệu.

### D.5. `null` và `undefined`

- `undefined` thường biểu thị chưa được gán/không có giá trị trả về/property không tồn tại.
- `null` thường được lập trình viên dùng có chủ đích để biểu thị “không có giá trị”.
- `typeof null` trả về `"object"` do đặc điểm lịch sử của JavaScript.

Trong API contract, cần thống nhất field optional, `null` và missing field có ý nghĩa gì.

### D.6. Falsy values

Các falsy value phổ biến:

```text
false, 0, -0, 0n, "", null, undefined, NaN
```

Array rỗng `[]` và object rỗng `{}` là truthy. Đây là nguồn nhiều câu hỏi đánh lừa nhưng nên hiểu quy tắc thay vì học mẹo.

### D.7. `map`, `forEach` và `reduce`

- `map` trả array mới cùng số phần tử sau biến đổi.
- `forEach` dùng để lặp tạo side effect và trả `undefined`.
- `reduce` tích lũy thành một giá trị; mạnh nhưng không nên dùng nếu làm code khó đọc hơn cách trực tiếp.

Trong JSX, `map` phù hợp vì cần trả danh sách element.

### D.8. Promise combinators

- `Promise.all`: fulfilled khi tất cả fulfilled; reject sớm khi một promise reject.
- `Promise.allSettled`: đợi tất cả và trả trạng thái từng promise.
- `Promise.race`: settled theo promise settled đầu tiên.
- `Promise.any`: fulfilled theo promise fulfilled đầu tiên; reject nếu tất cả reject.

Ví dụ tải dữ liệu độc lập song song:

```ts
const [profile, conversations] = await Promise.all([
  fetchProfile(),
  fetchConversations(),
]);
```

Đừng viết hai `await` tuần tự nếu hai request độc lập và latency quan trọng.

### D.9. Function declaration và function expression

```ts
function declaration() {}

const expression = function () {};
const arrow = () => {};
```

Khác biệt đáng chú ý gồm hoisting, `this`, `arguments`, khả năng dùng làm constructor và phong cách code. Arrow function không có `arguments` riêng và không dùng với `new`.

### D.10. Pure function

Pure function:

- cùng input cho cùng output;
- không tạo observable side effect lên bên ngoài.

React component và reducer nên thuần trong render/reduction. Gọi API, sửa DOM hoặc mutation biến global trong render làm kết quả khó dự đoán và có thể bị lộ rõ dưới Strict Mode/concurrent rendering.

### D.11. Memory leak phía frontend

Nguồn phổ biến:

- event listener không gỡ;
- interval/timeout không clear;
- socket/subscription không unsubscribe;
- giữ reference lớn không cần thiết;
- cache không giới hạn;
- closure giữ dữ liệu lâu hơn dự kiến.

Không phải mọi state update sau unmount đều tự động chứng minh memory leak; cần xem resource có còn bị giữ hoặc công việc có tiếp tục vô ích không.

### D.12. Debounce mẫu có cleanup

```tsx
useEffect(() => {
  const timerId = window.setTimeout(() => {
    setDebouncedValue(value);
  }, 300);

  return () => window.clearTimeout(timerId);
}, [value]);
```

Mỗi khi `value` đổi trước 300ms, cleanup hủy timer cũ và tạo timer mới.

---

## Phụ lục E – React chuyên sâu và React hiện đại

### E.1. Class component lifecycle

Dù dự án dùng function component, phỏng vấn có thể hỏi code legacy:

- `componentDidMount`: sau mount.
- `componentDidUpdate`: sau update.
- `componentWillUnmount`: trước unmount.
- `shouldComponentUpdate`: kiểm soát update.
- `componentDidCatch`/`getDerivedStateFromError`: Error Boundary.

Không nên ánh xạ máy móc `useEffect(..., [])` thành `componentDidMount`. Effect có mô hình setup/cleanup đồng bộ external system và chịu semantics của dependency/Strict Mode.

### E.2. Error Boundary

Error Boundary bắt lỗi render/lifecycle trong cây con và hiển thị fallback thay vì làm hỏng toàn bộ UI.

Nó không tự bắt mọi lỗi:

- lỗi event handler;
- lỗi async callback thông thường;
- lỗi phía chính Error Boundary;
- lỗi server/network nếu code đã xử lý ngoài render.

Có thể đặt boundary theo route hoặc feature quan trọng để lỗi một khu vực không làm mất toàn ứng dụng. Function component thông thường chưa tự định nghĩa đầy đủ Error Boundary lifecycle giống class nếu không dùng framework/library hỗ trợ.

### E.3. Portal

Portal render children vào DOM node khác ngoài DOM hierarchy thông thường, thường dùng cho modal, tooltip hoặc toast:

```tsx
createPortal(<Modal />, document.getElementById("modal-root")!);
```

Dù DOM đặt nơi khác, portal vẫn thuộc React tree ban đầu: Context tiếp tục hoạt động và event propagation tuân theo React tree.

### E.4. Suspense

Suspense hiển thị fallback khi cây con “suspend” trong một integration được React hỗ trợ:

```tsx
<Suspense fallback={<PageSkeleton />}>
  <LazyPage />
</Suspense>
```

Use case quen thuộc là code splitting với `lazy`. Suspense không tự khiến mọi `fetch` tùy ý trong effect có loading fallback; data framework/integration phải hỗ trợ cơ chế tương ứng.

### E.5. `lazy`

```tsx
const ChatPage = lazy(() => import("./ChatPage"));
```

Dynamic import tạo ranh giới code splitting. Module lazy thường cần default export theo contract của `lazy`, hoặc chuyển đổi Promise module phù hợp.

### E.6. Ref forwarding và React hiện đại

Ở nhiều codebase cũ, `forwardRef` được dùng để component cha truyền ref đến DOM node bên trong. Trong React hiện đại, cách xử lý `ref` đang được đơn giản hóa theo phiên bản và toolchain, nhưng khi đi phỏng vấn vẫn phải đọc được pattern `forwardRef` vì nó rất phổ biến trong component library.

Use case:

- focus input từ cha;
- tích hợp form library;
- đo DOM;
- imperative API có kiểm soát.

Đừng expose DOM nội bộ nếu component không thực sự cần imperative access.

### E.7. `useImperativeHandle`

Hook này tùy biến giá trị mà component expose qua ref, ví dụ chỉ expose `focus()` thay vì toàn bộ DOM node. Đây là escape hatch; data flow khai báo qua props vẫn nên là mặc định.

### E.8. `useId`

`useId` tạo ID ổn định phù hợp liên kết accessibility giữa label, input và description, đặc biệt hữu ích khi có server rendering/hydration.

Không dùng `useId` làm key cho item trong list. Key phải đến từ identity của dữ liệu.

### E.9. `useActionState`

`useActionState` giúp quản lý state phát sinh từ một action, đặc biệt trong flow form/action hiện đại. Nó có thể kết hợp pending/error/result quanh action thay vì tự nối nhiều state rời.

Khi trả lời phỏng vấn, không nên nói mọi form phải chuyển sang API này. Formik vẫn đang được dự án dùng; lựa chọn phụ thuộc kiến trúc, validation, framework và độ phức tạp form.

### E.10. `useOptimistic`

`useOptimistic` hỗ trợ hiển thị state dự đoán trong lúc action đang hoàn thành. Với chat, tin nhắn có thể xuất hiện ngay trạng thái `sending`; khi server thất bại, UI cần rollback hoặc chuyển sang `failed` và cho retry.

Optimistic UI chỉ tốt khi:

- xác suất thành công cao;
- rollback rõ ràng;
- identity tạm/thật được đối chiếu;
- không che giấu thao tác nhạy cảm thất bại.

### E.11. `use` và dữ liệu bất đồng bộ

API `use` có thể đọc resource như Promise hoặc Context trong những môi trường/pattern được hỗ trợ và kết hợp với Suspense/Error Boundary. Nó có quy tắc khác Hook truyền thống ở một số điểm, nhưng không có nghĩa có thể tùy tiện tạo Promise mới mỗi render hoặc thay toàn bộ data layer mà không hiểu caching/framework integration.

Đối với dự án này, React Query vẫn là lộ trình thực dụng để học server-state lifecycle rõ ràng.

### E.12. Concurrent rendering – mô hình cần nhớ

React hiện đại có thể chuẩn bị, tạm dừng, bỏ hoặc tiếp tục render trước commit trong các update phù hợp. Vì vậy render phải thuần khiết: không gọi API, không mutation global và không dựa vào “component được gọi đúng một lần”.

Concurrent rendering không có nghĩa JavaScript tự động chạy component song song trên nhiều CPU thread. Nó là khả năng React điều phối và ưu tiên công việc render.

### E.13. State được giữ theo vị trí trong cây

React liên kết state với vị trí component trong rendered tree. Nếu type/key ở vị trí đó giữ nguyên, state thường được giữ. Nếu type hoặc key đổi, state có thể reset.

```tsx
{isAdmin ? <Form mode="admin" /> : <Form mode="user" />}
```

Hai nhánh cùng component type ở cùng vị trí có thể giữ state. Nếu muốn reset theo mode, dùng key có chủ đích hoặc thiết kế state rõ ràng.

### E.14. Stale closure trong React

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

Callback trên giữ `count` của render đầu vì effect không khai báo dependency. Cách sửa phụ thuộc mục tiêu:

- thêm dependency và setup lại;
- dùng functional update nếu đang cập nhật state;
- dùng ref cho latest value nếu thật sự cần đọc mà không resubscribe;
- tái cấu trúc logic.

Không nên tắt lint dependency một cách máy móc.

### E.15. Synthetic Event

React cung cấp event object với interface nhất quán trên các browser và tích hợp event system của React. Khi phỏng vấn, điều quan trọng hơn tên gọi là hiểu bubbling, capturing, `preventDefault`, `stopPropagation` và việc handler là nơi phù hợp cho side effect do người dùng kích hoạt.

### E.16. Source of truth

Một dữ liệu nên có nguồn sự thật rõ ràng:

- input value → Formik;
- conversation ID → URL;
- message cache → React Query;
- sidebar state → local state/Zustand tùy phạm vi;
- auth/session → thiết kế auth store kết hợp server session.

Nếu cùng danh sách messages được giữ độc lập trong local state, Zustand và React Query, bug đồng bộ gần như chắc chắn sẽ xuất hiện.

### E.17. Composition thay cho boolean props bùng nổ

Một component có quá nhiều prop kiểu `isCompact`, `hasHeader`, `showFooter`, `isAdmin`, `isEditable` thường chứa nhiều mode khó hiểu. Có thể dùng component chuyên biệt, slot hoặc compound component để API biểu đạt hơn.

### E.18. Trade-off – từ khóa giúp trả lời cấp độ cao hơn

Trong phỏng vấn, sau khi nêu giải pháp, hãy chủ động nói trade-off:

- Context đơn giản nhưng update rộng có thể làm nhiều consumer render.
- Zustand tiện cho global state nhưng thêm dependency và source of truth mới.
- Optimistic UI nhanh nhưng rollback/dedup phức tạp.
- Memoization có thể giảm render nhưng tăng độ phức tạp và chi phí cache.
- SSR cải thiện HTML ban đầu/SEO nhưng tăng độ phức tạp hydration và server.
- Component dùng chung giảm lặp nhưng abstraction quá sớm làm props khó dùng.

Người hiểu sâu không chỉ biết “dùng gì”, mà còn biết **vì sao chọn**, **mất gì khi chọn**, và **dấu hiệu nào khiến mình đổi lựa chọn**.

