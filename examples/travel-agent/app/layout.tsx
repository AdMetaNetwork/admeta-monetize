import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roam — AdMeta Travel Agent Demo',
  description: 'A transparent sponsored-offer demo for an AI travel assistant.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
