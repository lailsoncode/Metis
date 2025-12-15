import { Wifi, Bot, Database, Brain, Printer } from "lucide-react";

const themes = [
  {
    icon: Wifi,
    title: "Internet das Coisas (IoT)",
    description: "Dispositivos conectados transformando indústrias e cidades inteligentes.",
    color: "primary"
  },
  {
    icon: Bot,
    title: "Robótica",
    description: "Automação e robôs colaborativos na manufatura moderna.",
    color: "secondary"
  },
  {
    icon: Database,
    title: "Big Data",
    description: "Análise de grandes volumes de dados para tomada de decisões.",
    color: "accent"
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Algoritmos que aprendem e melhoram com experiência.",
    color: "primary"
  },
  {
    icon: Printer,
    title: "Impressão 3D",
    description: "Manufatura aditiva revolucionando a produção industrial.",
    color: "secondary"
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/30",
      glow: "group-hover:shadow-glow"
    },
    secondary: {
      bg: "bg-secondary/10",
      text: "text-secondary",
      border: "border-secondary/30",
      glow: "group-hover:shadow-glow-purple"
    },
    accent: {
      bg: "bg-accent/10",
      text: "text-accent",
      border: "border-accent/30",
      glow: "group-hover:shadow-glow-accent"
    }
  };
  return colors[color] || colors.primary;
};

export const ThemesGallery = () => {
  return (
    <section id="temas" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Conteúdo Programático
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            O que você vai{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              aprender
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore os principais pilares da Indústria 4.0 através de vídeos 
            educativos e materiais didáticos desenvolvidos especialmente para 
            professores e alunos da educação básica.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {themes.map((theme, index) => {
            const colorClasses = getColorClasses(theme.color);
            return (
              <div 
                key={theme.title}
                className={`group relative p-6 rounded-2xl bg-card border ${colorClasses.border} hover:border-opacity-60 transition-all duration-300 cursor-pointer ${colorClasses.glow}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colorClasses.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <theme.icon className={`w-7 h-7 ${colorClasses.text}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {theme.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {theme.description}
                </p>

                {/* Hover Indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-transparent ${theme.color === 'primary' ? 'via-primary' : theme.color === 'secondary' ? 'via-secondary' : 'via-accent'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
