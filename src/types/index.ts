export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
  note?: string;
  served?: boolean;
};

export type TableOrder = {
  id: string;
  table: number;
  items: OrderItem[];
  total?: number;
  status: "serving" | "waiting" | "done";
  paidAt?: string;
  createdAt: string;
};

export type DailyData = {
  key: string;
  serving: TableOrder[];
  waitingPayment: TableOrder[];
  history: TableOrder[];
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  defaultNote?: string;
};

