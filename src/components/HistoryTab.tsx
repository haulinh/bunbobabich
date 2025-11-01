"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { formatCurrency, formatDate } from "@/utils/dateKey";
import { Calendar } from "lucide-react";

export default function HistoryTab() {
  const { history } = useOrderStore();

  const todayTotal = history.reduce((sum, order) => sum + (order.total || 0), 0);
  const today = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-700 text-lg font-medium">Chưa có lịch sử thanh toán</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={24} />
          <span className="text-xl font-bold text-gray-800">📅 {today}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-semibold text-gray-800">💚 Tổng doanh thu hôm nay:</span>
          <span className="text-2xl font-bold text-green-600">
            {formatCurrency(todayTotal)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {history.map((order) => {
          const total = order.total || order.items.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
          );

          return (
            <div
              key={order.id}
              className="border-2 border-gray-300 rounded-lg p-6 bg-white shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <span className="text-xl">🪑</span>
                  Bàn {order.table}
                </h3>
                <span className="text-xl font-semibold text-blue-600">
                  💰 {formatCurrency(total)}
                </span>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.qty}x {item.name} ({formatCurrency(item.price)})
                      {item.note && (
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded ml-2 border border-orange-300">
                          - {item.note}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {order.paidAt && (
                <div className="mt-4 text-xs text-gray-600 border-t border-gray-200 pt-2">
                  Thanh toán lúc: {formatDate(order.paidAt)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

