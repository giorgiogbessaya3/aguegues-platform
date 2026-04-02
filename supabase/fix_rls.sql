-- ============================================================
-- CORRECTIF RLS (Row Level Security)
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- 1. Désactiver temporairement RLS sur toutes les tables
--    (à re-sécuriser avant mise en production)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_cadres DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_jeunes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_contact DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques conflictuelles
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Lecture profils validés" ON public.profiles;
DROP POLICY IF EXISTS "Admin peut voir tous les profils" ON public.profiles;
DROP POLICY IF EXISTS "User peut modifier son propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Insertion de son propre profil" ON public.profiles;

-- ============================================================
-- VÉRIFICATION — Voir tous les profils inscrits
-- ============================================================
SELECT 
    p.id,
    p.prenom,
    p.nom,
    p.type,
    p.statut,
    p.created_at,
    u.email,
    u.email_confirmed_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC;
