import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'MedInfo — Encyclopedie Medicale',
    template: '%s | MedInfo',
  },
  description:
    'Plateforme d\'information medicale fiable. Consultez les fiches detaillees sur les maladies, symptomes, diagnostics et traitements.',
  keywords: ['sante', 'maladies', 'symptomes', 'medecine', 'encyclopedie medicale', 'diagnostic', 'traitement'],
  authors: [{ name: 'MedInfo' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'MedInfo',
    title: 'MedInfo — Encyclopedie Medicale',
    description:
      'Plateforme d\'information medicale fiable. Consultez les fiches detaillees sur les maladies, symptomes, diagnostics et traitements.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <MedicalDisclaimer />
        <Footer />
      </body>
    </html>
  );
}
