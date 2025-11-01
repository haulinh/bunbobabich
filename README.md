# 🍜 Bún Bò Bà Bích - Order App

Ứng dụng quản lý order nội bộ cho quán bún bò, hoạt động offline với lưu trữ theo ngày.

## 🚀 Công nghệ sử dụng

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand với persist middleware
- **UI Components**: Lucide React Icons
- **Storage**: localStorage (tự động theo ngày)

## 📦 Cài đặt

```bash
npm install
```

## 🏃 Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## ✨ Tính năng

- 🧾 **Tạo Order**: Thêm order cho bàn với menu và ghi chú
- 🍲 **Bàn đang phục vụ**: Theo dõi và tick món đã ra
- 💰 **Chờ thanh toán**: Tính tiền và thối lại
- 📜 **Lịch sử**: Xem lịch sử và tổng doanh thu theo ngày
- 🧮 **Tính nhanh**: Tính tiền ngoại lệ không lưu lịch sử

## 📂 Cấu trúc thư mục

```
src/
 ├─ store/          # Zustand stores
 ├─ components/     # React components
 ├─ utils/          # Utility functions
 ├─ types/          # TypeScript types
 └─ data/           # Static data (menu)
```

## 💾 Lưu trữ

Dữ liệu được lưu trong localStorage với key theo ngày: `orders_YYYY-MM-DD`

Tự động reset khi sang ngày mới.

