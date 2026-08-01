import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MusicLocker | Music Library Insights",
  description: "Build a personal music library and explore its story.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%2320201e' stroke='%2320201e'/><circle cx='12' cy='12' r='7' stroke='rgba(255,255,255,0.18)' stroke-width='0.8'/><circle cx='12' cy='12' r='4.5' stroke='rgba(255,255,255,0.18)' stroke-width='0.8'/><circle cx='12' cy='12' r='2.5' fill='%23f6d58b'/><circle cx='12' cy='12' r='0.75' fill='%2320201e'/></svg>",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
