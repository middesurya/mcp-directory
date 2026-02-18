import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MCP Directory - Discover Model Context Protocol Servers",
    template: "%s | MCP Directory",
  },
  description:
    "The definitive directory for discovering MCP (Model Context Protocol) servers. Browse 180+ servers across 22 categories for your AI workflows.",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "MCP servers",
    "AI tools",
    "Claude",
    "LLM tools",
    "MCP clients",
    "Claude Desktop",
    "Cursor",
    "AI integrations",
  ],
  metadataBase: new URL("https://mcp-directory-pi.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mcp-directory-pi.vercel.app",
    siteName: "MCP Directory",
    title: "MCP Directory - Discover Model Context Protocol Servers",
    description:
      "The definitive directory for discovering MCP (Model Context Protocol) servers. Browse 180+ servers across 22 categories for your AI workflows.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MCP Directory - Discover Model Context Protocol Servers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Directory - Discover Model Context Protocol Servers",
    description:
      "The definitive directory for discovering MCP (Model Context Protocol) servers. Browse 180+ servers across 22 categories for your AI workflows.",
    images: ["/og-image.png"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
