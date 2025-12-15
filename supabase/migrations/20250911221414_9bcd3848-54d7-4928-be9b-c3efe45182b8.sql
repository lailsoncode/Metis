-- Fix RLS recursion issues by updating all policies to use public.has_role function
-- Drop existing problematic policies first
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage course modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.module_progress;
DROP POLICY IF EXISTS "Admins can manage all registrations" ON public.student_registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.student_registrations;

-- Create new policies using public.has_role to prevent recursion
-- Profiles policies
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Courses policies
CREATE POLICY "Admins can manage courses" 
ON public.courses 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Course modules policies  
CREATE POLICY "Admins can manage course modules" 
ON public.course_modules 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update the student policy for course modules to also use has_role
DROP POLICY IF EXISTS "Students can view modules of enrolled courses" ON public.course_modules;
CREATE POLICY "Students can view modules of enrolled courses" 
ON public.course_modules 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE e.course_id = course_modules.course_id 
      AND e.student_id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin')
);

-- Enrollments policies
CREATE POLICY "Admins can manage all enrollments" 
ON public.enrollments 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Certificates policies
CREATE POLICY "Admins can manage certificates" 
ON public.certificates 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Module progress policies
CREATE POLICY "Admins can view all progress" 
ON public.module_progress 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Student registrations policies
CREATE POLICY "Admins can manage all registrations" 
ON public.student_registrations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for automatic progress updates and certificate generation
CREATE TRIGGER trigger_update_course_progress
  AFTER INSERT OR UPDATE ON public.module_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_progress();

-- Create triggers for automatic profile updates
CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_updated_at();

CREATE TRIGGER trigger_update_student_registrations_updated_at
  BEFORE UPDATE ON public.student_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();