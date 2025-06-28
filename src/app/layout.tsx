import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageTransitionProvider } from "@/components/providers";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "Artistly",
  description: "Find the perfect artist for your next event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased"
        )}
      >
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <div className="relative flex min-h-screen flex-col">
              <Header />
                <main className="flex-1">
                  <PageTransitionProvider>
                    {children}
                  </PageTransitionProvider>
                </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
