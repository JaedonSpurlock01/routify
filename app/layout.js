import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "routify",
  description: "A city pathfinding visualizer with map queries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#121212]">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
