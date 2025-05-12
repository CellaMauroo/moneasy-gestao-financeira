"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const router = useRouter()

    useEffect(() => {
        const isLogged = localStorage.getItem("logged") === "true"
        if (!isLogged) {
            router.push("/login")
        }
    }, [])

    return (
        <div>
            <h1 className="text-7xl font-bold">Dashboard</h1>
        </div>
    )
}
