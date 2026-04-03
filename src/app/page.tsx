'use client'

import { useState, useEffect, useRef } from 'react'

// Images carousel — placez vos images dans /public/commune/
const carouselImages = [
    { src: '/commune/photo1.jpeg', legende: 'Vue du lac Nokoué' },
    { src: '/commune/photo2.jpeg', legende: 'Village sur pilotis' },
    { src: '/commune/photo3.jpeg', legende: 'Marché local' },
    { src: '/commune/photo4.jpeg', legende: 'Fête culturelle' },
    { src: '/commune/photo5.jpeg', legende: 'Bord du fleuve' },
    { src: '/commune/photo6.jpeg', legende: 'École primaire' },
    { src: '/commune/photo7.jpeg', legende: 'Village sur pilotis' },
    { src: '/commune/photo8.jpeg', legende: 'Marché local' },
    { src: '/commune/photo9.jpeg', legende: 'Fête culturelle' },
    { src: '/commune/photo10.jpeg', legende: 'Bord du fleuve' },
]

// ─── Fond réseau : nœuds connectés + attraction vers curseur ─────────────────
type Node = { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number }

function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouse = useRef({ x: -999, y: -999 })
    const nodes = useRef<Node[]>([])
    const raf = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const COLS = 12, ROWS = 5
        const CONNECT_DIST = 110
        const ATTRACT_RADIUS = 140
        const ATTRACT_FORCE = 0.06

        const buildGrid = () => {
            const W = canvas.offsetWidth, H = canvas.offsetHeight
            canvas.width = W; canvas.height = H
            const colStep = W / (COLS - 1)
            const rowStep = H / (ROWS - 1)
            nodes.current = []
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const bx = c * colStep + (Math.random() - 0.5) * 20
                    const by = r * rowStep + (Math.random() - 0.5) * 20
                    nodes.current.push({
                        x: bx, y: by, baseX: bx, baseY: by,
                        vx: (Math.random() - 0.5) * 0.4,
                        vy: (Math.random() - 0.5) * 0.4,
                    })
                }
            }
        }
        buildGrid()
        window.addEventListener('resize', buildGrid)

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
            } else {
                mouse.current = { x: -999, y: -999 }
            }
        }
        window.addEventListener('mousemove', onMove)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const mx = mouse.current.x, my = mouse.current.y
            const ns = nodes.current

            // Mettre à jour les nœuds
            for (const n of ns) {
                // Attraction vers le curseur
                if (mx > 0) {
                    const dx = mx - n.x, dy = my - n.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < ATTRACT_RADIUS) {
                        const force = (1 - dist / ATTRACT_RADIUS) * ATTRACT_FORCE
                        n.vx += dx * force * 0.1
                        n.vy += dy * force * 0.1
                    }
                }
                // Retour à la position de base (ressort)
                n.vx += (n.baseX - n.x) * 0.012
                n.vy += (n.baseY - n.y) * 0.012
                // Amortissement
                n.vx *= 0.88; n.vy *= 0.88
                n.x += n.vx; n.y += n.vy
            }

            // Dessiner connexions
            for (let i = 0; i < ns.length; i++) {
                for (let j = i + 1; j < ns.length; j++) {
                    const dx = ns[i].x - ns[j].x
                    const dy = ns[i].y - ns[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < CONNECT_DIST) {
                        const opacity = (1 - dist / CONNECT_DIST) * 0.35
                        ctx.beginPath()
                        ctx.moveTo(ns[i].x, ns[i].y)
                        ctx.lineTo(ns[j].x, ns[j].y)
                        ctx.strokeStyle = `rgba(110, 231, 160, ${opacity})`
                        ctx.lineWidth = 0.8
                        ctx.stroke()
                    }
                }
            }

            // Dessiner nœuds
            for (const n of ns) {
                const dxM = mx > 0 ? mx - n.x : 9999
                const dyM = my > 0 ? my - n.y : 9999
                const distM = Math.sqrt(dxM * dxM + dyM * dyM)
                const glow = distM < ATTRACT_RADIUS ? (1 - distM / ATTRACT_RADIUS) : 0

                // Halo si proche du curseur
                if (glow > 0.1) {
                    ctx.beginPath()
                    ctx.arc(n.x, n.y, 6 + glow * 8, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(110, 231, 160, ${glow * 0.12})`
                    ctx.fill()
                }
                // Point
                ctx.beginPath()
                ctx.arc(n.x, n.y, 2 + glow * 2, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(110, 231, 160, ${0.5 + glow * 0.5})`
                ctx.fill()
            }

            raf.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(raf.current)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('resize', buildGrid)
        }
    }, [])

    return (
        <canvas ref={canvasRef} style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 1, display: 'block',
        }} />
    )
}


// Données visuelles du carousel
const placeholderData = [
    { emoji: '🌊', title: 'Lac Nokoué', desc: 'Eaux calmes et reflets dorés', bg: 'linear-gradient(160deg,#0a3d62,#1a6b3c,#0e5640)', accent: '#34d399' },
    { emoji: '🏘️', title: 'Village sur Pilotis', desc: 'Architecture lacustre unique en Afrique', bg: 'linear-gradient(160deg,#1a5c2a,#2d6a4f,#40916c)', accent: '#6ee7a0' },
    { emoji: '🛒', title: 'Marché Local', desc: 'Commerce et vie quotidienne', bg: 'linear-gradient(160deg,#7f4f24,#b5651d,#8b4513)', accent: '#fbbf24' },
    { emoji: '🥁', title: 'Fête Culturelle', desc: 'Traditions et patrimoine vivant', bg: 'linear-gradient(160deg,#501f6c,#7b2d8b,#9b2c9b)', accent: '#c084fc' },
    { emoji: '🚣', title: 'Bord du Fleuve', desc: 'Pêche traditionnelle au crépuscule', bg: 'linear-gradient(160deg,#1e3a5f,#1a5c2a,#0a3d62)', accent: '#60a5fa' },
    { emoji: '🏫', title: 'École Primaire', desc: 'Avenir et jeunesse des Aguégués', bg: 'linear-gradient(160deg,#004d40,#00695c,#00897b)', accent: '#2dd4bf' },
    { emoji: '🏘️', title: 'Village sur Pilotis', desc: 'Architecture lacustre unique en Afrique', bg: 'linear-gradient(160deg,#1a5c2a,#2d6a4f,#40916c)', accent: '#6ee7a0' },
    { emoji: '🛒', title: 'Marché Local', desc: 'Commerce et vie quotidienne', bg: 'linear-gradient(160deg,#7f4f24,#b5651d,#8b4513)', accent: '#fbbf24' },
    { emoji: '🥁', title: 'Fête Culturelle', desc: 'Traditions et patrimoine vivant', bg: 'linear-gradient(160deg,#501f6c,#7b2d8b,#9b2c9b)', accent: '#c084fc' },
    { emoji: '🚣', title: 'Bord du Fleuve', desc: 'Pêche traditionnelle au crépuscule', bg: 'linear-gradient(160deg,#1e3a5f,#1a5c2a,#0a3d62)', accent: '#60a5fa' },
]

// ─── Carte unique de carousel (avec Ken Burns + reveal caption) ────────────────
function CarouselCard({
    img, ph, imgIdx, total, isActive,
}: {
    img: { src: string; legende: string }
    ph: typeof placeholderData[0]
    imgIdx: number
    total: number
    isActive: boolean
}) {
    const [imgOk, setImgOk] = useState(false)

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: ph.bg }}>

            {/* ── Image réelle avec Ken Burns ── */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={img.src} alt={img.legende}
                onLoad={() => setImgOk(true)}
                onError={e => { e.currentTarget.style.display = 'none' }}
                className={isActive && imgOk ? 'carousel-img-active' : ''}
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'opacity 0.6s ease',
                    opacity: imgOk ? 1 : 0,
                    zIndex: 2,
                    transformOrigin: 'center center',
                }}
            />

            {/* ── Placeholder richement stylé ── */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                opacity: imgOk ? 0 : 1, transition: 'opacity 0.6s',
                padding: '2rem',
            }}>
                {/* Grille de points */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.07,
                    backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
                    backgroundSize: '28px 28px',
                }} />
                {/* Halo accent */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '220px', height: '220px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${ph.accent}22 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }} />
                {/* Icône */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    border: `2px solid ${ph.accent}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.2rem', marginBottom: '1.25rem',
                    boxShadow: `0 0 40px ${ph.accent}33`,
                    position: 'relative', zIndex: 2,
                }}>
                    {ph.emoji}
                </div>
                <div style={{
                    fontSize: '1.125rem', fontWeight: 800, color: 'white',
                    textAlign: 'center', marginBottom: '0.5rem',
                    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                    position: 'relative', zIndex: 2,
                }}>{ph.title}</div>
                <div style={{
                    fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)',
                    textAlign: 'center', lineHeight: 1.5,
                    maxWidth: '180px', position: 'relative', zIndex: 2,
                }}>{ph.desc}</div>
                <div style={{
                    marginTop: '1.25rem', padding: '0.35rem 1rem',
                    background: `${ph.accent}22`,
                    border: `1px solid ${ph.accent}44`,
                    borderRadius: '999px',
                    fontSize: '0.7rem', color: ph.accent,
                    fontWeight: 600, position: 'relative', zIndex: 2,
                }}>📸 Image à venir</div>
            </div>

            {/* ── Overlay gradient cinématique (sur vraie image) ── */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 3,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
                pointerEvents: 'none',
            }} />

            {/* ── Caption reveal en bas ── */}
            <div className={isActive ? 'caption-reveal caption-visible' : 'caption-reveal'} style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                zIndex: 4, padding: '1.5rem 1.25rem 1rem',
            }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.35rem 0.875rem',
                    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                    borderRadius: '999px',
                    border: `1px solid ${ph.accent}44`,
                }}>
                    <span style={{ fontSize: '0.875rem', color: ph.accent }}>📍</span>
                    <span style={{ fontSize: '0.8125rem', color: 'white', fontWeight: 600 }}>{img.legende}</span>
                </div>
            </div>

            {/* ── Numéro coin haut droit ── */}
            <div style={{
                position: 'absolute', top: '0.75rem', right: '0.875rem',
                zIndex: 5, display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.2rem 0.6rem',
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)',
                borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)',
            }}>
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                    {imgIdx + 1} / {total}
                </span>
            </div>
        </div>
    )
}

// ─── Zigzag Carousel principal ─────────────────────────────────────────────────
function Carousel2() {
    const [images, setImages] = useState(carouselImages)
    const total = images.length
    const [index, setIndex] = useState(0)
    const [prev, setPrev] = useState<number | null>(null)
    const [direction, setDirection] = useState<'left' | 'right'>('right')
    const [animating, setAnimating] = useState(false)
    const timer = useRef<ReturnType<typeof setInterval> | null>(null)
    const [cols, setCols] = useState(3)

    useEffect(() => {
        const check = () => {
            if (window.innerWidth < 640) setCols(1)
            else if (window.innerWidth < 1024) setCols(2)
            else setCols(3)
        }
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/carousel`)
            .then(res => res.json())
            .then(data => { if (data?.length > 0) setImages(data) })
            .catch(() => {})
    }, [])

    const maxIndex = Math.ceil(total / cols) - 1

    const goTo = (next: number, dir: 'left' | 'right') => {
        if (animating) return
        setPrev(index)
        setDirection(dir)
        setAnimating(true)
        setIndex(next)
        setTimeout(() => { setPrev(null); setAnimating(false) }, 700)
    }

    const handleNext = () => { goTo(index >= maxIndex ? 0 : index + 1, 'right'); resetTimer() }
    const handlePrev = () => { goTo(index <= 0 ? maxIndex : index - 1, 'left'); resetTimer() }

    const resetTimer = () => {
        if (timer.current) clearInterval(timer.current)
        timer.current = setInterval(handleNext, 5000)
    }

    useEffect(() => {
        timer.current = setInterval(handleNext, 5000)
        return () => { if (timer.current) clearInterval(timer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxIndex, index])

    useEffect(() => { setIndex(0) }, [cols])

    // Calculer les images du slide courant
    const getSlideImages = (slideIdx: number) => {
        return Array.from({ length: cols }, (_, offset) => {
            const imgIdx = slideIdx * cols + offset
            return imgIdx < total ? { imgIdx, img: images[imgIdx], ph: placeholderData[imgIdx % placeholderData.length] } : null
        }).filter(Boolean) as { imgIdx: number; img: typeof images[0]; ph: typeof placeholderData[0] }[]
    }

    const currentItems = getSlideImages(index)
    const prevItems = prev !== null ? getSlideImages(prev) : []

    // Zigzag offsets par colonne : alternance haut/bas
    const zigzagOffsets = ['0px', '-32px', '0px'] // col 0 normal, col 1 décalée vers le haut, col 2 normal
    const zigzagHeights = ['100%', 'calc(100% + 32px)', '100%']

    return (
        <div style={{
            position: 'relative', overflow: 'hidden',
            background: '#050e07', height: '100%',
        }}>
            {/* ── Slide précédent (en sortie) ── */}
            {prev !== null && (
                <div
                    className={direction === 'right' ? 'slide-exit-left' : 'slide-exit-right'}
                    style={{
                        position: 'absolute', inset: 0, zIndex: 1,
                        display: 'flex', gap: '3px',
                        alignItems: 'flex-start',
                    }}
                >
                    {prevItems.map(({ imgIdx, img, ph }, offset) => (
                        <div key={imgIdx} style={{
                            flex: 1, position: 'relative',
                            marginTop: zigzagOffsets[offset],
                            height: zigzagHeights[offset],
                            borderRadius: '4px', overflow: 'hidden',
                        }}>
                            <CarouselCard img={img} ph={ph} imgIdx={imgIdx} total={total} isActive={false} />
                        </div>
                    ))}
                </div>
            )}

            {/* ── Slide actuel (en entrée) ── */}
            <div
                className={animating
                    ? (direction === 'right' ? 'slide-enter-right' : 'slide-enter-left')
                    : 'slide-visible'
                }
                style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    display: 'flex', gap: '3px',
                    alignItems: 'flex-start',
                }}
            >
                {currentItems.map(({ imgIdx, img, ph }, offset) => (
                    <div key={imgIdx} style={{
                        flex: 1, position: 'relative',
                        marginTop: zigzagOffsets[offset],
                        height: zigzagHeights[offset],
                        borderRadius: '4px', overflow: 'hidden',
                        transition: 'box-shadow 0.3s',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                    }}>
                        <CarouselCard img={img} ph={ph} imgIdx={imgIdx} total={total} isActive={!animating} />
                    </div>
                ))}
            </div>

            {/* ── Bouton Précédent ── */}
            <button onClick={handlePrev} style={{
                position: 'absolute', top: '50%', left: '1rem',
                transform: 'translateY(-50%)', zIndex: 10,
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', fontSize: '1.5rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', lineHeight: 1,
            }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a5c2a'; e.currentTarget.style.borderColor = '#6ee7a0' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >‹</button>

            {/* ── Bouton Suivant ── */}
            <button onClick={handleNext} style={{
                position: 'absolute', top: '50%', right: '1rem',
                transform: 'translateY(-50%)', zIndex: 10,
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white', fontSize: '1.5rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', lineHeight: 1,
            }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a5c2a'; e.currentTarget.style.borderColor = '#6ee7a0' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >›</button>

            {/* ── Indicateurs ── */}
            <div style={{
                position: 'absolute', bottom: '1rem', left: '50%',
                transform: 'translateX(-50%)', zIndex: 10,
                display: 'flex', gap: '6px', alignItems: 'center',
            }}>
                {Array.from({ length: maxIndex + 1 }, (_, i) => (
                    <button key={i} onClick={() => goTo(i, i > index ? 'right' : 'left')} style={{
                        width: i === index ? '28px' : '8px',
                        height: '8px', borderRadius: '4px',
                        background: i === index ? '#6ee7a0' : 'rgba(255,255,255,0.35)',
                        border: 'none', cursor: 'pointer', padding: 0,
                        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        boxShadow: i === index ? '0 0 10px #6ee7a066' : 'none',
                    }} />
                ))}
            </div>
        </div>
    )
}

export default function HomePage() {
    return (
        <main style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
        }} className="home-main">

                {/* ── HERO avec fond image ─────────────────── */}
                <section style={{
                    position: 'relative', overflow: 'hidden',
                    backgroundImage: 'url(/commune/arrpresentation.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1rem, 4vw, 3rem)',
                    minHeight: '0', flexShrink: 0,
                }}>
                    {/* Overlay sombre */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,25,15,0.88) 0%, rgba(15,45,74,0.80) 45%, rgba(10,35,18,0.75) 100%)', pointerEvents: 'none' }} />
                    {/* Canvas particules par-dessus l'overlay */}
                    <HeroCanvas />

                    {/* Contenu par-dessus le canvas */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(110,231,160,0.1)',
                            border: '1px solid rgba(110,231,160,0.2)',
                            borderRadius: '999px',
                            fontSize: '0.7rem', fontWeight: 600,
                            color: '#6ee7a0', marginBottom: '0.75rem',
                        }}>
                            🇧🇯 Portail officiel · Commune des Aguégués
                        </div>

                        {/* Titre — max 2 lignes */}
                        <h1 style={{
                            fontSize: 'clamp(1.25rem, 2.8vw, 1.875rem)',
                            fontWeight: 800, color: 'white',
                            lineHeight: 1.25, margin: '0 0 0.625rem',
                            letterSpacing: '-0.015em',
                            maxWidth: '680px',
                        }}>
                            Unir les Compétences, Écouter les Citoyens,{' '}
                            <span style={{
                                background: 'linear-gradient(90deg, #6ee7a0, #34d399)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>Construire Ensemble</span>
                        </h1>

                    </div>
                </section>


                {/* ── CAROUSEL ──────────────────────────────── */}
                <section style={{ display: 'flex', flexDirection: 'column', background: '#050e07', flex: 1, minHeight: '300px' }}>
                    {/* En-tête carousel */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.625rem 1.25rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        flexShrink: 0,
                    }}>
                        <span style={{
                            fontSize: '0.8125rem', fontWeight: 700,
                            color: '#6ee7a0', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}>
                            <span style={{
                                display: 'inline-block', width: '8px', height: '8px',
                                borderRadius: '50%', background: '#6ee7a0',
                                boxShadow: '0 0 8px #6ee7a0',
                                animation: 'pulse-dot 2s ease-in-out infinite',
                            }} />
                            La Commune en Images
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#4b5563', fontStyle: 'italic' }}>
                            Aguégués · Bénin
                        </span>
                    </div>
                    {/* Carousel */}
                    <div style={{ flex: 1, overflow: 'hidden', minHeight: '250px', padding: '8px 6px 6px' }}>
                        <Carousel2 />
                    </div>
                </section>

            <style>{`
        /* ── Layout ── */
        @media (min-width: 640px) {
          .home-main { height: 100dvh; flex-direction: column; overflow: hidden; }
        }
        @media (max-width: 639px) {
          .home-main { height: auto; min-height: 100dvh; overflow: auto; }
        }

        /* ── Slide transitions ── */
        @keyframes slideInFromRight {
          from { transform: translateX(100%) skewX(-3deg); opacity: 0; }
          to   { transform: translateX(0)    skewX(0deg);  opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%) skewX(3deg); opacity: 0; }
          to   { transform: translateX(0)     skewX(0deg); opacity: 1; }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0)     skewX(0deg);  opacity: 1; }
          to   { transform: translateX(-100%) skewX(-3deg); opacity: 0; }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0)    skewX(0deg); opacity: 1; }
          to   { transform: translateX(100%) skewX(3deg); opacity: 0; }
        }

        .slide-enter-right  { animation: slideInFromRight  0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-enter-left   { animation: slideInFromLeft   0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-exit-left    { animation: slideOutToLeft    0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-exit-right   { animation: slideOutToRight   0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-visible      { transform: translateX(0); opacity: 1; }

        /* ── Ken Burns sur l'image active ── */
        @keyframes kenBurns {
          0%   { transform: scale(1)    translate(0, 0); }
          50%  { transform: scale(1.06) translate(-1%, 0.5%); }
          100% { transform: scale(1)    translate(0, 0); }
        }
        .carousel-img-active {
          animation: kenBurns 8s ease-in-out infinite;
        }

        /* ── Caption reveal ── */
        .caption-reveal {
          transform: translateY(16px);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.25s,
                      opacity   0.55s ease 0.25s;
        }
        .caption-reveal.caption-visible {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Dot pulsant ── */
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 6px #6ee7a0; opacity: 1; }
          50%       { box-shadow: 0 0 14px #6ee7a0; opacity: 0.6; }
        }
      `}</style>
        </main>
    )
}
