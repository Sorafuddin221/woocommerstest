import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "./animations.css";
import { Providers } from "./providers"; // Import Providers
import CookieBanner from "@/components/CookieBanner";



async function getSettings() {
  try {
    const res = await fetch(new URL('/api/settings/theme', process.env.NEXT_PUBLIC_BACKEND_URL).toString());
    if (!res.ok) {
      console.error('Failed to fetch settings:', res.status, res.statusText);
      return null;
    }
    return res.json();
  } catch (error: any) {
    console.error('Error fetching settings for metadata:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: settings?.metaTitle || "My Affiliate App",
    description: settings?.metaDescription || "A powerful affiliate marketing platform.",
    icons: {
      icon: settings?.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      images: settings?.metaLogoUrl ? [settings.metaLogoUrl] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers> {/* Use Providers instead of SessionProvider */}
          {children}
        </Providers>
        <CookieBanner />
      </body>
    </html>
  );
}