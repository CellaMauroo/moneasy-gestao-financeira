// Em app/components/expenseModal.tsx

"use client";

import { useState, useEffect } from "react";
import { Expense, Group, Category } from "../types";

// CORREÇÃO 1: Definimos um tipo para os dados que o formulário vai ENVIAR.
// A API espera números (IDs) para 'group' e 'category', não objetos inteiros.
type ExpensePayload = Omit<Expense, 'id' | 'user' | 'group' | 'category'> & {
  group: number;
  category: number;
};

interface ExpenseModalProps {
  initialData: Partial<Expense> | null;
  groups: Group[];
  categories: Category[];
  onClose: () => void;
  // A função onSave agora espera o payload com os IDs numéricos.
  onSave: (expenseData: ExpensePayload) => void;
}

export default function ExpenseModal({ initialData, groups, categories, onClose, onSave }: ExpenseModalProps) {
  const [name, setName] = useState(initialData?.expense_name || "");
  const [value, setValue] = useState(initialData?.value || "");
  const [date, setDate] = useState(initialData?.expense_date ? initialData.expense_date.split("T")[0] : new Date().toISOString().split("T")[0]);

  // CORREÇÃO 2: Acessamos o '.id' dos objetos 'group' e 'category' para obter o estado inicial.
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(initialData?.group?.id || null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialData?.category?.id || null);

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  // Filtra as categorias quando um grupo é selecionado
  useEffect(() => {
    if (selectedGroupId) {
      // A lógica de filtro agora compara o id do grupo aninhado
      const relevantCategories = categories.filter(c => c.group.id === selectedGroupId);
      setFilteredCategories(relevantCategories);
      
      // Se a categoria inicial não pertencer ao novo grupo, limpa a seleção
      if (!relevantCategories.some(c => c.id === selectedCategoryId)) {
        setSelectedCategoryId(null);
      }
    } else {
      setFilteredCategories([]);
      setSelectedCategoryId(null);
    }
  }, [selectedGroupId, categories, selectedCategoryId]);
  
  // Popula o filtro de categoria inicial ao editar
  useEffect(() => {
    if (initialData?.group?.id) {
      setFilteredCategories(categories.filter(c => c.group.id === initialData.group.id));
    }
  }, [initialData, categories]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value || !date || !selectedGroupId || !selectedCategoryId) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Enviamos o payload com os IDs numéricos, conforme o tipo ExpensePayload.
    onSave({
      expense_name: name,
      value: String(value),
      expense_date: new Date(date).toISOString(),
      group: selectedGroupId,
      category: selectedCategoryId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{initialData ? "Editar Despesa" : "Adicionar Nova Despesa"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Despesa</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
            <input id="value" type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-700">Grupo</label>
            <select id="group" value={selectedGroupId || ""} onChange={(e) => setSelectedGroupId(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required>
              <option value="" disabled>Selecione um grupo</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.group_name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
            <select id="category" value={selectedCategoryId || ""} onChange={(e) => setSelectedCategoryId(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" disabled={!selectedGroupId} required>
              <option value="" disabled>Selecione uma categoria</option>
              {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
