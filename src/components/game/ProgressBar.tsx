import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: "primary" | "accent" | "success" | "warning" | "destructive";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const colorClasses = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const glowClasses = {
  primary: "shadow-[0_0_10px_hsl(175,80%,50%,0.5)]",
  accent: "shadow-[0_0_10px_hsl(45,90%,55%,0.5)]",
  success: "shadow-[0_0_10px_hsl(145,70%,45%,0.5)]",
  warning: "shadow-[0_0_10px_hsl(35,90%,55%,0.5)]",
  destructive: "shadow-[0_0_10px_hsl(0,70%,50%,0.5)]",
};

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = false,
  color = "primary",
  size = "md",
  animated = true,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {/* Label & Value */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-mono text-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div className={cn(
        "w-full rounded-full bg-secondary overflow-hidden",
        sizeClasses[size]
      )}>
        {/* Progress Fill */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorClasses[color],
            glowClasses[color],
            animated && "animate-pulse-slow"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
