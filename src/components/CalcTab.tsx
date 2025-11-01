"use client";

import { useState } from "react";
import { formatCurrency } from "@/utils/dateKey";
import { RotateCcw } from "lucide-react";

export default function CalcTab() {
  const [quantities, setQuantities] = useState({
    "30k": 0,
    "35k": 0,
    "45k": 0,
  });
  const [customerPaid, setCustomerPaid] = useState<number>(0);

  const prices = {
    "30k": 30000,
    "35k": 35000,
    "45k": 45000,
  };

  const total = Object.entries(quantities).reduce(
    (sum, [key, qty]) => sum + prices[key as keyof typeof prices] * qty,
    0
  );

  const change = Math.max(0, customerPaid - total);

  const updateQuantity = (key: keyof typeof quantities, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const handleReset = () => {
    setQuantities({
      "30k": 0,
      "35k": 0,
      "45k": 0,
    });
    setCustomerPaid(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🧮 TÍNH TIỀN NGOẠI LỆ
      </h2>

      <div className="border-2 border-gray-300 rounded-lg p-6 bg-white shadow-md space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg text-gray-800">Tô 30k:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity("30k", -1)}
                disabled={quantities["30k"] === 0}
                className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 border-2 border-gray-400 disabled:border-gray-300"
              >
                -
              </button>
              <span className="w-16 text-center text-lg font-semibold text-gray-800">
                {quantities["30k"]}
              </span>
              <button
                onClick={() => updateQuantity("30k", 1)}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold border-2 border-blue-700 shadow-md"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg text-gray-800">Tô 35k:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity("35k", -1)}
                disabled={quantities["35k"] === 0}
                className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 border-2 border-gray-400 disabled:border-gray-300"
              >
                -
              </button>
              <span className="w-16 text-center text-lg font-semibold text-gray-800">
                {quantities["35k"]}
              </span>
              <button
                onClick={() => updateQuantity("35k", 1)}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold border-2 border-blue-700 shadow-md"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg text-gray-800">Tô 45k:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity("45k", -1)}
                disabled={quantities["45k"] === 0}
                className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 border-2 border-gray-400 disabled:border-gray-300"
              >
                -
              </button>
              <span className="w-16 text-center text-lg font-semibold text-gray-800">
                {quantities["45k"]}
              </span>
              <button
                onClick={() => updateQuantity("45k", 1)}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold border-2 border-blue-700 shadow-md"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-300 pt-4 space-y-3">
          <div className="flex justify-between items-center text-xl">
            <span className="font-semibold text-gray-800">💰 Tổng bill:</span>
            <span className="font-bold text-blue-600">{formatCurrency(total)}</span>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-gray-800">
              <span>💵</span>
              <span>Tiền khách đưa:</span>
            </label>
            <input
              type="number"
              min="0"
              value={customerPaid || ""}
              onChange={(e) => setCustomerPaid(parseInt(e.target.value) || 0)}
              placeholder="Nhập số tiền"
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-lg font-semibold text-gray-800 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm placeholder:text-gray-400"
            />
          </div>

          {customerPaid > 0 && (
            <div className="flex justify-between items-center text-xl">
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

        <button
          onClick={handleReset}
          className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 transition-colors mt-4 border-2 border-gray-700 shadow-md"
        >
          <RotateCcw size={24} />
          TÍNH LẠI
        </button>
      </div>
    </div>
  );
}

