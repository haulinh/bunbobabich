"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useOrderStore } from "@/store/useOrderStore";
import OrderTab from "@/components/OrderTab";
import ServingTab from "@/components/ServingTab";
import PaymentTab from "@/components/PaymentTab";
import HistoryTab from "@/components/HistoryTab";
import CalcTab from "@/components/CalcTab";
import { Receipt, UtensilsCrossed, CreditCard, History, Calculator } from "lucide-react";

const tabs = [
  { id: "order" as const, label: "Order", icon: Receipt, emoji: "🧾" },
  { id: "serving" as const, label: "Phục vụ", icon: UtensilsCrossed, emoji: "🍲" },
  { id: "payment" as const, label: "Thanh toán", icon: CreditCard, emoji: "💰" },
  { id: "history" as const, label: "Lịch sử", icon: History, emoji: "📜" },
  { id: "calc" as const, label: "Tính nhanh", icon: Calculator, emoji: "🧮" },
];

export default function Home() {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const checkNewDay = useOrderStore((state) => state.checkNewDay);
  const serving = useOrderStore((state) => state.serving);
  const waitingPayment = useOrderStore((state) => state.waitingPayment);

  useEffect(() => {
    checkNewDay();
  }, [checkNewDay]);

  const renderTab = () => {
    switch (activeTab) {
      case "order":
        return <OrderTab />;
      case "serving":
        return <ServingTab />;
      case "payment":
        return <PaymentTab />;
      case "history":
        return <HistoryTab />;
      case "calc":
        return <CalcTab />;
      default:
        return <OrderTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-300 shadow-md">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-around gap-1 sm:gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              // Get count for badges
              const getCount = () => {
                if (tab.id === "serving") return serving.length;
                if (tab.id === "payment") return waitingPayment.length;
                return 0;
              };
              
              const count = getCount();
              
              return (
                <div key={tab.id} className="relative flex-1 min-w-[60px] sm:min-w-[100px]">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full py-2 sm:py-4 px-1 sm:px-2 flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-colors border-b-2 ${
                      isActive
                        ? "border-blue-600 bg-blue-50 text-blue-600 font-bold"
                        : "border-transparent hover:bg-gray-100 text-gray-700 font-medium"
                    }`}
                  >
                    <span className="text-lg sm:text-2xl">{tab.emoji}</span>
                    <span className="text-xs sm:text-sm font-semibold text-center leading-tight">{tab.label}</span>
                  </button>
                  {count > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto py-6">
        {renderTab()}
      </main>
    </div>
  );
}

