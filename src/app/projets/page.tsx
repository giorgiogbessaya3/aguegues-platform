'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import { ArrowRight, Leaf, Heart, TrendingUp, BookOpen, Stethoscope, Building2, Droplets, TreePine, Zap, Users, Target } from 'lucide-react'

type Projet = {
    id: number
    titre: string
    slug: string
    description_courte: string
    description_complete: string
    montant_objectif: number
    montant_collecte: number
    pourcentage: number
    image_url: string | null
    categorie?: string
    jours_restants?: number
    nb_donateurs?: number
}

const CATEGORIES = [
    { id: 'tous', label: 'Tous', icon: Target },
    { id: 'education', label: 'Éducation', icon: BookOpen },
    { id: 'sante', label: 'Santé', icon: Stethoscope },
    { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
    { id: 'eau', label: 'Eau & Assainissement', icon: Droplets },
    { id: 'environnement', label: 'Environnement', icon: TreePine },
    { id: 'energie', label: 'Énergie', icon: Zap },
]

const PROJETS_DEMO: Projet[] = [
    {
        id: 1,
        titre: "Construction de l'École Primaire de Zoungomé",
        slug: "ecole-primaire-zoungome",
        description_courte: "Bâtir 6 salles de classe modernes pour accueillir 300 enfants dans des conditions dignes d'apprentissage.",
        description_complete: "Ce projet vise à construire une école primaire moderne dans le quartier de Zoungomé. Les enfants de ce quartier parcourent actuellement plus de 5 km pour aller à l'école. Les nouvelles installations comprendront 6 salles de classe, une bibliothèque et des sanitaires.",
        montant_objectif: 12000000,
        montant_collecte: 8400000,
        pourcentage: 70,
        image_url: null,
        categorie: 'education',
        jours_restants: 23,
        nb_donateurs: 142,
    },
    {
        id: 2,
        titre: "Centre de Santé Communautaire d'Agamè",
        slug: "centre-sante-agame",
        description_courte: "Doter le village d'Agamè d'un centre médical équipé pour servir 5 000 habitants.",
        description_complete: "Le village d'Agamè n'a aucun accès aux soins de santé à moins de 15 km. Ce centre offrira des consultations de base, maternité et pharmacie communautaire.",
        montant_objectif: 25000000,
        montant_collecte: 9750000,
        pourcentage: 39,
        image_url: null,
        categorie: 'sante',
        jours_restants: 45,
        nb_donateurs: 87,
    },
    {
        id: 3,
        titre: "Adduction d'Eau Potable — Village de Médédjonou",
        slug: "eau-potable-medjedjonou",
        description_courte: "Installer un réseau d'eau potable pour mettre fin aux 8 km de marche quotidienne des femmes et enfants.",
        description_complete: "Ce projet hydraulique financera le forage, le château d'eau et la distribution dans 5 hameaux. Il bénéficiera directement à plus de 2 000 personnes.",
        montant_objectif: 8500000,
        montant_collecte: 8075000,
        pourcentage: 95,
        image_url: null,
        categorie: 'eau',
        jours_restants: 5,
        nb_donateurs: 214,
    },
    {
        id: 4,
        titre: "Réfection de la Piste Rurale Gbédégban–Aguégués",
        slug: "piste-rurale-gbedegban",
        description_courte: "Remettre en état 12 km de piste pour désenclaver 4 villages et faciliter l'écoulement des productions agricoles.",
        description_complete: "La piste rurale reliant Gbédégban aux Aguégués est impraticable depuis la saison des pluies. Ce projet financera le rechargement en latérite et la pose de buses de drainage.",
        montant_objectif: 18000000,
        montant_collecte: 5400000,
        pourcentage: 30,
        image_url: null,
        categorie: 'infrastructure',
        jours_restants: 60,
        nb_donateurs: 53,
    },
    {
        id: 5,
        titre: "Reboisement du Bord du Lac Nokoué",
        slug: "reboisement-lac-nokoue",
        description_courte: "Planter 10 000 arbres le long des berges pour lutter contre l'érosion et protéger l'écosystème lacustre.",
        description_complete: "Face à la dégradation alarmante des berges du Lac Nokoué, ce programme de reboisement mobilisera les jeunes du village et les éco-gardes de la commune.",
        montant_objectif: 4000000,
        montant_collecte: 2600000,
        pourcentage: 65,
        image_url: null,
        categorie: 'environnement',
        jours_restants: 30,
        nb_donateurs: 176,
    },
    {
        id: 6,
        titre: "Électrification Solaire des Écoles d'Igbodja",
        slug: "electrification-solaire-igbodja",
        description_courte: "Équiper 3 établissements scolaires de panneaux solaires pour garantir l'éclairage des classes et des salles informatiques.",
        description_complete: "Les coupures de courant fréquentes pénalisent l'apprentissage. Ce projet dotera chaque école d'une installation solaire autonome avec batteries de stockage.",
        montant_objectif: 9500000,
        montant_collecte: 4275000,
        pourcentage: 45,
        image_url: null,
        categorie: 'energie',
        jours_restants: 38,
        nb_donateurs: 98,
    },
]

const ICONES_CATEGORIES: Record<string, React.ElementType> = {
    education: BookOpen,
    sante: Stethoscope,
    infrastructure: Building2,
    eau: Droplets,
    environnement: TreePine,
    energie: Zap,
}

function AnimatedCounter({ end, prefix = '', suffix = '' }: { end: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const started = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true
                let start = 0
                const duration = 1500
                const step = end / (duration / 16)
                const timer = setInterval(() => {
                    start += step
                    if (start >= end) { setCount(end); clearInterval(timer) }
                    else setCount(Math.floor(start))
                }, 16)
            }
        }, { threshold: 0.3 })
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [end])

    return <span ref={ref}>{prefix}{count.toLocaleString('fr-FR')}{suffix}</span>
}

export default function ProjetsPage() {
    const [projets, setProjets] = useState<Projet[]>(PROJETS_DEMO)
    const [loading, setLoading] = useState(false)
    const [filtre, setFiltre] = useState('tous')

    useEffect(() => {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/projets`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setProjets(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const projetsFiltres = filtre === 'tous'
        ? projets
        : projets.filter(p => p.categorie === filtre)

    const totalCollecte = projets.reduce((s, p) => s + p.montant_collecte, 0)
    const totalDonateurs = projets.reduce((s, p) => s + (p.nb_donateurs ?? 0), 0)
    const maxPourcentage = Math.max(...projets.map(p => p.pourcentage))

    return (
        <>
        <main style={{
            minHeight: '100vh',
            background: '#0a1620',
            backgroundImage: 'url(/commune/arrpresentation.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
        }}>
            {/* Overlay fixe sombre */}
            <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(10,22,32,0.93) 0%, rgba(10,22,32,0.88) 100%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Hero */}
            <div
                className="text-white relative overflow-hidden"
                style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: 'clamp(2rem, 5vw, 3rem) 0 clamp(1.5rem, 3vw, 2.25rem)',
                }}
            >
                {/* Overlay sombre pour lisibilité */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1620 0%, rgba(10,22,32,0.75) 60%, rgba(10,22,32,0.5) 100%)' }} />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-5xl">
                    <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border border-yellow-400/30">
                        <Heart size={11} className="animate-pulse" /> Solidarité communautaire
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight leading-tight">
                        Projets à <span className="text-yellow-400">Soutenir</span>
                    </h1>
                    <p className="text-base text-green-100 max-w-xl font-light mb-6">
                        Devenez acteur du développement des Aguégués. Chaque contribution bâtit l&apos;avenir de notre commune.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 max-w-lg">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
                            <div className="text-xl md:text-2xl font-black text-yellow-400 mb-0.5">
                                <AnimatedCounter end={projets.length} />
                            </div>
                            <div className="text-green-200 text-xs font-semibold uppercase tracking-wide">Projets actifs</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
                            <div className="text-lg md:text-xl font-black text-yellow-400 mb-0.5">
                                <AnimatedCounter end={Math.round(totalCollecte / 1000000)} suffix="M FCFA" />
                            </div>
                            <div className="text-green-200 text-xs font-semibold uppercase tracking-wide">Collectés</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
                            <div className="text-xl md:text-2xl font-black text-yellow-400 mb-0.5">
                                <AnimatedCounter end={totalDonateurs} suffix="+" />
                            </div>
                            <div className="text-green-200 text-xs font-semibold uppercase tracking-wide">Donateurs</div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Filtres */}
            <div style={{ position: 'sticky', top: '64px', zIndex: 20, background: 'rgba(10,22,32,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="container mx-auto px-4 lg:px-8 max-w-5xl" style={{ padding: '0.625rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon
                        const active = filtre === cat.id
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setFiltre(cat.id)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                                    padding: '0.45rem 0.875rem', borderRadius: '999px',
                                    cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', fontFamily: 'inherit',
                                    whiteSpace: 'nowrap',
                                    background: active ? 'rgba(52,211,153,0.18)' : 'rgba(255,255,255,0.05)',
                                    color: active ? '#34d399' : '#7ea8a8',
                                    border: `1.5px solid ${active ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
                                    boxShadow: active ? '0 0 16px rgba(52,211,153,0.2)' : 'none',
                                    transform: active ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                }}
                            >
                                <Icon size={13} />
                                {cat.label}
                                {cat.id !== 'tous' && (
                                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '999px', fontWeight: 700, background: active ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)', color: active ? '#34d399' : '#7ea8a8' }}>
                                        {projets.filter(p => p.categorie === cat.id).length}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Liste */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(52,211,153,0.2)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    </div>
                ) : projetsFiltres.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Aucun projet dans cette catégorie</h3>
                        <p style={{ color: '#7ea8a8', marginBottom: '1.5rem' }}>D&apos;autres initiatives seront bientôt publiées ici.</p>
                        <button onClick={() => setFiltre('tous')} style={{ padding: '0.625rem 1.5rem', background: '#34d399', color: '#0a1620', fontWeight: 800, borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                            Voir tous les projets
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.125rem' }}>
                        {projetsFiltres.map((projet, idx) => {
                            const isPopulaire = projet.pourcentage === maxPourcentage
                            const IconCat = projet.categorie ? ICONES_CATEGORIES[projet.categorie] : Leaf
                            const urgence = (projet.jours_restants ?? 99) <= 7
                            const pct = projet.pourcentage
                            const barColor = pct >= 75 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#fb923c'
                            return (
                                <Link
                                    href={`/projets/${projet.slug}`}
                                    key={projet.id}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="projet-card" style={{
                                        background: 'rgba(53,78,84,0.45)',
                                        backdropFilter: 'blur(16px)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column',
                                        animation: `cardIn 0.5s cubic-bezier(0.22,1,0.36,1) ${idx * 80}ms both`,
                                        position: 'relative',
                                        transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.28s',
                                    }}>
                                        {/* Badges */}
                                        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {isPopulaire && (
                                                <span style={{ background: '#fbbf24', color: '#92400e', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.625rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    🔥 Populaire
                                                </span>
                                            )}
                                            {urgence && (
                                                <span style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.625rem', borderRadius: '999px', animation: 'pulseDot 1.4s ease-in-out infinite' }}>
                                                    ⏰ Urgent
                                                </span>
                                            )}
                                        </div>

                                        {/* Bannière */}
                                        <div style={{ height: '120px', background: 'linear-gradient(160deg, #1a2e3a 0%, #0f1f2b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                            {/* Grille pointillée */}
                                            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                            {/* Glow orbe top-right */}
                                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: barColor, opacity: 0.5, filter: 'blur(22px)', animation: `orbFloat ${6 + idx % 3}s ease-in-out ${idx * 0.4}s infinite`, pointerEvents: 'none' }} />
                                            <div style={{ position: 'absolute', top: '8px', right: '12px', width: '30px', height: '30px', borderRadius: '50%', background: barColor, opacity: 0.7, filter: 'blur(8px)', animation: `orbFloat ${7 + idx % 2}s ease-in-out ${0.6 + idx * 0.3}s infinite reverse`, pointerEvents: 'none' }} />
                                            {projet.image_url ? (
                                                <img src={projet.image_url} alt={projet.titre} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                                            ) : (
                                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${barColor}22`, border: `1.5px solid ${barColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${barColor}30`, position: 'relative', zIndex: 1 }}>
                                                    {IconCat && <IconCat size={24} color={barColor} />}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ padding: '1.125rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            {projet.categorie && (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.625rem', borderRadius: '999px', background: `${barColor}15`, border: `1px solid ${barColor}35`, color: barColor, fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.625rem', letterSpacing: '0.04em', alignSelf: 'flex-start' }}>
                                                    {IconCat && <IconCat size={11} />} {CATEGORIES.find(c => c.id === projet.categorie)?.label ?? projet.categorie}
                                                </span>
                                            )}
                                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', margin: '0 0 0.375rem', lineHeight: 1.4 }}>{projet.titre}</h3>
                                            <p style={{ fontSize: '0.8125rem', color: '#7ea8a8', lineHeight: 1.65, margin: '0 0 0.875rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{projet.description_courte}</p>

                                            {/* Progress */}
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '6px', overflow: 'hidden', marginBottom: '0.375rem' }}>
                                                    <div style={{ height: '100%', borderRadius: '999px', width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}99, ${barColor})`, boxShadow: `0 0 8px ${barColor}60`, transition: 'width 1s ease-out' }} />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                                                    <span style={{ color: barColor }}>{new Intl.NumberFormat('fr-FR').format(projet.montant_collecte)} FCFA</span>
                                                    <span style={{ color: '#7ea8a8' }}>{pct}%</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#7ea8a8', fontWeight: 600 }}>
                                                    {projet.nb_donateurs !== undefined && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Users size={12} /> {projet.nb_donateurs}
                                                        </span>
                                                    )}
                                                    {projet.jours_restants !== undefined && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: urgence ? '#f87171' : '#7ea8a8' }}>
                                                            ⏱ {projet.jours_restants}j restants
                                                        </span>
                                                    )}
                                                </div>
                                                <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${barColor}15`, border: `1px solid ${barColor}35`, color: barColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                                    <ArrowRight size={15} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* CTA Proposer un projet */}
                <div className="mt-10 bg-gradient-to-r from-[#1a5c2a] to-green-700 rounded-2xl p-5 md:p-7 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <TrendingUp size={36} className="text-yellow-400 relative z-10 shrink-0" />
                    <div className="flex-1 text-center md:text-left relative z-10">
                        <h2 className="text-lg md:text-xl font-black mb-1">Vous avez un projet pour les Aguégués ?</h2>
                        <p className="text-green-100 text-sm max-w-lg">
                            Soumettez votre initiative à la mairie. Les meilleures propositions seront publées et financées par la diaspora.
                        </p>
                    </div>
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black px-6 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg relative z-10 shrink-0 text-sm whitespace-nowrap">
                        Proposer un projet <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
            </div>
        </main>
        <style>{`
            @keyframes cardIn {
                from { opacity: 0; transform: translateY(16px) scale(0.97); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes orbFloat {
                0%,100% { transform: translateY(0); }
                50%      { transform: translateY(-10px); }
            }
            @keyframes pulseDot {
                0%,100% { opacity: 1; }
                50%      { opacity: 0.5; }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .projet-card:hover {
                transform: translateY(-6px) scale(1.01) !important;
                border-color: rgba(126,200,200,0.22) !important;
                box-shadow: 0 16px 48px rgba(0,0,0,0.4) !important;
            }
        `}</style>
        <Footer />
        </>
    )
}
