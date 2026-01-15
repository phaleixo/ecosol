import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import "./globals.css";
import "./globals-sw.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Detecta a URL base usando suas variáveis existentes
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  // Define a base para resolver imagens de redes sociais
  metadataBase: new URL(baseUrl),

  title: {
    default: "ECOSOL Autista | Economia Solidária e Empreendedorismo TEA",
    template: "%s | ECOSOL Autista",
  },
  description:
    "A maior plataforma de economia solidária para autistas. Cadastre seus serviços, venda produtos e fortaleça a independência financeira da comunidade neurodivergente.",
  keywords: [
    "neurodiversidade",
    "inclusão no mercado de trabalho",
    "TEA",
    "autismo",
    "empreendedorismo autista",
    "economia solidária",
    "serviços por autistas",
    "comunidade neurodivergente",
    "independência financeira autista",
    "market place inclusivo",
    "consultoria neurodiversa",
    "TDAH",
    "AH/SD",
  ],
  authors: [{ name: "ECOSOL Autista", url: "https://www.ecosolautista.com.br" }],
  creator: "ECOSOL Autista",
  publisher: "ECOSOL Autista",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ECOSOL Autista — Conectando Talentos Neurodivergentes",
    description:
      "Descubra produtos e serviços criados por autistas. Fortaleça a economia local e apoie a autonomia financeira da nossa comunidade.",
    url: "https://www.ecosolautista.com.br",
    siteName: "ECOSOL Autista",
    images: [
      {
        url: "/ecosol-meta.png",
        width: 1200,
        height: 630,
        alt: "Banner ECOSOL Autista - Economia Solidária",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ECOSOL Autista | Economia Solidária Neurodivergente",
    description:
      "Plataforma de negócios e serviços para autistas. Cadastre-se e conquiste sua independência financeira.",
    images: ["/ecosol-meta.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}