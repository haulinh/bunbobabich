"use client";

import { useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { formatCurrency } from "@/utils/dateKey";
import { Check, CheckCircle2 } from "lucide-react";

export default function ServingTab() {
  const { serving, markItemServed, completeServing } = useOrderStore();
  const [confirmingTable, setConfirmingTable] = useState<string | null>(null);

  const handleToggleItem = (tableId: string, itemId: string) => {
    markItemServed(tableId, itemId);
  };

  const handleCompleteTable = (tableId: string) => {
    setConfirmingTable(tableId);
  };

  const confirmComplete = (tableId: string) => {
    completeServing(tableId);
    setConfirmingTable(null);
  };

  if (serving.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-700 text-lg font-medium">Không có bàn đang phục vụ</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {serving.map((order) => {
        const servedCount = order.items.filter((item) => item.served).length;
        const totalItems = order.items.length;
        const allServed = servedCount === totalItems;
        const total = order.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );
        const isConfirming = confirmingTable === order.id;

        return (
          <div
            key={order.id}
            className="border-2 border-gray-300 rounded-lg p-6 bg-white shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <span className="text-2xl">🪑</span>
                Bàn {order.table}
              </h3>
              <span className="text-xl font-semibold text-green-600">
                💰 {formatCurrency(total)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="py-2 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex-1 text-gray-700">
                      {item.qty}x {item.name} ({formatCurrency(item.price)})
                    </span>
                    <button
                      onClick={() => handleToggleItem(order.id, item.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2 ${
                        item.served
                          ? "bg-green-500 text-white border-green-600"
                          : "bg-gray-300 hover:bg-gray-400 border-gray-400 text-gray-700"
                      }`}
                    >
                      {item.served ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Check size={20} />
                      )}
                    </button>
                  </div>
                  {item.note && (
                    <div className="ml-0 mt-1">
                      <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block border border-orange-300">
                        📝 {item.note}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
              <span className="text-sm text-gray-700 font-medium">
                Món đã ra: {servedCount}/{totalItems}
              </span>
              {isConfirming ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmingTable(null)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => confirmComplete(order.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Xác nhận
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleCompleteTable(order.id)}
                  disabled={!allServed}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors border-2 border-blue-700 disabled:border-gray-500 shadow-md"
                >
                  Hoàn tất bàn này
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

