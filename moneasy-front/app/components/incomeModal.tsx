"use client";

import { useState } from "react";
import { Income, IncomeType } from "../types";


type IncomePayload = Omit<Income, "id" | "user" | "type"> & {
  type: number;
};

interface Props {
  initialData: Partial<Income> | null;
  types: IncomeType[];
  onClose: () => void;
  onSave: (data: IncomePayload) => void;
}

export default function IncomeModal({
  initialData,
  types,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(initialData?.income_name || "");
  const [value, setValue] = useState(initialData?.value || "");
  const [date, setDate] = useState(
    initialData?.income_date
      ? initialData.income_date.split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [typeId, setTypeId] = useState<number | "">(
    initialData?.type?.id || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value || !date || typeId === "") {
      alert("Preencha todos os campos.");
      return;
    }
    onSave({
      income_name: name,
      value: String(value),
      income_date: new Date(date).toISOString(),
      type: Number(typeId),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-10">
        <h2 className="text-3xl font-bold mb-8">
          {initialData ? "Editar Renda" : "Adicionar Nova Renda"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da renda
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value ? Number(e.target.value) : "")}
              className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="" disabled>
                Selecione o tipo
              </option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
