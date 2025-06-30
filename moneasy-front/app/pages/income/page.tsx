"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../../components/header";
import Navbar from "../../components/navbar";
import IncomeTable from "../../components/incomeTable";
import { IncomeProvider } from "../../contexts/incomeContext"; // ajuste o caminho se estiver diferente

export default function IncomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ✔️ verifica login
  useEffect(() => {
    const isLogged = localStorage.getItem("logged") === "true";
    if (!isLogged) {
      router.push("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) return null; // enquanto checa, não renderiza nada

  return (
    <div>
      <Header />

      <div className="flex">
        <Navbar active="money" />

        {/* conteúdo principal */}
        <main className="flex-1 p-6 bg-gray-300">

          <IncomeProvider>
            <IncomeTable />
          </IncomeProvider>
        </main>
      </div>
    </div>
  );
}
