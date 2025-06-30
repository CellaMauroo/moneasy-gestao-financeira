'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Income } from '../types'; // ajuste o caminho se necessário

/** ----------------------------------------------------------------
 *  Tipagem
 *  ---------------------------------------------------------------- */
type IncomePayload = Omit<Income, 'id' | 'type' | 'user'> & {
  /** ID do IncomeType enviado pelo select do formulário */
  typeId: number;
};

interface IncomeContextValue {
  incomes: Income[];
  loading: boolean;
  error: string | null;

  /** Recarrega a lista manualmente */
  reload: () => Promise<void>;

  /** CRUD */
  addIncome: (data: IncomePayload) => Promise<void>;
  updateIncome: (id: number, data: IncomePayload) => Promise<void>;
  deleteIncome: (id: number) => Promise<void>;
}

/** ----------------------------------------------------------------
 *  Context + hook
 *  ---------------------------------------------------------------- */
const IncomeContext = createContext<IncomeContextValue | undefined>(
  undefined
);

export const useIncome = () => {
  const ctx = useContext(IncomeContext);
  if (!ctx)
    throw new Error('useIncome precisa estar dentro de <IncomeProvider>');
  return ctx;
};

/** ----------------------------------------------------------------
 *  Provider
 *  ---------------------------------------------------------------- */
export function IncomeProvider({ children }: { children: ReactNode }) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** GET /api/income/ ------------------------------------------------ */
  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/income/');
      if (!res.ok) throw new Error(await res.text());
      const data: Income[] = await res.json();
      setIncomes(data);
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar rendas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** POST /api/income/ ----------------------------------------------- */
  const addIncome = async (data: IncomePayload) => {
    const res = await fetch('/api/income/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    const created: Income = await res.json();
    setIncomes((prev) => [...prev, created]);
  };

  /** PUT /api/income/:id/ -------------------------------------------- */
  const updateIncome = async (id: number, data: IncomePayload) => {
    const res = await fetch(`/api/income/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    // Recarrega para manter em sincronia
    await reload();
  };

  /** DELETE /api/income/:id/ ----------------------------------------- */
  const deleteIncome = async (id: number) => {
    const res = await fetch(`/api/income/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    setIncomes((prev) => prev.filter((inc) => inc.id !== id));
  };

  /** Carrega na montagem */
  useEffect(() => {
    reload();
  }, []);

  const value: IncomeContextValue = {
    incomes,
    loading,
    error,
    reload,
    addIncome,
    updateIncome,
    deleteIncome,
  };

  return (
    <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>
  );
}
