import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
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

// Consistent storage key for the store
const STORAGE_KEY = "bunbobabich-order-store";

function getDefaultState() {
  const today = getTodayKey();
  return {
    key: today,
    serving: [],
    waitingPayment: [],
    history: [],
  };
}

// Custom storage implementation with date-based key management
const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof window === "undefined") return null;
      const today = getTodayKey();
      const stored = localStorage.getItem(name);
      
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      const storedKey = parsed?.state?.key;
      
      // If stored data is from a different day, return null to trigger reset
      if (storedKey !== today) {
        return null;
      }
      
      return stored;
    } catch (error) {
      console.warn("Failed to get item from localStorage:", error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window === "undefined") return;
      
      // Ensure the state includes today's key before storing
      const parsed = JSON.parse(value);
      const today = getTodayKey();
      
      if (parsed?.state) {
        parsed.state.key = today;
      }
      
      localStorage.setItem(name, JSON.stringify(parsed));
    } catch (error) {
      console.warn("Failed to set item in localStorage:", error);
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(name);
    } catch (error) {
      console.warn("Failed to remove item from localStorage:", error);
    }
  },
};

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
      name: STORAGE_KEY,
      storage: createJSONStorage(() => customStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("Failed to rehydrate order store:", error);
          return;
        }
        
        if (state) {
          state.checkNewDay();
        }
      },
      // Only persist state data, not actions
      partialize: (state) => ({
        key: state.key,
        serving: state.serving,
        waitingPayment: state.waitingPayment,
        history: state.history,
      }),
    }
  )
);

