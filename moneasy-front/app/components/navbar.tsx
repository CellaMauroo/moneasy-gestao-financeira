import Image from "next/image"

interface NavbarProps {
  active?: "money" | "calc" | "school" | "forum"
}

export default function Navbar({ active }: NavbarProps) {
  function navLinkClasses(item: string, current: string | undefined) {
    const isActive = item === current
    return `hover:underline ml-2 self-center font-bold ${
      isActive ? "text-green-500" : "text-green-800"
    }`
  }

  function getIcon(name: string, current?: string) {
    const isActive = name === current
    return `/icons/${name}${isActive ? "-active" : ""}.svg`
  }

  return (
    <aside className="bg-white text-white w-1/7 h-screen p-6 flex flex-col gap-6">
      <nav className="flex flex-col align-center justify-center px-5 py-5 gap-y-14 text-2xl font-bold">
        <div className="flex">
          <Image src={getIcon("panel", active)} alt="Panel" width={40} height={40} />
          <a href="/pages/panel" className={navLinkClasses("panel", active)}>Painel Geral</a>
        </div>
        <div className="flex">
          <Image src={getIcon("money", active)} alt="Renda" width={40} height={40} />
          <a href="/pages/income" className={navLinkClasses("money", active)}>Renda</a>
        </div>
        <div className="flex">
          <Image src={getIcon("calc", active)} alt="Despesas" width={40} height={40} />
          <a href="/pages/expenses" className={navLinkClasses("calc", active)}>Despesas</a>
        </div>
        <div className="flex">
          <Image src={getIcon("school", active)} alt="Materiais" width={40} height={40} />
          <a href="/pages/materials" className={navLinkClasses("school", active)}>Materiais</a>
        </div>
        <div className="flex">
          <Image src={getIcon("forum", active)} alt="Fórum" width={40} height={40} />
          <a href="/pages/forum" className={navLinkClasses("forum", active)}>Fórum</a>
        </div>
      </nav>
    </aside>
  )
}
