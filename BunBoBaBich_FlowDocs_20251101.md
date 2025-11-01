# 🍜 BÚN BÒ BÀ BÍCH ORDER APP

---

## 📘 PHẦN 1 – FLOW NGHIỆP VỤ (DOCUMENT FLOW)

### 🎯 Mục tiêu
Ứng dụng nội bộ giúp quán ghi order nhanh, theo dõi món, tính tiền và lưu lịch sử.
Hoạt động offline, lưu dữ liệu theo ngày.

### 🧩 Luồng tổng quát
```
🧾 Tạo Order 
   ↓
🍲 Bàn đang phục vụ (tick món đã ra)
   ↓
💰 Chờ thanh toán (popup confirm)
   ↓
📜 Lịch sử (chi tiết bill + tổng doanh thu)
↘
🧮 Tính tiền ngoại lệ (không qua order)
```

### 🪑 1️⃣ Tạo Order
- Nhập số bàn, chọn món, ghi chú, bấm **Tạo Order**
- Món trong menu:
  | Món | Giá | Ghi chú |
  |------|-----|----------|
  | Nạm Gân | 35k | ít hành |
  | Tô Em Bé | 30k | nhỏ cho bé |
  | Tô Tùy Chọn | 35k / 45k | chọn topping |

### 🍲 2️⃣ Bàn đang phục vụ
- Hiển thị toàn bộ bàn đang hoạt động
- Tick món “Đã ra”
- Khi đủ món → popup xác nhận chuyển qua **Chờ thanh toán**

### 💰 3️⃣ Bàn đã xong (Chờ thanh toán)
- Hiển thị bill chi tiết, nhập tiền khách đưa → tính thối lại
- Nhấn “✅ Thanh toán” → popup xác nhận

### 📜 4️⃣ Lịch sử
- Lưu các bill đã thanh toán
- Hiển thị tổng doanh thu theo ngày

### 🧮 5️⃣ Tính tiền ngoại lệ
- Tính tiền nhanh cho khách mang về
- Không lưu lịch sử

---

## 🎨 PHẦN 2 – FLOW GIAO DIỆN (UI FLOW)

### 🧭 Thanh tab cố định
```
┌───────────────────────────────────────────────┐
│ 🧾 Order   🍲 Phục vụ   💰 Thanh toán   📜 Lịch sử   🧮 Tính nhanh │
└───────────────────────────────────────────────┘
```

### 1️⃣ Tab “Tạo Order”
```
🪑 Số bàn: [____3____]
───────────────────────────────
📋 MENU
───────────────────────────────
Nạm Gân (35k)
[ - ] [ 1 ] [ + ]  Ghi chú: [____________]
[ + Thêm món ]
───────────────────────────────
💰 Tổng tạm tính: 70,000đ
[ 🧾 TẠO ORDER ]
```

### 2️⃣ Tab “Bàn đang phục vụ”
```
🪑 Bàn 1   💰 70,000đ
───────────────────────────────
1x Nạm Gân (35k)  [✓]
1x Tô Em Bé (30k) [ ]
───────────────────────────────
Món đã ra: 1/2
[ Hoàn tất bàn này ]
```

### 3️⃣ Tab “Chờ thanh toán”
```
🪑 Bàn 2
───────────────────────────────
1x Tô Đặc Biệt (45k)
2x Tô Tùy Chọn (35k)
───────────────────────────────
💰 Tổng bill: 115,000đ
💵 Tiền khách đưa: [200,000]
💸 Tiền thối lại: 85,000đ
───────────────────────────────
[ ✅ THANH TOÁN ]
```

### 4️⃣ Tab “Lịch sử”
```
📅 01/11/2025
💚 Tổng doanh thu hôm nay: 185,000đ
───────────────────────────────
🪑 Bàn 2 | 💰 115,000đ
1x Tô Đặc Biệt (45k)
2x Tô Tùy Chọn (35k)
───────────────────────────────
🪑 Bàn 1 | 💰 70,000đ
1x Nạm Gân (35k)
1x Tô Em Bé (30k)
───────────────────────────────
```

### 5️⃣ Tab “Tính nhanh”
```
🧮 TÍNH TIỀN NGOẠI LỆ
───────────────────────────────
Tô 30k: [1]   Tô 35k: [2]   Tô 45k: [1]
💰 Tổng bill: 145,000đ
💵 Tiền khách đưa: [200,000]
💸 Tiền thối lại: 55,000đ
───────────────────────────────
[ 🔁 TÍNH LẠI ]
```

---

## 🧑‍💻 PHẦN 3 – FLOW TECHNICAL

### ⚙️ Công nghệ
| Thành phần | Công nghệ |
|-------------|------------|
| Frontend | Next.js + TailwindCSS |
| State | Zustand |
| Persist | Zustand middleware (localStorage) |
| UI | Shadcn/UI + Framer Motion |
| Storage | Tách theo ngày (`orders_YYYY-MM-DD`) |

### 🧱 Kiến trúc thư mục
```
src/
 ├─ store/
 │   ├─ useOrderStore.js
 │   └─ useAppStore.js
 ├─ components/
 │   ├─ OrderTab.jsx
 │   ├─ ServingTab.jsx
 │   ├─ PaymentTab.jsx
 │   ├─ HistoryTab.jsx
 │   └─ CalcTab.jsx
 ├─ utils/
 │   └─ dateKey.js
 └─ App.jsx
```

### 🧠 Cấu trúc dữ liệu
```ts
type OrderItem = {
  name: string;
  qty: number;
  price: number;
  note?: string;
};

type TableOrder = {
  table: number;
  items: OrderItem[];
  total?: number;
  status: "serving" | "waiting" | "done";
  paidAt?: string;
};

type DailyData = {
  key: string;
  serving: TableOrder[];
  waitingPayment: TableOrder[];
  history: TableOrder[];
};
```

### 💾 Lưu trữ theo ngày (localStorage)
- Key: `orders_YYYY-MM-DD`
- Giá trị:
```json
{
  "serving": [...],
  "waitingPayment": [...],
  "history": [...]
}
```

### 🧩 Logic chính
```js
import { create } from "zustand";
import { persist } from "zustand/middleware";

function getTodayKey() {
  return `orders_${new Date().toISOString().split('T')[0]}`;
}

export const useOrderStore = create()(
  persist(
    (set, get) => ({
      key: getTodayKey(),
      serving: [],
      waitingPayment: [],
      history: [],

      addOrder: (table, items) => set(s => ({ serving: [...s.serving, { table, items }] })),
      completeServing: (table) => {
        const { serving, waitingPayment } = get();
        const order = serving.find(b => b.table === table);
        if (!order) return;
        set({
          serving: serving.filter(b => b.table !== table),
          waitingPayment: [...waitingPayment, order]
        });
      },
      confirmPayment: (table, total) => {
        const { waitingPayment, history } = get();
        const order = waitingPayment.find(b => b.table === table);
        if (!order) return;
        set({
          waitingPayment: waitingPayment.filter(b => b.table !== table),
          history: [...history, { ...order, total, paidAt: new Date().toISOString() }]
        });
      },
      checkNewDay: () => {
        const today = getTodayKey();
        if (get().key !== today) {
          set({ key: today, serving: [], waitingPayment: [], history: [] });
        }
      }
    }),
    { name: getTodayKey(), getStorage: () => localStorage }
  )
);
```

### ✅ Ưu điểm
- Offline friendly  
- Tự động reset mỗi ngày  
- Dễ mở rộng (menu, báo cáo, export CSV)
