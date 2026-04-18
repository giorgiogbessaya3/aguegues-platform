import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'doleances.json')

// Lecture de la base locale
async function lireDoleances() {
    try {
        const contenu = await readFile(DB_PATH, 'utf-8')
        return JSON.parse(contenu) as object[]
    } catch {
        return []
    }
}

// GET : lister les doléances (usage admin)
export async function GET() {
    const doleances = await lireDoleances()
    return NextResponse.json(doleances)
}

// POST : enregistrer une nouvelle doléance
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Validation minimale
        if (!body.probleme || !body.localite) {
            return NextResponse.json(
                { error: 'Champs requis manquants : localite, probleme' },
                { status: 400 }
            )
        }

        // Assurer que le dossier data/ existe
        const dir = path.dirname(DB_PATH)
        if (!existsSync(dir)) await mkdir(dir, { recursive: true })

        // Lire les données existantes
        const existantes = await lireDoleances()

        // Ajouter la nouvelle doléance avec un ID unique
        const nouvelle = {
            id: Date.now(),
            ...body,
            media_data: undefined, // ne pas stocker le base64 en JSON (trop volumineux)
            has_media: !!body.media_data,
            created_at: body.created_at || new Date().toISOString(),
        }

        existantes.push(nouvelle)
        await writeFile(DB_PATH, JSON.stringify(existantes, null, 2), 'utf-8')

        return NextResponse.json({ success: true, id: nouvelle.id }, { status: 201 })
    } catch (err) {
        console.error('API doléances erreur:', err)
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
    }
}
