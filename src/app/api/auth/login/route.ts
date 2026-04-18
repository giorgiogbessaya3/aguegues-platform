import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { createHash } from 'crypto'

const DB_PATH = path.join(process.cwd(), 'data', 'comptes.json')

type Compte = {
    id: string
    email: string
    password_hash: string
    nom: string
    prenom: string
    statut: string
}

async function lireComptes(): Promise<Compte[]> {
    try {
        const c = await readFile(DB_PATH, 'utf-8')
        return JSON.parse(c)
    } catch { return [] }
}

function hashPassword(pwd: string) {
    return createHash('sha256').update(pwd + 'aguegues-salt').digest('hex')
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ message: 'Email et mot de passe requis' }, { status: 400 })
        }

        const comptes = await lireComptes()
        const compte = comptes.find(c => c.email === email)

        if (!compte) {
            return NextResponse.json({ message: 'Email ou mot de passe incorrect.' }, { status: 401 })
        }

        if (compte.password_hash !== hashPassword(password)) {
            return NextResponse.json({ message: 'Email ou mot de passe incorrect.' }, { status: 401 })
        }

        if (compte.statut === 'suspendu') {
            return NextResponse.json({ message: 'Votre compte a été suspendu. Contactez l\'administration.' }, { status: 403 })
        }

        // Session légère — dans un vrai projet, utiliser JWT ou NextAuth
        return NextResponse.json({
            success: true,
            user: { id: compte.id, email: compte.email, nom: compte.nom, prenom: compte.prenom }
        })
    } catch (err) {
        console.error('API auth/login erreur:', err)
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
    }
}
