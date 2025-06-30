// components/Header.tsx
import Image from "next/image";

export default function Header() {
    return (
        <header className="h-[15vh] bg-green-800 text-white px-6 py-4 flex items-center justify-between">
            <h1 className="text-5xl font-bold">Moneasy</h1>
            <div className="flex items-center gap-2">
                <span className="text-xl">
                  Olá, <strong>João Silva</strong>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round"d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>

            </div>

        </header>
    );
}
