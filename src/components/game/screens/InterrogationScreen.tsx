import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Users, User } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CHARACTERS } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import interrogationRoom from "@/assets/rooms/interrogation-room.png";

interface InterrogationScreenProps {
  onNavigate: (screen: string) => void;
}

export const InterrogationScreen = ({ onNavigate }: InterrogationScreenProps) => {
  const { 
    state, 
    askQuestion,
    hasAskedQuestion,
    addNote,
    discoverInsight,
    hasInsight,
  } = useGame();
  const { playSound } = useSound();
  
  const [selectedCharacter, setSelectedCharacter] = useState<typeof CHARACTERS[0] | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);

  const handleSelectCharacter = (char: typeof CHARACTERS[0]) => {
    setSelectedCharacter(char);
    setShowQuestions(true);
    setCurrentResponse(char.initialStatement);
    playSound("click");
  };

  const handleAskQuestion = (question: typeof CHARACTERS[0]["questions"][0]) => {
    if (!selectedCharacter) return;
    if (hasAskedQuestion(question.id)) return;
    
    askQuestion(question.id, question.cost);
    setCurrentResponse(question.response);
    
    // Add note
    addNote({
      type: "dialogue",
      text: `${selectedCharacter.name}: "${question.response}"`,
      source: "interrogation",
      characterId: selectedCharacter.id,
    });
    
    // Check for insight discoveries based on questions
    if (question.id === "sara_q2" && !hasInsight("insight-quality-vs-quantity")) {
      discoverInsight("insight-quality-vs-quantity");
      toast.success("اكتشاف! سارة ركزت على الكمية لا الجودة");
    }
    
    if (question.id === "ahmed_q2" && !hasInsight("insight-sales-team-innocent")) {
      discoverInsight("insight-sales-team-innocent");
      toast.success("اكتشاف! فريق المبيعات بريء من المشكلة");
    }
    
    playSound("reveal");
  };

  // Get available questions for character
  const getAvailableQuestions = () => {
    if (!selectedCharacter) return [];
    return selectedCharacter.questions;
  };

  const availableQuestions = getAvailableQuestions();

  // Filter characters for meeting room (exclude CEO)
  const meetingRoomCharacters = CHARACTERS.filter(c => c.room === "meeting-room");

  return (
    <InteractiveRoom
      backgroundImage={interrogationRoom}
      hotspots={[]}
      onHotspotClick={() => {}}
      activeHotspot={selectedCharacter?.id || null}
      overlayContent={showQuestions && selectedCharacter ? (
        <motion.div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
          {/* Character header */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{selectedCharacter.name}</h3>
              <p className="text-muted-foreground">{selectedCharacter.role}</p>
            </div>
          </div>

          {/* Response */}
          {currentResponse && (
            <motion.div 
              className="p-4 rounded-xl bg-secondary/30 border border-border mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-foreground text-lg">"{currentResponse}"</p>
            </motion.div>
          )}

          {/* Questions */}
          <div className="space-y-3">
            <h4 className="font-bold text-foreground mb-3">الأسئلة المتاحة:</h4>
            {availableQuestions.map((question) => {
              const isAsked = hasAskedQuestion(question.id);
              return (
                <motion.button
                  key={question.id}
                  onClick={() => !isAsked && handleAskQuestion(question)}
                  disabled={isAsked}
                  className={cn(
                    "w-full p-4 rounded-xl border text-right transition-all",
                    isAsked 
                      ? "bg-secondary/50 border-border opacity-60 cursor-not-allowed" 
                      : "bg-card/50 border-border hover:border-primary"
                  )}
                  whileHover={!isAsked ? { x: -5 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className={cn("w-4 h-4", isAsked ? "text-muted-foreground" : "text-primary")} />
                      <span className={cn("font-medium", isAsked ? "text-muted-foreground" : "text-foreground")}>
                        {question.text}
                      </span>
                    </div>
                    {!isAsked && (
                      <span className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                        -{question.cost} وقت
                      </span>
                    )}
                    {isAsked && (
                      <span className="text-xs text-green-400">✓ تم السؤال</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={() => { setShowQuestions(false); setSelectedCharacter(null); setCurrentResponse(null); }}
            className="mt-6 w-full py-3 rounded-xl bg-secondary text-foreground"
          >
            إغلاق
          </button>
        </motion.div>
      ) : null}
      onCloseOverlay={() => { setShowQuestions(false); setSelectedCharacter(null); }}
    >
      {/* Status */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">غرفة الاجتماعات</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-foreground">الوقت: {state.time}</span>
        </div>
      </motion.div>

      {/* Characters */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {meetingRoomCharacters.map((char, i) => {
          const positions = [
            { left: "30%", bottom: "25%" },
            { left: "65%", bottom: "25%" },
          ];
          return (
            <motion.div 
              key={char.id} 
              className="absolute pointer-events-auto cursor-pointer" 
              style={positions[i]}
              onClick={() => handleSelectCharacter(char)}
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center border-2 border-primary/50">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-background/90 text-center whitespace-nowrap">
                <p className="font-bold text-foreground">{char.name}</p>
                <p className="text-xs text-muted-foreground">{char.role}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
      </div>
      <div className="absolute bottom-8 right-8 z-20">
        <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <NavigationButton iconEmoji="📊" label="التحليل" onClick={() => onNavigate("analysis")} />
      </div>
    </InteractiveRoom>
  );
};
