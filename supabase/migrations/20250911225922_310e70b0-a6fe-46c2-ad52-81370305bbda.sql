-- Limpar todos os dados de usuários para recomeçar os testes
-- A ordem é importante para respeitar as foreign keys

-- 1. Limpar certificados
DELETE FROM public.certificates;

-- 2. Limpar progresso dos módulos  
DELETE FROM public.module_progress;

-- 3. Limpar matrículas/enrollments
DELETE FROM public.enrollments;

-- 4. Limpar registros de estudantes
DELETE FROM public.student_registrations;

-- 5. Limpar perfis
DELETE FROM public.profiles;

-- Nota: Os usuários em auth.users precisam ser removidos manualmente 
-- via dashboard do Supabase em Auth > Users