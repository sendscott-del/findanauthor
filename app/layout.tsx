import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Writers for Readers — Author visits for every classroom",
  description: "Connect your school with a children's book author. Free matching service for teachers, librarians, and educators.",
  openGraph: {
    title: "Writers for Readers",
    description: "Author visits for every classroom.",
    url: "https://findanauthor.org",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
