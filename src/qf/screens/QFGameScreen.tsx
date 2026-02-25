import { useQF } from "@/qf/context/QFContext";
import { QFHud } from "@/qf/components/QFHud";
import { QFNode } from "@/qf/components/QFNode";
import { QFFramingScreen } from "@/qf/components/QFFramingScreen";
import { QFResultScreen } from "@/qf/components/QFResultScreen";

export const QFGameScreen = () => {
  const { state, isTimeCritical } = useQF();

  return (
    <div
      className={`min-h-screen bg-background transition-all duration-1000 ${
        isTimeCritical ? "bg-gradient-to-b from-destructive/5 to-background" : ""
      }`}
    >
      {/* HUD - always visible during play/framing */}
      {(state.phase === "playing" || state.phase === "responding" || state.phase === "framing") && (
        <QFHud />
      )}

      {/* Main content area */}
      <div className="pt-24 pb-8">
        {(state.phase === "playing" || state.phase === "responding") && <QFNode />}
        {state.phase === "framing" && <QFFramingScreen />}
        {state.phase === "result" && <QFResultScreen />}
      </div>
    </div>
  );
};
