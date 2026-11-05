import type { Metadata, Viewport } from "next";
import { SerwistProvider } from "@serwist/turbopack/react";
import { AppShell } from "./components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мои билеты",
  applicationName: "Мои билеты",
  description: "Мои билеты на электрички",
  appleWebApp: {
    capable: true,
    title: "Мои билеты",
    statusBarStyle: "default",
  },
  icons: { icon: "/images/icon-192.png", apple: "/images/icon-180.png" },
  formatDetection: { telephone: false, date: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2e3347",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>
        <SerwistProvider swUrl="/serwist/sw.js" disable={process.env.NODE_ENV !== "production"} reloadOnOnline={false}>
          <AppShell>{children}</AppShell>
        </SerwistProvider>
      </body>
    </html>
  );
}
