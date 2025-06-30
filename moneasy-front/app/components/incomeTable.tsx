'use client';
import { useState } from 'react';
import { useIncome } from '../contexts/incomeContext';
import IncomeForm from './incomeForm';
import { Income } from '../types';

export default function IncomeTable() {
  const { incomes, loading, deleteIncome } = useIncome();

  const [editing, setEditing] = useState<Income | null>(null);
  const [openModal, setOpenModal] = useState(false); // controla modal

  const closeModal = () => {
    setEditing(null);
    setOpenModal(false);
  };

  if (loading) return <p>Carregando…</p>;

  return (
    <div className="w-full">
      {/* ---------- Modal ---------- */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editing ? 'Editar Renda' : 'Nova Renda'}
            </h2>
            <IncomeForm editIncome={editing} onDone={closeModal} />

            <button
              onClick={closeModal}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ---------- Cabeçalho e botão ---------- */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Minhas Rendas</h2>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md"
          // se usar DaisyUI: className="btn btn-success"
        >
          + Nova Renda
        </button>
      </div>

      {/* ---------- Listagem ---------- */}
      {incomes.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhuma renda encontrada. Clique em “+ Nova Renda” para começar.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th>Descrição</th>
                <th>Valor (R$)</th>
                <th>Data</th>
                <th>Tipo</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {incomes.map((inc) => (
                <tr key={inc.id} className="hover:bg-gray-100">
                  <td>{inc.income_name}</td>
                  <td>{Number(inc.value).toFixed(2)}</td>
                  <td>{inc.income_date.slice(0, 10)}</td>
                  <td>{inc.type.type_name}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(inc);
                        setOpenModal(true);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteIncome(inc.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
