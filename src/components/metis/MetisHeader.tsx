import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "O Projeto", href: "#sobre" },
  { label: "Galeria de Vídeos", href: "#videos" },
  { label: "Temas", href: "#temas" },
  { label: "Impacto", href: "#impacto" },
  { label: "Contato", href: "#contato" },
];

export const MetisHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary group-hover:text-secondary transition-colors" />
              <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              METIS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/matricula">
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                Acessar Plataforma
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-3 text-left text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Entrar
                </Button>
              </Link>
              <Link to="/matricula">
                <Button className="w-full bg-gradient-primary">
                  Acessar Plataforma
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
