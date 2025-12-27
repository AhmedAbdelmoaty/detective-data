import { useState, useEffect } from "react";
import { IntroScreen } from "@/components/game/screens/IntroScreen";
import { OnboardingScreen } from "@/components/game/screens/OnboardingScreen";
import { ManagerOfficeScreen } from "@/components/game/screens/ManagerOfficeScreen";
import { AccountingRoomScreen } from "@/components/game/screens/AccountingRoomScreen";
import { WarehouseRoomScreen } from "@/components/game/screens/WarehouseRoomScreen";
import { ProjectsRoomScreen } from "@/components/game/screens/ProjectsRoomScreen";
import { AnalysisLabScreen } from "@/components/game/screens/AnalysisLabScreen";
import { ResultScreen } from "@/components/game/screens/ResultScreen";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider, useMusic } from "@/hooks/useBackgroundMusic";
import { SoundToggle } from "@/components/game/SoundToggle";
import { GameProvider } from "@/contexts/GameContext";

// الشاشات: intro, onboarding, result + 5 غرف
type Screen = "intro" | "onboarding" | "manager-office" | "accounting" | "warehouse" | "projects" | "analysis-lab" | "result";

const GameContent = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("intro");
  const { setCurrentRoom } = useMusic();

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  useEffect(() => {
    // Map screens to music rooms
    const roomMapping: Record<string, "intro" | "office" | "evidence" | "analysis" | "interrogation" | "result"> = {
      "intro": "intro",
      "onboarding": "intro",
      "manager-office": "office",
      "accounting": "evidence",
      "warehouse": "evidence",
      "projects": "interrogation",
      "analysis-lab": "analysis",
      "result": "result",
    };
    
    const musicRoom = roomMapping[currentScreen];
    if (musicRoom) {
      setCurrentRoom(musicRoom);
    }
  }, [currentScreen, setCurrentRoom]);

  return (
    <div className="min-h-screen bg-background">
      <SoundToggle />
      
      {/* شاشات عامة */}
      {currentScreen === "intro" && <IntroScreen onNavigate={() => handleNavigate("onboarding")} />}
      {currentScreen === "onboarding" && <OnboardingScreen onComplete={() => handleNavigate("manager-office")} />}
      {currentScreen === "result" && <ResultScreen onNavigate={handleNavigate} />}
      
      {/* الغرف الخمس */}
      {currentScreen === "manager-office" && <ManagerOfficeScreen onNavigate={handleNavigate} />}
      {currentScreen === "accounting" && <AccountingRoomScreen onNavigate={handleNavigate} />}
      {currentScreen === "warehouse" && <WarehouseRoomScreen onNavigate={handleNavigate} />}
      {currentScreen === "projects" && <ProjectsRoomScreen onNavigate={handleNavigate} />}
      {currentScreen === "analysis-lab" && <AnalysisLabScreen onNavigate={handleNavigate} />}
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <MusicProvider>
        <SoundProvider>
          <GameContent />
        </SoundProvider>
      </MusicProvider>
    </GameProvider>
  );
};

export default Index;
