import { useState, useEffect } from "react";
import { IntroScreen } from "@/components/game/screens/IntroScreen";
import { OnboardingScreen } from "@/components/game/screens/OnboardingScreen";
import { OfficeScreen } from "@/components/game/screens/OfficeScreen";
import { EvidenceScreen } from "@/components/game/screens/EvidenceScreen";
import { AnalysisScreen } from "@/components/game/screens/AnalysisScreen";
import { InterrogationScreen } from "@/components/game/screens/InterrogationScreen";
import { ResultScreen } from "@/components/game/screens/ResultScreen";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider, useMusic } from "@/hooks/useBackgroundMusic";
import { SoundToggle } from "@/components/game/SoundToggle";
import { GameProvider } from "@/contexts/GameContext";

type Screen = "intro" | "onboarding" | "office" | "evidence" | "analysis" | "interrogation" | "result";

const GameContent = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("intro");
  const { setCurrentRoom } = useMusic();

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  useEffect(() => {
    setCurrentRoom(currentScreen);
  }, [currentScreen, setCurrentRoom]);

  return (
    <div className="min-h-screen bg-background">
      <SoundToggle />
      {currentScreen === "intro" && <IntroScreen onNavigate={() => handleNavigate("onboarding")} />}
      {currentScreen === "onboarding" && <OnboardingScreen onComplete={() => handleNavigate("office")} />}
      {currentScreen === "office" && <OfficeScreen onNavigate={handleNavigate} />}
      {currentScreen === "evidence" && <EvidenceScreen onNavigate={handleNavigate} />}
      {currentScreen === "analysis" && <AnalysisScreen onNavigate={handleNavigate} />}
      {currentScreen === "interrogation" && <InterrogationScreen onNavigate={handleNavigate} />}
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
