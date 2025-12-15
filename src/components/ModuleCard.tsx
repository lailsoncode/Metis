import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  color: "primary" | "secondary" | "accent";
}

export const ModuleCard = ({ 
  title, 
  description, 
  icon: Icon, 
  isActive, 
  onClick, 
  color 
}: ModuleCardProps) => {
  const colorClasses = {
    primary: "border-primary/20 hover:border-primary/40 hover:shadow-glow",
    secondary: "border-secondary/20 hover:border-secondary/40 hover:shadow-nature", 
    accent: "border-accent/20 hover:border-accent/40 hover:shadow-medium"
  };

  const activeColorClasses = {
    primary: "border-primary bg-gradient-to-br from-primary/10 to-primary-light/10 shadow-glow",
    secondary: "border-secondary bg-gradient-to-br from-secondary/10 to-secondary-light/10 shadow-nature",
    accent: "border-accent bg-gradient-to-br from-accent/10 to-muted shadow-medium"
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 transform hover:scale-105",
        "bg-card hover:bg-card-hover",
        isActive ? activeColorClasses[color] : colorClasses[color]
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={cn(
          "p-3 rounded-lg",
          color === "primary" && "bg-primary/10 text-primary",
          color === "secondary" && "bg-secondary/10 text-secondary",
          color === "accent" && "bg-accent/20 text-accent-foreground"
        )}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};