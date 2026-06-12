import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Portfolio | Developer",
  description: "A modern developer portfolio showcasing projects, skills, and experience.",
  keywords: ['developer', 'portfolio', 'web developer', 'software engineer'],
  authors: [{ name: 'Developer' }],
  openGraph: {
    type: 'website',
    title: 'Portfolio | Developer',
    description: 'A modern developer portfolio showcasing projects, skills, and experience.',
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Developer',
    description: 'A modern developer portfolio showcasing projects, skills, and experience.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ScrollProgress />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
