import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Shield, Lock, Eye, Users, Mail } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Politique de Confidentialité — Portail Numérique des Aguégués',
    description: 'Politique de confidentialité et protection des données personnelles du Portail Numérique des Aguégués, conforme à la loi béninoise APDP.',
}

const sections = [
    {
        icon: <Users size={22} color="var(--color-primary)" />,
        titre: '1. Responsable du traitement',
        contenu: `Le responsable du traitement des données à caractère personnel est la **Mairie des Aguégués**, commune du département de l'Ouémé, République du Bénin.

Contact : mairie.aguegues@benin.bj | Aguégués Centre, Bénin`,
    },
    {
        icon: <Eye size={22} color="var(--color-primary)" />,
        titre: '2. Données collectées',
        contenu: `Dans le cadre de votre inscription sur le Portail Numérique des Aguégués, nous collectons les données suivantes :

• **Identité** : prénom, nom
• **Contact** : adresse email, numéro de téléphone (optionnel)
• **Localisation** : ville et pays de résidence
• **Profil professionnel** : poste, employeur, secteur d'activité, niveau d'études, biographie

Pour les doléances citoyennes, les données collectées sont : nom (optionnel), localité, description du problème, coordonnées GPS (optionnel) et photo/vidéo (optionnel).`,
    },
    {
        icon: <Shield size={22} color="var(--color-primary)" />,
        titre: '3. Finalité du traitement',
        contenu: `Vos données sont collectées pour les finalités suivantes :

• **Annuaire public** : permettre aux visiteurs de localiser les cadres et jeunes talents de la commune
• **Doléances** : transmettre vos préoccupations à la Mairie des Aguégués pour traitement
• **Communication** : vous informer des actualités, projets et opportunités de la commune
• **Amélioration du service** : analyser l'utilisation de la plateforme (données anonymisées)`,
    },
    {
        icon: <Lock size={22} color="var(--color-primary)" />,
        titre: '4. Sécurité des données',
        contenu: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :

• **Chiffrement SSL/TLS** : toutes les communications sont chiffrées
• **Hébergement sécurisé** : données hébergées sur Supabase (EU-West, conforme RGPD)
• **Authentification sécurisée** : mots de passe hachés, sessions sécurisées
• **Accès restreint** : seuls les administrateurs autorisés accèdent aux données sensibles`,
    },
    {
        icon: <Mail size={22} color="var(--color-primary)" />,
        titre: '5. Vos droits',
        contenu: `Conformément à la loi béninoise n°2009-09 portant protection des données à caractère personnel (APDP), vous disposez des droits suivants :

• **Droit d'accès** : obtenir une copie de vos données personnelles
• **Droit de rectification** : corriger des informations inexactes
• **Droit à l'effacement** : demander la suppression de votre compte et données
• **Droit d'opposition** : vous opposer au traitement de vos données

Pour exercer ces droits, contactez-nous via votre espace personnel ou à l'adresse : mairie.aguegues@benin.bj`,
    },
    {
        icon: <Shield size={22} color="var(--color-secondary)" />,
        titre: '6. Conservation des données',
        contenu: `Vos données sont conservées pour la durée nécessaire aux finalités pour lesquelles elles ont été collectées :

• **Profils actifs** : durée de l'inscription + 3 ans après dernière connexion
• **Doléances** : 5 ans après traitement complet
• **Données de navigation** : 13 mois maximum (anonymisées)

Au-delà de ces durées, vos données sont supprimées ou anonymisées.`,
    },
]

function renderContenu(texte: string) {
    return texte.split('\n').map((line, i) => {
        if (!line.trim()) return <br key={i} />
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return (
            <p key={i} style={{ margin: '0.375rem 0', color: 'var(--color-gray-600)', lineHeight: 1.75, fontSize: '0.9375rem' }}
                dangerouslySetInnerHTML={{ __html: formatted }} />
        )
    })
}

export default function PolitiqueConfidentialitePage() {
    return (
        <>
            <main style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>

                {/* HERO */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-secondary) 100%)',
                    padding: '3rem 0 2rem',
                }}>
                    <div className="container-main">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>Accueil</Link>
                            <ChevronRight size={14} color="rgba(255,255,255,0.5)" />
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>Politique de confidentialité</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Shield size={28} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'white', margin: 0 }}>
                                    Politique de Confidentialité
                                </h1>
                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', margin: '0.25rem 0 0' }}>
                                    Conforme à la loi APDP du Bénin · Dernière mise à jour : mars 2025
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENU */}
                <div className="container-main" style={{ padding: '2.5rem 1rem 4rem' }}>

                    {/* Bannière info */}
                    <div style={{
                        background: 'var(--color-primary-50)',
                        border: '1px solid var(--color-primary-200)',
                        borderRadius: '14px',
                        padding: '1rem 1.5rem',
                        marginBottom: '2rem',
                        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    }}>
                        <Shield size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.9375rem', color: 'var(--color-gray-700)', margin: 0, lineHeight: 1.65 }}>
                            Le Portail Numérique des Aguégués s&apos;engage à protéger vos données personnelles conformément à la loi béninoise n°2009-09
                            relative à la protection des données à caractère personnel (APDP).
                        </p>
                    </div>

                    {/* Sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {sections.map((s) => (
                            <div key={s.titre} style={{
                                background: 'white',
                                borderRadius: '16px',
                                boxShadow: 'var(--shadow-card)',
                                padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        background: 'var(--color-primary-50)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        {s.icon}
                                    </div>
                                    <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: 0 }}>
                                        {s.titre}
                                    </h2>
                                </div>
                                <div>{renderContenu(s.contenu)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Bas de page */}
                    <div style={{
                        marginTop: '2rem', padding: '1.25rem 1.5rem',
                        background: 'white', borderRadius: '16px',
                        boxShadow: 'var(--shadow-card)',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', margin: '0 0 1rem' }}>
                            Des questions sur cette politique ? Contactez-nous.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/contact" className="btn btn-primary btn-sm">
                                📬 Nous contacter
                            </Link>
                            <Link href="/" className="btn btn-ghost btn-sm">
                                ← Retour à l&apos;accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
