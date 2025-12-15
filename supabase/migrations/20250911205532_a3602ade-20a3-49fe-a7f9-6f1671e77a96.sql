-- =============================================================================
-- CONEXÃO PALMEIRA - ESTRUTURA COMPLETA DO BANCO DE DADOS (PARTE 1)
-- =============================================================================

-- Criação dos tipos enum
CREATE TYPE public.user_role AS ENUM ('admin', 'student');
CREATE TYPE public.course_level AS ENUM ('iniciante', 'intermediario', 'avancado');
CREATE TYPE public.module_type AS ENUM ('video', 'texto', 'quiz', 'atividade');
CREATE TYPE public.certificate_status AS ENUM ('pending', 'issued', 'revoked');

-- =============================================================================
-- TABELA DE PERFIS DE USUÁRIO
-- =============================================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =============================================================================
-- TABELA DE CURSOS
-- =============================================================================
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  level course_level NOT NULL DEFAULT 'iniciante',
  duration_hours INTEGER NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  instructor_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  price DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view active courses" 
ON public.courses FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage courses" 
ON public.courses FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =============================================================================
-- TABELA DE MÓDULOS DO CURSO
-- =============================================================================
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  module_type module_type NOT NULL DEFAULT 'texto',
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for course_modules
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- TABELA DE MATRÍCULAS
-- =============================================================================
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(student_id, course_id)
);

-- Enable RLS for enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;