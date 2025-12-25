import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ChatBubbleProps {
  message: string;
  sender: string;
  senderEmoji: string;
  direction?: "left" | "right";
  isTyping?: boolean;
  delay?: number;
  color?: "cyan" | "gold" | "purple" | "green";
}

const colorClasses = {
  cyan: "border-primary/30 bg-primary/10",
  gold: "border-accent/30 bg-accent/10",
  purple: "border-neon-purple/30 bg-neon-purple/10",
  green: "border-success/30 bg-success/10",
};

export const ChatBubble = ({
  message,
  sender,
  senderEmoji,
  direction = "left",
  isTyping = false,
  delay = 0,
  color = "cyan",
}: ChatBubbleProps) => {
  const [visible, setVisible] = useState(delay === 0);
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(!isTyping);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  useEffect(() => {
    if (visible && isTyping && !isComplete) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= message.length) {
          setDisplayedText(message.slice(0, index));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    } else if (visible && !isTyping) {
      setDisplayedText(message);
    }
  }, [visible, isTyping, message, isComplete]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        direction === "right" && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
        {senderEmoji}
      </div>

      {/* Bubble */}
      <div className="flex-1 max-w-[80%]">
        <p className={cn(
          "text-xs text-muted-foreground mb-1",
          direction === "right" && "text-right"
        )}>
          {sender}
        </p>
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl border",
            colorClasses[color],
            direction === "left" ? "rounded-tl-sm" : "rounded-tr-sm"
          )}
        >
          <p className="text-sm text-foreground leading-relaxed" dir="rtl">
            {displayedText}
            {!isComplete && (
              <span className="inline-block w-2 h-4 bg-primary/50 ml-1 animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
