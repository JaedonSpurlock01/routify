import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "routify",
  description: "A pathfinding visualizer that works with any city",
};

export const viewport = {
  width: "device-width",
  "initial-scale": "1.0",
  "maximum-scale": "1.0",
  "user-scalable": "no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#121212]">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
