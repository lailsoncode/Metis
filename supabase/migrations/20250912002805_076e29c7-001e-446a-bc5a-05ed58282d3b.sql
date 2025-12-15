-- Limpar banco mantendo apenas o usuário admin
-- Deletar certificados (exceto os do admin se houver)
DELETE FROM certificates 
WHERE student_id NOT IN (
  SELECT id FROM profiles WHERE role = 'admin'
);

-- Deletar progresso de módulos (exceto do admin se houver)
DELETE FROM module_progress 
WHERE student_id NOT IN (
  SELECT id FROM profiles WHERE role = 'admin'
);

-- Deletar matrículas (exceto do admin se houver)
DELETE FROM enrollments 
WHERE student_id NOT IN (
  SELECT id FROM profiles WHERE role = 'admin'
);

-- Deletar registros de estudantes (exceto do admin)
DELETE FROM student_registrations 
WHERE user_id NOT IN (
  SELECT id FROM profiles WHERE role = 'admin'
);

-- Deletar profiles de estudantes (manter apenas admin)
DELETE FROM profiles 
WHERE role = 'student';