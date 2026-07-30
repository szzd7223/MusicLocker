import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Record Room | Music Library Insights",
  description: "Build a personal music library and explore its story.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
