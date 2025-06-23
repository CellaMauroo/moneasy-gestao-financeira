"use client";
import {
  XMarkIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import type { Item } from "./expenseCard";

interface Props {
  initialItems: Item[];
  initialDate: string | null;          // novo
  onClose: () => void;
  onSave: (date: string, items: Item[]) => void; // passa data + itens
}

export default function ExpenseModal({
  initialItems,
  initialDate,
  onClose,
  onSave,
}: Props) {
  /* ---------- estado ---------- */
  const [rows, setRows] = useState<Item[]>(
    initialItems.length ? initialItems : [{ desc: "", value: 0 }]
  );

  // YYYY-MM formato – ideal para “mês/ano”
  const today = new Date().toISOString().slice(0, 7);
  const [dateRef, setDateRef] = useState(initialDate ?? today);

  /* ---------- handlers ---------- */
  const updateRow = (idx: number, field: keyof Item, val: string) =>
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
    );

  const addRow = () => setRows((r) => [...r, { desc: "", value: 0 }]);
  const removeRow = (idx: number) =>
    setRows((r) => (r.length === 1 ? r : r.filter((_, i) => i !== idx)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = rows.filter((r) => r.desc && +r.value);
    if (!cleaned.length) return;
    onSave(dateRef, cleaned.map((r) => ({ ...r, value: +r.value })));
  };

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-xl p-6 space-y-6 shadow-lg"
      >
        {/* título */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Despesa</h2>
          <button type="button" onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* data mês/ano */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Referência (mês/ano)
          </label>
          <input
            type="month"
            value={dateRef}
            onChange={(e) => setDateRef(e.target.value)}
            className="border rounded px-3 py-1.5"
            required
          />
        </div>

        {/* linhas de itens */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {rows.map((row, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs">Descrição</label>
                <input
                  className="w-full border rounded px-3 py-1.5"
                  value={row.desc}
                  onChange={(e) => updateRow(idx, "desc", e.target.value)}
                  required
                />
              </div>
              <div className="w-32">
                <label className="block text-xs">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded px-3 py-1.5"
                  value={row.value}
                  onChange={(e) => updateRow(idx, "value", e.target.value)}
                  required
                />
              </div>
              <button type="button" onClick={() => removeRow(idx)}>
                <MinusCircleIcon className="h-6 w-6 text-red-600" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 text-green-700"
          >
            <PlusCircleIcon className="h-5 w-5" /> Adicionar item
          </button>
        </div>

        {/* ações */}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
