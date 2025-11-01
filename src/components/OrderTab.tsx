"use client";

import { useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { MENU_ITEMS } from "@/data/menu";
import { formatCurrency } from "@/utils/dateKey";
import type { OrderItem } from "@/types";
import { Plus, Minus, Receipt } from "lucide-react";

export default function OrderTab() {
  const [table, setTable] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    Map<string, { qty: number; notes: string[] }>
  >(new Map());

  const addOrder = useOrderStore((state) => state.addOrder);

  const updateItemQty = (menuId: string, delta: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(menuId) || { qty: 0, notes: [] };
      const newQty = Math.max(0, current.qty + delta);
      
      if (newQty === 0) {
        newMap.delete(menuId);
      } else {
        // Adjust notes array to match new quantity
        const newNotes = [...current.notes];
        if (delta > 0) {
          // Adding items - add empty note strings
          for (let i = 0; i < delta; i++) {
            newNotes.push("");
          }
        } else {
          // Removing items - remove from end
          for (let i = 0; i < -delta; i++) {
            newNotes.pop();
          }
        }
        newMap.set(menuId, { qty: newQty, notes: newNotes });
      }
      return newMap;
    });
  };

  const updateItemNote = (menuId: string, index: number, note: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(menuId) || { qty: 0, notes: [] };
      const newNotes = [...current.notes];
      newNotes[index] = note;
      newMap.set(menuId, { ...current, notes: newNotes });
      return newMap;
    });
  };

  const handleCreateOrder = () => {
    if (selectedItems.size === 0) return;

    const orderItems: OrderItem[] = [];
    selectedItems.forEach((value, menuId) => {
      const menuItem = MENU_ITEMS.find((item) => item.id === menuId);
      if (menuItem && value.qty > 0) {
        for (let i = 0; i < value.qty; i++) {
          orderItems.push({
            id: `item_${Date.now()}_${Math.random()}_${i}`,
            name: menuItem.name,
            qty: 1,
            price: menuItem.price,
            note: value.notes[i] || undefined,
          });
        }
      }
    });

    // Use table number or default to 1 if null
    const tableNumber = table ?? 1;
    addOrder(tableNumber, orderItems);
    setSelectedItems(new Map());
    setTable(null);
  };

  const total = Array.from(selectedItems.entries()).reduce((sum, [menuId, value]) => {
    const menuItem = MENU_ITEMS.find((item) => item.id === menuId);
    return sum + (menuItem?.price || 0) * value.qty;
  }, 0);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <span className="text-2xl">🪑</span>
          Số bàn:
        </label>
        <input
          type="number"
          min="1"
          value={table ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              setTable(null);
            } else {
              const numValue = parseInt(value);
              if (!isNaN(numValue) && numValue > 0) {
                setTable(numValue);
              }
            }
          }}
          placeholder="Nhập số bàn"
          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg text-lg font-semibold text-gray-800 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm placeholder:text-gray-400"
        />
      </div>

      <div className="border-t-2 border-gray-300 pt-4">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <span>📋</span> MENU
        </h2>
        <div className="space-y-4">
          {MENU_ITEMS.map((menuItem) => {
            const itemData = selectedItems.get(menuItem.id);
            const qty = itemData?.qty || 0;
            
            return (
              <div key={menuItem.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">
                    {menuItem.name} ({formatCurrency(menuItem.price)})
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => updateItemQty(menuItem.id, -1)}
                    disabled={qty === 0}
                    className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 border-2 border-gray-400 disabled:border-gray-300"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">{qty}</span>
                  <button
                    onClick={() => updateItemQty(menuItem.id, 1)}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center border-2 border-blue-700 shadow-md"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>
                {qty > 0 && (
                  <div className="space-y-2 ml-[72px]">
                    {itemData?.notes.map((note, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={qty === 1 ? "Ghi chú" : `Ghi chú cho món ${idx + 1}`}
                        value={note}
                        onChange={(e) => updateItemNote(menuItem.id, idx, e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg text-sm font-medium text-gray-800 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm placeholder:text-gray-400"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t-2 border-gray-300 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-800">💰 Tổng tạm tính:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(total)}
          </span>
        </div>
        <button
          onClick={handleCreateOrder}
          disabled={selectedItems.size === 0}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 transition-colors border-2 border-blue-700 disabled:border-gray-500 shadow-md"
        >
          <Receipt size={24} />
          TẠO ORDER
        </button>
      </div>
    </div>
  );
}

