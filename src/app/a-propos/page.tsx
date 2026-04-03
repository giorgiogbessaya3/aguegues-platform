'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import {
    ChevronRight, MapPin, Users, Heart,
    Globe, Award, BookOpen, Handshake, ArrowRight,
    Building2, Phone, Mail, Waves, TreePine, Fish,
    Crown, Shield, Landmark, Star, CheckCircle, Clock
} from 'lucide-react'

// ─── Hook d'animation au scroll ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
            { threshold }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return { ref, inView }
}

// ─── Compteur animé ───────────────────────────────────────────────────────────
function Counter({ end, suffix = '', duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0)
    const { ref, inView } = useInView(0.3)
    useEffect(() => {
        if (!inView) return
        let start = 0
        const step = end / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= end) { setCount(end); clearInterval(timer) }
            else setCount(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [inView, end, duration])
    return <span ref={ref}>{count.toLocaleString('fr-FR')}{suffix}</span>
}

// ─── Données réelles ──────────────────────────────────────────────────────────
const stats = [
    { valeur: 44562, suffix: '', label: 'Habitants (RGPH-4)', icon: <Users size={22} />, color: '#1a6b3c' },
    { valeur: 103, suffix: ' km²', label: 'Superficie totale', icon: <Globe size={22} />, color: '#1e3a5f' },
    { valeur: 3, suffix: '', label: 'Arrondissements', icon: <Building2 size={22} />, color: '#c4940a' },
    { valeur: 12, suffix: '+', label: 'Villages et quartiers', icon: <MapPin size={22} />, color: '#7c3aed' },
]

const arrondissements = [
    {
        nom: 'Avagbodji',
        icon: <Waves size={28} />,
        color: '#1a5c2a',
        bg: '#dcf0e4',
        desc: 'Arrondissement lacustre aux paysages uniques sur pilotis, berceau de la culture Toffinous des Aguégués.',
    },
    {
        nom: 'Houédomé',
        icon: <Crown size={28} />,
        color: '#1e3a5f',
        bg: '#eff4fb',
        desc: 'Seul village non inondable (Agbodjèdo) lors des crues. Centre administratif et commercial de la commune.',
    },
    {
        nom: 'Zoungamé',
        icon: <TreePine size={28} />,
        color: '#c4940a',
        bg: '#fef3c7',
        desc: 'Arrondissement aux forêts sacrées et sites historiques, gardien de la mémoire des ancêtres Ouémènous.',
    },
]

const valeurs = [
    { icon: <Heart size={26} />, titre: 'Solidarité', texte: 'Créer des liens durables entre tous les fils et filles des Aguégués, sur le territoire et dans la diaspora.', couleur: '#e11d48', bg: '#fff1f2' },
    { icon: <Star size={26} />, titre: 'Excellence', texte: 'Promouvoir l\'excellence académique et professionnelle des jeunes de la commune comme modèle de réussite.', couleur: '#c4940a', bg: '#fef3c7' },
    { icon: <Globe size={26} />, titre: 'Inclusion', texte: 'Aucun talent ne doit rester dans l\'ombre. Chaque Aguéguéen(ne), quel que soit son parcours, a sa place ici.', couleur: '#1a6b3c', bg: '#dcf0e4' },
    { icon: <Handshake size={26} />, titre: 'Partenariat', texte: 'Travailler main dans la main avec la Mairie, les partenaires techniques et les institutions pour maximiser l\'impact.', couleur: '#1e3a5f', bg: '#eff4fb' },
]

const timeline = [
    { annee: 'XVIIe s.', titre: 'Les Toffinous', texte: 'Les premiers habitants, les Toffinous, s\'installent sur les îlots du lac Nokoué. Ils sont les "hommes de l\'eau", maîtres de la pêche et de la navigation lacustre.', icon: <Fish size={18} /> },
    { annee: 'XVIIIe s.', titre: 'Les Ouémènous', texte: 'Fuyant les razzias esclavagistes du royaume d\'Abomey, les Ouémènous rejoignent les Toffinous sur ce territoire refuge protégé par les eaux.', icon: <Shield size={18} /> },
    { annee: 'Origine', titre: 'Le nom "Aguégué"', texte: 'La tradition orale attribue le nom à Amoussou Aguégué, honoré par le roi Gnancadja Zounhon qui épousa sa sœur Gbassègbo, donnant ainsi son nom au territoire.', icon: <Crown size={18} /> },
    { annee: '2002', titre: 'Commune de droit commun', texte: 'Dans le cadre de la décentralisation au Bénin, les Aguégués deviennent officiellement une commune de plein exercice dans le département de l\'Ouémé.', icon: <Landmark size={18} /> },
    { annee: '2026', titre: 'Portail Numérique', texte: 'Ernest Agbokoumissi, installé maire le 20 février 2026, lance le Portail Numérique Officiel pour moderniser la gouvernance et valoriser les talents de la commune.', icon: <Globe size={18} /> },
]

const sitesTouristiques = [
    { nom: 'Maisons sur pilotis', desc: 'Architecture unique africaine, maisons construites au-dessus du lac Nokoué', emoji: '🏡' },
    { nom: 'Forêt sacrée Balèzoumé', desc: 'Lieu de culte et de mémoire ancestrale, gardienne des traditions Ouémènous', emoji: '🌳' },
    { nom: 'Palais royal de Soholou', desc: 'Vestige historique de la royauté Toffinous, témoin de siècles d\'histoire', emoji: '🏛️' },
    { nom: 'Lac Nokoué', desc: 'Lac côtier entre Cotonou et Porto-Novo, richesse halieutique exceptionnelle', emoji: '🐟' },
    { nom: 'Place Goukon', desc: 'Ancienne place de préparation des guerriers, cœur historique de la commune', emoji: '⚔️' },
    { nom: 'Forêt sacrée Bamèzoun', desc: 'Lieu d\'intronisation des rois Ouémènous, site rituel préservé', emoji: '🌿' },
]

// ─── Composant Section animée ─────────────────────────────────────────────────
function AnimSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, inView } = useInView()
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AProposPage() {
    return (
        <>
            <main style={{ minHeight: '100vh', background: '#f9fafb' }}>

                {/* ════════════════════════════════════════════════
                    HERO — Immersif avec particules
                ════════════════════════════════════════════════ */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: 'clamp(420px, 55vh, 600px)',
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }}>
                    {/* Overlay dégradé */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(5,15,8,0.97) 0%, rgba(10,30,20,0.80) 40%, rgba(15,45,74,0.55) 75%, rgba(10,25,50,0.3) 100%)' }} />

                    {/* Particules décoratives */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} className="hero-particles" />

                    <div className="container-main" style={{ position: 'relative', zIndex: 1, paddingBottom: 'clamp(2.5rem, 5vw, 4rem)', paddingTop: '5rem' }}>
                        {/* Fil d'Ariane */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '2rem', flexWrap: 'wrap' }} className="breadcrumb-wrap">
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.8125rem' }}>Accueil</Link>
                            <ChevronRight size={13} color="rgba(255,255,255,0.35)" />
                            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8125rem', fontWeight: 600 }}>Présentation</span>
                        </div>

                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.375rem 1rem',
                            background: 'rgba(110,231,160,0.12)',
                            border: '1px solid rgba(110,231,160,0.3)',
                            borderRadius: '999px', marginBottom: '1.25rem',
                        }}>
                            <MapPin size={13} color="#6ee7a0" />
                            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6ee7a0' }}>Département de l&apos;Ouémé · Bénin 🇧🇯</span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(2rem, 6vw, 3.75rem)',
                            fontWeight: 900, color: 'white',
                            lineHeight: 1.1, margin: '0 0 1rem',
                            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                        }}>
                            Les Aguégués,<br />
                            <span style={{ color: '#6ee7a0' }}>une commune d&apos;exception</span>
                        </h1>
                        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)', color: 'rgba(255,255,255,0.75)', maxWidth: '580px', lineHeight: 1.75, margin: 0 }}>
                            Nichée entre le lac Nokoué et le fleuve Ouémé, la commune des Aguégués est un territoire
                            semi-lacustre unique en Afrique de l&apos;Ouest, à mi-chemin entre Cotonou et Porto-Novo.
                        </p>

                        {/* Stats rapides */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2.5rem' }}>
                            {[
                                { label: '44 562 hab.', sub: 'Population RGPH-4' },
                                { label: '103 km²', sub: 'Superficie' },
                                { label: '3 arrond.', sub: 'Avagbodji · Houédomé · Zoungamé' },
                            ].map(({ label, sub }) => (
                                <div key={label} style={{
                                    padding: '0.75rem 1.25rem',
                                    background: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '14px',
                                }}>
                                    <div style={{ fontWeight: 800, color: 'white', fontSize: '1.0625rem' }}>{label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    COMPTEURS ANIMÉS
                ════════════════════════════════════════════════ */}
                <div style={{ background: 'white', borderBottom: '1px solid #f3f4f6' }}>
                    <div className="container-main" style={{ padding: 'clamp(2rem, 4vw, 3rem) 1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                            {stats.map(({ valeur, suffix, label, icon, color }, i) => (
                                <AnimSection key={label} delay={i * 100}>
                                    <div style={{
                                        textAlign: 'center', padding: '1.75rem 1rem',
                                        borderRadius: '18px', background: '#f9fafb',
                                        border: '1px solid #f3f4f6',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)' }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'center', color, marginBottom: '0.75rem' }}>{icon}</div>
                                        <div style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                                            <Counter end={valeur} suffix={suffix} />
                                        </div>
                                        <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.5rem', fontWeight: 500 }}>{label}</div>
                                    </div>
                                </AnimSection>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════
                    PRÉSENTATION — GÉOGRAPHIE & IDENTITÉ
                ════════════════════════════════════════════════ */}
                <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: '#f9fafb' }}>
                    <div className="container-main">
                        <AnimSection>
                            <div style={{ display: 'grid', gap: '2.5rem', alignItems: 'center' }} className="section-2col">

                                {/* Texte */}
                                <div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: '#dcf0e4', borderRadius: '999px', marginBottom: '1rem' }}>
                                        <Waves size={14} color="#1a5c2a" />
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1a5c2a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Commune semi-lacustre</span>
                                    </div>
                                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.375rem)', fontWeight: 900, color: '#111827', margin: '0 0 1.25rem', lineHeight: 1.2 }}>
                                        Un territoire façonné par l&apos;eau
                                    </h2>
                                    <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.85, marginBottom: '1rem' }}>
                                        Stratégiquement positionnée entre <strong>Cotonou</strong> (capitale économique) et <strong>Porto-Novo</strong> (capitale politique),
                                        la commune des Aguégués est encerclée par le lac Nokoué au sud et à l&apos;ouest, et par la lagune de Porto-Novo à l&apos;est.
                                    </p>
                                    <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.85, marginBottom: '1.75rem' }}>
                                        Son territoire de <strong>103 km²</strong> est composé d&apos;îlots de terre submersibles dans la partie basse
                                        du fleuve Ouémé. Chaque année, de <strong>juillet à novembre</strong>, la montée des eaux transforme le paysage,
                                        rendant certaines zones accessibles uniquement par voie lacustre.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {[
                                            'Commune semi-lacustre unique en Afrique de l\'Ouest',
                                            'Villages sur pilotis, architecture patrimoniale exceptionnelle',
                                            'Richesse halieutique du lac Nokoué (pêche traditionnelle)',
                                            'Entre Cotonou et Porto-Novo — position géostratégique',
                                        ].map(item => (
                                            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <CheckCircle size={17} color="#1a5c2a" style={{ flexShrink: 0, marginTop: '3px' }} />
                                                <span style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.5 }}>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Card visuelle */}
                                <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                    <div style={{
                                        backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center top',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}>
                                        {/* Overlay vert */}
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,92,42,0.88) 0%, rgba(30,58,95,0.85) 100%)', pointerEvents: 'none' }} />
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                                <Building2 size={36} color="white" />
                                            </div>
                                            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.25rem' }}>Mairie des Aguégués</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', margin: 0 }}>Commune de l&apos;Ouémé, Bénin 🇧🇯</p>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        {[
                                            { label: 'Département', value: 'Ouémé' },
                                            { label: 'Superficie', value: '103 km²' },
                                            { label: 'Population', value: '44 562 hab. (RGPH-4, 2013)' },
                                            { label: 'Arrondissements', value: 'Avagbodji · Houédomé · Zoungamé' },
                                            { label: 'BP', value: '1179, Aguégués' },
                                            { label: 'Téléphone', value: '+229 97 33 87 49' },
                                            { label: 'Email', value: 'mairiedesaguegues@yahoo.fr' },
                                            { label: 'Maire', value: 'Ernest A. Agbokoumissi (2026)' },
                                        ].map(({ label, value }) => (
                                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6875rem 0', borderBottom: '1px solid #f3f4f6', gap: '1rem', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.8125rem', color: '#9ca3af', fontWeight: 600 }}>{label}</span>
                                                <span style={{ fontSize: '0.8125rem', color: '#1f2937', fontWeight: 500, textAlign: 'right' }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </AnimSection>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════
                    LES 3 ARRONDISSEMENTS
                ════════════════════════════════════════════════ */}
                <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: '#f9fafb' }}>
                    <div className="container-main">
                        <AnimSection>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: '#eff4fb', borderRadius: '999px', marginBottom: '0.875rem' }}>
                                    <Building2 size={14} color="#1e3a5f" />
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Organisation administrative</span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#111827', margin: '0 0 0.875rem' }}>
                                    3 Arrondissements
                                </h2>
                                <p style={{ fontSize: '1.0625rem', color: '#6b7280', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                                    La commune est organisée en trois arrondissements, chacun avec sa propre identité et ses spécificités géographiques.
                                </p>
                            </div>
                        </AnimSection>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
                            {arrondissements.map(({ nom, icon, color, bg, desc }, i) => (
                                <AnimSection key={nom} delay={i * 120}>
                                    <div style={{
                                        background: 'white', borderRadius: '20px',
                                        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                                        padding: '2rem 1.5rem', height: '100%',
                                        border: `2px solid ${color}15`,
                                        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${color}20`; e.currentTarget.style.borderColor = `${color}40` }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = `${color}15` }}
                                    >
                                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color }}>{icon}</div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 0.75rem' }}>{nom}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                                    </div>
                                </AnimSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════
                    SITES TOURISTIQUES
                ════════════════════════════════════════════════ */}
                <section style={{
                    padding: 'clamp(3rem, 6vw, 5rem) 0',
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Overlay sombre vert */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,20,10,0.88) 0%, rgba(10,30,50,0.85) 100%)', pointerEvents: 'none' }} />
                    {/* Motif pointillés */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
                    <div className="container-main" style={{ position: 'relative' }}>
                        <AnimSection>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: 'rgba(110,231,160,0.12)', border: '1px solid rgba(110,231,160,0.25)', borderRadius: '999px', marginBottom: '0.875rem' }}>
                                    <TreePine size={14} color="#6ee7a0" />
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6ee7a0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Patrimoine & Tourisme</span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'white', margin: '0 0 0.875rem' }}>
                                    Sites à Découvrir
                                </h2>
                                <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.6)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                                    La commune des Aguégués regorge de trésors naturels, historiques et culturels.
                                </p>
                            </div>
                        </AnimSection>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
                            {sitesTouristiques.map(({ nom, desc, emoji }, i) => (
                                <AnimSection key={nom} delay={i * 80}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '18px',
                                        padding: '1.5rem',
                                        transition: 'background 0.2s, transform 0.2s',
                                        cursor: 'default',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = '' }}
                                    >
                                        <div style={{ fontSize: '2.25rem', marginBottom: '0.875rem' }}>{emoji}</div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem' }}>{nom}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                                    </div>
                                </AnimSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════
                    TIMELINE HISTORIQUE
                ════════════════════════════════════════════════ */}
                <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: '#f9fafb' }}>
                    <div className="container-main">
                        <AnimSection>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: '#fef3c7', borderRadius: '999px', marginBottom: '0.875rem' }}>
                                    <Clock size={14} color="#92400e" />
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Histoire & Mémoire</span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#111827', margin: '0 0 0.875rem' }}>
                                    Notre Histoire
                                </h2>
                                <p style={{ fontSize: '1.0625rem', color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
                                    Du XVIIe siècle à aujourd&apos;hui, retracez les étapes qui ont forgé l&apos;identité des Aguégués.
                                </p>
                            </div>
                        </AnimSection>

                        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
                            {/* Ligne verticale */}
                            <div style={{ position: 'absolute', left: '30px', top: '20px', bottom: '20px', width: '2px', background: 'linear-gradient(to bottom, #1a5c2a, #1e3a5f, #c4940a)', borderRadius: '999px', opacity: 0.3 }} className="timeline-line-hidden" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {timeline.map(({ annee, titre, texte, icon }, i) => (
                                    <AnimSection key={annee} delay={i * 100}>
                                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                            {/* Bulle */}
                                            <div style={{ flexShrink: 0 }}>
                                                <div style={{
                                                    width: '60px', height: '60px', borderRadius: '50%',
                                                    background: i === timeline.length - 1 ? 'linear-gradient(135deg, #1a5c2a, #1e3a5f)' : 'white',
                                                    border: '2.5px solid #1a5c2a',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: i === timeline.length - 1 ? 'white' : '#1a5c2a',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    position: 'relative', zIndex: 1,
                                                }}>
                                                    {icon}
                                                </div>
                                            </div>
                                            {/* Contenu */}
                                            <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem', flex: 1, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginTop: '0.625rem' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1a5c2a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{annee}</div>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem' }}>{titre}</h3>
                                                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{texte}</p>
                                            </div>
                                        </div>
                                    </AnimSection>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════
                    INFORMATIONS DE CONTACT MAIRIE
                ════════════════════════════════════════════════ */}
                <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 0', background: '#f0f4f8' }}>
                    <div className="container-main">
                        <AnimSection>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#111827', margin: '0 0 0.875rem' }}>
                                    Contacter la Mairie
                                </h2>
                                <p style={{ fontSize: '1.0625rem', color: '#6b7280', maxWidth: '480px', margin: '0 auto' }}>
                                    Retrouvez toutes les coordonnées officielles de la Mairie des Aguégués.
                                </p>
                            </div>
                        </AnimSection>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
                            {[
                                { icon: <MapPin size={22} />, titre: 'Adresse', vals: ['Mairie des Aguégués', 'BP 1179, Aguégués', 'Département de l\'Ouémé, Bénin'], color: '#1a5c2a', bg: '#dcf0e4' },
                                { icon: <Phone size={22} />, titre: 'Téléphones', vals: ['+229 97 33 87 49', '+229 97 85 62 18'], color: '#1e3a5f', bg: '#eff4fb' },
                                { icon: <Mail size={22} />, titre: 'Email', vals: ['mairiedesaguegues@yahoo.fr'], color: '#c4940a', bg: '#fef3c7' },
                                { icon: <Clock size={22} />, titre: 'Horaires', vals: ['Lun – Ven : 8h00 – 17h00', 'Week-end : Fermé'], color: '#7c3aed', bg: '#f5f3ff' },
                            ].map(({ icon, titre, vals, color, bg }, i) => (
                                <AnimSection key={titre} delay={i * 100}>
                                    <div style={{
                                        background: 'white', borderRadius: '18px',
                                        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                                        padding: '1.5rem',
                                        border: `2px solid ${color}10`,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${color}15` }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)' }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: '1.125rem' }}>
                                            {icon}
                                        </div>
                                        <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', margin: '0 0 0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{titre}</h3>
                                        {vals.map(v => <p key={v} style={{ fontSize: '0.9rem', color: '#4b5563', margin: '0 0 0.25rem', lineHeight: 1.5 }}>{v}</p>)}
                                    </div>
                                </AnimSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════
                    NOS VALEURS
                ════════════════════════════════════════════════ */}
                <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: '#f9fafb' }}>
                    <div className="container-main">
                        <AnimSection>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', background: '#fef3c7', borderRadius: '999px', marginBottom: '0.875rem' }}>
                                    <Heart size={14} color="#92400e" />
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ce qui nous guide</span>
                                </div>
                                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#111827', margin: '0 0 0.875rem' }}>
                                    Nos Valeurs
                                </h2>
                            </div>
                        </AnimSection>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
                            {valeurs.map(({ icon, titre, texte, couleur, bg }, i) => (
                                <AnimSection key={titre} delay={i * 100}>
                                    <div style={{ background: 'white', borderRadius: '18px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '2rem 1.5rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)' }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)' }}
                                    >
                                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: couleur }}>{icon}</div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: '0 0 0.625rem' }}>{titre}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{texte}</p>
                                    </div>
                                </AnimSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════════════════
                    CTA FINAL — BANDEAU COMPACT
                ════════════════════════════════════════════════ */}
                <AnimSection>
                    <div style={{
                        backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        padding: 'clamp(1.25rem, 3vw, 1.75rem) clamp(1rem, 4vw, 2.5rem)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* Overlay vert/sombre */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,20,10,0.92) 0%, rgba(26,92,42,0.88) 60%, rgba(15,45,74,0.90) 100%)', pointerEvents: 'none' }} />
                        {/* Motif pointillés */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
                        <div style={{
                            maxWidth: '1100px', margin: '0 auto', position: 'relative',
                            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                            justifyContent: 'space-between', gap: '1rem',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '1.625rem' }}>🏡</span>
                                <div>
                                    <div style={{ fontWeight: 800, color: 'white', fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)' }}>Rejoignez le mouvement des Aguégués</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>Cadre, citoyen ou partenaire — votre place est ici.</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <Link href="/inscription" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.625rem 1.375rem', background: 'white', color: '#1a5c2a',
                                    borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = ''}
                                >
                                    S&apos;inscrire <ArrowRight size={15} />
                                </Link>
                                <Link href="/contact" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.625rem 1.25rem', background: 'rgba(255,255,255,0.1)', color: 'white',
                                    borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                                    border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                >
                                    <BookOpen size={15} /> Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                </AnimSection>
            </main>
            <Footer />

            <style>{`
                /* Responsive 2 colonnes section */
                .section-2col {
                    grid-template-columns: 1fr;
                }
                @media (min-width: 900px) {
                    .section-2col {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                /* Timeline vertical line */
                .timeline-line-hidden {
                    display: block;
                }
                @media (max-width: 500px) {
                    .timeline-line-hidden {
                        display: none;
                    }
                }

                /* Particules hero */
                .hero-particles {
                    background-image:
                        radial-gradient(circle at 15% 85%, rgba(110,231,160,0.08) 0%, transparent 50%),
                        radial-gradient(circle at 85% 15%, rgba(30,58,95,0.15) 0%, transparent 50%);
                }

                /* Animation flottante pour elements hero */
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </>
    )
}
