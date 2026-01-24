import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Shell from "@/components/ui/shell";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ExamProvider } from "@/contexts/ExamContext";
import { MenuProvider } from "@/contexts/MenuContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IITian Squad",
  description: "Your exam preparation companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get theme immediately
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var initialTheme = theme || (prefersDark ? 'dark' : 'light');
                  
                  // Apply theme to prevent flash
                  document.documentElement.className = document.documentElement.className.replace(/\\bdark\\b/g, '') + (initialTheme === 'dark' ? ' dark' : '');
                  document.documentElement.setAttribute('data-theme', initialTheme);
                  
                  // Also set color scheme
                  document.documentElement.style.colorScheme = initialTheme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ExamProvider>
              <MenuProvider>
                <Shell>{children}</Shell>
              </MenuProvider>
            </ExamProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
