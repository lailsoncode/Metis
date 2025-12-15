-- Matricular o usuário admin no curso "Conexão Palmeira" para permitir visualização
INSERT INTO enrollments (student_id, course_id, enrolled_at, is_active)
SELECT 
    p.id as student_id,
    c.id as course_id,
    now() as enrolled_at,
    true as is_active
FROM profiles p, courses c
WHERE p.email = 'lailson@oxentecode.com.br' 
  AND c.title = 'Conexão Palmeira'
  AND NOT EXISTS (
    SELECT 1 FROM enrollments e 
    WHERE e.student_id = p.id AND e.course_id = c.id
  );