import { useState, useEffect } from "react";
import { IntroScreen } from "@/components/game/screens/IntroScreen";
import { OnboardingScreen } from "@/components/game/screens/OnboardingScreen";
import { ScenesScreen } from "@/components/game/screens/ScenesScreen";
import { HypothesisSelectScreen } from "@/components/game/screens/HypothesisSelectScreen";
import { AnalystHubScreen } from "@/components/game/screens/AnalystHubScreen";
import { OfficeScreen } from "@/components/game/screens/OfficeScreen";
import { EvidenceScreen } from "@/components/game/screens/EvidenceScreen";
import { DashboardScreen } from "@/components/game/screens/DashboardScreen";
import { FloorScreen } from "@/components/game/screens/FloorScreen";
import { AnalysisScreen } from "@/components/game/screens/AnalysisScreen";
import { ResultScreen } from "@/components/game/screens/ResultScreen";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider, useMusic } from "@/hooks/useBackgroundMusic";
import { SoundToggle } from "@/components/game/SoundToggle";
import { FloatingNotebook } from "@/components/game/FloatingNotebook";
import { GameProvider } from "@/contexts/GameContext";

type Screen = "intro" | "onboarding" | "scenes" | "hypothesis-select" | "analyst-hub" | "office" | "evidence" | "dashboard" | "floor" | "analysis" | "result";

const showNotebookScreens: Screen[] = ["analyst-hub", "office", "evidence", "dashboard", "floor", "analysis"];

const GameContent = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    () => (localStorage.getItem("detective-game-screen") as Screen) || "intro"
  );
  const { setCurrentRoom } = useMusic();

  useEffect(() => {
    localStorage.setItem("detective-game-screen", currentScreen);
  }, [currentScreen]);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  useEffect(() => {
    const roomTypes = ["intro", "office", "evidence", "analysis", "floor", "result"];
    if (roomTypes.includes(currentScreen)) {
      setCurrentRoom(currentScreen as any);
    }
  }, [currentScreen, setCurrentRoom]);

  const showNotebook = showNotebookScreens.includes(currentScreen);

  return (
    <div className="min-h-screen bg-background">
      <SoundToggle />
      {showNotebook && <FloatingNotebook />}
      {currentScreen === "intro" && <IntroScreen onNavigate={() => handleNavigate("onboarding")} />}
      {currentScreen === "onboarding" && <OnboardingScreen onComplete={() => handleNavigate("scenes")} />}
      {currentScreen === "scenes" && <ScenesScreen onComplete={() => handleNavigate("hypothesis-select")} />}
      {currentScreen === "hypothesis-select" && <HypothesisSelectScreen onComplete={() => handleNavigate("analyst-hub")} />}
      {currentScreen === "analyst-hub" && <AnalystHubScreen onNavigate={handleNavigate} />}
      {currentScreen === "office" && <OfficeScreen onNavigate={handleNavigate} />}
      {currentScreen === "evidence" && <EvidenceScreen onNavigate={handleNavigate} />}
      {currentScreen === "dashboard" && <DashboardScreen onNavigate={handleNavigate} />}
      {currentScreen === "floor" && <FloorScreen onNavigate={handleNavigate} />}
      {currentScreen === "analysis" && <AnalysisScreen onNavigate={handleNavigate} />}
      {currentScreen === "result" && <ResultScreen onNavigate={handleNavigate} />}
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
