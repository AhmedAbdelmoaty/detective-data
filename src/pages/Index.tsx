import { useState } from "react";
import { IntroScreen } from "@/components/game/screens/IntroScreen";
import { OfficeScreen } from "@/components/game/screens/OfficeScreen";
import { EvidenceScreen } from "@/components/game/screens/EvidenceScreen";
import { AnalysisScreen } from "@/components/game/screens/AnalysisScreen";
import { InterrogationScreen } from "@/components/game/screens/InterrogationScreen";

type Screen = "intro" | "office" | "evidence" | "analysis" | "interrogation";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("intro");

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  return (
    <div className="dark">
      {currentScreen === "intro" && <IntroScreen onStart={() => setCurrentScreen("office")} />}
      {currentScreen === "office" && <OfficeScreen onNavigate={handleNavigate} />}
      {currentScreen === "evidence" && <EvidenceScreen onNavigate={handleNavigate} />}
      {currentScreen === "analysis" && <AnalysisScreen onNavigate={handleNavigate} />}
      {currentScreen === "interrogation" && <InterrogationScreen onNavigate={handleNavigate} />}
    </div>
  );
};

export default Index;
