import type { Metadata, Viewport } from 'next';
import { clinic } from './clinic-data';
import './globals.css';
import './desktop-perfect.css';
import './desktop-polish.css';
import './mobile-v2.css';
import './mobile-v2-final.css';
import './hero-visuals.css';
import './clinic-adjustments.css';

export const metadata: Metadata = {
  metadataBase: new URL(clinic.siteUrl),
  title: clinic.name + ' — стоматология в Северном Бутове, Москва',
  description: 'Стоматологическая клиника «Медиком-М»: лечение зубов, гигиена, протезирование и имплантация. Москва, бульвар Дмитрия Донского, 13. Телефон ' + clinic.phone + '.',
  alternates: { canonical: clinic.siteUrl },
  robots: { index: true, follow: true },
  openGraph: {
    title: clinic.name + ' — стоматологическая клиника',
    description: clinic.fullAddress + ' · ' + clinic.hours,
    url: clinic.siteUrl, type: 'website', locale: 'ru_RU',
    images: [{ url: clinic.siteUrl + 'assets/dental-care.webp', width: 1536, height: 1024, alt: 'Стоматологическая иллюстрация' }],
  },
  twitter: { card: 'summary_large_image', title: clinic.name + ' — стоматология в Москве', description: clinic.fullAddress, images: [clinic.siteUrl + 'assets/dental-care.webp'] },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#f4f7f9', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { '@context': 'https://schema.org', '@type': 'Dentist', name: clinic.name, url: clinic.siteUrl, telephone: clinic.phone, email: clinic.email,
    address: { '@type': 'PostalAddress', streetAddress: clinic.address, addressLocality: clinic.city, addressCountry: 'RU' },
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '10:00', closes: '21:00' },
  };
  return <html lang="ru" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} /></head><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} /></body></html>;
}
