import { Button } from "@/components/ui/button";
import { Brain, Bot, Cpu, Network, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const MetisHero = () => {
  const scrollToAbout = () => {
    const element = document.querySelector("#sobre");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Brain 
          className="absolute top-[15%] left-[10%] w-12 h-12 md:w-16 md:h-16 text-primary/20 animate-float" 
          style={{ animationDelay: "0s" }}
        />
        <Bot 
          className="absolute top-[25%] right-[15%] w-10 h-10 md:w-14 md:h-14 text-secondary/20 animate-float" 
          style={{ animationDelay: "1s" }}
        />
        <Cpu 
          className="absolute bottom-[30%] left-[15%] w-8 h-8 md:w-12 md:h-12 text-accent/30 animate-float" 
          style={{ animationDelay: "2s" }}
        />
        <Network 
          className="absolute bottom-[20%] right-[10%] w-14 h-14 md:w-20 md:h-20 text-primary/15 animate-float" 
          style={{ animationDelay: "1.5s" }}
        />
        <Sparkles 
          className="absolute top-[40%] left-[5%] w-6 h-6 text-warning/30 animate-pulse" 
        />
        <Sparkles 
          className="absolute top-[60%] right-[8%] w-8 h-8 text-secondary/25 animate-pulse" 
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Projeto de Pesquisa e Extensão</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Inovação na Educação com{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Inteligência Artificial
            </span>{" "}
            e{" "}
            <span className="bg-gradient-ai bg-clip-text text-transparent">
              Avatares Digitais
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Formação docente e recursos didáticos sobre{" "}
            <strong className="text-foreground">Indústria 4.0</strong> para transformar a escola pública
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              onClick={scrollToAbout}
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 transition-opacity group px-8"
            >
              Conheça nossa Metodologia
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/matricula">
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 px-8"
              >
                <Bot className="mr-2 w-4 h-4" />
                Ver Vídeos
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 md:mt-24 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">5+</div>
              <div className="text-sm md:text-base text-muted-foreground">Temas Abordados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary">100%</div>
              <div className="text-sm md:text-base text-muted-foreground">Gratuito</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">BNCC</div>
              <div className="text-sm md:text-base text-muted-foreground">Alinhado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </div>
      </div>
    </section>
  );
};
