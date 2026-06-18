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
  title: "B.Tech CSE Graduate | Aspiring QA Engineer & Java Developer Portfolio",
  description: "Portfolio of a B.Tech CSE Graduate and Aspiring QA Engineer & Java Developer. Specialized in manual & automated testing, Selenium, Java development, and reliable software automation.",
  keywords: ['QA Engineer', 'Java Developer', 'Software Testing', 'Selenium Testing', 'B.Tech CSE Graduate', 'Java Internship', 'Manual Testing', 'Postman API Testing'],
  authors: [{ name: 'B.Tech CSE Graduate' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://abhigith-portfolio.web.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'B.Tech CSE Graduate | Aspiring QA Engineer & Java Developer Portfolio',
    description: 'Portfolio of a B.Tech CSE Graduate and Aspiring QA Engineer & Java Developer. Specialized in manual & automated testing, Selenium, Java development, and reliable software automation.',
    siteName: 'Professional QA & Java Developer Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.Tech CSE Graduate | Aspiring QA Engineer & Java Developer Portfolio',
    description: 'Portfolio of a B.Tech CSE Graduate and Aspiring QA Engineer & Java Developer. Specialized in manual & automated testing, Selenium, Java development, and reliable software automation.',
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "B.Tech CSE Graduate",
    "jobTitle": "Aspiring QA Engineer & Java Developer",
    "description": "Building reliable software through testing, automation and modern web technologies.",
    "knowsAbout": [
      "Software Testing",
      "Manual Testing",
      "Automation Testing",
      "Selenium",
      "Java",
      "Postman",
      "TestNG",
      "MySQL",
      "Git",
      "React",
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "B.Tech CSE College"
    }
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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

