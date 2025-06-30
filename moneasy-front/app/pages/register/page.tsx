"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

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

    // Validações iniciais no front-end
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
      // ETAPA 1: Registrar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // Você pode passar dados extras aqui, que serão salvos em `raw_user_meta_data`
          data: {
            username: username,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Se o email de confirmação estiver ativo, authData.user pode ser nulo aqui.
      if (!authData.user) {
        setError(
          "Erro ao obter o usuário do Supabase. Verifique se o e-mail de confirmação está desativado ou lide com o fluxo de confirmação."
        );
        setLoading(false);
        return;
      }

      // ETAPA 2: Enviar os dados do perfil para o seu backend Django
      // Incluindo o ID do Supabase que acabamos de criar.
      const supabaseId = authData.user.id;

      const res = await fetch("http://127.0.0.1:8000/api/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supabase_id: supabaseId, // A CHAVE para linkar as tabelas
          cpf,
          birth_date: birthDate,
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          // NÃO ENVIAMOS MAIS A SENHA PARA O DJANGO!
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(
          `Seu usuário foi criado na autenticação, mas falhou ao criar o perfil: ${JSON.stringify(
            errorData
          )}. Por favor, contate o suporte.`
        );
        setLoading(false);
        return;
      }

      // Tudo correu bem!
      alert("Cadastro realizado com sucesso! Redirecionando para o login.");
      router.push("/pages/login");
    } catch (err) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
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
          </form>
        </div>
      </div>
    </div>
  );
}