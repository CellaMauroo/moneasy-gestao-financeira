"use client";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function NewExpenseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-gray-200/70 border rounded-lg
                 px-6 py-4 text-lg text-gray-700 hover:bg-gray-300 transition"
    >
      <PlusCircleIcon className="h-7 w-7 text-gray-500" />
      Informar nova despesa…
    </button>
  );
}
