import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { getCategories } from "./services/categories";
import { getDiscountRules } from "./services/discount-rules";
import { getOrderRules } from "./services/order-rules";
import { getSession } from "./lib/session";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AuthProvider } from "./useContext/AuthContext";
import { DiscountRuleProvider } from "./useContext/DiscountRuleContext";
import { OrderRulesProvider } from "./useContext/OrderRulesContext";
import { Footer, WhatsAppFloat, Navbar } from "./components";


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
  const [categories, discountRules, orderRules, session] = await Promise.all([
    getCategories(),
    getDiscountRules(),
    getOrderRules(),
    getSession(),
  ]);

  return (
    <html lang="en" className={`${utendo.variable} ${okine.variable}`}>
      <body className="antialiased">
        <AuthProvider initialSession={{ isAuthenticated: session.isAuthenticated, user: session.user }}>
          <DiscountRuleProvider initialRules={discountRules}>
            <OrderRulesProvider initialRules={orderRules}>
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
                phoneNumber="+573024197103"
                message="¡Hola! Me interesa comprar al por mayor"
              />
            </OrderRulesProvider>
          </DiscountRuleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
