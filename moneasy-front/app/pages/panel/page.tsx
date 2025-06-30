// Em app/pages/dashboard/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense, Category } from "../../types";

// Tipos específicos para esta página
interface ChartData {
  month: string;
  total: number;
}

interface RecentExpenseDisplay {
    id: number;
    date: string;
    categoryName: string;
    value: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<RecentExpenseDisplay[]>([]);
  const [expenseChartData, setExpenseChartData] = useState<ChartData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Usuário");

  const fetchData = useCallback(async (token: string) => {
    try {
      const supabaseUser = (await supabase.auth.getUser()).data.user;
      if (!supabaseUser) throw new Error("Usuário Supabase não autenticado.");

      const userRes = await fetch("http://127.0.0.1:8000/api/user/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ supabase_id: supabaseUser.id })
      });

      if (!userRes.ok) {
        const errorText = await userRes.text();
        throw new Error(`Falha ao buscar usuário do Django: ${errorText}`);
      }
      
      const userData = await userRes.json();
      if (!userData.id) throw new Error("A resposta da API para o usuário não continha um 'id'.");
      
      const [incomeRes, expenseChartRes, recentExpensesRes, categoriesRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/income/last_months/?user_id=${userData.id}&months=1`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://127.0.0.1:8000/api/expense/last_months/?user_id=${userData.id}&months=4`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://127.0.0.1:8000/api/expense/?user_id=${userData.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://127.0.0.1:8000/api/expense-category/`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!incomeRes.ok || !expenseChartRes.ok || !recentExpensesRes.ok || !categoriesRes.ok) {
        throw new Error("Uma ou mais chamadas à API de dados financeiros falharam.");
      }

      // CORREÇÃO: Os endpoints 'last_months' retornam um array diretamente (sem 'results').
      const incomeData = await incomeRes.json();
      const expenseChartRawData = await expenseChartRes.json();

      // Estes endpoints padrão usam paginação e têm 'results'.
      const allExpensesData = await recentExpensesRes.json();
      const categoriesData = await categoriesRes.json();

      // Card de Renda Total - lendo o array diretamente
      setTotalIncome(incomeData[0]?.total || 0);

      // Card de Despesa Total e Gráfico - lendo o array diretamente
      const expenseTotalsByMonth = expenseChartRawData || [];

      // Lógica mais robusta para pegar o total do mês atual
      const now = new Date();
      const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const currentMonthData = expenseTotalsByMonth.find(item => item.month === currentMonthKey);
      setTotalExpenses(currentMonthData?.total || 0);
      
      setExpenseChartData(expenseTotalsByMonth.map(item => ({
        month: new Date(item.month + '-02').toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', ''),
        total: item.total
      })));
      
      // Tabela de Despesas Recentes (acessando a propriedade aninhada 'category.category_name')
      const recent: Expense[] = (allExpensesData.results || [])
        .sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime())
        .slice(0, 5);
      
      setRecentExpenses(recent.map(exp => ({
        id: exp.id,
        date: new Date(exp.expense_date).toLocaleDateString('pt-BR'),
        categoryName: exp.category?.category_name || 'Sem Categoria',
        value: parseFloat(exp.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      })));

    } catch (error) {
      console.error("ERRO CRÍTICO NO DASHBOARD:", error);
      setError(error.message);
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
        setUserName(session.user?.user_metadata?.first_name || "William");
        fetchData(session.access_token);
      }
    };
    getSession();
  }, [fetchData, router]);

  const saldoAtual = totalIncome - totalExpenses;
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100"><Navbar active="dashboard"/><main className="flex-1 flex items-center justify-center"><p>Carregando painel...</p></main></div>
    );
  }
  
  if (error) {
     return (
      <div className="flex min-h-screen bg-gray-100"><Navbar active="dashboard"/><main className="flex-1 flex items-center justify-center p-8"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center"><p className="font-bold">Ocorreu um erro ao carregar o painel</p><p className="text-sm">{error}</p></div></main></div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header userName={userName} />
      <div className="flex">
        <Navbar active="panel"/>
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel Geral</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md"> <p>Total de Despesas (Mês)</p> <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p> </div>
            <div className="bg-white p-6 rounded-lg shadow-md"> <p>Total de Renda (Mês)</p> <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p> </div>
            <div className="bg-white p-6 rounded-lg shadow-md"> <p>Saldo Atual (Mês)</p> <p className={`text-2xl font-bold ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(saldoAtual)}</p> </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Despesas Recentes</h2>
              <table className="w-full">
                <thead><tr className="text-left text-sm text-gray-500"><th className="pb-2">Data</th><th className="pb-2">Categoria</th><th className="pb-2 text-right">Valor</th></tr></thead>
                <tbody>{recentExpenses.map((exp) => (<tr key={exp.id} className="border-t"><td className="py-3">{exp.date}</td><td>{exp.categoryName}</td><td className="text-right font-medium">{exp.value}</td></tr>))}</tbody>
              </table>
            </div>
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Gráfico de Despesas</h2>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={expenseChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Total']} />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Despesa Mensal" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
