"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import IncomeModal from "../../components/incomeModal";
import { Income, IncomeType } from "../../types";

type FormData = {
  income_name: string;
  value: string;
  income_date: string;
  type: number;
};

function IncomeRow({
  inc,
  types,
  onEdit,
  onDelete,
}: {
  inc: Income;
  types: IncomeType[];      
  onEdit: () => void;
  onDelete: () => void;
}) {
  
  const typeName = types.find((t) => t.id === inc.type)?.type ?? "—";

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
      <div>
        <p className="font-bold text-gray-800">{inc.income_name}</p>

       
        <p className="text-sm text-gray-500">
          {new Date(inc.income_date).toLocaleDateString("pt-BR")} — {typeName}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <p className="font-semibold text-green-700">
          {parseFloat(inc.value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <button onClick={onEdit} className="text-blue-600 hover:underline">
          Editar
        </button>
        <button onClick={onDelete} className="text-red-600 hover:underline">
          Excluir
        </button>
      </div>
    </div>
  );
}

export default function IncomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [incomes, setIncomes] = useState<Income[]>([]);
  const [types, setTypes] = useState<IncomeType[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);

  /* ---------- fetch all ---------- */
  const fetchAll = useCallback(
    async (token: string) => {
      try {
        /* resolve user */
        const { data: { user } } = await supabase.auth.getUser();
        const uRes = await fetch("http://127.0.0.1:8000/api/user/", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ supabase_id: user?.id }),
        });
        const u = await uRes.json();
        if (!u.id) throw new Error("user id not found");
        setUserId(u.id);

        /* parallel fetch */
        const [incomeRes, typeRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/income/?user_id=${u.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://127.0.0.1:8000/api/income-type/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log(typeRes)
        if (!incomeRes.ok || !typeRes.ok) throw new Error("API error");

        setIncomes((await incomeRes.json()).results ?? []);
        setTypes((await typeRes.json()).results ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ---------- auth session ---------- */
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else {
        setAccessToken(session.access_token);
        fetchAll(session.access_token);
      }
    })();
  }, [fetchAll, router]);

  /* ---------- CRUD handlers ---------- */
  const openNew = () => { setEditing(null); setShowModal(true); };
  const openEdit = (inc: Income) => { setEditing(inc); setShowModal(true); };

  const saveIncome = async (data: FormData) => {
    if (!accessToken || !userId) return;
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `http://127.0.0.1:8000/api/income/${editing.id}/`
      : `http://127.0.0.1:8000/api/income/`;

    const payload = {
      income_name: data.income_name,
      value: data.value,
      income_date: data.income_date,
      type: data.type,
      user: userId,
    };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.json();
      alert(JSON.stringify(errBody, null, 2));
      return;
    }

    fetchAll(accessToken);
    setShowModal(false);
  };

  const deleteIncome = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Excluir renda?")) return;
    await fetch(`http://127.0.0.1:8000/api/income/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  /* ---------- UI ---------- */
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Navbar active="money" />

        <main className="flex-1 px-10 py-6 bg-gray-300 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Minhas Rendas</h1>
            <button
              onClick={openNew}
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Nova Renda
            </button>

          </div>

          {loading ? (
            <p>Carregando…</p>
          ) : incomes.length ? (
            <div className="space-y-4">
              {incomes
                .sort(
                  (a, b) =>
                    new Date(b.income_date).getTime() -
                    new Date(a.income_date).getTime()
                )
                .map((inc) => (
                  <IncomeRow
                    key={inc.id}
                    inc={inc}
                    types={types}
                    onEdit={() => openEdit(inc)}
                    onDelete={() => deleteIncome(inc.id)}
                  />
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Nenhuma renda encontrada. Clique em “+ Nova Renda” para começar.
            </p>
          )}
        </main>
      </div>

      {showModal && (
        <IncomeModal
          initialData={editing}
          types={types}
          onClose={() => setShowModal(false)}
          onSave={saveIncome}
        />
      )}
    </>
  );
}
