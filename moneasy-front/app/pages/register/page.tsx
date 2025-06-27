"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  // Estados para todos os campos obrigatórios
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!cpf || !birthDate || !firstName || !lastName || !username || !email || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf,
          birth_date: birthDate,
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(JSON.stringify(data));
        setLoading(false);
        return;
      }

      router.push("/pages/login");
    } catch (err) {
      setError("Erro ao se registrar. Tente novamente.");
      setLoading(false);
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
        <div className="w-[70%] h-auto bg-white rounded-md flex flex-col justify-center items-center shadow-md">
          <form onSubmit={handleRegister} className="w-full max-w-md flex flex-col p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center text-green-700">
              Crie sua conta
            </h1>

            <label>CPF</label>
            <input
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="CPF (somente números)"
              maxLength={11}
              className="border rounded-md p-3 mb-4"
              required
            />

            <label>Data de nascimento</label>
            <input
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              type="date"
              className="border rounded-md p-3 mb-4"
              required
            />

            <label>Nome</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Primeiro nome"
              className="border rounded-md p-3 mb-4"
              required
            />

            <label>Sobrenome</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Sobrenome"
              className="border rounded-md p-3 mb-4"
              required
            />

            <label>Usuário</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuário"
              className="border rounded-md p-3 mb-4"
              required
            />

            <label>E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="border rounded-md p-3 mb-4"
              required
            />

            <label>Senha</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Senha"
              className="border rounded-md p-3 mb-4"
              required
              minLength={6}
            />

            <label>Confirme sua senha</label>
            <input
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              type="password"
              placeholder="Confirme a senha"
              className="border rounded-md p-3 mb-6"
              required
              minLength={6}
            />

            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition cursor-pointer"
            >
              {loading ? "Registrando..." : "Confirmar Cadastro"}
            </button>

            <div className="justify-center items-center flex mt-5">
              <label>Já possui uma conta?</label>
              <a
                className="pl-2 text-green-800 underline cursor-pointer"
                href="../pages/login"
              >
                Entrar
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
