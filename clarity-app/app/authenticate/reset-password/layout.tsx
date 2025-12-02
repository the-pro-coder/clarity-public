import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clarity - Reset Password",
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
      <body className={`${inter.className} antialiased`}>{children}</body>
      <Toaster />
    </html>
  );
}
