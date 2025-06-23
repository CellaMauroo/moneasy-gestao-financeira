"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/header"
import Navbar from "../../components/navbar"
import ForumCard from "../../components/forumCard"

export default function Forum() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  const [topics, setTopics] = useState([
    { title: "Como montar uma reserva de emergência com salário mínimo?", date: "11/05/25" },
    { title: "Tesouro Direto ainda vale a pena em 20025?", date: "01/05/25" },
    { title: "Qual melhor app para controlar gastos mensais?", date: "16/03/25" },
    { title: "Como economizar ganhando pouco?", date: "11/03/25" },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newTopicTitle, setNewTopicTitle] = useState("")

  useEffect(() => {
    const isLogged = localStorage.getItem("logged") === "true"
    if (!isLogged) {
      router.push("/login")
    } else {
      setIsChecking(false)
    }
  }, [])

  const handleCreateTopic = () => {
    if (newTopicTitle.trim()) {
      const now = new Date()
      const formattedDate = now.toLocaleDateString("pt-BR").replace(/\//g, "/").slice(0, 5) + "/" + now.getFullYear().toString().slice(2)
      setTopics([...topics, { title: newTopicTitle.trim(), date: formattedDate }])
      setNewTopicTitle("")
      setShowForm(false)
    }
  }

  if (isChecking) return null

  return (
    <div>
      <Header />
      <div className="flex">
        <Navbar active="forum"/>
        <main className="w-6/7 p-6 bg-gray-300 min-h-screen relative">

          {topics.map((topic, i) => (
            <ForumCard
              key={i}
              title={topic.title}
              date={topic.date}
              onClick={() => alert(`Abrir tópico: ${topic.title}`)}
            />
          ))}

          {/* Botão flutuante */}
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition"
          >
            + Novo Tópico
          </button>

          {/* Modal de novo tópico */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Novo Tópico</h2>
                <input
                  type="text"
                  placeholder="Título do tópico"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateTopic}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
