-- Remove a foreign key constraint problemática da tabela profiles
-- Segundo as boas práticas do Supabase, nunca devemos referenciar auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;