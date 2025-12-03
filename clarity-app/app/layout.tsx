import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Clarity: Adaptive Learning for Students with ADHD",
  description:
    "Personalized learning for high-school students with ADHD. Clarity adapts explanations in real time using AI to improve understanding. Designed for focus, clarity, and engagement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        <body className={`${inter.className} antialiased`}>{children}</body>
        <Toaster />
      </ThemeProvider>
    </html>
  );
}
