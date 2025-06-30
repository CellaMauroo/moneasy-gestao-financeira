"use client";
import { FC } from "react";

interface ForumCardProps {
  title: string;
  date: string;          // ISO
  onClick?: () => void;
}

const ForumCard: FC<ForumCardProps> = ({ title, date, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white flex justify-between items-start mb-4 rounded
               shadow-sm cursor-pointer hover:bg-gray-100 transition h-[100px]"
  >
    <div className="border-l-8 border-green-600 pl-4 h-full">
      <h2 className="font-bold text-black mt-5">{title}</h2>
      <p className="text-sm text-gray-500">Acessar fórum…</p>
    </div>
    <span className="text-sm text-gray-500 p-10">
      {new Date(date).toLocaleDateString("pt-BR")}
    </span>
  </div>
);

export default ForumCard;
