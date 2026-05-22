import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redline — Every Car Has a Story",
  description:
    "The car encyclopedia for enthusiasts. Browse JDM legends, supercars, and classics. Specs, history, variants — all in one app.",
  openGraph: {
    title: "Redline — Every Car Has a Story",
    description:
      "The car encyclopedia for JDM, supercar, and classic car enthusiasts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {/* Film grain overlay */}
        <div className="film-grain" />
        {children}
      </body>
    </html>
  );
}