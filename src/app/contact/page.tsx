'use client'

import { useState, useRef, useEffect } from 'react'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
    Mail, Phone, MapPin, Send, ChevronRight,
    MessageSquare, Clock, Facebook, Twitter, Linkedin, CheckCircle,
    ArrowRight, HelpCircle
} from 'lucide-react'

/* ─── Palette thème (identique Actualités) ─────────────────── */
const T = {
    bg:     '#0a1620',
    card:   '#354E54',
    border: 'rgba(255,255,255,0.12)',
    text:   '#c8dede',
    muted:  '#7ea8a8',
    accent: '#7ec8c8',
    white:  '#ffffff',
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

/* ─── Hook Scroll Reveal ────────────────────────────────────── */
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

function Reveal({ children, delay = 0, dir = 'up' }: {
    children: React.ReactNode; delay?: number; dir?: 'up' | 'left' | 'right' | 'scale'
}) {
    const { ref, visible } = useReveal()
    const cls = `reveal reveal-${dir}${visible ? ' revealed' : ''}`
    return (
        <div ref={ref} className={cls} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    )
}

/* ─── Particule flottante ─────────────────────────────────── */
function FloatingParticle({ x, y, size, delay, dur }: {
    x: number; y: number; size: number; delay: number; dur: number
}) {
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

/* ─── Sujets du formulaire ────────────────────────────────── */
const sujets = [
    { value: 'general',     label: 'Renseignement général',      color: T.accent },
    { value: 'inscription', label: 'Aide à l\'inscription',      color: '#34d399' },
    { value: 'profil',      label: 'Problème avec mon profil',   color: '#fbbf24' },
    { value: 'partenariat', label: 'Proposition de partenariat', color: '#a78bfa' },
    { value: 'signalement', label: 'Signaler un contenu',        color: '#fb923c' },
    { value: 'autre',       label: 'Autre',                      color: T.muted  },
]

/* ═══════════════════════════════════════════════════════════ */
export default function ContactPage() {
    const [formData, setFormData] = useState({
        nom: '', email: '', telephone: '', sujet: 'general', message: ''
    })
    const [formState, setFormState] = useState<FormState>('idle')
    const [heroVisible, setHeroVisible] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 100)
        return () => clearTimeout(t)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormState('submitting')
        // Simulation envoi (pas de dépendance Supabase)
        await new Promise(r => setTimeout(r, 1400))
        setFormState('success')
    }

    const particles = [
        { x: 6,  y: 18, size: 4, delay: 0,   dur: 4.2 },
        { x: 22, y: 72, size: 3, delay: 1.2, dur: 3.8 },
        { x: 48, y: 14, size: 5, delay: 0.5, dur: 5.0 },
        { x: 68, y: 58, size: 3, delay: 2.1, dur: 4.5 },
        { x: 82, y: 28, size: 4, delay: 0.8, dur: 3.6 },
        { x: 92, y: 78, size: 6, delay: 1.7, dur: 4.8 },
        { x: 38, y: 88, size: 3, delay: 0.3, dur: 3.9 },
    ]

    const coordonnees = [
        {
            icon: <MapPin size={20} />,
            label: 'Adresse',
            value: 'Mairie des Aguégués, Département de l\'Ouémé, Bénin',
            color: '#34d399',
        },
        {
            icon: <Mail size={20} />,
            label: 'Email',
            value: 'contact@portail-aguegues.bj',
            href: 'mailto:contact@portail-aguegues.bj',
            color: T.accent,
        },
        {
            icon: <Phone size={20} />,
            label: 'Téléphone',
            value: '+229 XX XX XX XX',
            href: 'tel:+229XXXXXXXX',
            color: '#fbbf24',
        },
        {
            icon: <Clock size={20} />,
            label: 'Horaires',
            value: 'Lun – Ven : 8h00 – 17h00',
            color: '#a78bfa',
        },
    ]

    const reseaux = [
        { icon: <Facebook size={20} />, label: 'Facebook',  handle: '@portail.aguegues',            color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  href: '#' },
        { icon: <Twitter size={20} />,  label: 'Twitter / X', handle: '@aguegues_bj',             color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  href: '#' },
        { icon: <Linkedin size={20} />, label: 'LinkedIn',  handle: 'Portail Numérique des Aguégués', color: '#818cf8', bg: 'rgba(129,140,248,0.12)', href: '#' },
    ]

    const faq = [
        { q: 'Comment créer un compte ?',        href: '/inscription' },
        { q: 'Qui peut s\'inscrire ?',            href: '/a-propos'   },
        { q: 'Mes données sont-elles sécurisées ?', href: '/politique-confidentialite' },
    ]

    const sujetActif = sujets.find(s => s.value === formData.sujet)

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
                {/* Overlay fixe */}
                <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(10,22,32,0.93) 0%, rgba(10,22,32,0.88) 100%)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>

                    {/* ═══ HERO ══════════════════════════════════════════ */}
                    <div style={{
                        backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                        backgroundSize: 'cover', backgroundPosition: 'center 30%',
                        position: 'relative', overflow: 'hidden',
                        minHeight: '320px',
                        display: 'flex', alignItems: 'flex-end',
                        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
                    }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1620 0%, rgba(10,22,32,0.8) 55%, rgba(10,22,32,0.5) 100%)' }} />

                        {/* Grille pointillée */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

                        {/* Particules */}
                        {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

                        {/* Orbe lumineux */}
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
                                <span style={{ color: T.accent, fontSize: '0.8125rem', fontWeight: 600 }}>Contact</span>
                            </div>

                            {/* Badge animé */}
                            <div className={`hero-elem${heroVisible ? ' hero-in' : ''}`} style={{ transitionDelay: '120ms', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', background: 'rgba(126,200,200,0.12)', border: '1px solid rgba(126,200,200,0.28)', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, color: T.accent, marginBottom: '1rem', letterSpacing: '0.06em' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.accent, animation: 'pulseDot 1.8s ease-in-out infinite', display: 'inline-block' }} />
                                <MessageSquare size={11} /> CONTACTEZ-NOUS
                            </div>

                            <h1 className={`hero-elem${heroVisible ? ' hero-in' : ''}`} style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', fontWeight: 900, color: T.white, lineHeight: 1.1, margin: '0 0 0.875rem', letterSpacing: '-0.025em', transitionDelay: '200ms' }}>
                                Parlons-nous,{' '}
                                <span style={{ background: 'linear-gradient(90deg, #7ec8c8, #34d399, #7ec8c8)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmerText 3s linear infinite' }}>ensemble</span>
                            </h1>
                            <p className={`hero-elem${heroVisible ? ' hero-in' : ''}`} style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', color: 'rgba(200,222,222,0.65)', margin: 0, transitionDelay: '300ms' }}>
                                Notre équipe vous répond dans les 48h ouvrées. Posez-nous toutes vos questions.
                            </p>
                        </div>
                    </div>

                    {/* ═══ CONTENU PRINCIPAL ══════════════════════════════ */}
                    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)' }}>
                        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.75rem' }}>

                            {/* ══ FORMULAIRE ══════════════════════════════ */}
                            <Reveal delay={0} dir="up">
                                <div style={{
                                    background: 'rgba(53,78,84,0.55)',
                                    backdropFilter: 'blur(20px)',
                                    border: `1px solid ${T.border}`,
                                    borderRadius: '22px',
                                    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    {/* Orbe déco */}
                                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(126,200,200,0.06)', pointerEvents: 'none', animation: 'orbFloat 8s ease-in-out infinite' }} />

                                    {formState === 'success' ? (
                                        /* ── Succès ── */
                                        <div style={{ textAlign: 'center', padding: '3rem 1rem', animation: 'fadeIn 0.5s ease' }}>
                                            <div style={{
                                                width: '80px', height: '80px', borderRadius: '50%',
                                                background: 'rgba(52,211,153,0.15)',
                                                border: '2px solid rgba(52,211,153,0.4)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 1.5rem',
                                                boxShadow: '0 0 32px rgba(52,211,153,0.2)',
                                                animation: 'iconBreath 3s ease-in-out infinite',
                                            }}>
                                                <CheckCircle size={38} color="#34d399" />
                                            </div>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: T.white, margin: '0 0 0.75rem' }}>
                                                Message envoyé !
                                            </h2>
                                            <p style={{ color: T.text, lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 2rem' }}>
                                                Merci, <strong style={{ color: T.white }}>{formData.nom}</strong>. Notre équipe vous répondra à{' '}
                                                <strong style={{ color: T.accent }}>{formData.email}</strong> dans les 48 heures ouvrées.
                                            </p>
                                            <button
                                                onClick={() => { setFormState('idle'); setFormData({ nom: '', email: '', telephone: '', sujet: 'general', message: '' }) }}
                                                className="btn-contact-reset"
                                            >
                                                Envoyer un autre message
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: T.white, margin: '0 0 0.375rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <Send size={20} color={T.accent} /> Envoyer un message
                                            </h2>
                                            <p style={{ color: T.muted, fontSize: '0.875rem', margin: '0 0 1.75rem' }}>
                                                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                                            </p>

                                            <form onSubmit={handleSubmit}>
                                                {/* Nom + Email */}
                                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.125rem', marginBottom: '1.125rem' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                                                            Nom complet *
                                                        </label>
                                                        <input
                                                            id="nom" name="nom" type="text"
                                                            placeholder="Ex : Jean-Baptiste Akoué"
                                                            value={formData.nom}
                                                            onChange={handleChange}
                                                            onFocus={() => setFocusedField('nom')}
                                                            onBlur={() => setFocusedField(null)}
                                                            required
                                                            className={`contact-input${focusedField === 'nom' ? ' focused' : ''}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                                                            Email *
                                                        </label>
                                                        <input
                                                            id="email" name="email" type="email"
                                                            placeholder="votre@email.com"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            onFocus={() => setFocusedField('email')}
                                                            onBlur={() => setFocusedField(null)}
                                                            required
                                                            className={`contact-input${focusedField === 'email' ? ' focused' : ''}`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Téléphone + Sujet */}
                                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.125rem', marginBottom: '1.125rem' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                                                            Téléphone (optionnel)
                                                        </label>
                                                        <input
                                                            id="telephone" name="telephone" type="tel"
                                                            placeholder="+229 XX XX XX XX"
                                                            value={formData.telephone}
                                                            onChange={handleChange}
                                                            onFocus={() => setFocusedField('telephone')}
                                                            onBlur={() => setFocusedField(null)}
                                                            className={`contact-input${focusedField === 'telephone' ? ' focused' : ''}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                                                            Sujet *
                                                        </label>
                                                        <select
                                                            id="sujet" name="sujet"
                                                            value={formData.sujet}
                                                            onChange={handleChange}
                                                            onFocus={() => setFocusedField('sujet')}
                                                            onBlur={() => setFocusedField(null)}
                                                            required
                                                            className={`contact-input contact-select${focusedField === 'sujet' ? ' focused' : ''}`}
                                                            style={{ color: sujetActif?.color || T.white }}
                                                        >
                                                            {sujets.map(s => (
                                                                <option key={s.value} value={s.value}>{s.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Message */}
                                                <div style={{ marginBottom: '1.5rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                            Votre message *
                                                        </label>
                                                        <span style={{ fontSize: '0.75rem', color: formData.message.length > 800 ? '#fb923c' : T.muted }}>
                                                            {formData.message.length}/1000
                                                        </span>
                                                    </div>
                                                    <textarea
                                                        id="message" name="message"
                                                        placeholder="Décrivez votre demande en détail…"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('message')}
                                                        onBlur={() => setFocusedField(null)}
                                                        required
                                                        maxLength={1000}
                                                        className={`contact-input${focusedField === 'message' ? ' focused' : ''}`}
                                                        style={{ minHeight: '140px', resize: 'vertical' }}
                                                    />
                                                </div>

                                                {/* Mention légale */}
                                                <p style={{ fontSize: '0.78rem', color: T.muted, marginBottom: '1.25rem', lineHeight: 1.6 }}>
                                                    En envoyant ce formulaire, vous acceptez que vos données soient utilisées conformément à notre{' '}
                                                    <Link href="/politique-confidentialite" style={{ color: T.accent, textDecoration: 'none' }}>politique de confidentialité</Link>.
                                                </p>

                                                {/* Bouton */}
                                                <button
                                                    type="submit"
                                                    disabled={formState === 'submitting'}
                                                    className="btn-contact-submit"
                                                >
                                                    {formState === 'submitting' ? (
                                                        <><span className="spin-ring" /> Envoi en cours…</>
                                                    ) : (
                                                        <><Send size={17} /> Envoyer le message</>
                                                    )}
                                                </button>

                                                {formState === 'error' && (
                                                    <p style={{ color: '#fb923c', fontSize: '0.875rem', marginTop: '0.875rem', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                                                        Une erreur s&apos;est produite. Veuillez réessayer.
                                                    </p>
                                                )}
                                            </form>
                                        </>
                                    )}
                                </div>
                            </Reveal>

                            {/* ══ COLONNE DROITE ══════════════════════════ */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                {/* Coordonnées */}
                                <Reveal delay={80} dir="right">
                                    <div style={{
                                        background: 'rgba(53,78,84,0.55)',
                                        backdropFilter: 'blur(20px)',
                                        border: `1px solid ${T.border}`,
                                        borderRadius: '20px',
                                        padding: '1.75rem',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(126,200,200,0.05)', pointerEvents: 'none' }} />
                                        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: T.white, margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '3px', height: '18px', background: T.accent, borderRadius: '999px', boxShadow: `0 0 8px ${T.accent}60` }} />
                                            Nous trouver
                                        </h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {coordonnees.map(({ icon, label, value, href, color }, i) => (
                                                <div key={label} className="coord-item" style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', animation: `cardIn 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both` }}>
                                                    <div style={{
                                                        width: '42px', height: '42px', borderRadius: '12px',
                                                        background: `${color}15`,
                                                        border: `1px solid ${color}30`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0, color,
                                                        transition: 'transform 0.25s, box-shadow 0.25s',
                                                    }}>
                                                        {icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
                                                        {href ? (
                                                            <a href={href} style={{ fontSize: '0.9rem', color: color, fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }}
                                                                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                                                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                                            >{value}</a>
                                                        ) : (
                                                            <div style={{ fontSize: '0.9rem', color: T.text, fontWeight: 500, lineHeight: 1.5 }}>{value}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Reveal>

                                {/* Réseaux sociaux */}
                                <Reveal delay={160} dir="right">
                                    <div style={{
                                        background: 'rgba(53,78,84,0.55)',
                                        backdropFilter: 'blur(20px)',
                                        border: `1px solid ${T.border}`,
                                        borderRadius: '20px',
                                        padding: '1.75rem',
                                    }}>
                                        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: T.white, margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '3px', height: '18px', background: '#60a5fa', borderRadius: '999px', boxShadow: '0 0 8px rgba(96,165,250,0.6)' }} />
                                            Suivez-nous
                                        </h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {reseaux.map(({ icon, label, handle, color, bg, href }, i) => (
                                                <a key={label} href={href} className="reseau-link" style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                                                    padding: '0.75rem 1rem', borderRadius: '14px',
                                                    textDecoration: 'none',
                                                    background: bg,
                                                    border: `1px solid ${color}25`,
                                                    transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s',
                                                    animation: `cardIn 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both`,
                                                }}
                                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.boxShadow = `0 4px 20px ${color}20` }}
                                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none' }}
                                                >
                                                    <div style={{ color, width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: T.white }}>{label}</div>
                                                        <div style={{ fontSize: '0.8rem', color }}>{handle}</div>
                                                    </div>
                                                    <ArrowRight size={14} color={color} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </Reveal>

                                {/* FAQ rapide */}
                                <Reveal delay={240} dir="right">
                                    <div style={{
                                        background: 'rgba(126,200,200,0.06)',
                                        backdropFilter: 'blur(16px)',
                                        border: '1px solid rgba(126,200,200,0.2)',
                                        borderRadius: '18px',
                                        padding: '1.5rem',
                                    }}>
                                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: T.accent, margin: '0 0 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <HelpCircle size={16} /> Questions fréquentes
                                        </h3>
                                        {faq.map(({ q, href }, i) => (
                                            <Link key={q} href={href} className="faq-link" style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '0.6rem 0',
                                                borderBottom: i < faq.length - 1 ? '1px solid rgba(126,200,200,0.1)' : 'none',
                                                textDecoration: 'none', color: T.text, fontWeight: 500, fontSize: '0.875rem',
                                                gap: '0.5rem', transition: 'color 0.2s',
                                            }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.accent }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.text }}
                                            >
                                                {q}
                                                <ChevronRight size={15} style={{ flexShrink: 0, color: T.muted }} />
                                            </Link>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* ══ HERO ════════════════════════════════════════════ */
        .hero-elem {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ══ SCROLL REVEAL ═══════════════════════════════════ */
        .reveal {
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal-up    { opacity: 0; transform: translateY(28px); }
        .reveal-left  { opacity: 0; transform: translateX(-22px); }
        .reveal-right { opacity: 0; transform: translateX(22px); }
        .reveal-scale { opacity: 0; transform: scale(0.95); }
        .revealed     { opacity: 1 !important; transform: none !important; }

        /* ══ KEYFRAMES ════════════════════════════════════════ */
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
          0%,100% { box-shadow: 0 0 24px rgba(52,211,153,0.2); }
          50%      { box-shadow: 0 0 40px rgba(52,211,153,0.4); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ══ INPUTS ══════════════════════════════════════════ */
        .contact-input {
          width: 100%;
          padding: 0.7rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .contact-input::placeholder { color: #7ea8a8; }
        .contact-input.focused {
          border-color: #7ec8c8 !important;
          box-shadow: 0 0 0 3px rgba(126,200,200,0.15) !important;
          background: rgba(255,255,255,0.08) !important;
        }
        .contact-select { cursor: pointer; appearance: auto; }
        .contact-input option { background: #1a2e3a; color: #c8dede; }

        /* ══ BOUTON SUBMIT ═══════════════════════════════════ */
        .btn-contact-submit {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #7ec8c8 0%, #34d399 100%);
          color: #0a1620;
          border: none;
          border-radius: 14px;
          font-size: 0.9375rem;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(126,200,200,0.25);
          letter-spacing: 0.01em;
        }
        .btn-contact-submit:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 36px rgba(126,200,200,0.4);
        }
        .btn-contact-submit:active:not(:disabled) {
          transform: scale(0.98);
        }
        .btn-contact-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ══ BOUTON RESET ════════════════════════════════════ */
        .btn-contact-reset {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.5rem;
          background: rgba(126,200,200,0.12);
          color: #7ec8c8;
          border: 1.5px solid rgba(126,200,200,0.3);
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-contact-reset:hover {
          background: rgba(126,200,200,0.2);
          transform: translateY(-1px);
        }

        /* ══ SPINNER ══════════════════════════════════════════ */
        .spin-ring {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(10,22,32,0.3);
          border-top-color: #0a1620;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ══ LAYOUT RESPONSIVE ════════════════════════════════ */
        @media (min-width: 900px) {
          .contact-grid { grid-template-columns: 1fr 360px !important; }
        }
      `}</style>
        </>
    )
}
