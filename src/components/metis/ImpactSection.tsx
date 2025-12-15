import { FileText, Users, School, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const stats = [
  {
    icon: School,
    value: "10+",
    label: "Escolas Atendidas",
    color: "primary"
  },
  {
    icon: Users,
    value: "50+",
    label: "Professores Formados",
    color: "secondary"
  },
  {
    icon: FileText,
    value: "500+",
    label: "Alunos Impactados",
    color: "accent"
  }
];

const methodologySteps = [
  {
    step: "01",
    title: "Roteirização (IA)",
    description: "Criação de roteiros educativos com auxílio de inteligência artificial, validados por especialistas.",
    icon: FileText
  },
  {
    step: "02",
    title: "Produção (Avatares)",
    description: "Geração de vídeos com avatares digitais usando Synthesia e HeyGen para máximo engajamento.",
    icon: Users
  },
  {
    step: "03",
    title: "Validação (Escolas)",
    description: "Aplicação e avaliação dos materiais em escolas públicas para garantir efetividade.",
    icon: School
  }
];

export const ImpactSection = () => {
  return (
    <section id="impacto" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Stats */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nosso Impacto
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12">
            Transformando a{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              educação pública
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl mb-4 mx-auto flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary/10' : 
                  stat.color === 'secondary' ? 'bg-secondary/10' : 'bg-accent/10'
                }`}>
                  <stat.icon className={`w-7 h-7 ${
                    stat.color === 'primary' ? 'text-primary' : 
                    stat.color === 'secondary' ? 'text-secondary' : 'text-accent'
                  }`} />
                </div>
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${
                  stat.color === 'primary' ? 'text-primary' : 
                  stat.color === 'secondary' ? 'text-secondary' : 'text-accent'
                }`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Nossa Metodologia
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Um processo estruturado para garantir qualidade e aplicabilidade 
              dos materiais educativos.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -translate-y-1/2" />

            <div className="grid md:grid-cols-3 gap-8">
              {methodologySteps.map((step, index) => (
                <div key={step.step} className="relative">
                  {/* Card */}
                  <div className="bg-card border border-border rounded-2xl p-6 relative z-10 hover:shadow-medium transition-shadow">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-6 px-3 py-1 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-full">
                      {step.step}
                    </div>

                    <div className="pt-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                        <step.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < methodologySteps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 z-20 w-8 h-8 bg-background border border-border rounded-full items-center justify-center -translate-y-1/2">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Note */}
          <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  Acessibilidade WCAG
                  <Sparkles className="w-4 h-4 text-accent" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  Todos os materiais são desenvolvidos seguindo diretrizes de acessibilidade, 
                  com alto contraste e design adaptável para garantir que todos os alunos 
                  possam aprender.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
