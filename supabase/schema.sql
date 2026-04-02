-- ===========================================
-- SCHÉMA BASE DE DONNÉES — Aguégués / AGANER
-- À exécuter dans Supabase SQL Editor
-- ===========================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLE : profiles (tous les utilisateurs)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('cadre', 'jeune')),
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'suspendu')),
  
  -- Informations personnelles
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  photo_url TEXT,
  date_naissance DATE,
  village_origine TEXT,
  ville_residence TEXT,
  pays_residence TEXT DEFAULT 'Bénin',
  
  -- Contact
  telephone TEXT,
  telephone_public BOOLEAN DEFAULT false,
  email_public BOOLEAN DEFAULT false,
  linkedin_url TEXT,
  
  -- Présentation
  bio TEXT,
  
  -- Formation
  niveau_etudes TEXT,
  diplomes TEXT[], -- liste de diplômes
  etablissements TEXT[], -- établissements fréquentés
  
  -- Secteur
  secteur_activite TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABLE : profiles_cadres (infos supplémentaires pour les cadres)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.profiles_cadres (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  poste_actuel TEXT,
  employeur TEXT,
  employeur_public BOOLEAN DEFAULT true,
  domaine_expertise TEXT,
  annees_experience INTEGER,
  realisations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABLE : profiles_jeunes (infos supplémentaires pour les jeunes)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.profiles_jeunes (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  statut_emploi TEXT CHECK (statut_emploi IN ('en_poste', 'cherche_emploi', 'etudiant', 'entrepreneur')),
  competences TEXT[],
  cv_url TEXT,
  cv_public BOOLEAN DEFAULT true,
  ouvert_opportunites BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABLE : articles (actualités/blog)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  extrait TEXT,
  image_url TEXT,
  categorie TEXT DEFAULT 'actualite' CHECK (categorie IN ('actualite', 'opportunite', 'nomination', 'evenement')),
  publie BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  auteur_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TABLE : messages_contact
-- ===========================================
CREATE TABLE IF NOT EXISTS public.messages_contact (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT,
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_cadres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_jeunes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_contact ENABLE ROW LEVEL SECURITY;

-- Profiles : lecture publique des profils validés
CREATE POLICY "Profils validés publics" ON public.profiles
  FOR SELECT USING (statut = 'valide');

-- Profiles : un utilisateur peut voir et modifier son propre profil
CREATE POLICY "Voir son propre profil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Modifier son propre profil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Créer son profil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Articles : lecture publique des articles publiés
CREATE POLICY "Articles publiés publics" ON public.articles
  FOR SELECT USING (publie = true);

-- Messages contact : insertion publique
CREATE POLICY "Envoyer un message" ON public.messages_contact
  FOR INSERT WITH CHECK (true);

-- ===========================================
-- FONCTION : mise à jour automatique updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- DONNÉES DE DÉMONSTRATION (articles)
-- ===========================================
INSERT INTO public.articles (titre, contenu, extrait, categorie, publie, slug) VALUES
(
  'Lancement officiel de la plateforme AGANER',
  'Nous sommes ravis d''annoncer le lancement officiel de la plateforme numérique de recensement des cadres et jeunes talents de la commune des Aguégués. Cette initiative, portée par l''ONG AGANER en partenariat avec la Mairie des Aguégués, vise à créer un annuaire numérique de toutes les compétences de notre commune pour favoriser le développement local.',
  'Lancement de la plateforme numérique de recensement des talents de la commune des Aguégués.',
  'actualite',
  true,
  'lancement-plateforme-aganer'
),
(
  'Appel à candidatures — Jeunes entrepreneurs 2025',
  'La Mairie des Aguégués et l''ONG AGANER lancent un appel à candidatures pour le programme de soutien aux jeunes entrepreneurs de la commune. Les candidats sélectionnés bénéficieront d''un accompagnement personnalisé et d''une subvention pour démarrer leur activité.',
  'Programme de soutien aux jeunes entrepreneurs de la commune des Aguégués.',
  'opportunite',
  true,
  'appel-candidatures-entrepreneurs-2025'
),
(
  'Nomination du nouveau Directeur Général des Services',
  'La Mairie des Aguégués annonce la nomination de M. exemple à la direction générale des services de la commune. Fort de 15 ans d''expérience dans l''administration publique, il apportera son expertise au service du développement de la commune.',
  'Nomination à la direction générale des services de la Mairie des Aguégués.',
  'nomination',
  true,
  'nomination-directeur-general-services'
);
