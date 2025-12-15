-- =============================================================================
-- CONEXÃO PALMEIRA - TABELAS E FUNÇÕES RESTANTES (PARTE 3)
-- =============================================================================

-- =============================================================================
-- TABELA DE PROGRESSO DOS MÓDULOS
-- =============================================================================
CREATE TABLE public.module_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, module_id)
);

-- Enable RLS for module_progress
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for module_progress
CREATE POLICY "Students can view their own progress" 
ON public.module_progress FOR SELECT 
USING (student_id = auth.uid());

CREATE POLICY "Students can update their own progress" 
ON public.module_progress FOR ALL 
USING (student_id = auth.uid());

CREATE POLICY "Admins can view all progress" 
ON public.module_progress FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =============================================================================
-- TABELA DE CERTIFICADOS
-- =============================================================================
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status certificate_status NOT NULL DEFAULT 'issued',
  certificate_url TEXT,
  verification_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Enable RLS for certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for certificates
CREATE POLICY "Students can view their own certificates" 
ON public.certificates FOR SELECT 
USING (student_id = auth.uid());

CREATE POLICY "Anyone can verify certificates" 
ON public.certificates FOR SELECT 
USING (status = 'issued');

CREATE POLICY "Admins can manage certificates" 
ON public.certificates FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =============================================================================
-- FUNCTIONS E TRIGGERS
-- =============================================================================

-- Function para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automático
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function para atualizar progresso do curso
CREATE OR REPLACE FUNCTION public.update_course_progress()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger para atualizar progresso
CREATE TRIGGER update_course_progress_trigger
  AFTER INSERT OR UPDATE ON public.module_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_course_progress();

-- Function para verificar se usuário tem role específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$;