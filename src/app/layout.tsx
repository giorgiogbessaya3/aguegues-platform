import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Portail Numérique des Aguégués — Annuaire · Doléances · Projets',
    template: '%s | Portail Numérique des Aguégués'
  },
  description: 'Portail officiel de la commune des Aguégués (Bénin). Recensement des cadres et jeunes talents, dépôt de doléances citoyennes, soutien aux projets de développement local.',
  keywords: ['Aguégués', 'Portail Numérique', 'Bénin', 'annuaire', 'cadres', 'jeunes talents', 'recensement', 'commune', 'doléances', 'projets communaux'],
  authors: [{ name: 'Mairie des Aguégués' }],
  openGraph: {
    title: 'Portail Numérique des Aguégués',
    description: 'Portail officiel de recensement, doléances et projets de développement de la commune des Aguégués, Bénin.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Portail Numérique des Aguégués',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portail Numérique des Aguégués',
    description: 'Portail officiel de recensement, doléances et projets de développement de la commune des Aguégués, Bénin.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Portail Aguégués',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a6b3c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
