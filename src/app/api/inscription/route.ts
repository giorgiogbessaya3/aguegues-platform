import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { createHash } from 'crypto'

const DB_PATH = path.join(process.cwd(), 'data', 'comptes.json')

type Compte = {
    id: string
    email: string
    password_hash: string
    type: string
    nom: string
    prenom: string
    telephone?: string
    ville_residence?: string
    pays_residence: string
    statut: string
    created_at: string
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
        const body = await req.json()
        if (!body.email || !body.nom || !body.prenom) {
            return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
        }

        const dir = path.dirname(DB_PATH)
        if (!existsSync(dir)) await mkdir(dir, { recursive: true })

        const comptes = await lireComptes()

        // Vérifier doublon email
        if (comptes.find(c => c.email === body.email)) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
        }

        const nouveau: Compte = {
            id: `user_${Date.now()}`,
            email: body.email,
            password_hash: body.password ? hashPassword(body.password) : '',
            type: body.type || 'jeune',
            nom: body.nom,
            prenom: body.prenom,
            telephone: body.telephone || undefined,
            ville_residence: body.ville_residence || undefined,
            pays_residence: body.pays_residence || 'Bénin',
            statut: 'en_attente',
            created_at: new Date().toISOString(),
        }

        comptes.push(nouveau)
        await writeFile(DB_PATH, JSON.stringify(comptes, null, 2), 'utf-8')

        return NextResponse.json({ success: true, id: nouveau.id }, { status: 201 })
    } catch (err) {
        console.error('API inscription erreur:', err)
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
    }
}
