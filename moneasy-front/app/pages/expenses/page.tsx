// Em app/pages/expenses/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import ExpenseModal from "../../components/expenseModal";
import { Expense, Group, Category } from "../../types";

// Tipo para os dados que vêm do modal
type FormDataFromModal = {
  expense_name: string;
  value: string;
  expense_date: string;
  group: number;
  category: number;
};

// Componente para listar cada despesa
function ExpenseListItem({ expense, onEdit, onDelete }: { expense: Expense, onEdit: () => void, onDelete: () => void }) {
  // Acessamos os nomes aninhados para exibição, com verificação de nulidade
  const categoryName = expense.category?.category_name || "Sem Categoria";
  const groupName = expense.group?.group_name || "Sem Grupo";

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <p className="font-bold text-gray-800">{expense.expense_name}</p>
        <p className="text-sm text-gray-500">{new Date(expense.expense_date).toLocaleDateString('pt-BR')} - {groupName} / {categoryName}</p>
      </div>
      <div className="flex items-center space-x-4">
        <p className="font-semibold text-red-600">
          {parseFloat(expense.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">Editar</button>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">Excluir</button>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const router = useRouter();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchData = useCallback(async (token: string) => {
    try {
      const userRes = await fetch("http://127.0.0.1:8000/api/user/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ supabase_id: (await supabase.auth.getUser()).data.user?.id })
      });
      const userData = await userRes.json();
      if (!userData.id) throw new Error("ID do usuário não encontrado.");
      setUserId(userData.id);
      
      const [expensesRes, groupsRes, categoriesRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/expense/?user_id=${userData.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://127.0.0.1:8000/api/expense-group/`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://127.0.0.1:8000/api/expense-category/`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (!expensesRes.ok || !groupsRes.ok || !categoriesRes.ok) {
        throw new Error("Falha ao buscar os dados da API.");
      }
      
      const expensesData = await expensesRes.json();
      setExpenses(expensesData.results || []);

      const groupsData = await groupsRes.json();
      setGroups(groupsData.results || []);

      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.results || []);

    } catch (error) {
      console.error("Falha ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setAccessToken(session.access_token);
        fetchData(session.access_token);
      }
    };
    getSession();
  }, [fetchData, router]);

  const handleOpenNew = () => { setEditingExpense(null); setShowModal(true); };
  const handleOpenEdit = (expense: Expense) => { setEditingExpense(expense); setShowModal(true); };
  
  const handleSaveExpense = async (formData: FormDataFromModal) => {
    if (!accessToken || !userId) return;

    const method = editingExpense ? 'PUT' : 'POST';
    const url = editingExpense 
      ? `http://127.0.0.1:8000/api/expense/${editingExpense.id}/` 
      : `http://127.0.0.1:8000/api/expense/`;

    // CORREÇÃO: Construímos o payload mapeando os campos para os nomes que a API espera.
    const payload = {
        expense_name: formData.expense_name,
        value: formData.value,
        expense_date: formData.expense_date,
        group_id: formData.group, // Renomeia 'group' para 'group_id'
        category_id: formData.category, // Renomeia 'category' para 'category_id'
        user: userId,
    };
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
          const errorBody = await response.json();
          const errorMessages = Object.entries(errorBody).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n');
          throw new Error(errorMessages);
      }
      
      // Busca os dados novamente para atualizar a lista com a nova despesa
      if (accessToken) {
        fetchData(accessToken);
      }
      
      setShowModal(false);
      setEditingExpense(null);

    } catch (error) {
      console.error("Falha ao salvar despesa:", error);
      alert(`Ocorreu um erro ao salvar a despesa:\n${error.message}`);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (!accessToken) return;
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/expense/${expenseId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      // Atualiza a lista removendo o item deletado
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    } catch (error) {
      console.error("Falha ao excluir despesa:", error);
    }
  };
  
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Navbar active="expenses"/>
        <main className="flex-1 px-10 py-6 bg-gray-100 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Minhas Despesas</h1>
            <button onClick={handleOpenNew} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              + Nova Despesa
            </button>
          </div>
          
          {loading ? <p>Carregando despesas...</p> : (
            <div className="space-y-4">
              {expenses.length > 0 ? (
                expenses
                  .sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime())
                  .map((expense) => (
                    <ExpenseListItem
                      key={expense.id}
                      expense={expense}
                      onEdit={() => handleOpenEdit(expense)}
                      onDelete={() => handleDeleteExpense(expense.id)}
                    />
                  ))
              ) : (
                <p className="text-center text-gray-500 mt-10">Nenhuma despesa encontrada. Clique em "+ Nova Despesa" para começar.</p>
              )}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <ExpenseModal
          initialData={editingExpense}
          groups={groups}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleSaveExpense}
        />
      )}
    </>
  );
}
  