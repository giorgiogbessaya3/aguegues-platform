'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
    ChevronRight, Search, X, MapPin, Briefcase,
    CheckCircle, Send, Users, ClipboardList, UserPlus,
    Lock, Clock, GraduationCap, User, Phone, Mail,
} from 'lucide-react'

/* ─── Palette thème (identique Doléances) ───────────────────────── */
const T = {
    bg:     '#0a1620',
    card:   'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.07)',
    accent: '#7ec8c8',
    text:   '#c8dede',
    muted:  '#7ea8a8',
    white:  '#ffffff',
}

/* ─── Données statiques ─────────────────────────────────────────── */
const CADRES_DEMO = [
    { id: '1', nom: 'Dr. Kofi Mensah',        domaine: 'Santé',       fonction: 'Médecin Chirurgien',    localisation: 'Cotonou',       disponible: true,  competences: ['Chirurgie', 'Pédiatrie', 'Santé publique'],          initiales: 'KM', couleur: '#10b981' },
    { id: '2', nom: 'Ing. Adélaïde Hounton',  domaine: 'Finance',     fonction: 'Ingénieure Financière', localisation: 'Cotonou',       disponible: true,  competences: ['Analyse financière', 'Audit', 'Comptabilité'],       initiales: 'AH', couleur: '#7ec8c8' },
    { id: '3', nom: 'Me. Patrice Agossou',    domaine: 'Droit',       fonction: 'Avocat Associé',        localisation: 'Porto-Novo',    disponible: false, competences: ['Droit des affaires', 'Arbitrage'],                   initiales: 'PA', couleur: '#f59e0b' },
    { id: '4', nom: 'Pr. Célestine Dossou',   domaine: 'Éducation',   fonction: 'Professeure Titulaire', localisation: 'Abomey-Calavi', disponible: true,  competences: ['Mathématiques', 'Recherche', 'Pédagogie'],           initiales: 'CD', couleur: '#a78bfa' },
    { id: '5', nom: 'Ing. Romuald Gandonou',  domaine: 'BTP',         fonction: 'Directeur des Travaux', localisation: 'Cotonou',       disponible: false, competences: ['Infrastructure', 'Génie civil', 'Management'],       initiales: 'RG', couleur: '#f97316' },
    { id: '6', nom: 'Ing. Marcelline Atchade',domaine: 'Technologie', fonction: 'Chef de Projet IT',     localisation: 'Cotonou',       disponible: true,  competences: ['Télécoms', 'Digital', 'Gestion de projet'],          initiales: 'MA', couleur: '#38bdf8' },
]

const domaines = ['Tous', 'Santé', 'Finance', 'Droit', 'Éducation', 'BTP', 'Technologie', 'Agriculture', 'Politique', 'Autre']
const villages = ['Aguégués Centre', 'Avagbodji', 'Tohouè', 'Dégon', 'Hêtin-Sota', 'Zoungamè', 'Kpinnou', 'Akodéha', 'Gankpétin', 'Vêki']

type MonInscriptionForm = {
    nom: string; prenom: string; telephone: string; email: string
    domaine: string; fonction_actuelle: string; localisation: string
    disponible: boolean; competences: string
}

/* ─── Hook scroll reveal ────────────────────────────────────────── */
function useReveal() {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return { ref, visible }
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, visible } = useReveal()
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        }}>{children}</div>
    )
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function EspaceCadresPage() {
    const [onglet, setOnglet] = useState<'annuaire' | 'inscription'>('annuaire')
    const [heroIn, setHeroIn] = useState(false)

    // Annuaire
    const [recherche, setRecherche] = useState('')
    const [domaineFiltre, setDomaineFiltre] = useState('Tous')
    const [dispoFiltre, setDispoFiltre] = useState(false)

    // Inscription
    const [form, setForm] = useState<MonInscriptionForm>({
        nom: '', prenom: '', telephone: '', email: '',
        domaine: '', fonction_actuelle: '', localisation: '',
        disponible: false, competences: '',
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [erreur, setErreur] = useState('')

    useEffect(() => { const t = setTimeout(() => setHeroIn(true), 80); return () => clearTimeout(t) }, [])

    const set = (k: keyof MonInscriptionForm, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

    const resultats = useMemo(() => CADRES_DEMO.filter(c => {
        const q = recherche.toLowerCase()
        const matchQ = !q || c.nom.toLowerCase().includes(q) || c.domaine.toLowerCase().includes(q) || c.fonction.toLowerCase().includes(q)
        const matchD = domaineFiltre === 'Tous' || c.domaine === domaineFiltre
        const matchDispo = !dispoFiltre || c.disponible
        return matchQ && matchD && matchDispo
    }), [recherche, domaineFiltre, dispoFiltre])

    const handleInscription = async (e: React.FormEvent) => {
        e.preventDefault()
        setErreur('')
        if (!form.nom || !form.prenom || !form.domaine || !form.fonction_actuelle) {
            setErreur('Veuillez remplir les champs obligatoires marqués *')
            return
        }
        setLoading(true)
        // Simulation locale — pas de dépendance Supabase
        await new Promise(r => setTimeout(r, 900))
        setLoading(false)
        setSuccess(true)
    }

    return (
        <>
            <main style={{ minHeight: '100vh', background: T.bg }}>

                {/* ═══ HERO ══════════════════════════════════════════════════ */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover', backgroundPosition: 'center 30%',
                    position: 'relative', overflow: 'hidden',
                    minHeight: '420px',
                    display: 'flex', alignItems: 'flex-end',
                    padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
                }}>
                    {/* Overlay multicouche */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1620 0%, rgba(10,22,32,0.78) 55%, rgba(10,22,32,0.45) 100%)' }} />
                    {/* Particules déco */}
                    <div className="ec-hero-particles" />

                    <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px' }}>
                        {/* Fil d'Ariane */}
                        <div className={`ec-hero-elem${heroIn ? ' ec-hero-in' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.25rem', transitionDelay: '0ms' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.8125rem' }}>Accueil</Link>
                            <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
                            <span style={{ color: T.accent, fontSize: '0.8125rem', fontWeight: 600 }}>Espace Cadres</span>
                        </div>

                        {/* Badge */}
                        <div className={`ec-hero-elem${heroIn ? ' ec-hero-in' : ''}`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.3rem 0.875rem',
                            background: 'rgba(126,200,200,0.12)', border: '1px solid rgba(126,200,200,0.28)',
                            borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                            color: T.accent, marginBottom: '1rem', letterSpacing: '0.06em',
                            transitionDelay: '100ms',
                        }}>
                            <GraduationCap size={11} /> BASE DE DONNÉES DES COMPÉTENCES
                        </div>

                        {/* Titre */}
                        <h1 className={`ec-hero-elem${heroIn ? ' ec-hero-in' : ''}`} style={{
                            fontSize: 'clamp(1.875rem, 5vw, 3.25rem)', fontWeight: 900, color: T.white,
                            lineHeight: 1.1, margin: '0 0 1rem', letterSpacing: '-0.025em',
                            transitionDelay: '160ms',
                        }}>
                            Espace Cadres<br />
                            <span style={{ background: 'linear-gradient(90deg, #7ec8c8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>des Aguégués</span>
                        </h1>

                        {/* Sous-titre */}
                        <p className={`ec-hero-elem${heroIn ? ' ec-hero-in' : ''}`} style={{
                            fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)', color: 'rgba(200,222,222,0.7)',
                            lineHeight: 1.8, maxWidth: '560px', margin: '0 0 2rem',
                            transitionDelay: '220ms',
                        }}>
                            Identifiez, rassemblez et valorisez tous les talents issus de notre commune,
                            où qu&apos;ils se trouvent dans le monde.
                        </p>

                        {/* Stats */}
                        <div className={`ec-hero-elem${heroIn ? ' ec-hero-in' : ''}`} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem', transitionDelay: '300ms' }}>
                            {[
                                { icon: <Users size={18} color={T.accent} />,        val: `${CADRES_DEMO.length}+`, lab: 'Cadres inscrits' },
                                { icon: <CheckCircle size={18} color={T.accent} />,  val: `${CADRES_DEMO.filter(c => c.disponible).length}`, lab: 'Disponibles' },
                                { icon: <Briefcase size={18} color={T.accent} />,    val: `${domaines.length - 1}`, lab: 'Domaines' },
                            ].map(s => (
                                <div key={s.lab} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(126,200,200,0.1)', border: '1px solid rgba(126,200,200,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 900, fontSize: '1rem', color: T.accent }}>{s.val}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(200,222,222,0.5)', fontWeight: 500 }}>{s.lab}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Onglets */}
                        <div style={{ display: 'flex', gap: '0' }}>
                            {([
                                { key: 'annuaire',    icon: <Users size={15} />,    label: 'Annuaire' },
                                { key: 'inscription', icon: <UserPlus size={15} />, label: "M'inscrire" },
                            ] as const).map(({ key, icon, label }) => (
                                <button key={key} onClick={() => setOnglet(key)} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: onglet === key ? T.accent : 'transparent',
                                    color: onglet === key ? '#0a1620' : 'rgba(255,255,255,0.7)',
                                    border: 'none', cursor: 'pointer',
                                    fontWeight: 700, fontSize: '0.875rem',
                                    borderRadius: '12px 12px 0 0',
                                    transition: 'all 0.2s',
                                    fontFamily: 'inherit',
                                }}>
                                    {icon} {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══ CONTENU ═══════════════════════════════════════════════ */}
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)' }}>

                    {/* ════ ONGLET ANNUAIRE ════ */}
                    {onglet === 'annuaire' && (
                        <>
                            {/* Barre de recherche — glassmorphism */}
                            <Reveal delay={0}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(16px)',
                                    borderRadius: '18px',
                                    border: `1px solid ${T.border}`,
                                    padding: '1.25rem',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {/* Recherche */}
                                        <div style={{ flex: '1 1 220px', position: 'relative' }}>
                                            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: T.muted }} />
                                            <input type="text" placeholder="Nom, fonction, domaine…"
                                                value={recherche} onChange={e => setRecherche(e.target.value)}
                                                className="ec-input"
                                                style={{ paddingLeft: '2.5rem' }}
                                            />
                                        </div>
                                        {/* Filtre domaine */}
                                        <select value={domaineFiltre} onChange={e => setDomaineFiltre(e.target.value)} className="ec-input" style={{ flex: '0 0 auto', minWidth: '150px' }}>
                                            {domaines.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        {/* Dispo */}
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: T.text, whiteSpace: 'nowrap' }}>
                                            <input type="checkbox" checked={dispoFiltre} onChange={e => setDispoFiltre(e.target.checked)} style={{ accentColor: T.accent, width: '16px', height: '16px' }} />
                                            Disponibles
                                        </label>
                                        {(recherche || domaineFiltre !== 'Tous' || dispoFiltre) && (
                                            <button onClick={() => { setRecherche(''); setDomaineFiltre('Tous'); setDispoFiltre(false) }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#f87171', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                                <X size={13} /> Effacer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Reveal>

                            <p style={{ fontSize: '0.875rem', color: T.muted, marginBottom: '1rem' }}>
                                <strong style={{ color: T.text }}>{resultats.length}</strong> cadre{resultats.length > 1 ? 's' : ''} trouvé{resultats.length > 1 ? 's' : ''}
                            </p>

                            {resultats.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: T.card, backdropFilter: 'blur(12px)', borderRadius: '18px', border: `1px solid ${T.border}` }}>
                                    <ClipboardList size={40} color={T.muted} style={{ margin: '0 auto 1rem' }} />
                                    <p style={{ color: T.text, fontWeight: 600, marginBottom: '0.375rem' }}>Aucun résultat</p>
                                    <p style={{ color: T.muted, fontSize: '0.875rem' }}>Modifiez vos critères de recherche.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.125rem' }}>
                                    {resultats.map((c, i) => (
                                        <Reveal key={c.id} delay={i * 60}>
                                            <div className="ec-card">
                                                {/* Bande colorée */}
                                                <div style={{ height: '3px', background: `linear-gradient(90deg, ${c.couleur}, ${c.couleur}55)` }} />
                                                <div style={{ padding: '1.25rem' }}>
                                                    {/* Header */}
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem' }}>
                                                        <div style={{
                                                            width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
                                                            background: `${c.couleur}18`, border: `1.5px solid ${c.couleur}35`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '0.9rem', fontWeight: 800, color: c.couleur,
                                                        }}>{c.initiales}</div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: T.white, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nom}</div>
                                                            <div style={{ fontSize: '0.8125rem', color: T.muted, lineHeight: 1.4 }}>{c.fonction}</div>
                                                        </div>
                                                        <div style={{
                                                            flexShrink: 0, padding: '0.2rem 0.5rem', borderRadius: '999px',
                                                            fontSize: '0.6875rem', fontWeight: 700,
                                                            background: c.disponible ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)',
                                                            color: c.disponible ? '#34d399' : T.muted,
                                                            border: `1px solid ${c.disponible ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`,
                                                        }}>
                                                            {c.disponible ? '● Dispo' : '○ Occupé'}
                                                        </div>
                                                    </div>

                                                    {/* Infos */}
                                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: T.muted }}>
                                                            <Briefcase size={12} color={T.muted} /> {c.domaine}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: T.muted }}>
                                                            <MapPin size={12} color={T.muted} /> {c.localisation}
                                                        </span>
                                                    </div>

                                                    {/* Compétences */}
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                                                        {c.competences.slice(0, 3).map(comp => (
                                                            <span key={comp} style={{
                                                                padding: '0.2rem 0.6rem', borderRadius: '6px',
                                                                background: `${c.couleur}12`, color: c.couleur,
                                                                fontSize: '0.7rem', fontWeight: 600,
                                                                border: `1px solid ${c.couleur}22`,
                                                            }}>{comp}</span>
                                                        ))}
                                                    </div>

                                                    <Link href={`/annuaire/cadres/${c.id}`} className="ec-card-link">
                                                        Voir le profil →
                                                    </Link>
                                                </div>
                                            </div>
                                        </Reveal>
                                    ))}
                                </div>
                            )}

                            {/* CTA inscription */}
                            <Reveal delay={200}>
                                <div style={{
                                    marginTop: '2.5rem', padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1.25rem, 3vw, 2rem)',
                                    background: 'linear-gradient(135deg, rgba(30,58,95,0.6), rgba(26,92,42,0.6))',
                                    backdropFilter: 'blur(16px)',
                                    borderRadius: '18px',
                                    border: '1px solid rgba(126,200,200,0.15)',
                                    display: 'flex', flexWrap: 'wrap',
                                    alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                                }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: T.white, marginBottom: '0.25rem' }}>
                                            Vous êtes originaire des Aguégués ?
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: T.muted }}>
                                            Inscrivez-vous pour rejoindre la base de données des compétences.
                                        </div>
                                    </div>
                                    <button onClick={() => setOnglet('inscription')} style={{
                                        padding: '0.75rem 1.5rem', background: T.accent, color: '#0a1620',
                                        border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem',
                                        cursor: 'pointer', boxShadow: '0 4px 18px rgba(126,200,200,0.3)', fontFamily: 'inherit',
                                        whiteSpace: 'nowrap', transition: 'transform 0.2s, box-shadow 0.2s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(126,200,200,0.45)' }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(126,200,200,0.3)' }}
                                    >
                                        + M&apos;inscrire comme cadre
                                    </button>
                                </div>
                            </Reveal>
                        </>
                    )}

                    {/* ════ ONGLET INSCRIPTION ════ */}
                    {onglet === 'inscription' && (
                        success ? (
                            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: T.card, backdropFilter: 'blur(12px)', borderRadius: '22px', border: `1px solid ${T.border}` }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(126,200,200,0.15))',
                                    border: '2px solid rgba(52,211,153,0.4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    boxShadow: '0 0 32px rgba(52,211,153,0.2)',
                                }}>
                                    <CheckCircle size={40} color="#34d399" />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: T.white, marginBottom: '0.75rem' }}>
                                    Profil enregistré !
                                </h2>
                                <p style={{ color: T.text, lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 2rem' }}>
                                    Votre profil a bien été ajouté à la base de données des cadres des Aguégués.
                                    Il sera visible après validation par l&apos;administration.
                                </p>
                                <button onClick={() => { setSuccess(false); setOnglet('annuaire') }} style={{
                                    padding: '0.75rem 1.75rem', background: T.accent, color: '#0a1620',
                                    border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit',
                                }}>
                                    Voir l&apos;annuaire →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInscription}>
                                {erreur && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderRadius: '14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: '1.25rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: '#fca5a5', flex: 1 }}>{erreur}</span>
                                        <button type="button" onClick={() => setErreur('')} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex' }}><X size={15} /></button>
                                    </div>
                                )}

                                {/* Section 1 — Identité */}
                                <EcSection num="1" icon={<User size={14} />} titre="Identité">
                                    <div className="ec-form-grid">
                                        <EcField label="Nom *"><input required value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="AGOSSOU" className="ec-field-input" /></EcField>
                                        <EcField label="Prénom *"><input required value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Jean-Baptiste" className="ec-field-input" /></EcField>
                                    </div>
                                    <div className="ec-form-grid">
                                        <EcField label="Téléphone">
                                            <div style={{ position: 'relative' }}>
                                                <Phone size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: T.muted, pointerEvents: 'none' }} />
                                                <input value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="+229 97 000 000" type="tel" className="ec-field-input" style={{ paddingLeft: '2.5rem' }} />
                                            </div>
                                        </EcField>
                                        <EcField label="Email">
                                            <div style={{ position: 'relative' }}>
                                                <Mail size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: T.muted, pointerEvents: 'none' }} />
                                                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="jean@example.com" type="email" className="ec-field-input" style={{ paddingLeft: '2.5rem' }} />
                                            </div>
                                        </EcField>
                                    </div>
                                </EcSection>

                                {/* Section 2 — Profil professionnel */}
                                <EcSection num="2" icon={<Briefcase size={14} />} titre="Profil professionnel">
                                    <EcField label="Domaine d'activité *">
                                        <select required value={form.domaine} onChange={e => set('domaine', e.target.value)} className="ec-field-input">
                                            <option value="">— Sélectionnez —</option>
                                            {domaines.filter(d => d !== 'Tous').map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </EcField>
                                    <EcField label="Fonction actuelle *">
                                        <input required value={form.fonction_actuelle} onChange={e => set('fonction_actuelle', e.target.value)} placeholder="Ex : Directeur médical, Avocat, Ingénieur…" className="ec-field-input" />
                                    </EcField>
                                    <EcField label="Compétences clés (séparées par des virgules)">
                                        <input value={form.competences} onChange={e => set('competences', e.target.value)} placeholder="Ex : Chirurgie, Santé publique, Gestion de projet" className="ec-field-input" />
                                    </EcField>
                                </EcSection>

                                {/* Section 3 — Localisation & disponibilité */}
                                <EcSection num="3" icon={<MapPin size={14} />} titre="Localisation & disponibilité">
                                    <EcField label="Village / quartier d'origine">
                                        <select value={form.localisation} onChange={e => set('localisation', e.target.value)} className="ec-field-input">
                                            <option value="">— Sélectionnez —</option>
                                            {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </EcField>
                                    <label className={`ec-dispo-label${form.disponible ? ' ec-dispo-active' : ''}`}>
                                        <input type="checkbox" checked={form.disponible} onChange={e => set('disponible', e.target.checked)} style={{ accentColor: T.accent, width: '18px', height: '18px' }} />
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: T.white }}>Je suis disponible pour contribuer</div>
                                            <div style={{ fontSize: '0.8125rem', color: T.muted }}>Conseil, mentorat, expertise, action terrain…</div>
                                        </div>
                                    </label>
                                </EcSection>

                                <button type="submit" disabled={loading} className="ec-submit-btn">
                                    {loading ? <><span className="ec-spinner" /> Enregistrement…</> : <><Send size={17} /> Enregistrer mon profil</>}
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: T.muted, marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                                    <Lock size={12} /> Informations confidentielles — visible après validation par l&apos;administration.
                                </p>
                            </form>
                        )
                    )}
                </div>
            </main>
            <Footer />
            <style>{`
                /* ═══ Animations hero ═══ */
                .ec-hero-elem {
                    opacity: 0; transform: translateY(18px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                .ec-hero-elem.ec-hero-in { opacity: 1; transform: translateY(0); }

                /* ═══ Particules déco ═══ */
                .ec-hero-particles {
                    position: absolute; inset: 0; pointer-events: none;
                    background-image:
                        radial-gradient(circle at 20% 80%, rgba(126,200,200,0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(52,211,153,0.06) 0%, transparent 50%);
                }

                /* ═══ Inputs / selects ═══ */
                .ec-input {
                    width: 100%;
                    padding: 0.6875rem 1rem;
                    background: rgba(255,255,255,0.04);
                    border: 1.5px solid rgba(255,255,255,0.08);
                    border-radius: 10px;
                    font-size: 0.9rem; color: #c8dede;
                    font-family: inherit; outline: none;
                    box-sizing: border-box;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .ec-input:focus {
                    border-color: #7ec8c8;
                    box-shadow: 0 0 0 3px rgba(126,200,200,0.12);
                }
                .ec-input option { background: #1a2e3a; color: #c8dede; }

                /* ═══ Cartes annuaire ═══ */
                .ec-card {
                    background: rgba(255,255,255,0.03);
                    backdropFilter: blur(12px);
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.07);
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
                }
                .ec-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(0,0,0,0.35);
                    border-color: rgba(126,200,200,0.2);
                }
                .ec-card-link {
                    display: flex; align-items: center; justify-content: center; gap: 0.375rem;
                    margin-top: 0.75rem; padding: 0.5625rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px; color: #7ec8c8;
                    font-weight: 600; font-size: 0.8125rem; text-decoration: none;
                    transition: background 0.15s;
                }
                .ec-card-link:hover { background: rgba(126,200,200,0.1); }

                /* ═══ Sections formulaire glassmorphism ═══ */
                .ec-section {
                    background: rgba(255,255,255,0.03);
                    backdrop-filter: blur(12px);
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.07);
                    padding: clamp(1.25rem, 3vw, 1.875rem);
                    margin-bottom: 1.25rem;
                    box-shadow: 0 4px 30px rgba(0,0,0,0.25);
                    position: relative; overflow: hidden;
                }
                .ec-section::before {
                    content: '';
                    position: absolute; top: 0; left: 1.5rem; right: 1.5rem; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(126,200,200,0.2), transparent);
                }
                .ec-section-header {
                    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
                }
                .ec-section-num {
                    width: 32px; height: 32px; border-radius: '11px'; flex-shrink: 0;
                    background: linear-gradient(135deg, #2d4a52, #7ec8c8);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.8rem; font-weight: 900; color: #0a1620;
                    box-shadow: 0 4px 12px rgba(126,200,200,0.3);
                    border-radius: 11px;
                }
                .ec-field-label {
                    display: block;
                    font-size: 0.75rem; font-weight: 700;
                    color: #7ea8a8; margin-bottom: 0.625rem;
                    letter-spacing: 0.06em; text-transform: uppercase;
                }
                .ec-field-input {
                    width: 100%; padding: 0.8125rem 1rem;
                    background: rgba(255,255,255,0.04);
                    border: 1.5px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    font-size: 0.9375rem; color: #e2ecec;
                    font-family: inherit; outline: none;
                    box-sizing: border-box;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                }
                .ec-field-input:focus {
                    border-color: #7ec8c8;
                    box-shadow: 0 0 0 3px rgba(126,200,200,0.12);
                    background: rgba(255,255,255,0.06);
                }
                .ec-field-input option { background: #1a2e3a; color: #c8dede; }

                /* ═══ Disponibilité checkbox ═══ */
                .ec-dispo-label {
                    display: flex; align-items: center; gap: 0.875rem;
                    cursor: pointer; padding: 1rem;
                    border-radius: 14px;
                    border: 1.5px solid rgba(255,255,255,0.07);
                    background: rgba(255,255,255,0.02);
                    transition: border-color 0.2s, background 0.2s;
                }
                .ec-dispo-label.ec-dispo-active {
                    border-color: rgba(126,200,200,0.35);
                    background: rgba(126,200,200,0.06);
                }

                /* ═══ Grille 2 colonnes formulaire ═══ */
                .ec-form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
                @media (min-width: 480px) {
                    .ec-form-grid { grid-template-columns: 1fr 1fr; }
                }

                /* ═══ Bouton soumettre ═══ */
                .ec-submit-btn {
                    width: 100%; padding: 0.9375rem;
                    background: linear-gradient(135deg, #354E54, #7ec8c8);
                    color: #0a1620;
                    border: none; border-radius: 16px;
                    font-weight: 800; font-size: 1rem;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 0.625rem;
                    box-shadow: 0 6px 24px rgba(126,200,200,0.3);
                    font-family: inherit;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .ec-submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 36px rgba(126,200,200,0.45);
                }
                .ec-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                /* ═══ Spinner ═══ */
                .ec-spinner {
                    display: inline-block; width: 16px; height: 16px;
                    border: 2px solid rgba(10,22,32,0.25);
                    border-top-color: #0a1620;
                    border-radius: 50%;
                    animation: ec-spin 0.7s linear infinite;
                }
                @keyframes ec-spin { to { transform: rotate(360deg); } }
            `}</style>
        </>
    )
}

/* ─── Composants internes ─────────────────────────────────────── */
function EcSection({ num, icon, titre, children }: { num: string; icon: React.ReactNode; titre: string; children: React.ReactNode }) {
    return (
        <div className="ec-section">
            <div className="ec-section-header">
                <div className="ec-section-num">{num}</div>
                <span style={{ color: '#7ec8c8', flexShrink: 0 }}>{icon}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0, flex: 1 }}>{titre}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>{children}</div>
        </div>
    )
}

function EcField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="ec-field-label">{label}</label>
            {children}
        </div>
    )
}
