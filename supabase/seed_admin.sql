-- ============================================================
-- ADMIN PAR DÉFAUT — À SUPPRIMER APRÈS UTILISATION
-- Identifiants : admin@aganer.org / Admin2024!
-- Exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- 1. Créer l'utilisateur dans Supabase Auth
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    recovery_token
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@aganer.org',
    crypt('Admin2024!', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"admin"}'::jsonb,
    false,
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_id;

  -- 2. Créer le profil admin dans la table profiles
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      type,
      statut,
      nom,
      prenom,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      'cadre',
      'valide',
      'Admin',
      'AGANER',
      now(),
      now()
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Admin créé avec succès ! ID: %', admin_id;
  ELSE
    -- L'email existe déjà — récupérer l'ID existant
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@aganer.org';
    RAISE NOTICE 'Utilisateur admin@aganer.org existe déjà. ID: %', admin_id;
  END IF;

END $$;
