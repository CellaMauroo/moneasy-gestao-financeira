'use client';
import { useEffect, useState } from 'react';
import { useIncome } from '../contexts/incomeContext';
import { Income, IncomeType } from '../types';

interface Props {
  editIncome?: Income | null;
  onDone?: () => void;
}

export default function IncomeForm({ editIncome, onDone }: Props) {
  const { addIncome, updateIncome } = useIncome();

  const [types, setTypes] = useState<IncomeType[]>([]);
  const [income_name, setName] = useState(editIncome?.income_name ?? '');
  const [value, setValue] = useState(editIncome?.value ?? '');
  const [income_date, setDate] = useState(
    editIncome?.income_date.slice(0, 10) ?? ''
  );
  const [typeId, setTypeId] = useState<number>(editIncome?.type.id ?? 0);

  useEffect(() => {
    fetch('/api/income-type/')
      .then((r) => r.json())
      .then(setTypes)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { income_name, value, income_date, typeId };

    if (editIncome) {
      await updateIncome(editIncome.id, payload);
    } else {
      await addIncome(payload);
    }

    if (onDone) onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        required
        placeholder="Descrição da renda"
        className="input w-full"
        value={income_name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        required
        type="number"
        min="0"
        step="0.01"
        placeholder="Valor"
        className="input w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <input
        required
        type="date"
        className="input w-full"
        value={income_date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        required
        className="input w-full"
        value={typeId}
        onChange={(e) => setTypeId(Number(e.target.value))}
      >
        <option value="0" disabled>
          Selecione o tipo
        </option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.type_name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md"
      >
        {editIncome ? 'Atualizar' : 'Adicionar'} Renda
      </button>
    </form>
  );
}
