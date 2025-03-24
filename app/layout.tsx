import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/ui/Header"; // Import the Header component
import Footer from "../components/ui/Footer"; // Import the Header component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech Blog", // Update the title
  description:
    "Insights and articles about AI, Data Science, and Machine Learning", // Update the description
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header /> {/* Pass the style prop */}
        <main style={{ paddingTop: "var(--header-height)" }}>
          {children}
        </main>{" "}
        <Footer />
      </body>
    </html>
  );
}
