import { Play, Clock, Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const videos = [
  {
    title: "Introdução à Indústria 4.0",
    description: "Entenda o que é a quarta revolução industrial e como ela impacta nosso dia a dia.",
    duration: "5 min",
    views: "1.2K",
    thumbnail: "bg-gradient-to-br from-primary to-primary-dark"
  },
  {
    title: "Como a Robótica Transforma Fábricas?",
    description: "Descubra como robôs colaborativos estão mudando a manufatura moderna.",
    duration: "7 min",
    views: "980",
    thumbnail: "bg-gradient-to-br from-secondary to-secondary-dark"
  },
  {
    title: "IoT na Sala de Aula",
    description: "Aplicações práticas de Internet das Coisas no ambiente educacional.",
    duration: "6 min",
    views: "1.5K",
    thumbnail: "bg-gradient-to-br from-accent to-success"
  },
  {
    title: "Big Data para Iniciantes",
    description: "O que são grandes volumes de dados e por que eles importam?",
    duration: "4 min",
    views: "850",
    thumbnail: "bg-gradient-to-br from-primary-light to-secondary"
  },
  {
    title: "Machine Learning Explicado",
    description: "Como máquinas aprendem? Uma explicação simples e visual.",
    duration: "8 min",
    views: "2.1K",
    thumbnail: "bg-gradient-to-br from-secondary-light to-primary"
  }
];

export const VideoShowcase = () => {
  return (
    <section id="videos" className="py-20 md:py-32 bg-gradient-to-b from-surface-light to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Galeria de Vídeos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Conteúdos produzidos com{" "}
            <span className="bg-gradient-ai bg-clip-text text-transparent">
              Avatares Digitais
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Vídeos educativos curtos e engajadores, criados com tecnologia de 
            avatares digitais para facilitar a compreensão de temas complexos.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {videos.map((video, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="group cursor-pointer">
                    {/* Thumbnail */}
                    <div className={`relative aspect-video rounded-xl ${video.thumbnail} overflow-hidden mb-4`}>
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                          <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-foreground/80 text-background text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{video.views} visualizações</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Em breve mais conteúdos disponíveis
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Novos vídeos sendo produzidos
          </div>
        </div>
      </div>
    </section>
  );
};
