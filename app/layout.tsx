import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "animate.css";
import Navbar from "@/app/components/ui/menu/navbar";
import { getCategories } from "./services/categories";
import Footer from "./components/ui/footer/footer";


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
        <Navbar categories={categories} />
        <main className="w-full">{children}</main>
        <Footer styles="w-full h-full bg-accent" />
      </body>
    </html>
  );
}
