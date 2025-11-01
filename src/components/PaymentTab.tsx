"use client";

import { useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { formatCurrency } from "@/utils/dateKey";
import { CheckCircle2 } from "lucide-react";

export default function PaymentTab() {
  const { waitingPayment, confirmPayment } = useOrderStore();
  const [customerPayments, setCustomerPayments] = useState<
    Map<string, number>
  >(new Map());
  const [confirmingTable, setConfirmingTable] = useState<string | null>(null);

  const handlePaymentInput = (tableId: string, amount: number) => {
    setCustomerPayments((prev) => {
      const newMap = new Map(prev);
      newMap.set(tableId, amount);
      return newMap;
    });
  };

  const handleConfirmPayment = (tableId: string, total: number) => {
    setConfirmingTable(tableId);
  };

  const executePayment = (tableId: string, total: number) => {
    confirmPayment(tableId, total);
    setCustomerPayments((prev) => {
      const newMap = new Map(prev);
      newMap.delete(tableId);
      return newMap;
    });
    setConfirmingTable(null);
  };

  if (waitingPayment.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-700 text-lg font-medium">Không có bàn chờ thanh toán</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {waitingPayment.map((order) => {
        const total = order.total || order.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );
        const customerPaid =
          customerPayments.get(order.id) || 0;
        const change = Math.max(0, customerPaid - total);
        const isConfirming = confirmingTable === order.id;

        return (
          <div
            key={order.id}
            className="border-2 border-gray-300 rounded-lg p-6 bg-white shadow-md"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <span className="text-2xl">🪑</span>
              Bàn {order.table}
            </h3>

            <div className="space-y-2 mb-4 border-b border-gray-300 pb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-700">
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

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-800">💰 Tổng bill:</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <span>💵</span>
                  <span className="font-medium text-gray-800">Tiền khách đưa:</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={customerPaid || ""}
                  onChange={(e) =>
                    handlePaymentInput(
                      order.id,
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="Nhập số tiền"
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-lg font-semibold text-gray-800 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm placeholder:text-gray-400"
                />
              </div>

              {customerPaid > 0 && (
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-800">💸 Tiền thối lại:</span>
                  <span
                    className={`font-bold ${
                      change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(change)}
                  </span>
                </div>
              )}
            </div>

            {isConfirming ? (
              <div className="flex gap-2 pt-4 border-t-2 border-gray-300">
                <button
                  onClick={() => setConfirmingTable(null)}
                  className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={() => executePayment(order.id, total)}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  Xác nhận thanh toán
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleConfirmPayment(order.id, total)}
                disabled={customerPaid < total}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 transition-colors border-2 border-green-700 disabled:border-gray-500 shadow-md"
              >
                <CheckCircle2 size={24} />
                THANH TOÁN
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

