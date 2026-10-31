import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Echo — AI Customer Support | Zolentix",
  description:
    "Intelligent customer support chatbot powered by your knowledge base. Built by Zolentix.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-echo-base">
        {children}
      </body>
    </html>
  );
}
