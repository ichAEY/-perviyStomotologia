import type { Metadata, Viewport } from 'next';
import './globals.css';
import './desktop-perfect.css';
import './desktop-polish.css';
import './mobile-redesign.css';
import './mobile-v2.css';
import './mobile-v2-final.css';
import './mobile-v2-hotfix.css';
import './hero-visuals.css';
import DesktopPerfect from './desktop-perfect';
import MobileV2 from './mobile-v2';
import MobileV2FinalPolish from './mobile-v2-final';
import HeroVisualRotator from './hero-visuals';

export const metadata: Metadata = {
  metadataBase: new URL('https://ichaey.github.io/-dm_rihalsky/'),
  title: 'Дмитрий Рихальский — физическая реабилитация',
  description: '13+ лет практики. Физическая реабилитация очно в Севастополе и онлайн. Консультация 60 минут — 5 000 ₽.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Дмитрий Рихальский — физическая реабилитация',
    description: 'Вернуться к движению. Севастополь · онлайн.',
    type: 'website',
    locale: 'ru_RU',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Дмитрий Рихальский — физическая реабилитация',
    description: '13+ лет практики. Очно в Севастополе и онлайн.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f4f7f9',
  colorScheme: 'light',
};

const enhancementScript = `document.documentElement.classList.add('js');`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head><script dangerouslySetInnerHTML={{ __html: enhancementScript }} /></head>
      <body>
        {children}
        <DesktopPerfect />
        <MobileV2 />
        <HeroVisualRotator />
        <MobileV2FinalPolish />
      </body>
    </html>
  );
}
