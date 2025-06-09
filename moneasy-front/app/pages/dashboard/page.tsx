"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/header"
import Navbar from "../../components/navbar"


export default function DashboardPage() {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const isLogged = localStorage.getItem("logged") === "true"
        if (!isLogged) {
            router.push("/login")
        } else {
            setIsChecking(false)
        }
    }, [])

    if (isChecking) return null

    return (
        <div>
            <Header/>
            <div className="flex">

            <Navbar/>
            <main className="w-6/7 p-6 bg-gray-300">
                <h1 className="text-4xl font-bold">Dashboard</h1>
            </main>
            </div>

        </div>
    )
}
