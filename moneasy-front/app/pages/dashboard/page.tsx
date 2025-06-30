"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import { supabase } from "../../lib/supabaseClient";
import LogoutButton from '@/app/components/logoutButton';
type Expense = {
  id: number;
  expense_name: string;
  expense_date: string;
  value: string;
  group: number;
  category: number;
  user: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push("/login");
          return;
        }

        const accessToken = session.access_token;
        console.log("Access Token:", accessToken);

        const res = await fetch("http://127.0.0.1:8000/api/expense/", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Erro: ${res.status} ${res.statusText}`);
        }

        const data: Expense[] = await res.json();
        setExpenses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []); // ✅ Adicionado array de dependência

  return (
    <div>
      <Header />
      <div className="flex min-h-screen">
        <Navbar />
        <main className="w-6/7 p-6 bg-gray-300 overflow-auto">
          <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
          <LogoutButton></LogoutButton>
          {loading && <p>Carregando despesas...</p>}
          {error && <p className="text-red-600">Erro: {error}</p>}

          {!loading && !error && (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1">ID</th>
                  <th className="border border-gray-300 px-2 py-1">Nome</th>
                  <th className="border border-gray-300 px-2 py-1">Data</th>
                  <th className="border border-gray-300 px-2 py-1">Valor (R$)</th>
                  <th className="border border-gray-300 px-2 py-1">Grupo</th>
                  <th className="border border-gray-300 px-2 py-1">Categoria</th>
                  <th className="border border-gray-300 px-2 py-1">Usuário</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="border border-gray-300 px-2 py-1">{exp.id}</td>
                    <td className="border border-gray-300 px-2 py-1">{exp.expense_name}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      {new Date(exp.expense_date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">{exp.value}</td>
                    <td className="border border-gray-300 px-2 py-1">{exp.group}</td>
                    <td className="border border-gray-300 px-2 py-1">{exp.category}</td>
                    <td className="border border-gray-300 px-2 py-1">{exp.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
