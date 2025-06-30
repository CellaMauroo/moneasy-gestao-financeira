"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient"; // Importe seu cliente Supabase

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Chama a função de signOut do Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Se der erro, mostra no console (pode ser um alerta mais amigável)
      console.error("Erro ao fazer logout:", error.message);
    } else {
      // Se o logout for bem-sucedido, redireciona o usuário.
      // Você pode redirecionar para a página de login ou para a home.
      // router.refresh() também é uma opção para atualizar o estado do servidor.
      router.push("/pages/login"); 
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
    >
      Sair
    </button>
  );
}