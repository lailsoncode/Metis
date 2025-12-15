-- Limpeza completa de usuários e progressos (sem tocar no schema auth)
-- Ordem respeita possíveis dependências

-- 1) Certificados
DELETE FROM public.certificates;

-- 2) Progresso de módulos
DELETE FROM public.module_progress;

-- 3) Matrículas
DELETE FROM public.enrollments;

-- 4) Registros de matrícula
DELETE FROM public.student_registrations;

-- 5) Perfis
DELETE FROM public.profiles;