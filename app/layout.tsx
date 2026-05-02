import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import "./globals.css";
import "./globals-sw.css";
import RegisterSW from "@/components/register-sw";
import PWAInstall from "@/components/pwa-install";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Detecta a URL base usando suas variáveis existentes
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

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
  authors: [
    { name: "ECOSOL Autista", url: "https://www.ecosolautista.com.br" },
  ],
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
      <head>
        <link id="site-manifest" rel="manifest" href="/manifest-light.json" />
        <meta name="theme-color" data-dynamic />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fafafa"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0b1220"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  function rgbToHex(rgb){
    var m = rgb && rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if(!m) return null;
    return '#'+[1,2,3].map(function(i){return parseInt(m[i]).toString(16).padStart(2,'0')}).join('');
  }
  function updateThemeColor(){
    try{
      var el = document.createElement('div');
      el.style.color = 'hsl(var(--background))';
      el.style.display = 'none';
      document.documentElement.appendChild(el);
      var rgb = getComputedStyle(el).color;
      document.documentElement.removeChild(el);
      var hex = rgbToHex(rgb) || '#ffffff';
      var meta = document.querySelector('meta[name="theme-color"][data-dynamic]');
      if(!meta){ meta = document.createElement('meta'); meta.setAttribute('name','theme-color'); meta.setAttribute('data-dynamic','true'); document.head.appendChild(meta); }
      meta.setAttribute('content', hex);
    }catch(e){/* ignore */}
  }
  updateThemeColor();
  new MutationObserver(function(mutations){
    for(var i=0;i<mutations.length;i++){
      var m = mutations[i];
      if(m.type==='attributes' && m.attributeName==='class'){
        updateThemeColor();
        break;
      }
    }
  }).observe(document.documentElement, { attributes: true });
})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try{
    var link = document.getElementById('site-manifest');
    if(!link) return;
    var setManifest = function(prefersDark){
      link.setAttribute('href', prefersDark ? '/manifest-dark.json' : '/manifest-light.json');
    };
    var mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if(mql){
      setManifest(mql.matches);
      mql.addEventListener ? mql.addEventListener('change', function(e){ setManifest(e.matches); }) : mql.addListener(function(e){ setManifest(e.matches); });
    } else {
      setManifest(false);
    }
  }catch(e){}
})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <RegisterSW />
        <PWAInstall />
      </body>
    </html>
  );
}