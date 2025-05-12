// app/login/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        // Simula login (depois usa signIn do NextAuth)
        if (email === "admin@example.com" && password === "123") {
            localStorage.setItem("logged", "true")
            router.push("/dashboard")
        } else {
            alert("Login inválido")
        }
    }

    return (
        <form onSubmit={handleLogin} className="flex flex-col items-center justify-center w-full p-5">
            <h1 className="text-5xl mb-5 font-semibold">Login</h1>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border rounded-md p-2 m-2  " />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Senha" className="border rounded-md p-2 m-2" />
            <button type="submit" className="border rounded-md bg-gray-200 p-2 hover:bg-gray-300 cursor-pointer">Entrar</button>
        </form>
    )
}
