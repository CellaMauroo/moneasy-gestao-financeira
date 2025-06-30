"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import NewExpenseButton from "../../components/newExpenseButton";
import ExpenseCard, { Item } from "../../components/expenseCard";
import ExpenseModal from "../../components/expenseModal";
import { UserProvider } from "../../contexts/UserContext";

interface Expense {
  reference: string; 
  items: Item[];
}

export default function ExpensesPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  useEffect(() => {
      const isLogged = localStorage.getItem("logged") === "true"
      if (!isLogged) {
        router.push("/login")
      } else {
        setIsChecking(false)
      }
    }, [])

  const openNew = () => {
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEdit = (idx: number) => {
    setEditingIdx(idx);
    setShowModal(true);
  };

  const saveExpense = (refDateISO: string, items: Item[]) => {
    const [year, month] = refDateISO.split("-");
    const ref = new Date(Number(year), Number(month) - 1)
      .toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
      .replace(".", ""); 

    setExpenses((prev) =>
      editingIdx === null
        ? [...prev, { reference: ref, items }]
        : prev.map((e, i) => (i === editingIdx ? { reference: ref, items } : e))
    );
  };

  return (
    <UserProvider>
      <Header />

      <div className="flex min-h-screen">
        <Navbar active="calc"/>

        <main className="flex-1 px-10 py-6 bg-gray-100 space-y-6 overflow-y-auto">
          <input
            placeholder="Pesquisar"
            className="mb-6 w-1/3 border rounded-full px-4 py-2 shadow-sm"
          />

          <NewExpenseButton onClick={openNew} />

          {expenses.map((e, idx) => (
            <ExpenseCard
              key={idx}
              reference={e.reference}
              items={e.items}
              onEdit={() => openEdit(idx)}
              onDelete={() =>
                setExpenses((prev) => prev.filter((_, i) => i !== idx))
              }
            />
          ))}
        </main>
      </div>

      {showModal && (
        <ExpenseModal
          initialItems={
            editingIdx !== null ? expenses[editingIdx].items : []
          }
          initialDate={
            editingIdx !== null
              ? (() => {
                  const [mes, ano] = expenses[editingIdx].reference.split("/");
                  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
                  const idxMonth = months.findIndex((m) =>
                    mes.toLowerCase().startsWith(m)
                  );
                  return `${ano}-${String(idxMonth + 1).padStart(2, "0")}`;
                })()
              : null
          }
          onClose={() => setShowModal(false)}
          onSave={(dateIso, items) => {
            saveExpense(dateIso, items);
            setShowModal(false);
          }}
        />
      )}
    </UserProvider>
  );
}
