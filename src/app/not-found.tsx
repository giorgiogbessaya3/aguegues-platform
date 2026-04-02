import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Page introuvable — Portail Numérique des Aguégués',
    description: 'Cette page n\'existe pas ou a été déplacée.',
}

export default function NotFound() {
    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-gray-50)',
            padding: '2rem 1rem',
        }}>
            <div style={{ textAlign: 'center', maxWidth: '480px' }}>
                {/* Numéro 404 stylisé */}
                <div style={{
                    fontSize: 'clamp(6rem, 20vw, 9rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '1rem',
                    userSelect: 'none',
                }}>
                    404
                </div>

                {/* Icône */}
                <div style={{
                    fontSize: '3.5rem',
                    marginBottom: '1.5rem',
                    lineHeight: 1,
                }}>
                    🗺️
                </div>

                <h1 style={{
                    fontSize: 'clamp(1.375rem, 4vw, 1.875rem)',
                    fontWeight: 900,
                    color: 'var(--color-gray-900)',
                    margin: '0 0 0.875rem',
                }}>
                    Page introuvable
                </h1>

                <p style={{
                    color: 'var(--color-gray-500)',
                    lineHeight: 1.75,
                    marginBottom: '2rem',
                    fontSize: '1rem',
                }}>
                    La page que vous cherchez n&apos;existe pas ou a été déplacée.
                    Vérifiez l&apos;URL ou retournez à l&apos;accueil.
                </p>

                <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/" className="btn btn-primary">
                        🏠 Retour à l&apos;accueil
                    </Link>
                    <Link href="/annuaire/cadres" className="btn btn-outline">
                        Consulter l&apos;annuaire
                    </Link>
                </div>

                {/* Liens rapides */}
                <div style={{
                    marginTop: '2.5rem',
                    padding: '1.25rem',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-card)',
                }}>
                    <p style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--color-gray-400)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.875rem',
                    }}>
                        Pages utiles
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                        {[
                            { href: '/actualites', label: '📰 Actualités' },
                            { href: '/projets', label: '💡 Projets' },
                            { href: '/doleances', label: '📢 Doléances' },
                            { href: '/inscription', label: '✍️ S\'inscrire' },
                        ].map(({ href, label }) => (
                            <Link key={href} href={href} style={{
                                padding: '0.375rem 0.875rem',
                                background: 'var(--color-gray-100)',
                                borderRadius: '999px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: 'var(--color-gray-600)',
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                            }}>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
