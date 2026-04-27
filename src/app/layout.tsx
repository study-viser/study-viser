import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Study Viser",
  description: "A study management platform for students, instructors, and TAs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="d-flex flex-column min-vh-100" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-grow-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
