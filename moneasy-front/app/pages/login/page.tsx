"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient";


export default function LoginPage() {
    
  
    
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
         e.preventDefault(); 

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,       
            password: password  
        });

        if (error) {
            alert("Erro no login: " + error.message);
        } else if (data.user) {
            alert("Login realizado com sucesso!");
            router.push("/pages/income");
        }

    }

    return (
        <div className="flex h-screen">
            <div className="w-[40%] bg-green-800 text-white flex flex-col justify-start items-start p-10">
                <h1 className="text-7xl font-bold mb-4">Moneasy</h1>
                <h2 className="text-5xl mt-36">Bem vindo!</h2>
                <h2 className="text-5xl mt-10">Cadastre-se agora</h2>
                <h2 className="text-5xl mt-10">facilite sua gestão.</h2>
            </div>

            <div className="flex-1 bg-gray-200 flex flex-col justify-center items-center p-10">
                <div className="w-[70%] h-[90%] bg-white rounded-md flex flex-col justify-center items-center shadow-md">
                    <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col">
                        <div className="flex justify-center">
                            <h1 className="text-3xl font-semibold mb-6 text-center justify-center text-green-700 pr-2">
                                Entre na sua conta!
                            </h1>
                        </div>
                        <label>E-mail</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="border rounded-md p-3 mb-4"
                        />
                        <label>Senha</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Senha"
                            className="border rounded-md p-3 mb-6"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition cursor-pointer"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
