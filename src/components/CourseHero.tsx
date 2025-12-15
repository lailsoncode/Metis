import { Button } from "@/components/ui/button";
import { Wind, Leaf, Zap, Info } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-wind-turbines.jpg";

interface CourseHeroProps {
  onEnroll: () => void;
}

export const CourseHero = ({ onEnroll }: CourseHeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-30 animate-bounce">
        <Wind size={60} className="text-white" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-30 animate-pulse">
        <Leaf size={80} className="text-secondary-light" />
      </div>
      <div className="absolute top-40 right-20 opacity-40 animate-bounce delay-300">
        <Zap size={40} className="text-warning" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Conexão
            <span className="block bg-gradient-to-r from-secondary-light to-warning bg-clip-text text-transparent">
              Palmeira
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed">
            Uma jornada de aprendizado sobre energia renovável, biodiversidade e a convivência entre tecnologia e natureza na região de Picuí
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">         
            <Button
              onClick={onEnroll}
              variant="secondary"
              size="lg"
              className="group"
            >
              <Info className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Saiba Mais
            </Button>
          <Link to="/matricula">
            <Button
              variant="hero"
              size="lg"
              className="group"
            >
              <Wind className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Matricule-se no Curso
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline-light" size="lg">
              <Leaf className="mr-2 h-5 w-5" />
              Já tenho conta
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-light">3</div>
            <div className="text-white/80">Módulos Interativos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-light">100%</div>
            <div className="text-white/80">Energia Limpa</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-light">∞</div>
            <div className="text-white/80">Possibilidades</div>
          </div>
        </div>
      </div>
    </div>
  );
};