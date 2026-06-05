export const metadata = {
  title: '¿Cómo Comprar? — Medin Camisas',
  description: 'Aprende cómo hacer tu pedido en Medin Camisas, paso a paso.',
};

export default function ComoComprarPage() {
  return (
    <main className="min-h-screen bg-dark py-16 px-4">
      <div className="container mx-auto flex flex-col items-center gap-10">

        {/* Title */}
        <div className="text-center">
          <p className="text-accent uppercase tracking-widest text-sm font-semibold mb-3">
            Guía de compra
          </p>
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            ¿Cómo <span className="text-accent">Comprar?</span>
          </h1>
          <p className="mt-4 text-white/60 text-lg max-w-lg mx-auto">
            Sigue el tutorial y realiza tu pedido en minutos.
          </p>
        </div>

        {/* Video at natural size */}
        <video
          className="rounded-2xl shadow-2xl max-w-full"
          autoPlay
          loop
          controls
          preload="none"
        >
          <source src="/home/tutorial.mp4" type="video/mp4" />
        </video>

      </div>
    </main>
  );
}
