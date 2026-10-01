import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "thai"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata = {
  title: "Luma Skin - Admin",
  description: "Product Management System for Luma Skin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className="antialiased bg-luma-light text-luma-text">
        {children}
      </body>
    </html>
  );
}
