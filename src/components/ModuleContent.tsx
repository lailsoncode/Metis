import { Wind, Leaf, Users, Battery, TreePine, Microscope, MapPin, Heart, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import caatingaImage from "@/assets/caatinga-biodiversity.jpg";
import connectionImage from "@/assets/nature-tech-connection.jpg";

interface ModuleSection {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ModuleContentProps {
  activeModule: "modulo-1" | "modulo-2" | "modulo-3";
}

export const ModuleContent = ({ activeModule }: ModuleContentProps) => {
  const moduleData = {
    "modulo-1": {
      title: "O Vento que Transforma",
      color: "primary",
      sections: [
        {
          title: "Fundamentos da Energia Eólica",
          description: "Nesta seção, você vai descobrir o que é a energia eólica, por que ela é considerada uma fonte de energia limpa e renovável e como as turbinas funcionam para transformar o vento em eletricidade. Explore os benefícios ambientais e econômicos dessa tecnologia para o Brasil.",
          icon: <Wind className="h-6 w-6" />
        },
        {
          title: "O Complexo Serra da Palmeira", 
          description: "Vamos mergulhar na história do Complexo Eólico Serra da Palmeira, desde a sua idealização até a implementação. Conheça os parceiros estratégicos CTG Brasil e Omexom e aprenda sobre a tecnologia de ponta que faz a diferença na região de Picuí.",
          icon: <Battery className="h-6 w-6" />
        },
        {
          title: "O Futuro do Vento",
          description: "Descubra como é a manutenção e operação de um parque eólico. Entenda as carreiras e oportunidades profissionais neste setor e conheça os projetos futuros que podem expandir ainda mais o uso dessa tecnologia.",
          icon: <Route className="h-6 w-6" />
        }
      ]
    },
    "modulo-2": {
      title: "O Tesouro da Serra",
      color: "secondary", 
      sections: [
        {
          title: "Conhecendo a Caatinga",
          description: "Explore a biodiversidade única da Caatinga, um bioma exclusivo do Brasil. Esta seção apresenta a fauna e a flora nativas, além de um mapa interativo para você explorar os pontos de interesse ecológico em Picuí.",
          icon: <TreePine className="h-6 w-6" />
        },
        {
          title: "Espécies e Preservação",
          description: "Navegue por um catálogo digital de animais encontrados na Serra da Palmeira e ouça os sons da natureza. Saiba mais sobre as espécies endêmicas e em risco de extinção, e entenda a importância da sua preservação.",
          icon: <Microscope className="h-6 w-6" />
        },
        {
          title: "Interagindo com o Meio Ambiente",
          description: "Receba dicas para interagir com a natureza de forma responsável. Conheça os programas de conservação locais e veja como o projeto METIS pode fomentar o turismo ecológico na região.",
          icon: <Heart className="h-6 w-6" />
        }
      ]
    },
    "modulo-3": {
      title: "Diálogos entre Natureza e Tecnologia",
      color: "accent",
      sections: [
        {
          title: "Tecnologia e Meio Ambiente",
          description: "Este módulo é o coração do projeto. Saiba como a tecnologia e a natureza dialogam. Conheça os estudos de impacto ambiental e os programas de mitigação que garantem a harmonia entre o parque eólico e o ecossistema local.",
          icon: <Leaf className="h-6 w-6" />
        },
        {
          title: "Pessoas e o Projeto",
          description: "Ouça diretamente de especialistas e moradores locais. Assista a entrevistas que mostram como a comunidade de Picuí se adaptou à presença do complexo eólico e como ele se tornou parte da paisagem e da vida local.",
          icon: <Users className="h-6 w-6" />
        },
        {
          title: "Roteiros do Conhecimento",
          description: "Descubra sugestões de roteiros virtuais e físicos que conectam o parque eólico aos pontos de interesse da biodiversidade. Aprenda a explorar a região de uma forma que valorize tanto a tecnologia quanto a natureza.",
          icon: <MapPin className="h-6 w-6" />
        }
      ]
    }
  };

  const currentModule = moduleData[activeModule];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className={cn(
          "text-4xl font-bold mb-4",
          currentModule.color === "primary" && "text-primary",
          currentModule.color === "secondary" && "text-secondary",
          currentModule.color === "accent" && "text-accent-foreground"
        )}>
          {currentModule.title}
        </h2>
        
        {/* Module Image */}
        <div className="relative mx-auto max-w-2xl mb-8 rounded-2xl overflow-hidden shadow-strong">
          <img 
            src={activeModule === "modulo-2" ? caatingaImage : connectionImage}
            alt={currentModule.title}
            className="w-full h-64 object-cover"
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
          )} />
        </div>
      </div>

      {/* Sections */}
      <div className="grid gap-8">
        {currentModule.sections.map((section, index) => (
          <div key={index} className="group">
            <div className={cn(
              "p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-strong transform hover:-translate-y-1",
              "bg-gradient-card",
              currentModule.color === "primary" && "border-primary/20 hover:border-primary/40",
              currentModule.color === "secondary" && "border-secondary/20 hover:border-secondary/40", 
              currentModule.color === "accent" && "border-accent/30 hover:border-accent/50"
            )}>
              <div className="flex items-start gap-6">
                <div className={cn(
                  "p-4 rounded-xl shrink-0",
                  currentModule.color === "primary" && "bg-primary/10 text-primary",
                  currentModule.color === "secondary" && "bg-secondary/10 text-secondary",
                  currentModule.color === "accent" && "bg-accent/20 text-accent-foreground"
                )}>
                  {section.icon}
                </div>
                <div>
                  <h3 className={cn(
                    "text-2xl font-semibold mb-4",
                    currentModule.color === "primary" && "text-primary-dark",
                    currentModule.color === "secondary" && "text-secondary-dark",
                    currentModule.color === "accent" && "text-accent-foreground"
                  )}>
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};