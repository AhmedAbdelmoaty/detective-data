import { QFProvider } from "@/qf/context/QFContext";
import { QFGameScreen } from "@/qf/screens/QFGameScreen";

const QFGame = () => {
  return (
    <QFProvider>
      <QFGameScreen />
    </QFProvider>
  );
};

export default QFGame;
