import { QFProvider, useQF } from "./context/QFContext";
import { QFIntro } from "./components/QFIntro";
import { QFHud } from "./components/QFHud";
import { FramingBoard } from "./components/FramingBoard";
import { QFScene } from "./components/QFScene";
import { QFClosingScene } from "./components/QFClosingScene";
import { QFEndings } from "./components/QFEndings";
import { SoundProvider } from "@/hooks/useSoundEffects";

const QFContent = () => {
  const { state } = useQF();

  return (
    <div className="min-h-screen bg-background">
      {state.gamePhase === "intro" && <QFIntro />}

      {state.gamePhase === "playing" && (
        <>
          <QFHud />
          <FramingBoard />
          <QFScene />
        </>
      )}

      {state.gamePhase === "closing" && (
        <>
          <QFHud />
          <FramingBoard />
          <QFClosingScene />
        </>
      )}

      {state.gamePhase === "ending" && <QFEndings />}
    </div>
  );
};

const QFGame = () => (
  <QFProvider>
    <SoundProvider>
      <QFContent />
    </SoundProvider>
  </QFProvider>
);

export default QFGame;
