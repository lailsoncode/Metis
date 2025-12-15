import { Brain, Sparkles, Youtube, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const quickLinks = [
  { label: "Início", href: "#inicio" },
  { label: "O Projeto", href: "#sobre" },
  { label: "Galeria de Vídeos", href: "#videos" },
  { label: "Temas", href: "#temas" },
  { label: "Impacto", href: "#impacto" },
];

export const MetisFooter = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contato" className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Brain className="w-8 h-8 text-primary-light" />
                <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold">METIS</span>
            </Link>
            <p className="text-background/70 mb-6 max-w-md">
              Projeto de pesquisa e extensão focado na formação de professores e 
              alunos da educação básica sobre Inteligência Artificial e Indústria 4.0.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-background/70 hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Patos - PB, Brasil</span>
              </li>
              <li>
                <a
                  href="mailto:contato@metis.edu.br"
                  className="flex items-center gap-3 text-background/70 hover:text-primary-light transition-colors"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>contato@metis.edu.br</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <p className="text-center text-background/50 text-sm mb-6">Parceiros</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="h-10 px-6 bg-background/10 rounded flex items-center justify-center text-sm font-medium">
              Instituição de Ensino
            </div>
            <div className="h-10 px-6 bg-background/10 rounded flex items-center justify-center text-sm font-medium">
              Secretaria de C&T - Patos/PB
            </div>
            <div className="h-10 px-6 bg-background/10 rounded flex items-center justify-center text-sm font-medium">
              Parceiro Educacional
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
            <p>© 2024 METIS. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Acessibilidade WCAG 2.1
              </span>
              <span>•</span>
              <a href="#" className="hover:text-primary-light transition-colors">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
