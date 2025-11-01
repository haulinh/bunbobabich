import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTodayKey } from "@/utils/dateKey";
import type { TableOrder, OrderItem } from "@/types";

interface OrderStore {
  key: string;
  serving: TableOrder[];
  waitingPayment: TableOrder[];
  history: TableOrder[];
  
  addOrder: (table: number, items: OrderItem[]) => void;
  markItemServed: (tableId: string, itemId: string) => void;
  completeServing: (tableId: string) => void;
  confirmPayment: (tableId: string, total: number) => void;
  checkNewDay: () => void;
}

function getDefaultState() {
  const today = getTodayKey();
  return {
    key: today,
    serving: [],
    waitingPayment: [],
    history: [],
  };
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),

      addOrder: (table, items) => {
        const order: TableOrder = {
          id: `order_${Date.now()}_${Math.random()}`,
          table,
          items: items.map(item => ({ ...item, served: false })),
          status: "serving",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          serving: [...state.serving, order],
        }));
      },

      markItemServed: (tableId, itemId) => {
        set((state) => ({
          serving: state.serving.map((order) =>
            order.id === tableId
              ? {
                  ...order,
                  items: order.items.map((item) =>
                    item.id === itemId ? { ...item, served: true } : item
                  ),
                }
              : order
          ),
        }));
      },

      completeServing: (tableId) => {
        const { serving, waitingPayment } = get();
        const order = serving.find((o) => o.id === tableId);
        if (!order) return;

        const total = order.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );

        set({
          serving: serving.filter((o) => o.id !== tableId),
          waitingPayment: [
            ...waitingPayment,
            { ...order, status: "waiting", total },
          ],
        });
      },

      confirmPayment: (tableId, total) => {
        const { waitingPayment, history } = get();
        const order = waitingPayment.find((o) => o.id === tableId);
        if (!order) return;

        set({
          waitingPayment: waitingPayment.filter((o) => o.id !== tableId),
          history: [
            ...history,
            {
              ...order,
              status: "done",
              total,
              paidAt: new Date().toISOString(),
            },
          ],
        });
      },

      checkNewDay: () => {
        const today = getTodayKey();
        const currentKey = get().key;
        if (currentKey !== today) {
          // Clear old day's data and set new day's data
          const newState = getDefaultState();
          set(newState);
        }
      },
    }),
    {
      name: getTodayKey(),
      storage: {
        getItem: (name: string): string | null => {
          const today = getTodayKey();
          return localStorage.getItem(today);
        },
        setItem: (name: string, value: string): void => {
          const today = getTodayKey();
          localStorage.setItem(today, value);
        },
        removeItem: (name: string): void => {
          const today = getTodayKey();
          localStorage.removeItem(today);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkNewDay();
        }
      },
    }
  )
);

