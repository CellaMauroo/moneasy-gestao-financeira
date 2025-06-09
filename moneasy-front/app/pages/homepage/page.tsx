import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="flex items-center gap-2">
          <h1 className="text-5xl text-[#255929]">Moneasy</h1>
        </div>
        <Link href="/pages/login">
          <button className="bg-[#29622E] text-white px-6 py-3 rounded-md text-lg hover:opacity-90">
            Entrar na conta
          </button>
        </Link>
      </header>

      <section className="bg-[#255929] text-white py-15 px-20 flex justify-around items-center">
        <div className="max-w-3xl pl-24">
        <h2 className="text-6xl leading-tight text-white">
        <span className="pl-8 block">Assuma o controle</span>
        <span className="block">da sua vida financeira</span>
        </h2>

        </div>

        <div>
          <Image
            src="/icons/porquinho.png"
            alt="Porquinho"
            width={380}
            height={380}
          />
        </div>
      </section>

      {/* Cards */}
      <section className="flex justify-center px-8 py-12">
        <div className="flex flex-wrap justify-center gap-16 max-w-[1300px]">

          {/* Card 1 */}
          <div className="bg-[#C4DDC6] rounded-2xl p-10 w-96 shadow-lg text-center">
            <Image
              src="/icons/icone_despesas.png"
              alt="Despesas"
              width={72}
              height={72}
              className="mx-auto"
            />
            <h3 className="text-2xl mt-6 text-[#255929]">Gerencie suas Despesas</h3>
            <p className="text-lg text-black mt-3 leading-relaxed">
              Registre e categorize facilmente suas despesas
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#C4DDC6] rounded-2xl p-10 w-96 shadow-lg text-center">
            <Image
              src="/icons/icone_renda.png"
              alt="Renda"
              width={90}
              height={72}
              className="mx-auto"
            />
            <h3 className="text-2xl mt-6 text-[#255929]">Acompanhe sua Renda</h3>
            <p className="text-lg text-black mt-3 leading-relaxed">
              Centralize todas as duas fontes de renda em um só lugar
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#C4DDC6] rounded-2xl p-10 w-96 shadow-lg text-center">
            <Image
              src="/icons/icone_apoio.png"
              alt="Material de Apoio"
              width={72}
              height={72}
              className="mx-auto"
            />
            <h3 className="text-2xl mt-6 text-[#255929]">Material de Apoio</h3>
            <p className="text-lg text-black mt-3 leading-relaxed">
              Acesso a conteúdos educacionais
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
