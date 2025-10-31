import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Embraflex Store",
  description: "Loja Embraflex com WooCommerce",
}

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo à Embraflex</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Produtos em Destaque</h2>
          <p>Em breve nossos produtos aparecerão aqui!</p>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Novidades</h2>
          <p>Confira as últimas novidades da Embraflex</p>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Sobre Nós</h2>
          <p>Saiba mais sobre a Embraflex</p>
        </div>
      </div>
    </div>
  )
}