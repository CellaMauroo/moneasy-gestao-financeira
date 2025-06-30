
"use client";

import Header from "../../components/header";
import Navbar from "../../components/navbar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";


type Material = {
    id: number;
    title: string;
    desc: string;
    tag: "Video" | "PDF";
    duration: string;
    skills: string;
    prereq: string;
    action: string;    
};

const mock: Material[] = [
    {
        id: 1,
        title: "Curso de Educação Financeira",
        desc: "Aprenda a organizar suas finanças, controlar gastos, planejar objetivos e investir com consciência. Um curso essencial para quem deseja conquistar estabilidade financeira e tomar decisões mais inteligentes com o dinheiro.",
        tag: "Video",
        duration: "40h",
        skills: "Contabilidade e Finanças",
        prereq: "Nenhum",
        action: "Curso",
    },
    {
        id: 2,
        title: "Curso de Lançamento de Despesas",
        desc: "Domine o registro e o controle de despesas de forma prática e eficiente. Este curso ensina como organizar os gastos do dia a dia, manter o equilíbrio financeiro e gerar relatórios claros para uma gestão mais consciente.",
        tag: "Video",
        duration: "20h",
        skills: "Contabilidade e Gestão Pessoal",
        prereq: "Nenhum",
        action: "Curso",
    },
    {
        id: 3,
        title: 'Artigo “O que é Gestão Financeira?”',
        desc: "Entenda os princípios da gestão financeira e sua importância para o sucesso pessoal. O artigo aborda conceitos-chave, práticas de controle e planejamento que ajudam a tomar decisões estratégicas sobre o uso do dinheiro.",
        tag: "PDF",
        duration: "Livre",
        skills: "Gestão Financeira e Finanças",
        prereq: "Leitura",
        action: "Artigo",
    },
];

export default function MaterialsPage() {
    return (
        <>
            <Header />

            <div className="flex min-h-screen">
                <Navbar active="materials" />

                <main className="flex-1 p-10 bg-gray-200 space-y-8 overflow-y-auto">
                    
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-lg">
                            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="w-full pl-10 pr-4 py-3 rounded-md shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-green-600"
                                disabled
                            />
                        </div>
                    </div>

                    
                    <section className="space-y-6">
                        {mock.map((m) => (
                            <article
                                key={m.id}
                                className="bg-white rounded-lg shadow flex flex-col lg:flex-row
             items-start lg:items-center gap-6 p-6"
                            >
                                {/* ícone */}
                                <div className="shrink-0 h-10 w-10 flex items-center justify-center
                  rounded-full border-2 border-green-600 text-green-600 font-bold">
                                    {m.tag === "Video" ? "▶" : "📄"}
                                </div>

                                
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-semibold text-lg text-green-800">{m.title}</h3>
                                    <p className="text-sm text-gray-700">{m.desc}</p>
                                </div>

                                
                                <div className="w-full lg:w-60 flex flex-col gap-3">
                                
                                    <ul className="space-y-0.5 text-xs text-gray-600">
                                        {[
                                            `Duração: ${m.duration}`,
                                            `Conhecimentos: ${m.skills}`,
                                            `Pré-requisitos: ${m.prereq}`,
                                        ].map((txt, i) => (
                                            <li
                                                key={i}
                                                className="relative pl-4 before:content-['-'] before:absolute before:left-0 whitespace-normal"
                                            >
                                                {txt}
                                            </li>

                                        ))}
                                    </ul>

                                    <div className="self-end">
                                        <button
                                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-4 rounded w-28"          
                                        >
                                            Acessar {m.action}
                                        </button>
                                    </div>
                                </div>
                            </article>

                        ))}
                    </section>
                </main>
            </div >
        </>
    );
}
