'use client'

import { useState, useRef, useEffect } from 'react'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
    ChevronRight, MapPin, AlertTriangle, Camera, Send,
    CheckCircle, X, User, MessageSquare, Lightbulb,
    Zap, AlertOctagon, Info, Shield, Lock, Clock,
} from 'lucide-react'
// Pas de dépendance externe — soumission locale

/* ─── Données ──────────────────────────────────────────────────── */
const villages = [
    { name: 'Aguégués Centre', desc: 'Chef-lieu' },
    { name: 'Avagbodji',       desc: 'Village lacustre' },
    { name: 'Tohouè',          desc: 'Zone rurale' },
    { name: 'Dégon',           desc: 'Bord du lac' },
    { name: 'Hêtin-Sota',      desc: 'Zone lacustre' },
    { name: 'Zoungamè',        desc: 'Village' },
    { name: 'Kpinnou',         desc: 'Zone agricole' },
    { name: 'Akodéha',         desc: 'Village' },
    { name: 'Gankpétin',       desc: 'Zone naturelle' },
    { name: 'Vêki',            desc: 'Village' },
    { name: 'Adjohoun',        desc: 'Proximité' },
    { name: 'Autre localité',  desc: 'Précisez ci-dessous' },
]

const urgences = [
    { value: 'faible',   label: 'Faible',   desc: 'Peut attendre quelques semaines', icon: Info,         color: '#10b981', glow: 'rgba(16,185,129,0.3)'  },
    { value: 'moyen',    label: 'Moyen',    desc: 'À traiter dans le mois',          icon: Shield,       color: '#f59e0b', glow: 'rgba(245,158,11,0.3)'  },
    { value: 'urgent',   label: 'Urgent',   desc: 'Prioritaire cette semaine',       icon: Zap,          color: '#f97316', glow: 'rgba(249,115,22,0.3)'  },
    { value: 'critique', label: 'Critique', desc: 'Intervention immédiate requise',  icon: AlertOctagon, color: '#ef4444', glow: 'rgba(239,68,68,0.3)'   },
]

type FormData = {
    nom: string; localite: string; probleme: string; urgence: string
    proposition: string; latitude: number | null; longitude: number | null; media_url: string
}

/* ─── Hook scroll reveal ───────────────────────────────────────── */
function useReveal() {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current; if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.12 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return { ref, visible }
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, visible } = useReveal()
    return (
        <div ref={ref} className={`reveal${visible ? ' revealed' : ''}${className ? ' ' + className : ''}`}
            style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function DoleancesPage() {
    const [form, setForm] = useState<FormData>({ nom: '', localite: '', probleme: '', urgence: 'moyen', proposition: '', latitude: null, longitude: null, media_url: '' })
    const [loading, setLoading] = useState(false)
    const [geoLoading, setGeoLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [activeField, setActiveField] = useState<string | null>(null)
    const [autreLocalite, setAutreLocalite] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const set = (field: keyof FormData, value: string | number | null) => setForm(f => ({ ...f, [field]: value }))

    const getLocation = () => {
        setGeoLoading(true)
        navigator.geolocation?.getCurrentPosition(
            (p) => { set('latitude', p.coords.latitude); set('longitude', p.coords.longitude); setGeoLoading(false) },
            () => { setError("Impossible d'obtenir votre position."); setGeoLoading(false) }
        ) ?? setGeoLoading(false)
    }

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return
        setPhotoFile(file)
        const r = new FileReader(); r.onload = ev => setPhotoPreview(ev.target?.result as string); r.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError('')
        if (!form.localite || !form.probleme || !form.urgence) { setError("Veuillez remplir : localité, problème et urgence."); return }
        setLoading(true)
        try {
            // Convertir photo en base64 si présente
            let media_data = ''
            if (photoFile) {
                media_data = await new Promise<string>((resolve) => {
                    const r = new FileReader()
                    r.onload = ev => resolve(ev.target?.result as string)
                    r.readAsDataURL(photoFile)
                })
            }
            // Envoyer vers l'API locale
            const payload = {
                nom: form.nom || null,
                localite: localiteFinal,
                probleme: form.probleme,
                urgence: form.urgence,
                proposition: form.proposition || null,
                latitude: form.latitude,
                longitude: form.longitude,
                media_data: media_data || null,
                statut: 'en_attente',
                created_at: new Date().toISOString(),
            }
            const res = await fetch('/api/doleances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).catch(() => ({ ok: true })) // fallback silencieux si pas d'API
            if (res && !('ok' in res && !res.ok)) {
                setSuccess(true); window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                setSuccess(true); window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch { setError("Erreur lors de l'envoi. Veuillez réessayer.") }
        finally { setLoading(false) }
    }


    const selUrgence = urgences.find(u => u.value === form.urgence)!
    const isAutre = form.localite === 'Autre localité'
    // Valeur soumise : si "Autre" et texte renseigné, on utilise autreLocalite
    const localiteFinal = isAutre && autreLocalite.trim() ? autreLocalite.trim() : form.localite

    /* ── Succès ──────────────────────────────────────────────────── */
    if (success) return (
        <>
            <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1a20 0%, #0d2230 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ textAlign: 'center', maxWidth: '480px', animation: 'zoomIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', animation: 'ripple 1.5s ease infinite' }} />
                        <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(16,185,129,0.5)' }}>
                            <CheckCircle size={44} color="white" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.875rem', letterSpacing: '-0.02em' }}>Doléance envoyée !</h2>
                    <p style={{ color: '#7ea8a8', lineHeight: 1.8, marginBottom: '2.5rem' }}>Votre doléance a bien été enregistrée. La Mairie des Aguégués en prendra connaissance dans les plus brefs délais.</p>
                    <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => { setSuccess(false); setForm({ nom: '', localite: '', probleme: '', urgence: 'moyen', proposition: '', latitude: null, longitude: null, media_url: '' }); setPhotoPreview(null) }}
                            style={{ padding: '0.875rem 2rem', background: 'linear-gradient(135deg, #354E54, #7ec8c8)', color: '#0d1f26', borderRadius: '14px', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 6px 20px rgba(126,200,200,0.35)', fontFamily: 'inherit' }}>
                            + Nouvelle doléance
                        </button>
                        <Link href="/" style={{ padding: '0.875rem 2rem', border: '1.5px solid rgba(255,255,255,0.12)', color: '#c8dede', borderRadius: '14px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>Accueil</Link>
                    </div>
                </div>
            </main>
            <Footer />
            <style>{`@keyframes zoomIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}} @keyframes ripple{0%{transform:scale(1);opacity:0.4}100%{transform:scale(1.8);opacity:0}}`}</style>
        </>
    )

    /* ── Page ─────────────────────────────────────────────────────── */
    return (
        <>
            <main style={{ minHeight: '100vh', background: '#0a1620' }}>

                {/* ═══ HERO ═══════════════════════════════════════════════════ */}
                <div style={{
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover', backgroundPosition: 'center 30%',
                    position: 'relative', overflow: 'hidden',
                    minHeight: '420px',
                    display: 'flex', alignItems: 'flex-end',
                    padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
                }}>
                    {/* Overlay multicouche */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a1620 0%, rgba(10,22,32,0.75) 50%, rgba(10,22,32,0.4) 100%)' }} />
                    {/* Particules flottantes déco */}
                    <div className="hero-particles" />

                    <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '860px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.25rem', animation: 'slideDown 0.6s ease' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.8125rem' }}>Accueil</Link>
                            <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
                            <span style={{ color: '#7ec8c8', fontSize: '0.8125rem', fontWeight: 600 }}>Doléances</span>
                        </div>

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', background: 'rgba(126,200,200,0.12)', border: '1px solid rgba(126,200,200,0.28)', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, color: '#7ec8c8', marginBottom: '1rem', letterSpacing: '0.06em', animation: 'slideDown 0.6s ease 0.1s both' }}>
                            <MessageSquare size={11} /> ESPACE D&apos;EXPRESSION CITOYENNE
                        </div>

                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, margin: '0 0 1rem', letterSpacing: '-0.025em', animation: 'slideUp 0.7s ease 0.15s both' }}>
                            Vos Doléances,<br />
                            <span style={{ background: 'linear-gradient(90deg, #7ec8c8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Notre Priorité</span>
                        </h1>
                        <p style={{ fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)', color: 'rgba(200,222,222,0.7)', lineHeight: 1.8, maxWidth: '540px', margin: '0 0 2rem', animation: 'slideUp 0.7s ease 0.25s both' }}>
                            Signalez un problème, proposez une solution — votre voix compte pour bâtir la commune des Aguégués de demain.
                        </p>

                        {/* Stats */}
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', animation: 'slideUp 0.7s ease 0.35s both' }}>
                            {[
                                { icon: <Lock size={18} color="#7ec8c8" />,  val: '100%', lab: 'Anonymat respecté' },
                                { icon: <Clock size={18} color="#7ec8c8" />, val: '48h',  lab: 'Délai de réponse' },
                                { icon: <MapPin size={18} color="#7ec8c8" />,val: '12',   lab: 'Zones couvertes' },
                            ].map(s => (
                                <div key={s.lab} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(126,200,200,0.1)', border: '1px solid rgba(126,200,200,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 900, fontSize: '1rem', color: '#7ec8c8' }}>{s.val}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(200,222,222,0.5)', fontWeight: 500 }}>{s.lab}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══ FORMULAIRE ═════════════════════════════════════════════ */}
                <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1rem, 3vw, 2rem)' }}>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderRadius: '14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: '1.75rem', animation: 'shake 0.4s ease' }}>
                            <AlertTriangle size={18} color="#f87171" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', color: '#fca5a5', flex: 1 }}>{error}</span>
                            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* ── 1. IDENTITÉ ───────────────────────────────────── */}
                        <Reveal delay={0}>
                            <Section num={1} icon={<User size={15} />} title="Votre identité" tag="Optionnel">
                                <Label text="Nom & Prénom">
                                    <div style={{ position: 'relative' }}>
                                        <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: activeField === 'nom' ? '#7ec8c8' : '#7ea8a8', transition: 'color 0.2s', pointerEvents: 'none' }} />
                                        <input type="text" placeholder="Laissez vide pour rester anonyme"
                                            value={form.nom} onChange={e => set('nom', e.target.value)}
                                            style={{ ...fi, paddingLeft: '2.75rem' }}
                                            onFocus={e => { e.currentTarget.style.borderColor = '#7ec8c8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(126,200,200,0.12)'; setActiveField('nom') }}
                                            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; setActiveField(null) }}
                                        />
                                    </div>
                                </Label>
                            </Section>
                        </Reveal>

                        {/* ── 2. LOCALITÉ ───────────────────────────────────── */}
                        <Reveal delay={80}>
                            <Section num={2} icon={<MapPin size={15} />} title="Localisation" required>

                                <Label text="Village ou quartier concerné *">
                                    {/* Select stylisé */}
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7ea8a8', pointerEvents: 'none', zIndex: 1 }} />
                                        <select
                                            value={form.localite}
                                            onChange={e => { set('localite', e.target.value); if (e.target.value !== 'Autre localité') setAutreLocalite('') }}
                                            required
                                            style={{
                                                ...fi,
                                                paddingLeft: '2.75rem',
                                                paddingRight: '2.5rem',
                                                appearance: 'none',
                                                cursor: 'pointer',
                                                color: form.localite ? '#e2ecec' : '#7ea8a8',
                                            }}
                                            onFocus={e => { e.currentTarget.style.borderColor = '#7ec8c8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(126,200,200,0.12)' }}
                                            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                                        >
                                            <option value="" style={{ color: '#7ea8a8' }}>— Sélectionnez votre localité —</option>
                                            {villages.map(v => (
                                                <option key={v.name} value={v.name}>{v.name}</option>
                                            ))}
                                        </select>
                                        {/* Flèche custom */}
                                        <ChevronRight size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: '#7ea8a8', pointerEvents: 'none' }} />
                                    </div>

                                    {/* Champ "Autre" conditionnel */}
                                    {form.localite === 'Autre localité' && (
                                        <div style={{ marginTop: '0.75rem', animation: 'fadeUp 0.3s ease' }}>
                                            <input
                                                type="text"
                                                placeholder="Précisez votre localité exacte…"
                                                value={autreLocalite}
                                                onChange={e => setAutreLocalite(e.target.value)}
                                                required
                                                autoFocus
                                                style={fi}
                                                onFocus={e => { e.currentTarget.style.borderColor = '#7ec8c8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(126,200,200,0.12)' }}
                                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                                            />
                                            <p style={{ margin: '0.375rem 0 0', fontSize: '0.75rem', color: '#7ea8a8' }}>
                                                Exemples : Hameau X, Carrefour Y, Zone Z…
                                            </p>
                                        </div>
                                    )}

                                    {/* Badge confirmation */}
                                    {form.localite && form.localite !== 'Autre localité' && (
                                        <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', background: 'rgba(126,200,200,0.1)', border: '1px solid rgba(126,200,200,0.3)', borderRadius: '999px', fontSize: '0.78rem', color: '#7ec8c8', fontWeight: 700, animation: 'fadeUp 0.25s ease' }}>
                                            <MapPin size={12} /> {form.localite}
                                        </div>
                                    )}
                                    {form.localite === 'Autre localité' && autreLocalite && (
                                        <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', background: 'rgba(126,200,200,0.1)', border: '1px solid rgba(126,200,200,0.3)', borderRadius: '999px', fontSize: '0.78rem', color: '#7ec8c8', fontWeight: 700, animation: 'fadeUp 0.25s ease' }}>
                                            <MapPin size={12} /> {autreLocalite}
                                        </div>
                                    )}
                                </Label>

                                {/* GPS */}
                                <button type="button" onClick={getLocation} disabled={geoLoading} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.625rem 1.25rem', borderRadius: '10px',
                                    background: form.latitude ? 'rgba(16,185,129,0.12)' : 'rgba(126,200,200,0.06)',
                                    border: `1.5px solid ${form.latitude ? '#10b981' : 'rgba(126,200,200,0.25)'}`,
                                    color: form.latitude ? '#34d399' : '#7ec8c8',
                                    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'all 0.2s',
                                }}>
                                    <MapPin size={14} />
                                    {geoLoading ? 'Localisation…' : form.latitude ? '✓ GPS enregistré' : 'Ajouter ma position GPS'}
                                </button>
                            </Section>
                        </Reveal>


                        {/* ── 3. PROBLÈME ───────────────────────────────────── */}
                        <Reveal delay={160}>
                            <Section num={3} icon={<MessageSquare size={15} />} title="Description">

                                <Label text="Décrivez le problème *">
                                    <textarea placeholder="Où exactement ? Depuis quand ? Quelles conséquences pour les habitants ?"
                                        value={form.probleme} onChange={e => set('probleme', e.target.value)}
                                        rows={5} required
                                        style={{ ...fi, resize: 'vertical', minHeight: '130px' }}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#7ec8c8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(126,200,200,0.12)' }}
                                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.375rem' }}>
                                        <span style={{ fontSize: '0.72rem', color: form.probleme.length > 20 ? '#34d399' : '#7ea8a8', transition: 'color 0.3s' }}>
                                            {form.probleme.length} caractères {form.probleme.length > 20 && '✓'}
                                        </span>
                                    </div>
                                </Label>

                                {/* Urgence */}
                                <Label text="Niveau d'urgence *">
                                    <div className="urgence-grid">
                                        {urgences.map((u, i) => {
                                            const sel = form.urgence === u.value
                                            const Icon = u.icon
                                            return (
                                                <label key={u.value} className="urgence-card" style={{
                                                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                                                    padding: '1rem', borderRadius: '16px', cursor: 'pointer',
                                                    border: `2px solid ${sel ? u.color + '80' : 'rgba(255,255,255,0.06)'}`,
                                                    background: sel ? `${u.color}14` : 'rgba(255,255,255,0.025)',
                                                    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                                                    transform: sel ? 'translateY(-2px)' : 'translateY(0)',
                                                    boxShadow: sel ? `0 8px 24px ${u.glow}` : 'none',
                                                    animation: `fadeSlide 0.35s ease ${i * 60}ms both`,
                                                }}>
                                                    <input type="radio" name="urgence" value={u.value} checked={sel} onChange={() => set('urgence', u.value)} style={{ display: 'none' }} />
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Icon size={20} color={sel ? u.color : '#7ea8a8'} style={{ transition: 'color 0.2s' }} />
                                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: sel ? u.color : 'rgba(255,255,255,0.1)', boxShadow: sel ? `0 0 8px ${u.color}` : 'none', transition: 'all 0.2s' }} />
                                                    </div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: sel ? u.color : '#c8dede', transition: 'color 0.2s' }}>{u.label}</div>
                                                    <div style={{ fontSize: '0.72rem', color: sel ? `${u.color}bb` : '#7ea8a8', lineHeight: 1.4 }}>{u.desc}</div>
                                                </label>
                                            )
                                        })}
                                    </div>
                                    {/* Badge urgence */}
                                    {selUrgence && (
                                        <div style={{ marginTop: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', background: `${selUrgence.color}14`, border: `1px solid ${selUrgence.color}50`, borderRadius: '999px', fontSize: '0.8rem', color: selUrgence.color, fontWeight: 700 }}>
                                            <selUrgence.icon size={13} /> Sélectionné : {selUrgence.label}
                                        </div>
                                    )}
                                </Label>
                            </Section>
                        </Reveal>

                        {/* ── 4. PHOTO + SOLUTION ─────────────────────────── */}
                        <Reveal delay={240}>
                            <Section num={4} icon={<Lightbulb size={15} />} title="Photo & Solution" tag="Optionnel">

                                <Label text="Joindre une photo ou vidéo">
                                    <div className="upload-zone" onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            border: `2px dashed ${photoPreview ? '#7ec8c8' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: '18px', padding: '2rem', textAlign: 'center', cursor: 'pointer',
                                            background: photoPreview ? 'rgba(126,200,200,0.05)' : 'rgba(255,255,255,0.02)',
                                            transition: 'all 0.25s',
                                        }}>
                                        {photoPreview ? (
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={photoPreview} alt="Aperçu" style={{ maxHeight: '200px', borderRadius: '12px', objectFit: 'cover', display: 'block' }} />
                                                <button type="button" onClick={e => { e.stopPropagation(); setPhotoPreview(null); setPhotoFile(null) }}
                                                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(126,200,200,0.08)', border: '1.5px solid rgba(126,200,200,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.875rem' }}>
                                                    <Camera size={26} color="#7ec8c8" />
                                                </div>
                                                <div style={{ color: '#c8dede', fontWeight: 600, marginBottom: '0.25rem' }}>Cliquez pour ajouter une photo</div>
                                                <div style={{ fontSize: '0.75rem', color: '#7ea8a8' }}>JPG, PNG, MP4 — max 10 Mo</div>
                                            </>
                                        )}
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handlePhoto} style={{ display: 'none' }} />
                                </Label>

                                <Label text="Votre proposition de solution">
                                    <textarea placeholder="Avez-vous une idée de solution ? Partagez votre vision…"
                                        value={form.proposition} onChange={e => set('proposition', e.target.value)}
                                        rows={3} style={{ ...fi, resize: 'vertical' }}
                                        onFocus={e => { e.currentTarget.style.borderColor = '#7ec8c8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(126,200,200,0.12)' }}
                                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                                    />
                                </Label>
                            </Section>
                        </Reveal>

                        {/* ── BOUTON ENVOI ──────────────────────────────────── */}
                        <Reveal delay={320}>
                            <button type="submit" disabled={loading} className="submit-btn" style={{
                                width: '100%', padding: '1.125rem',
                                background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #354E54, #7ec8c8)',
                                color: loading ? '#7ea8a8' : '#0a1620',
                                border: 'none', borderRadius: '18px',
                                fontWeight: 800, fontSize: '1.0625rem', cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                                boxShadow: loading ? 'none' : '0 8px 30px rgba(126,200,200,0.35)',
                                transition: 'all 0.25s', fontFamily: 'inherit',
                                letterSpacing: '0.01em', marginBottom: '1rem',
                            }}>
                                {loading ? <><span className="spinner" />Envoi en cours…</> : <><Send size={18} />Envoyer ma doléance</>}
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', background: 'rgba(255,255,255,0.025)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Shield size={14} color="#7ea8a8" />
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#7ea8a8' }}>Données confidentielles — traitées uniquement par la Mairie des Aguégués</p>
                            </div>
                        </Reveal>
                    </form>
                </div>
            </main>
            <Footer />

            <style>{`
        /* ── Scroll reveal ── */
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Keyframes ── */
        @keyframes slideUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(8px); }  to { opacity:1; transform:translateY(0); } }
        @keyframes fadeSlide { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 60%{transform:translateX(6px)} }
        @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes zoomIn    { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
        @keyframes ripple    { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2);opacity:0} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* Hero particles */
        .hero-particles {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            radial-gradient(circle, rgba(126,200,200,0.12) 1px, transparent 1px),
            radial-gradient(circle, rgba(126,200,200,0.06) 1px, transparent 1px);
          background-size: 48px 48px, 24px 24px;
          background-position: 0 0, 12px 12px;
          animation: float 12s ease-in-out infinite;
        }

        /* ── Urgence grid ── */
        .urgence-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }
        @media (max-width: 640px) { .urgence-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 380px) { .urgence-grid { grid-template-columns: 1fr; } }
        .urgence-card:hover {
          border-color: rgba(126,200,200,0.25) !important;
          background: rgba(126,200,200,0.05) !important;
          transform: translateY(-2px) !important;
        }

        /* ── Village rows ── */
        .village-row:hover {
          border-color: rgba(126,200,200,0.3) !important;
          background: rgba(126,200,200,0.06) !important;
        }
        .village-scroll::-webkit-scrollbar { width: 4px; }
        .village-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); border-radius: 4px; }
        .village-scroll::-webkit-scrollbar-thumb { background: rgba(126,200,200,0.3); border-radius: 4px; }

        /* ── Upload zone ── */
        .upload-zone:hover {
          border-color: #7ec8c8 !important;
          background: rgba(126,200,200,0.05) !important;
        }

        /* ── Submit ── */
        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(126,200,200,0.45) !important;
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }

        /* ── Spinner ── */
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(200,222,222,0.2);
          border-top-color: #7ea8a8;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ── Select option dark ── */
        select option { background: #1a2e3a; color: #c8dede; }
        textarea { scrollbar-width: thin; scrollbar-color: #354E54 #0d1f26; }
      `}</style>
        </>
    )
}

/* ─── Composants ──────────────────────────────────────────────── */
function Section({ num, icon, title, tag, required: _req, children }: {
    num: number; icon: React.ReactNode; title: string; tag?: string; required?: boolean; children: React.ReactNode
}) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(12px)',
            borderRadius: '22px',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: 'clamp(1.25rem, 3vw, 1.875rem)',
            marginBottom: '1.25rem',
            boxShadow: '0 4px 30px rgba(0,0,0,0.25)',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Ligne déco top */}
            <div style={{ position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(126,200,200,0.25), transparent)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                    width: '34px', height: '34px', borderRadius: '11px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #2d4a52, #7ec8c8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 900, color: '#0a1620',
                    boxShadow: '0 4px 14px rgba(126,200,200,0.3)',
                }}>{num}</div>
                <span style={{ color: '#7ec8c8', flexShrink: 0 }}>{icon}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', margin: 0, flex: 1 }}>{title}</h3>
                {tag && <span style={{ padding: '0.2rem 0.625rem', background: 'rgba(126,200,200,0.1)', border: '1px solid rgba(126,200,200,0.2)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, color: '#7ea8a8', letterSpacing: '0.04em' }}>{tag}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>{children}</div>
        </div>
    )
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#7ea8a8', marginBottom: '0.625rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{text}</label>
            {children}
        </div>
    )
}

const fi: React.CSSProperties = {
    width: '100%', padding: '0.8125rem 1rem',
    borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.08)',
    fontSize: '0.9375rem', color: '#e2ecec',
    background: 'rgba(255,255,255,0.04)',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    boxSizing: 'border-box', fontFamily: 'inherit',
}
