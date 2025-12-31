import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LazorKit - Gasless Solana Starter Templates',
  description: 'Production-ready templates for USDC checkout and subscriptions on Solana. Passkey auth, no seed phrases, gasless for users.',
  openGraph: {
    title: 'LazorKit - Gasless Solana Starter Templates',
    description: 'Production-ready templates for USDC checkout and subscriptions on Solana. Passkey auth, no seed phrases, gasless for users.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LazorKit - Gasless Solana Starter Templates',
    description: 'Production-ready templates for USDC checkout and subscriptions on Solana. Passkey auth, no seed phrases, gasless for users.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-display bg-zinc-950 text-zinc-50 min-h-screen flex flex-col overflow-x-hidden antialiased`}>
        {children}
      </body>
    </html>
  );
}
