"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Navbar from "../../components/navbar";

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
  const [isChecking, setIsChecking] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isLogged = localStorage.getItem("logged") === "true";
    if (!isLogged) {
      router.push("/login");
      return;
    }
    setIsChecking(false);

    fetch("http://127.0.0.1:8000/api/expense/")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar despesas");
        return res.json();
      })
      .then((data: Expense[]) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  if (isChecking) return null;

  return (
    <div>
      <Header />
      <div className="flex min-h-screen">
        <Navbar />
        <main className="w-6/7 p-6 bg-gray-300 overflow-auto">
          <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

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
