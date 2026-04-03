'use client'

import Link from 'next/link'
import { Globe, Mail, MapPin } from 'lucide-react'

const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'À Propos', href: '/a-propos' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'Doléances', href: '/doleances' },
    { label: 'Contact', href: '/contact' },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer style={{
            background: 'linear-gradient(180deg, #0d1f12 0%, #080e0a 100%)',
            color: '#6b7280',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '1.5rem clamp(1rem, 4vw, 2.5rem)',
        }}>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
            }}>
                {/* Logo + nom */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #1a5c2a, #1e3a5f)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Globe size={16} color="white" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white', whiteSpace: 'nowrap' }}>
                        Portail des Aguégués
                    </span>
                </Link>

                {/* Navigation rapide — masquée sur petit mobile */}
                <nav className="footer-nav" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {navLinks.map(({ label, href }) => (
                        <Link key={href} href={href} style={{
                            color: '#6b7280', fontSize: '0.8125rem', textDecoration: 'none',
                            transition: 'color 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#6ee7a0'}
                            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Contact rapide */}
                <div className="footer-contact" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href="mailto:contact@aguegues.bj" style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        color: '#6b7280', fontSize: '0.8125rem', textDecoration: 'none',
                        transition: 'color 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = '#6ee7a0'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                    >
                        <Mail size={13} />
                        contact@aguegues.bj
                    </a>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
                        <MapPin size={13} color="#6ee7a0" />
                        Aguégués, Bénin
                    </span>
                </div>
            </div>

            {/* Barre copyright */}
            <div style={{
                maxWidth: '1100px',
                margin: '1rem auto 0',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
            }}>
                <p style={{ fontSize: '0.75rem', color: '#374151', margin: 0 }}>
                    © {year} Portail Numérique des Aguégués — Mairie des Aguégués.
                </p>
                <p style={{ fontSize: '0.75rem', color: '#374151', margin: 0 }}>
                    🇧🇯 Bénin · Conforme APDP · Loi n°2009-09
                </p>
            </div>

            <style>{`
                /* Tablette (iPad ≤ 768px) : masquer contact */
                @media (max-width: 768px) {
                    .footer-contact {
                        display: none !important;
                    }
                }
                /* Mobile (≤ 480px) : masquer aussi la nav */
                @media (max-width: 480px) {
                    .footer-nav {
                        display: none !important;
                    }
                }
            `}</style>
        </footer>
    )
}
