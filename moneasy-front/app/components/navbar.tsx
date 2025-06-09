// components/Navbar.tsx
import Image from "next/image";

export default function Navbar() {
    return (
        <aside className="bg-whitetext-white w-1/7 h-screen p-6 flex flex-col gap-6">
            <nav className="flex flex-col align-center justify-center px-5 py-5 gap-y-14 text-2xl font-bold">
                <div className="flex">
                    <Image
                        src="/icons/money.svg"
                        alt="Porquinho"
                        width={40}
                        height={40}
                    />
                    <a href="/income" className="hover:underline text-green-800 ml-2 self-center">Renda</a>
                </div>
                <div className="flex">
                    <Image
                        src="/icons/calc.svg"
                        alt="Porquinho"
                        width={40}
                        height={40}
                    />
                    <a href="/expenses" className="hover:underline text-green-800 ml-2 self-center">Despesas</a>
                </div>
                <div className="flex">
                    <Image
                        src="/icons/school.svg"
                        alt="Porquinho"
                        width={40}
                        height={40}
                    />
                    <a href="/materials" className="hover:underline text-green-800 ml-2 self-center">Materiais</a>
                </div>
                <div className="flex">
                    <Image
                        src="/icons/forum.svg"
                        alt="Porquinho"
                        width={40}
                        height={40}
                    />
                    <a href="/forum" className="hover:underline text-green-800 ml-2 self-center">Fórum</a>
                </div>

            </nav>
        </aside>
    )
}
