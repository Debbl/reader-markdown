import type { Metadata } from "next";
import "../styles/globals.css";
import "highlight.js/styles/github.min.css";

export const metadata: Metadata = {
  title: "Reader Markdown",
  description: "read markdown file by web",
  icons: "/favicon.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body>{children}</body>
    </html>
  );
}
