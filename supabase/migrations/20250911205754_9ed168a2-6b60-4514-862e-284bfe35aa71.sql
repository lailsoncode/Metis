-- =============================================================================
-- CORREÇÃO DE SEGURANÇA - SEARCH_PATH NAS FUNÇÕES
-- =============================================================================

-- Corrigir function update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Corrigir function handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@conexaopalmeira.com' THEN 'admin'::user_role
      ELSE 'student'::user_role
    END
  );
  RETURN NEW;
END;
$$;

-- Corrigir function update_course_progress
CREATE OR REPLACE FUNCTION public.update_course_progress()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_modules INTEGER;
  completed_modules INTEGER;
  progress_percent INTEGER;
  enrollment_record RECORD;
BEGIN
  -- Buscar a matrícula
  SELECT * INTO enrollment_record 
  FROM public.enrollments 
  WHERE id = NEW.enrollment_id;
  
  -- Contar módulos totais e completados
  SELECT COUNT(*) INTO total_modules
  FROM public.course_modules 
  WHERE course_id = enrollment_record.course_id AND is_required = true;
  
  SELECT COUNT(*) INTO completed_modules
  FROM public.module_progress mp
  JOIN public.course_modules cm ON cm.id = mp.module_id
  WHERE mp.student_id = NEW.student_id 
    AND cm.course_id = enrollment_record.course_id
    AND mp.is_completed = true
    AND cm.is_required = true;
  
  -- Calcular porcentagem
  IF total_modules > 0 THEN
    progress_percent := (completed_modules * 100) / total_modules;
  ELSE
    progress_percent := 0;
  END IF;
  
  -- Atualizar progresso na matrícula
  UPDATE public.enrollments 
  SET 
    progress_percentage = progress_percent,
    completed_at = CASE 
      WHEN progress_percent = 100 THEN now() 
      ELSE NULL 
    END
  WHERE id = NEW.enrollment_id;
  
  -- Se curso completo, gerar certificado
  IF progress_percent = 100 AND NOT EXISTS (
    SELECT 1 FROM public.certificates 
    WHERE student_id = NEW.student_id AND course_id = enrollment_record.course_id
  ) THEN
    INSERT INTO public.certificates (
      student_id, 
      course_id, 
      enrollment_id,
      certificate_number,
      verification_code
    ) VALUES (
      NEW.student_id,
      enrollment_record.course_id,
      NEW.enrollment_id,
      'CERT-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8)),
      UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 12))
    );
  END IF;
  
  RETURN NEW;
END;
$$;