import Image from "next/image";
import { redirect } from "next/navigation"


export default function Home() {
    const isLoggedIn = false

    if (isLoggedIn) {
        redirect("/dashboard")
    } else {
        redirect("/login")
    }
}


