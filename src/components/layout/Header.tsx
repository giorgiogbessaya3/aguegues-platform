'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Menu, X, LogIn, UserPlus, ChevronRight,
    Landmark, BookOpen, ClipboardList, Newspaper, GraduationCap, Lightbulb, Mail,
    type LucideIcon,
} from 'lucide-react'

// ─── Palette #354E54 ────────────────────────────────────────────
const C = {
    bg:         '#354E54',       // fond sidebar
    bgDark:     '#253b40',       // fond plus foncé (header logo)
    hover:      '#2d4449',       // hover item
    active:     '#1f3238',       // item actif fond
    border:     'rgba(255,255,255,0.08)',
    text:       '#c8dede',       // texte normal
    textMuted:  '#7ea8a8',       // texte secondaire
    accent:     '#7ec8c8',       // teal clair — accent actif
    accentGlow: 'rgba(126,200,200,0.18)',
    white:      '#ffffff',
}

const navLinks: { label: string; href: string; icon: LucideIcon }[] = [

    { label: 'Présentation', href: '/a-propos', icon: BookOpen },
    { label: 'Mot du Maire', href: '/mot-du-maire', icon: Landmark },
    { label: 'Actualités', href: '/actualites', icon: Newspaper },
    { label: 'Doléances', href: '/doleances', icon: ClipboardList },
    { label: 'Projets à Soutenir', href: '/projets', icon: Lightbulb },
    { label: 'Espace Cadres', href: '/espace-cadres', icon: GraduationCap },
    { label: 'Contact', href: '/contact', icon: Mail },
]

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* ═══════════════════════════════════════
                SIDEBAR DESKTOP (fixée à gauche)
            ═══════════════════════════════════════ */}
            <aside className="sidebar-desktop" style={{
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                width: '240px',
                background: C.bg,
                borderRight: `1px solid ${C.border}`,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50,
                boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
                overflowY: 'auto',
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1.375rem 1rem 1.125rem',
                    borderBottom: `1px solid ${C.border}`,
                    background: '#ffffff',
                    textDecoration: 'none',
                    flexShrink: 0,
                }}>
                    <img
                        src="/logo.png"
                        alt="Portail officiel des Aguégués"
                        style={{ width: '120px', height: 'auto', objectFit: 'contain', display: 'block' }}
                    />
                </Link>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '0.875rem 0.75rem' }}>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-item${isActive ? ' nav-item--active' : ''}`}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.65rem 0.875rem',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    marginBottom: '2px',
                                    fontWeight: isActive ? 700 : 400,
                                    fontSize: '0.875rem',
                                }}
                            >
                                <span className="nav-item__icon">
                                    <link.icon size={17} />
                                </span>
                                <span className="nav-item__label" style={{ flex: 1 }}>{link.label}</span>
                                <span className="nav-item__arrow">
                                    <ChevronRight size={13} />
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Boutons connexion en bas */}
                <div style={{
                    padding: '1rem 0.875rem 1.375rem',
                    borderTop: `1px solid ${C.border}`,
                    display: 'flex', flexDirection: 'column', gap: '0.625rem',
                    flexShrink: 0,
                    background: C.bgDark,
                }}>

                    {/* Watermark bas */}
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.6875rem', color: C.textMuted, textAlign: 'center' }}>
                        🇧🇯 Commune des Aguégués
                    </p>
                </div>
            </aside>

            {/* ═══════════════════════════════════════
                TOPBAR MOBILE
            ═══════════════════════════════════════ */}
            <div className="topbar-mobile" style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: C.bg,
                borderBottom: `1px solid ${C.border}`,
                padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <img src="/logo.png" alt="Portail officiel des Aguégués" style={{ height: '52px', width: 'auto' }} />
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{
                        width: '42px', height: '42px', borderRadius: '10px',
                        border: `1.5px solid ${C.border}`,
                        background: C.hover,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: C.text,
                        transition: 'all 0.15s',
                    }}
                    aria-label="Menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Drawer mobile */}
            {mobileOpen && (
                <div className="mobile-drawer-overlay" style={{
                    position: 'fixed', inset: 0, zIndex: 60,
                    display: 'flex',
                }}>
                    {/* Overlay sombre */}
                    <div onClick={() => setMobileOpen(false)} style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(2px)',
                    }} />
                    {/* Panneau */}
                    <div style={{
                        position: 'relative', width: '260px',
                        background: C.bg,
                        height: '100%', overflowY: 'auto', zIndex: 1,
                        display: 'flex', flexDirection: 'column',
                        animation: 'slideInLeft 0.22s ease',
                        boxShadow: '4px 0 32px rgba(0,0,0,0.35)',
                    }}>
                        {/* Logo */}
                        <div style={{
                            padding: '1.25rem 1rem',
                            borderBottom: `1px solid ${C.border}`,
                            background: C.bgDark,
                        }}>
                            <img src="/logo.png" alt="Logo" style={{ width: '150px', height: 'auto' }} />
                        </div>
                        {/* Links */}
                        <nav style={{ flex: 1, padding: '0.875rem 0.75rem' }}>
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link key={link.href} href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.75rem 0.875rem', borderRadius: '10px',
                                            textDecoration: 'none',
                                            fontWeight: isActive ? 700 : 400,
                                            fontSize: '0.9375rem',
                                            color: isActive ? C.white : C.text,
                                            background: isActive ? C.active : 'transparent',
                                            borderLeft: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
                                            marginBottom: '2px',
                                        }}>
                                        <link.icon size={17} style={{ flexShrink: 0, color: isActive ? C.accent : C.textMuted }} />
                                        {link.label}
                                        {isActive && <ChevronRight size={13} style={{ marginLeft: 'auto', color: C.accent }} />}
                                    </Link>
                                )
                            })}
                        </nav>
                        {/* Boutons */}
                        <div style={{
                            padding: '1rem', borderTop: `1px solid ${C.border}`,
                            display: 'flex', flexDirection: 'column', gap: '0.75rem',
                            background: C.bgDark,
                        }}>
                            <Link href="/connexion" onClick={() => setMobileOpen(false)} style={{
                                display: 'block', textAlign: 'center',
                                padding: '0.75rem', borderRadius: '10px',
                                border: `1.5px solid ${C.accent}`, color: C.accent,
                                fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem',
                            }}>Connexion</Link>
                            <Link href="/inscription" onClick={() => setMobileOpen(false)} style={{
                                display: 'block', textAlign: 'center',
                                padding: '0.75rem', borderRadius: '10px',
                                background: C.accent, color: '#1a3038',
                                fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
                                boxShadow: '0 3px 12px rgba(126,200,200,0.3)',
                            }}>S&apos;inscrire</Link>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        /* ── Drawer mobile ── */
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @media (min-width: 768px) {
          .sidebar-desktop { display: flex !important; }
          .topbar-mobile    { display: none  !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none  !important; }
          .topbar-mobile   { display: flex  !important; }
        }

        /* ══════════════════════════════════════════
           Liens sidebar — animations premium
        ══════════════════════════════════════════ */

        /* État de base */
        .nav-item {
          color: #c8dede;
          background: transparent;
          border-left: 3px solid transparent;
          position: relative;
          overflow: hidden;
          transition:
            background   0.25s cubic-bezier(0.4,0,0.2,1),
            border-color 0.25s cubic-bezier(0.4,0,0.2,1),
            color        0.2s ease,
            transform    0.2s cubic-bezier(0.4,0,0.2,1);
        }

        /* Fond brillant qui glisse de gauche à droite au hover */
        .nav-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(126,200,200,0.08) 0%, transparent 80%);
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
          border-radius: 10px;
        }
        .nav-item:hover::before {
          transform: translateX(0);
        }

        /* Hover état */
        .nav-item:hover {
          color: #ffffff;
          background: #2d4449;
          border-left-color: rgba(126,200,200,0.35);
          transform: translateX(3px);
        }

        /* Icône — décalage leger au hover */
        .nav-item__icon {
          display: flex;
          align-items: center;
          color: #7ea8a8;
          flex-shrink: 0;
          transition:
            color      0.2s ease,
            transform  0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .nav-item:hover .nav-item__icon {
          color: #7ec8c8;
          transform: scale(1.15) rotate(-4deg);
        }

        /* Flèche — cachée par défaut, apparaît au hover */
        .nav-item__arrow {
          display: flex;
          align-items: center;
          color: #7ec8c8;
          opacity: 0;
          transform: translateX(-6px);
          transition:
            opacity   0.2s ease 0.05s,
            transform 0.25s cubic-bezier(0.4,0,0.2,1) 0.05s;
        }
        .nav-item:hover .nav-item__arrow,
        .nav-item--active .nav-item__arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* État actif */
        .nav-item--active {
          color: #ffffff !important;
          background: #1f3238 !important;
          border-left-color: #7ec8c8 !important;
          transform: none;
          font-weight: 700;
        }
        .nav-item--active .nav-item__icon {
          color: #7ec8c8;
        }
        .nav-item--active::before {
          transform: translateX(0);
          background: linear-gradient(90deg, rgba(126,200,200,0.12) 0%, transparent 70%);
        }

        /* Fond pilule active qui pulse doucement */
        @keyframes activePulse {
          0%, 100% { box-shadow: inset 3px 0 0 #7ec8c8, 0 0 0 rgba(126,200,200,0); }
          50%       { box-shadow: inset 3px 0 0 #7ec8c8, 2px 0 12px rgba(126,200,200,0.18); }
        }
        .nav-item--active {
          animation: activePulse 3s ease-in-out infinite;
        }
      `}</style>
        </>
    )
}
