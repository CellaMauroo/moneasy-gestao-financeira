"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/header"
import Navbar from "../../components/navbar"

type ExpenseGroup = {
  id: number
  name: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [expenseGroups, setExpenseGroups] = useState<ExpenseGroup[]>([])

  useEffect(() => {
    const isLogged = localStorage.getItem("logged") === "true"
    if (!isLogged) {
      router.push("/login")
    } else {
      setIsChecking(false)
      fetchExpenseGroups()
    }
  }, [])

  const fetchExpenseGroups = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/expense-group/")
      if (!res.ok) throw new Error("Erro ao buscar dados")
      const data = await res.json()
      setExpenseGroups(data)
    } catch (error) {
      console.error(error)
    }
  }

  if (isChecking) return null

  return (
    <div>
      <Header />
      <div className="flex">
        <Navbar />
        <main className="w-6/7 p-6 bg-gray-300">
          <h1 className="text-4xl font-bold mb-6">Expense Groups</h1>
          <ul className="space-y-2">
            {expenseGroups.map((group) => (
              <li key={group.id} className="bg-white p-4 rounded shadow">
                {group.name}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  )
}
