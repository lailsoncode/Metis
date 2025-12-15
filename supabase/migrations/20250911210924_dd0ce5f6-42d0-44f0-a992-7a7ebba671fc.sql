-- Update handle_new_user function to include lailson@oxentecode.com.br as admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', 'Usuário'),
    NEW.email,
    CASE 
      WHEN NEW.email IN ('admin@conexaopalmeira.com', 'lailson@oxentecode.com.br') THEN 'admin'::user_role
      ELSE 'student'::user_role
    END
  );
  RETURN NEW;
END;
$function$;

-- Create student_registrations table for detailed enrollment data
CREATE TABLE public.student_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  birth_date DATE,
  institution_name TEXT NOT NULL,
  school_year TEXT,
  course_name TEXT,
  city TEXT,
  state TEXT,
  motivation TEXT,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_registrations
CREATE POLICY "Students can view their own registration"
ON public.student_registrations
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Students can insert their own registration"
ON public.student_registrations
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Students can update their own registration"
ON public.student_registrations
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all registrations"
ON public.student_registrations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND role = 'admin'::user_role
));

CREATE POLICY "Admins can manage all registrations"
ON public.student_registrations
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND role = 'admin'::user_role
));

-- Create trigger for updated_at
CREATE TRIGGER update_student_registrations_updated_at
BEFORE UPDATE ON public.student_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing lailson@oxentecode.com.br user to admin if exists
UPDATE public.profiles 
SET role = 'admin'::user_role 
WHERE email = 'lailson@oxentecode.com.br' AND role = 'student'::user_role;