import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import "animate.css";
import Navbar from "@/app/components/ui/menu/navbar";
import { getCategories } from "./services/categories";
import Footer from "./components/ui/footer/footer";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import WhatsAppFloat from "./components/home/whatsapp/whatsappFloat";
import { AuthProvider } from "./context/AuthContext";


/* Utendo */
const utendo = localFont({
  src: [
    {
      path: "../public/fonts/Utendo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Utendo-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-utendo",
  display: "swap",
});

/* Okine */
const okine = localFont({
  src: "../public/fonts/Okine-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-okine",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medin Camisas",
  description: "Colecciones para hombre con fit moderno y precios competitivos. Compra al detal o surte tu negocio con la mejor calidad.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  return (
    <html lang="en" className={`${utendo.variable} ${okine.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <NuqsAdapter>
            <Suspense fallback={<div className="h-20 bg-dark" />}>
              <Navbar categories={categories} />
            </Suspense>
            <main className="w-full">
              {children}
            </main>
            <Footer styles="w-full h-full bg-beige" />
          </NuqsAdapter>

          
          <WhatsAppFloat 
            phoneNumber="+573115327297" 
            message="¡Hola! Me interesa obtener más información sobre sus servicios. ¿Podrían ayudarme?" 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
