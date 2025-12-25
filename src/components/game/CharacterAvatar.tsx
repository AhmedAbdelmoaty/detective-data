import { cn } from "@/lib/utils";

interface CharacterAvatarProps {
  name: string;
  role: string;
  emoji: string;
  color: "cyan" | "gold" | "purple" | "green" | "red";
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  badgeText?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  cyan: {
    bg: "from-primary/20 to-primary/5",
    border: "border-primary/50",
    glow: "shadow-[0_0_20px_hsl(175,80%,50%,0.3)]",
    text: "text-primary",
  },
  gold: {
    bg: "from-accent/20 to-accent/5",
    border: "border-accent/50",
    glow: "shadow-[0_0_20px_hsl(45,90%,55%,0.3)]",
    text: "text-accent",
  },
  purple: {
    bg: "from-neon-purple/20 to-neon-purple/5",
    border: "border-neon-purple/50",
    glow: "shadow-[0_0_20px_hsl(270,80%,60%,0.3)]",
    text: "text-neon-purple",
  },
  green: {
    bg: "from-success/20 to-success/5",
    border: "border-success/50",
    glow: "shadow-[0_0_20px_hsl(145,70%,45%,0.3)]",
    text: "text-success",
  },
  red: {
    bg: "from-destructive/20 to-destructive/5",
    border: "border-destructive/50",
    glow: "shadow-[0_0_20px_hsl(0,70%,50%,0.3)]",
    text: "text-destructive",
  },
};

const sizeClasses = {
  sm: {
    container: "w-16 h-16",
    emoji: "text-2xl",
    name: "text-xs",
    role: "text-[10px]",
  },
  md: {
    container: "w-24 h-24",
    emoji: "text-4xl",
    name: "text-sm",
    role: "text-xs",
  },
  lg: {
    container: "w-32 h-32",
    emoji: "text-5xl",
    name: "text-base",
    role: "text-sm",
  },
};

export const CharacterAvatar = ({
  name,
  role,
  emoji,
  color,
  size = "md",
  showBadge = false,
  badgeText,
  isActive = false,
  onClick,
}: CharacterAvatarProps) => {
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  return (
    <div 
      className={cn(
        "flex flex-col items-center gap-2 transition-all duration-300",
        onClick && "cursor-pointer hover:scale-105",
        isActive && "scale-105"
      )}
      onClick={onClick}
    >
      {/* Avatar Circle */}
      <div
        className={cn(
          sizes.container,
          "relative rounded-full flex items-center justify-center",
          "bg-gradient-to-br",
          colors.bg,
          "border-2",
          colors.border,
          "transition-all duration-300",
          isActive && colors.glow
        )}
      >
        <span className={cn(sizes.emoji, "select-none")}>{emoji}</span>
        
        {/* Badge */}
        {showBadge && badgeText && (
          <div className={cn(
            "absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
            "bg-destructive text-destructive-foreground",
            "animate-pulse"
          )}>
            {badgeText}
          </div>
        )}
      </div>

      {/* Name & Role */}
      <div className="text-center">
        <p className={cn(sizes.name, "font-semibold text-foreground")}>{name}</p>
        <p className={cn(sizes.role, colors.text, "opacity-80")}>{role}</p>
      </div>
    </div>
  );
};
