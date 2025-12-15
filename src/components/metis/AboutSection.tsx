import { BookOpen, Users, Lightbulb, Target, CheckCircle } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Lacuna na Formação",
    description: "Professores muitas vezes não possuem formação adequada sobre tecnologias digitais emergentes e Indústria 4.0."
  },
  {
    icon: Users,
    title: "Avatares Personalizados",
    description: "Utilizamos ferramentas como Synthesia e HeyGen para criar vídeos educativos com avatares digitais engajadores."
  },
  {
    icon: Lightbulb,
    title: "Metodologia Inovadora",
    description: "Roteiros criados com auxílio de IA, validados por especialistas e adaptados à realidade das escolas públicas."
  },
  {
    icon: Target,
    title: "Alinhamento BNCC",
    description: "Todo conteúdo segue as diretrizes da Base Nacional Comum Curricular, garantindo aplicabilidade em sala de aula."
  }
];

const highlights = [
  "Vídeos curtos e engajadores",
  "Linguagem acessível",
  "Alto contraste e acessibilidade",
  "Aplicação prática imediata"
];

export const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 md:py-32 bg-gradient-to-b from-background to-surface-light">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Sobre o Projeto
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Democratizando o acesso à{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              educação tecnológica
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            O projeto METIS surge para preencher a lacuna entre a formação docente tradicional 
            e as demandas da sociedade digital, utilizando avatares digitais como ponte para 
            o conhecimento.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-semibold text-center mb-6">
              Diferenciais do METIS
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
