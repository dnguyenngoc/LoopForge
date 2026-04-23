# Apple Developer & App Store Connect — Readiness (pre-build)

Dùng checklist này trước khi nộp bản dựng lên App Store Connect. Cập nhật các trường *ghi nhận* khi team đã xác minh tài khoản.

## 1. Tài khoản Apple Developer

| Mục | Trạng thái | Ghi chú |
|-----|------------|--------|
| Chương trình **Apple Developer Program** còn active | ☐ Đã xác nhận | [developer.apple.com/account](https://developer.apple.com/account) → *Membership* |
| **Team ID** (10 ký tự) | `__________` | Cùng trang *Membership* hoặc trên cert/provisioning |
| Vai trò: Account Holder / App Manager có quyền tạo app & ký bản dựng | ☐ | Thiếu quyền → nhờ Admin cấp hoặc cập nhật người ký (legal/owner) |

**Bundle ID (từ project iOS hiện tại):** `org.reactjs.native.example.LoopForge`  
Xác nhận trùng với *Identifiers* trên [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list). Trước khi phát hành, cân nhắc đổi sang domain riêng (ví dụ `com.tencongty.LoopForge`) nếu vẫn đang dùng template React Native mặc định.

## 2. App Store Connect — app record

| Mục | Trạng thái |
|-----|------------|
| Ứng dụng đã **tạo mới** hoặc **liên kết** với bundle ID đúng | ☐ |
| **SKU** (mã nội bộ, không đổi) đã gán | `__________` |
| **Privacy Policy URL** bắt buộc (nhiều trường hợp) — URL công khai, HTTPS | ☐ `__________` |
| **Age Rating / phân loại nội dung** (câu hỏi Content Rights, v.v.) | ☐ |
| **App Privacy** (Dữ liệu người dùng: thu thập gì, mục đích, liên kết, v.v.) | ☐ Khớp với thực tế app |

## 3. (Khuyến nghị) Tự động hóa nộp bản dựng (CI / fastlane)

| Mục | Trạng thái |
|-----|------------|
| **App Store Connect API key** (Users and Access → Keys) | ☐ |
| **Issuer ID** | `__________` |
| **Key ID** | `__________` |
| File **.p8** lưu an toàn (một lần tải; không commit vào git) | ☐ |
| Tài khoản App Store Connect: **App Manager** hoặc tương đương cho key | ☐ |

*Thay thế:* tài khoản Apple ID với bật 2FA dùng cho `fastlane` session — kém ổn định hơn trên CI.

## 4. Cảnh báo quyền / hợp lý (không bỏ qua)

- **Pháp lý & nội dung:** Privacy policy phải phản ánh cách dùng dữ liệu thật; export compliance, quyền sở hữu nội dung, giấy phép bên thứ 3 nếu có.
- **Tài chính (app trả phí / IAP / đăng ký):** Cần **Paid Applications** (hoặc tương đương) và thông tin **ngân hàng, thuế** đã hoàn tất trên App Store Connect — nếu chưa, có thể **không** bán hoặc phê duyệt IAP.
- Nếu thiếu quyền truy cập App Store Connect API hoặc Certificate của team, **ký build / upload sẽ thất bại** — ưu tiên xác nhận với Admin trước khi hết deadline.

---

*Phiên bản tài liệu: 2026-04-23. Cập nhật khi Team ID, Bundle ID hoặc chính sách riêng tư thay đổi.*
