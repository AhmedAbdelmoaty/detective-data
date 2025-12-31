import { useState, useEffect } from "react";
import { IntroScreen } from "@/components/game/screens/IntroScreen";
import { OnboardingScreen } from "@/components/game/screens/OnboardingScreen";
import { CFOOfficeScreen } from "@/components/game/screens/CFOOfficeScreen";
import { MyDeskScreen } from "@/components/game/screens/MyDeskScreen";
import { SalesDepartmentScreen } from "@/components/game/screens/SalesDepartmentScreen";
import { ContractsArchiveScreen } from "@/components/game/screens/ContractsArchiveScreen";
import { ConclusionScreen } from "@/components/game/screens/ConclusionScreen";
import { ResultScreen } from "@/components/game/screens/ResultScreen";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider } from "@/hooks/useBackgroundMusic";
import { SoundToggle } from "@/components/game/SoundToggle";
import { GameProvider } from "@/contexts/GameContext";

type Screen = "intro" | "onboarding" | "cfo-office" | "my-desk" | "sales" | "contracts" | "conclusion" | "result";

const GameContent = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("intro");

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  return (
    <div className="min-h-screen bg-background">
      <SoundToggle />
      {currentScreen === "intro" && <IntroScreen onNavigate={handleNavigate} />}
      {currentScreen === "onboarding" && <OnboardingScreen onComplete={() => handleNavigate("cfo-office")} />}
      {currentScreen === "cfo-office" && <CFOOfficeScreen onNavigate={handleNavigate} />}
      {currentScreen === "my-desk" && <MyDeskScreen onNavigate={handleNavigate} />}
      {currentScreen === "sales" && <SalesDepartmentScreen onNavigate={handleNavigate} />}
      {currentScreen === "contracts" && <ContractsArchiveScreen onNavigate={handleNavigate} />}
      {currentScreen === "conclusion" && <ConclusionScreen onNavigate={handleNavigate} />}
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
