import type { Metadata, Viewport } from 'next';
import './globals.css';
import './desktop-perfect.css';
import './desktop-polish.css';
import './mobile-v2.css';
import './mobile-v2-final.css';
import './mobile-v2-hotfix.css';
import './hero-visuals.css';
import './template.css';
import DesktopPerfect from './desktop-perfect';
import MobileV2 from './mobile-v2';
import MobileV2FinalPolish from './mobile-v2-final';
import HeroVisualRotator from './hero-visuals';

export const metadata: Metadata = {
  title: 'Стоматология — шаблон TANEM',
  description: 'Шаблон стоматологической клиники. Данные клиники заполняются перед запуском.',
  robots: { index: false, follow: false },
  openGraph: { title: 'Стоматология — шаблон TANEM', description: 'Демонстрационный шаблон стоматологической клиники.', type: 'website', locale: 'ru_RU' },
  twitter: { card: 'summary', title: 'Стоматология — шаблон TANEM' },
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
