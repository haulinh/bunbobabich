import { create } from "zustand";

type Tab = "order" | "serving" | "payment" | "history" | "calc";

interface AppStore {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: "order",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

