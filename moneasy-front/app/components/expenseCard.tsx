"use client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useUser } from "../contexts/UserContext";

export interface Item {
  desc: string;
  value: number;
}

interface Props {
  reference: string;       // “Jun/2025”
  items: Item[];
  onDelete: () => void;
  onEdit: () => void;
}

export default function ExpenseCard({
  reference,
  items,
  onDelete,
  onEdit,
}: Props) {
  const { name, role } = useUser();
  const total = items.reduce((sum, i) => sum + i.value, 0);

  return (
    <article className="bg-white rounded-lg shadow p-6">
      {/* cabeçalho */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            title="Editar"
            className="h-9 w-9 rounded-full border flex items-center justify-center
                       bg-gray-200 hover:bg-gray-300 transition"
          >
            <PencilIcon className="h-5 w-5 text-green-800" />
          </button>

          <div>
            <p className="font-semibold leading-tight">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>

        {/* referência (mês/ano) */}
        <span className="font-medium text-gray-700">
          Ref.&nbsp;{reference}
        </span>
      </div>

      {/* itens */}
      <ul className="space-y-0.5 mb-4">
        {items.map((it, idx) => (
          <li key={idx} className="flex justify-between text-sm text-red-700">
            <span>— {it.desc}</span>
            <span>R${it.value.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {/* rodapé */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-red-700">
          = R${total.toFixed(2)}
        </span>

        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-4 py-2 rounded bg-red-600
                     hover:bg-red-700 text-white text-sm"
        >
          <TrashIcon className="h-4 w-4" />
          Excluir
        </button>
      </div>
    </article>
  );
}
