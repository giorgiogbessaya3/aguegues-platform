'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import {
    Newspaper, ChevronRight, Calendar, ArrowRight,
    Search, BookOpen, Briefcase, Star, Bell, Rocket,
    ClipboardList, GraduationCap, Trophy, type LucideIcon
} from 'lucide-react'

/* ─── Palette thème ─────────────────────────────────────────── */
const T = {
    bg:      '#0a1620',
    card:    '#354E54',
    border:  'rgba(255,255,255,0.12)',
    text:    '#c8dede',
    muted:   '#7ea8a8',
    accent:  '#7ec8c8',
    white:   '#ffffff',
}

/* ─── Données ─────────────────────────────────────────────────── */
type Categorie = 'actualite' | 'opportunite' | 'nomination' | 'evenement'

const articles: {
    slug: string; titre: string; extrait: string; contenu: string
    categorie: Categorie; date: string; image_couleur: string
    icon: LucideIcon; temps_lecture: string
}[] = [
    { slug: 'lancement-plateforme-aganer-2025', titre: 'Lancement officiel du Portail Numérique des Aguégués', extrait: 'Le Portail Numérique et la Mairie des Aguégués lancent officiellement la plateforme numérique de recensement des cadres et jeunes talents de la commune.', contenu: '', categorie: 'actualite',   date: '2025-03-01', image_couleur: '#0d9488', icon: Rocket,       temps_lecture: '3 min' },
    { slug: 'programme-emploi-jeunes-2025',      titre: 'Programme Emploi Jeunes — Appel à candidatures',       extrait: 'La Mairie des Aguégués lance un programme de soutien à l\'emploi des jeunes. 50 jeunes seront accompagnés et subventionnés pour créer leur activité.',         contenu: '', categorie: 'opportunite', date: '2025-02-20', image_couleur: '#f59e0b', icon: Briefcase,    temps_lecture: '4 min' },
    { slug: 'nomination-chef-service-education', titre: 'Nomination au poste de Chef du Service Éducation',     extrait: 'La Mairie des Aguégués annonce la nomination de M. Clément Kpossou à la tête du service éducation de la commune, fort de 12 ans d\'expérience.',             contenu: '', categorie: 'nomination',  date: '2025-02-14', image_couleur: '#8b5cf6', icon: Trophy,      temps_lecture: '2 min' },
    { slug: 'journee-recensement-mars-2025',     titre: 'Grande journée de recensement numérique — 15 mars',   extrait: 'Une journée spéciale d\'inscription sur le Portail Numérique est organisée dans les quartiers de la commune le 15 mars 2025. Des agents seront sur place.',  contenu: '', categorie: 'evenement',  date: '2025-02-10', image_couleur: '#7ec8c8', icon: ClipboardList, temps_lecture: '3 min' },
    { slug: 'bourse-etude-france-2025',          titre: 'Bourses d\'études en France — Campus France Bénin',   extrait: 'Campus France Bénin ouvre les candidatures pour les bourses d\'excellence 2025. Les jeunes des Aguégués sont fortement encouragés à postuler.',             contenu: '', categorie: 'opportunite', date: '2025-01-28', image_couleur: '#3b82f6', icon: GraduationCap, temps_lecture: '5 min' },
    { slug: 'inauguration-mairie-renovee',        titre: 'Inauguration de la Mairie rénovée des Aguégués',      extrait: 'Le Maire des Aguégués inaugurera les nouveaux locaux rénovés de la Mairie le 5 avril 2025. Une cérémonie officielle est prévue avec les autorités.',       contenu: '', categorie: 'evenement',  date: '2025-01-15', image_couleur: '#f97316', icon: Star,         temps_lecture: '2 min' },
]

const catConfig: Record<Categorie | 'tous', { label: string; icon: LucideIcon; color: string; glow: string }> = {
    tous:       { label: 'Toutes',       icon: Newspaper,     color: T.accent,  glow: 'rgba(126,200,200,0.25)' },
    actualite:  { label: 'Actualités',   icon: Bell,          color: '#34d399', glow: 'rgba(52,211,153,0.25)'  },
    opportunite:{ label: 'Opportunités', icon: Briefcase,     color: '#fbbf24', glow: 'rgba(251,191,36,0.25)'  },
    nomination: { label: 'Nominations',  icon: Trophy,        color: '#a78bfa', glow: 'rgba(167,139,250,0.25)' },
    evenement:  { label: 'Événements',   icon: Bell,          color: '#fb923c', glow: 'rgba(251,146,60,0.25)'  },
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/* ─── Hook scroll reveal ──────────────────────────────────── */
function useReveal(threshold = 0.12) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect() }
        }, { threshold })
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return { ref, visible }
}

function Reveal({ children, delay = 0, dir = 'up' }: { children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' | 'scale' }) {
    const { ref, visible } = useReveal()
    const cls = `reveal reveal-${dir}${visible ? ' revealed' : ''}`
    return (
        <div ref={ref} className={cls} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    )
}

/* ─── Compteur animé ──────────────────────────────────────── */
function AnimatedCount({ value }: { value: number }) {
    const [displayed, setDisplayed] = useState(0)
    useEffect(() => {
        let start = 0
        const step = Math.ceil(value / 12)
        const timer = setInterval(() => {
            start += step
            if (start >= value) { setDisplayed(value); clearInterval(timer) }
            else setDisplayed(start)
        }, 40)
        return () => clearInterval(timer)
    }, [value])
    return <>{displayed}</>
}

/* ─── Particule flottante ─────────────────────────────────── */
function FloatingParticle({ x, y, size, delay, dur }: { x: number; y: number; size: number; delay: number; dur: number }) {
    return (
        <div style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: `${size}px`, height: `${size}px`,
            borderRadius: '50%',
            background: 'rgba(126,200,200,0.35)',
            animation: `floatParticle ${dur}s ease-in-out ${delay}s infinite alternate`,
            pointerEvents: 'none',
        }} />
    )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function ActualitesPage() {
    const [filtre, setFiltre] = useState<Categorie | 'tous'>('tous')
    const [recherche, setRecherche] = useState('')
    const [heroVisible, setHeroVisible] = useState(false)
    const [prevFiltre, setPrevFiltre] = useState<Categorie | 'tous'>('tous')
    const [gridKey, setGridKey] = useState(0)

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 100)
        return () => clearTimeout(t)
    }, [])

    const handleFiltre = (cat: Categorie | 'tous') => {
        if (cat === filtre) return
        setPrevFiltre(filtre)
        setFiltre(cat)
        setGridKey(k => k + 1)
    }

    const resultats = articles.filter(a => {
        const matchCat    = filtre === 'tous' || a.categorie === filtre
        const matchSearch = recherche === '' ||
            a.titre.toLowerCase().includes(recherche.toLowerCase()) ||
            a.extrait.toLowerCase().includes(recherche.toLowerCase())
        return matchCat && matchSearch
    })

    const vedette = articles[0]
    const VedetteIcon = vedette.icon

    const particles = [
        { x:8,  y:20, size:4, delay:0,   dur:4.2 },
        { x:20, y:70, size:3, delay:1.2, dur:3.8 },
        { x:45, y:15, size:5, delay:0.5, dur:5.0 },
        { x:65, y:55, size:3, delay:2.1, dur:4.5 },
        { x:80, y:30, size:4, delay:0.8, dur:3.6 },
        { x:90, y:75, size:6, delay:1.7, dur:4.8 },
        { x:35, y:85, size:3, delay:0.3, dur:3.9 },
    ]

    return (
        <>
            <main style={{
                    minHeight: '100vh',
                    background: T.bg,
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    position: 'relative',
                }}>
                {/* Overlay sombre fixe */}
                <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(10,22,32,0.93) 0%, rgba(10,22,32,0.88) 100%)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>

                {/* ═══ HERO ══════════════════════════════════════════════ */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover', backgroundPosition: 'center 30%',
                    position: 'relative', overflow: 'hidden',
                    minHeight: '340px',
                    display: 'flex', alignItems: 'flex-end',
                    padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1620 0%, rgba(10,22,32,0.8) 55%, rgba(10,22,32,0.5) 100%)' }} />

                    {/* Grille pointillée */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

                    {/* Particules flottantes */}
                    {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

                    {/* Orbe lumineux animé */}
                    <div style={{
                        position: 'absolute', top: '-80px', right: '10%',
                        width: '420px', height: '420px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(126,200,200,0.1) 0%, transparent 70%)',
                        animation: 'orbPulse 6s ease-in-out infinite',
                        pointerEvents: 'none',
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px' }}>
                        {/* Fil d'Ariane */}
                        <div className={`hero-elem${heroVisible ? ' hero-in' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.25rem', transitionDelay: '0ms' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.8125rem', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                            >Accueil</Link>
                            <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
                            <span style={{ color: T.accent, fontSize: '0.8125rem', fontWeight: 600 }}>Actualités</span>
                        </div>

                        {/* Badge */}
                        <div className={`hero-elem${heroVisible ? ' hero-in' : ''}`} style={{ transitionDelay: '120ms', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', background: 'rgba(126,200,200,0.12)', border: '1px solid rgba(126,200,200,0.28)', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, color: T.accent, marginBottom: '1rem', letterSpacing: '0.06em' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.accent, animation: 'pulseDot 1.8s ease-in-out infinite', display: 'inline-block' }} />
                            <Newspaper size={11} /> ACTUALITÉS &amp; ANNONCES
                        </div>

                        <h1 className={`hero-elem${heroVisible ? ' hero-in' : ''}`} style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', fontWeight: 900, color: T.white, lineHeight: 1.1, margin: '0 0 0.875rem', letterSpacing: '-0.025em', transitionDelay: '200ms' }}>
                            Toutes les{' '}
                            <span style={{ background: 'linear-gradient(90deg, #7ec8c8, #34d399, #7ec8c8)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmerText 3s linear infinite' }}>Nouvelles</span>
                        </h1>
                        <p className={`hero-elem${heroVisible ? ' hero-in' : ''}`} style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', color: 'rgba(200,222,222,0.65)', margin: 0, transitionDelay: '300ms' }}>
                            Restez informés de toutes les actualités, opportunités et événements de la commune des Aguégués.
                        </p>
                    </div>
                </div>

                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)' }}>

                    {/* ═══ ARTICLE VEDETTE ═══════════════════════════════ */}
                    <Reveal delay={0} dir="up">
                    <Link href={`/actualites/${vedette.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
                        <div className="vedette-card" style={{
                            borderRadius: '22px', overflow: 'hidden',
                            background: `linear-gradient(135deg, ${vedette.image_couleur}25 0%, ${vedette.image_couleur}10 100%)`,
                            border: `1px solid ${vedette.image_couleur}40`,
                            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                            position: 'relative',
                            cursor: 'pointer',
                        }}>
                            {/* Cercles déco animés */}
                            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: `${vedette.image_couleur}10`, pointerEvents: 'none', animation: 'orbFloat 8s ease-in-out infinite' }} />
                            <div style={{ position: 'absolute', bottom: '-40px', right: '80px', width: '140px', height: '140px', borderRadius: '50%', background: `${vedette.image_couleur}08`, pointerEvents: 'none', animation: 'orbFloat 10s ease-in-out 2s infinite reverse' }} />

                            {/* Ligne lumineuse en bas */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${vedette.image_couleur}80, transparent)`, animation: 'scanLine 3s ease-in-out infinite' }} />

                            <div style={{ position: 'relative', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                {/* Icône grande avec halo */}
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '20px', flexShrink: 0,
                                    background: `${vedette.image_couleur}22`,
                                    border: `2px solid ${vedette.image_couleur}50`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: `0 8px 24px ${vedette.image_couleur}30, 0 0 0 8px ${vedette.image_couleur}08`,
                                    animation: 'iconBreath 4s ease-in-out infinite',
                                }}>
                                    <VedetteIcon size={36} color={vedette.image_couleur} />
                                </div>

                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                                        {/* Badge "À la une" pulsant */}
                                        <span style={{
                                            background: `${vedette.image_couleur}22`, color: vedette.image_couleur,
                                            borderRadius: '999px', padding: '0.25rem 0.875rem',
                                            fontSize: '0.75rem', fontWeight: 700,
                                            border: `1px solid ${vedette.image_couleur}40`,
                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: vedette.image_couleur, animation: 'pulseDot 1.4s ease-in-out infinite', display: 'inline-block' }} />
                                            À la une
                                        </span>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', color: T.muted }}>
                                            <Calendar size={13} /> {formatDate(vedette.date)}
                                        </span>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', color: T.muted }}>
                                            <BookOpen size={13} /> {vedette.temps_lecture}
                                        </span>
                                    </div>
                                    <h2 style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.625rem)', fontWeight: 800, color: T.white, margin: '0 0 0.625rem', lineHeight: 1.3 }}>
                                        {vedette.titre}
                                    </h2>
                                    <p style={{ color: T.text, fontSize: '0.9375rem', lineHeight: 1.7, margin: '0 0 1.125rem' }}>
                                        {vedette.extrait}
                                    </p>
                                    <span className="lire-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: vedette.image_couleur, fontWeight: 700, fontSize: '0.875rem' }}>
                                        Lire l&apos;article <ArrowRight size={15} className="arrow-icon" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                    </Reveal>

                    {/* ═══ BARRE RECHERCHE + FILTRES ═══════════════════════ */}
                    <Reveal delay={100} dir="up">
                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: '18px',
                        border: `1px solid ${T.border}`,
                        padding: '1.125rem 1.25rem',
                        marginBottom: '2rem',
                        display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center',
                    }}>
                        {/* Recherche */}
                        <div style={{ flex: '1 1 200px', position: 'relative', minWidth: '180px' }}>
                            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: T.muted, pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="Rechercher un article…"
                                value={recherche}
                                onChange={e => setRecherche(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.6875rem 1rem 0.6875rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1.5px solid rgba(255,255,255,0.08)',
                                    background: 'rgba(255,255,255,0.04)',
                                    color: T.white, fontSize: '0.875rem',
                                    outline: 'none', fontFamily: 'inherit',
                                    transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(126,200,200,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                            />
                        </div>

                        {/* Filtres pills */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {(Object.keys(catConfig) as Array<Categorie | 'tous'>).map((cat, i) => {
                                const { label, icon: CatIcon, color, glow } = catConfig[cat]
                                const actif = filtre === cat
                                return (
                                    <button key={cat} onClick={() => handleFiltre(cat)} className={`filter-pill${actif ? ' active-pill' : ''}`} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                                        padding: '0.45rem 0.875rem', borderRadius: '999px',
                                        cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', fontFamily: 'inherit',
                                        background: actif ? `${color}20` : 'rgba(255,255,255,0.04)',
                                        color: actif ? color : T.muted,
                                        border: `1.5px solid ${actif ? color + '60' : 'rgba(255,255,255,0.08)'}`,
                                        boxShadow: actif ? `0 0 16px ${glow}, 0 0 0 1px ${color}20` : 'none',
                                        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                        transform: actif ? 'scale(1.05)' : 'scale(1)',
                                        animationDelay: `${i * 60}ms`,
                                    }}>
                                        <CatIcon size={13} />
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    </Reveal>

                    {/* ═══ COMPTEUR ════════════════════════════════════════ */}
                    <Reveal delay={150} dir="left">
                    <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: '3px', height: '20px', borderRadius: '999px', background: T.accent, boxShadow: `0 0 8px ${T.accent}60` }} />
                        <p style={{ color: T.muted, fontSize: '0.875rem', margin: 0 }}>
                            <strong style={{ color: T.accent }}><AnimatedCount value={resultats.length} /></strong> article{resultats.length > 1 ? 's' : ''} trouvé{resultats.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    </Reveal>

                    {/* ═══ GRILLE ARTICLES ═════════════════════════════════ */}
                    {resultats.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', border: `1px solid ${T.border}`, animation: 'fadeIn 0.4s ease' }}>
                            <Newspaper size={48} color={T.muted} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                            <p style={{ color: T.muted, fontWeight: 500 }}>Aucun article trouvé.</p>
                        </div>
                    ) : (
                        <div key={gridKey} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.125rem' }}>
                            {resultats.slice(1).map((article, i) => {
                                const cat = catConfig[article.categorie]
                                const ArticleIcon = article.icon
                                return (
                                    <Link key={article.slug} href={`/actualites/${article.slug}`} style={{ textDecoration: 'none' }}>
                                        <div className="article-card" style={{
                                            background: '#354E54',
                                            border: `1px solid rgba(255,255,255,0.14)`,
                                            borderRadius: '18px', overflow: 'hidden',
                                            height: '100%', cursor: 'pointer',
                                            display: 'flex', flexDirection: 'column',
                                            animation: `cardIn 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both`,
                                        }}>
                                            {/* Bannière colorée avec shimmer */}
                                            <div className="card-banner" style={{
                                                height: '120px',
                                                background: `linear-gradient(135deg, ${article.image_couleur}30 0%, ${article.image_couleur}18 100%)`,
                                                borderBottom: `1px solid ${article.image_couleur}30`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                position: 'relative', overflow: 'hidden',
                                            }}>
                                                {/* Shimmer sweep */}
                                                <div className="banner-shimmer" style={{
                                                    position: 'absolute', inset: 0,
                                                    background: `linear-gradient(105deg, transparent 40%, ${article.image_couleur}20 50%, transparent 60%)`,
                                                    backgroundSize: '200% 100%',
                                                }} />

                                                <div style={{
                                                    width: '56px', height: '56px', borderRadius: '16px',
                                                    background: `${article.image_couleur}22`,
                                                    border: `1.5px solid ${article.image_couleur}55`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: `0 4px 20px ${article.image_couleur}35`,
                                                    position: 'relative', zIndex: 1,
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                }}>
                                                    <ArticleIcon size={26} color={article.image_couleur} />
                                                </div>
                                            </div>

                                            <div style={{ padding: '1.125rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                {/* Badge catégorie */}
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                    padding: '0.2rem 0.625rem', borderRadius: '999px',
                                                    background: `${cat.color}15`,
                                                    border: `1px solid ${cat.color}35`,
                                                    color: cat.color,
                                                    fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.75rem',
                                                    letterSpacing: '0.04em',
                                                    alignSelf: 'flex-start',
                                                }}>
                                                    <cat.icon size={11} /> {cat.label.toUpperCase()}
                                                </span>

                                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.white, margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                                                    {article.titre}
                                                </h3>
                                                <p style={{
                                                    fontSize: '0.8125rem', color: T.muted, lineHeight: 1.65, margin: '0 0 1rem', flex: 1,
                                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                }}>
                                                    {article.extrait}
                                                </p>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                                    <span style={{ fontSize: '0.75rem', color: T.muted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        <Calendar size={12} /> {formatDate(article.date)}
                                                    </span>
                                                    <span className="card-lire" style={{ fontSize: '0.8125rem', color: article.image_couleur, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        Lire <ArrowRight size={13} className="arrow-icon" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
                </div>
            </main>
            <Footer />

            <style>{`
        /* ── Polices ── */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* ══ HERO ANIMATIONS ═══════════════════════════════════ */
        .hero-elem {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ══ SCROLL REVEAL ══════════════════════════════════════ */
        .reveal {
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-up   { opacity: 0; transform: translateY(28px); }
        .reveal-left { opacity: 0; transform: translateX(-22px); }
        .reveal-right{ opacity: 0; transform: translateX(22px); }
        .reveal-scale{ opacity: 0; transform: scale(0.95); }
        .revealed    { opacity: 1 !important; transform: none !important; }

        /* ══ KEYFRAMES ══════════════════════════════════════════ */
        @keyframes pulseDot {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.6; }
        }

        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes orbPulse {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50%      { transform: scale(1.15); opacity: 1; }
        }

        @keyframes orbFloat {
          0%,100% { transform: translateY(0) translateX(0); }
          33%      { transform: translateY(-12px) translateX(8px); }
          66%      { transform: translateY(6px) translateX(-6px); }
        }

        @keyframes floatParticle {
          from { transform: translateY(0) scale(1); opacity: 0.4; }
          to   { transform: translateY(-18px) scale(1.3); opacity: 0.7; }
        }

        @keyframes iconBreath {
          0%,100% { box-shadow: 0 8px 24px currentColor30, 0 0 0 8px currentColor08; }
          50%      { box-shadow: 0 12px 32px currentColor50, 0 0 0 14px currentColor12; }
        }

        @keyframes scanLine {
          0%   { transform: scaleX(0) translateX(-50%); opacity: 0; }
          50%  { transform: scaleX(1) translateX(0%);   opacity: 1; }
          100% { transform: scaleX(0) translateX(50%);  opacity: 0; }
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ══ CARD HOVER ═════════════════════════════════════════ */
        .article-card {
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      border-color 0.28s ease,
                      box-shadow 0.28s ease;
        }
        .article-card:hover {
          transform: translateY(-6px) scale(1.01);
          border-color: rgba(126,200,200,0.22) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(126,200,200,0.08);
        }
        .article-card:hover .card-banner {
          filter: brightness(1.08);
        }
        .article-card:hover .banner-shimmer {
          animation: shimmerSweep 0.7s ease forwards;
        }
        @keyframes shimmerSweep {
          from { background-position: -100% 0; }
          to   { background-position: 200% 0; }
        }
        .article-card:hover .card-lire .arrow-icon {
          animation: arrowBounce 0.5s ease;
        }

        /* ══ VEDETTE HOVER ══════════════════════════════════════ */
        .vedette-card {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.3s ease;
        }
        .vedette-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(13,148,136,0.2);
        }
        .vedette-card:hover .lire-btn .arrow-icon {
          animation: arrowBounce 0.5s ease;
        }

        @keyframes arrowBounce {
          0%  { transform: translateX(0); }
          40% { transform: translateX(6px); }
          70% { transform: translateX(-2px); }
          100%{ transform: translateX(0); }
        }

        /* ══ FILTER PILLS ═══════════════════════════════════════ */
        .filter-pill:hover:not(.active-pill) {
          color: #c8dede !important;
          border-color: rgba(255,255,255,0.18) !important;
          background: rgba(255,255,255,0.07) !important;
          transform: scale(1.03);
        }

        /* ══ MISC ════════════════════════════════════════════════ */
        select option { background: #1a2e3a; color: #c8dede; }
        input::placeholder { color: #7ea8a8; }
      `}</style>
        </>
    )
}
