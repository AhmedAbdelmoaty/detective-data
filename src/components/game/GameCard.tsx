import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface GameCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconEmoji?: string;
  variant?: "default" | "glass" | "glow" | "outlined";
  color?: "primary" | "accent" | "success" | "warning" | "destructive";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const variantClasses = {
  default: "bg-card border-border",
  glass: "glass",
  glow: "bg-card border-border glow-primary",
  outlined: "bg-transparent border-2",
};

const colorClasses = {
  primary: {
    icon: "text-primary",
    border: "border-primary/50",
    hover: "hover:border-primary hover:shadow-[0_0_20px_hsl(175,80%,50%,0.2)]",
  },
  accent: {
    icon: "text-accent",
    border: "border-accent/50",
    hover: "hover:border-accent hover:shadow-[0_0_20px_hsl(45,90%,55%,0.2)]",
  },
  success: {
    icon: "text-success",
    border: "border-success/50",
    hover: "hover:border-success hover:shadow-[0_0_20px_hsl(145,70%,45%,0.2)]",
  },
  warning: {
    icon: "text-warning",
    border: "border-warning/50",
    hover: "hover:border-warning hover:shadow-[0_0_20px_hsl(35,90%,55%,0.2)]",
  },
  destructive: {
    icon: "text-destructive",
    border: "border-destructive/50",
    hover: "hover:border-destructive hover:shadow-[0_0_20px_hsl(0,70%,50%,0.2)]",
  },
};

const sizeClasses = {
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export const GameCard = ({
  title,
  description,
  icon: Icon,
  iconEmoji,
  variant = "default",
  color = "primary",
  size = "md",
  onClick,
  children,
  className,
}: GameCardProps) => {
  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-300",
        variantClasses[variant],
        variant === "outlined" && colors.border,
        sizeClasses[size],
        onClick && cn("cursor-pointer", colors.hover),
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      {(Icon || iconEmoji || title) && (
        <div className="flex items-center gap-3 mb-3">
          {Icon && <Icon className={cn("w-6 h-6", colors.icon)} />}
          {iconEmoji && <span className="text-2xl">{iconEmoji}</span>}
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}

      {/* Content */}
      {children}
    </div>
  );
};
