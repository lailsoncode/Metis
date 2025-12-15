import { useState } from "react";
import { CourseHero } from "@/components/CourseHero";
import { ModuleCard } from "@/components/ModuleCard";
import { ModuleContent } from "@/components/ModuleContent";
import { Wind, TreePine, Users, ArrowRight, Play, Star, Users as UsersIcon, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ConexaoPalmeira = () => {
  const [showCourse, setShowCourse] = useState(false);
  const [activeModule, setActiveModule] = useState<"modulo-1" | "modulo-2" | "modulo-3">("modulo-1");

  const modules = [
    {
      id: "modulo-1" as const,
      title: "O Vento que Transforma",
      description: "Fundamentos da energia eólica e o Complexo Serra da Palmeira",
      icon: Wind,
      color: "primary" as const,
    },
    {
      id: "modulo-2" as const,
      title: "O Tesouro da Serra", 
      description: "Biodiversidade da Caatinga e preservação ambiental",
      icon: TreePine,
      color: "secondary" as const,
    },
    {
      id: "modulo-3" as const,
      title: "Diálogos entre Natureza e Tecnologia",
      description: "A harmonia entre inovação e meio ambiente",
      icon: Users,
      color: "accent" as const,
    },
  ];

  if (!showCourse) {
    return (
      <div className="min-h-screen">
        {/* Modern Hero Section */}
        <CourseHero onEnroll={() => setShowCourse(true)} />
        
        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-background to-surface-light">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">3</h3>
                <p className="text-muted-foreground">Módulos Interativos</p>
              </div>
              <div className="group">
                <div className="bg-gradient-nature rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">500+</h3>
                <p className="text-muted-foreground">Estudantes Conectados</p>
              </div>
              <div className="group">
                <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Wind className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">100%</h3>
                <p className="text-muted-foreground">Energia Limpa</p>
              </div>
              <div className="group">
                <div className="bg-gradient-nature rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">∞</h3>
                <p className="text-muted-foreground">Possibilidades</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-20 bg-surface-light">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Descubra o Poder da
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Energia Sustentável
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Uma experiência educacional única que conecta tecnologia, natureza e conhecimento
                na região da Serra da Palmeira, Picuí - PB
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {modules.map((module, index) => (
                <div 
                  key={module.id}
                  className="group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-strong transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-8">
                    <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <module.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{module.title}</h3>
                    <p className="text-muted-foreground mb-6">{module.description}</p>
                    <Button 
                      variant="ghost" 
                      className="group/btn p-0 h-auto text-primary hover:text-primary-dark"
                      onClick={() => setShowCourse(true)}
                    >
                      Explorar Módulo
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => setShowCourse(true)}
                size="lg"
                className="group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Começar Jornada de Aprendizado
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para Transformar o Futuro?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a centenas de estudantes descobrindo a harmonia entre tecnologia e natureza
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/matricula">
                <Button size="lg" variant="secondary" className="group">
                  <Wind className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Matricule-se Agora
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline-light">
                  <TreePine className="mr-2 h-5 w-5" />
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Modern Footer */}
        <footer className="bg-card border-t border-border py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                  Conexão Palmeira
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Conectando conhecimento, tecnologia e natureza para formar os líderes sustentáveis do futuro.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500" />
                    4.9/5 Avaliação dos Estudantes
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Parceiros</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>IFPB Picuí</p>
                  <p>CTG Brasil</p>
                  <p>Omexom</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contato</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Serra da Palmeira</p>
                  <p>Picuí - PB</p>
                  <p>contato@conexaopalmeira.com.br</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2025 Conexão Palmeira. Todos os direitos reservados.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Portal do Aluno
                </Link>
                <Link to="/matricula" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Matricular-se
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-soft">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Conexão Palmeira
            </h1>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Portal do Aluno
                </Button>
              </Link>
              <button
                onClick={() => setShowCourse(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Module Navigation */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Escolha seu Módulo de
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Aprendizado
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore cada aspecto da energia eólica e sua relação com a natureza através dos nossos módulos interativos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                isActive={activeModule === module.id}
                onClick={() => setActiveModule(module.id)}
                color={module.color}
              />
            ))}
          </div>
        </div>

        {/* Module Content */}
        <div className="bg-card rounded-2xl shadow-strong p-8 md:p-12 border border-border/50">
          <ModuleContent activeModule={activeModule} />
        </div>
      </div>
    </div>
  );
};

export default ConexaoPalmeira;