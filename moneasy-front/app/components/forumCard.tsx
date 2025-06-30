import { FC } from "react";

interface Props {
  title: string;
  date : string;
  author: string;             
  onClick?: () => void;
}

const ForumCard: FC<Props> = ({ title, date, author, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white flex justify-between items-start mb-4 rounded
               shadow-sm cursor-pointer hover:bg-gray-100 transition h-[110px]"
  >
    <div className="border-l-8 border-green-600 pl-4 h-full w-full">
      <h2 className="font-bold text-black mt-4">{title}</h2>
      <p className="text-sm text-gray-500">por {author}</p>
      <p className="text-xs text-gray-400">
        {new Date(date).toLocaleDateString("pt-BR")}
      </p>
    </div>
  </div>
);

export default ForumCard;
