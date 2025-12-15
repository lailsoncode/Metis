-- Create the main "Conexão Palmeira" course
INSERT INTO public.courses (
  title,
  description,
  detailed_description,
  level,
  duration_hours,
  is_active,
  is_featured,
  price
) VALUES (
  'Conexão Palmeira: Energia Eólica e Biodiversidade',
  'Explore a integração entre tecnologia eólica e preservação ambiental na Serra da Palmeira',
  'Um curso completo que desvenda a ciência por trás do complexo eólico e a rica biodiversidade da Caatinga, mostrando como tecnologia e natureza podem coexistir harmoniosamente.',
  'iniciante',
  12,
  true,
  true,
  0.00
);

-- Get the course ID for the modules (assuming it will be the first course)
-- Create Module 1: "O Vento que Transforma" - Energia Eólica
INSERT INTO public.course_modules (
  course_id,
  title,
  description,
  content,
  module_type,
  order_index,
  duration_minutes,
  is_required
) VALUES 
-- Módulo 1, Parte 1
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'Fundamentos da Energia Eólica',
  'Uma introdução ao conceito de energia eólica e como as turbinas funcionam',
  '# Fundamentos da Energia Eólica

## O que é energia eólica
A energia eólica é uma fonte de energia limpa e renovável que utiliza a força dos ventos para gerar eletricidade. É uma das formas mais sustentáveis de produção energética, não emitindo gases poluentes durante sua operação.

## Como as turbinas funcionam
As turbinas eólicas capturam a energia cinética do vento através de suas pás aerodinâmicas. Quando o vento atinge as pás, elas giram um rotor conectado a um gerador que converte o movimento em energia elétrica.

## Importância e benefícios
- Fonte de energia renovável e limpa
- Redução da emissão de gases do efeito estufa
- Geração de empregos locais
- Contribuição para a matriz energética brasileira',
  'texto',
  1,
  60,
  true
),
-- Módulo 1, Parte 2
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'O Complexo Serra da Palmeira',
  'A história e implementação do complexo eólico na região',
  '# O Complexo Serra da Palmeira

## História e instalação
O complexo eólico Serra da Palmeira representa um marco no desenvolvimento de energia renovável na região. Desde o planejamento até a construção, o projeto envolveu estudos detalhados de viabilidade técnica e ambiental.

## Parceiros e tecnologia
O projeto conta com a parceria de empresas líderes como CTG Brasil e Omexom, trazendo tecnologia de ponta e práticas sustentáveis para a região de Picuí.

## Dados e escala
- Capacidade instalada significativa
- Geração limpa de energia
- Impacto positivo no desenvolvimento regional
- Contribuição para a economia local',
  'texto',
  2,
  45,
  true
),
-- Módulo 1, Parte 3
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'O Futuro do Vento',
  'Carreiras, manutenção e perspectivas futuras',
  '# O Futuro do Vento

## Manutenção e operação
A operação de um parque eólico requer profissionais especializados em diversas áreas, desde técnicos em energia até especialistas em meio ambiente.

## Carreiras e oportunidades
O setor de energia renovável oferece diversas oportunidades profissionais:
- Técnicos em energia eólica
- Engenheiros ambientais
- Especialistas em manutenção
- Analistas de dados energéticos

## Projetos de expansão
O futuro da energia eólica na região promete mais desenvolvimento sustentável e oportunidades de crescimento econômico local.',
  'texto',
  3,
  40,
  true
),
-- Módulo 2, Parte 1
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'Conhecendo a Caatinga',
  'As características únicas do bioma Caatinga',
  '# Conhecendo a Caatinga

## O que é a Caatinga
A Caatinga é um bioma exclusivamente brasileiro, caracterizado por sua vegetação xerófila adaptada ao clima semiárido. É um ecossistema único no mundo, com alta biodiversidade e espécies endêmicas.

## Fauna e flora nativas
O bioma abriga uma rica diversidade de espécies adaptadas às condições áridas:
- Plantas suculentas e espinhosas
- Aves migratórias e residentes
- Mamíferos adaptados ao clima seco
- Répteis e anfíbios únicos

## Mapa interativo
A região de Picuí possui pontos de interesse ecológico únicos, onde é possível observar a biodiversidade local em seu habitat natural.',
  'texto',
  4,
  50,
  true
),
-- Módulo 2, Parte 2
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'Espécies e Preservação',
  'Catálogo da fauna local e medidas de conservação',
  '# Espécies e Preservação

## Animais da Serra da Palmeira
A região abriga uma diversidade impressionante de fauna:
- **Aves**: Bem-te-vi, Sabiá-do-campo, Carcará
- **Mamíferos**: Mocó, Preá, Raposa
- **Répteis**: Lagartos e serpentes adaptados

## Sons da natureza
A paisagem sonora da Caatinga é rica e diversificada, com cantos de aves que variam conforme as estações e horários do dia.

## Espécies ameaçadas
Algumas espécies locais enfrentam pressões ambientais e requerem medidas específicas de preservação e monitoramento.',
  'texto',
  5,
  55,
  true
),
-- Módulo 2, Parte 3
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'Interagindo com o Meio Ambiente',
  'Práticas de observação e conservação responsável',
  '# Interagindo com o Meio Ambiente

## Guia de observação
Para observar a natureza de forma responsável:
- Mantenha distância segura dos animais
- Não remova plantas ou disturbe ninhos
- Use binóculos para observação de aves
- Caminhe silenciosamente

## Programas de conservação
A comunidade local e empresas parceiras desenvolvem ações conjuntas para proteger o ecossistema da região.

## Turismo ecológico
O potencial para turismo sustentável na região é significativo, podendo gerar renda para a comunidade local enquanto promove a conservação.',
  'texto',
  6,
  45,
  true
),
-- Módulo 3, Parte 1
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'Tecnologia e Meio Ambiente',
  'Como projetos tecnológicos podem coexistir com a natureza',
  '# Tecnologia e Meio Ambiente

## Introdução à Convivência
Projetos de infraestrutura podem ser desenvolvidos em harmonia com o meio ambiente através de planejamento cuidadoso e tecnologias apropriadas.

## Estudos de impacto
Antes da instalação do parque eólico, foram realizados estudos detalhados:
- Análise de rotas migratórias de aves
- Estudos de solo e vegetação
- Avaliação de impactos sonoros
- Monitoramento da fauna local

## Soluções e mitigações
As empresas implementam diversas medidas para minimizar impactos ambientais e promover a coexistência harmoniosa.',
  'texto',
  7,
  50,
  true
),
-- Módulo 3, Parte 2
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'Pessoas e o Projeto',
  'Histórias e depoimentos da comunidade local',
  '# Pessoas e o Projeto

## Entrevistas com especialistas
Profissionais especializados compartilham suas experiências sobre a implementação do projeto e seus impactos positivos.

## Depoimentos da comunidade
Moradores locais relatam como o projeto trouxe benefícios para a região, incluindo oportunidades de emprego e desenvolvimento econômico.

## Engajamento local
O projeto "Conexão Palmeira" serve como modelo de como iniciativas tecnológicas podem beneficiar comunidades locais.',
  'texto',
  8,
  40,
  true
),
-- Módulo 3, Parte 3
(
  (SELECT id FROM public.courses WHERE title = 'Conexão Palmeira: Energia Eólica e Biodiversidade' LIMIT 1),
  'Roteiros do Conhecimento',
  'Conectando teoria e prática através de experiências',
  '# Roteiros do Conhecimento

## Trilhas virtuais
Roteiros digitais interativos que conectam os conhecimentos adquiridos nos módulos anteriores, mostrando a integração entre tecnologia e natureza.

## Roteiros físicos
Sugestões de locais que podem ser visitados para observar:
- As turbinas eólicas em funcionamento
- Pontos de observação da biodiversidade local
- Mirantes da Serra da Palmeira

## O futuro da conexão
A integração bem-sucedida entre tecnologia e natureza inspira um modelo de desenvolvimento mais sustentável para outras regiões.',
  'texto',
  9,
  35,
  true
);