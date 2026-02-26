import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQF } from "../context/QFContext";
import { QFHud } from "../components/QFHud";
import { QFQuestionCards } from "../components/QFQuestionCards";
import { QFFramingScreen } from "../components/QFFramingScreen";
import { QFResultScreen } from "../components/QFResultScreen";
import { EnhancedDialogue } from "@/components/game/EnhancedDialogue";
import type { QFDialogueLine, QFQuestion } from "../data/qf-tree";
import storeFront from "@/assets/scenes/store-front.png";
import interrogationRoom from "@/assets/rooms/interrogation-room.png";
import evidenceRoom from "@/assets/rooms/evidence-room.png";
import analysisRoom from "@/assets/rooms/analysis-room.png";
import floorRoom from "@/assets/rooms/floor.png";
import analysisLab from "@/assets/rooms/analysis-lab.png";

const sceneByNode: Record<string, string> = {
  intro: storeFront,
  r1: storeFront,
  r2a: analysisRoom,
  r2b: interrogationRoom,
  r2c: analysisRoom,
  r3a: floorRoom,
  r3b: evidenceRoom,
  r3c: interrogationRoom,
  r3d: analysisRoom,
  framing: analysisLab,
};

const getSceneImage = (phase: string, nodeId?: string) => {
  if (phase === "result") return analysisLab;
  if (!nodeId) return analysisRoom;
  return sceneByNode[nodeId] ?? analysisRoom;
};

const SceneFrame = ({ scene, contentKey, children }: { scene: string; contentKey: string; children: ReactNode }) => (
  <div className="min-h-screen bg-background relative overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.img
        key={scene}
        src={scene}
        alt="مشهد اللعبة"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </AnimatePresence>

    <div className="absolute inset-0 bg-background/55" />

    <motion.div
      key={contentKey}
      className="relative z-10 min-h-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      {children}
    </motion.div>
  </div>
);

export const QFGameScreen = () => {
  const { state, finishIntro, chooseQuestion, finishResponse, currentNode } = useQF();
  const [showNodeIntro, setShowNodeIntro] = useState(true);
  const [responseDialogueActive, setResponseDialogueActive] = useState(false);
  const [responseDialogue, setResponseDialogue] = useState<QFDialogueLine[]>([]);
  const previousNodeIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!currentNode?.id) return;
    if (previousNodeIdRef.current !== currentNode.id) {
      setShowNodeIntro(true);
      previousNodeIdRef.current = currentNode.id;
    }
  }, [currentNode?.id]);

  const sceneImage = getSceneImage(state.phase, currentNode?.id);

  if (state.phase === "result") {
    return <QFResultScreen />;
  }

  if (state.phase === "framing") {
    return (
      <SceneFrame scene={sceneImage} contentKey="framing">
        <QFHud />
        <QFFramingScreen />
      </SceneFrame>
    );
  }

  if (!currentNode) {
    return (
      <SceneFrame scene={sceneImage} contentKey="missing-node">
        <QFHud />
        <div className="min-h-screen flex items-center justify-center p-6" dir="rtl">
          <div className="max-w-md w-full rounded-2xl border border-border bg-card/80 p-5 text-center backdrop-blur-md">
            <p className="text-foreground font-bold mb-2">حصل خلل في الانتقال بين الجولات</p>
            <p className="text-sm text-muted-foreground">جرّب إعادة الجولة من زر "إعادة" أعلى الشاشة.</p>
          </div>
        </div>
      </SceneFrame>
    );
  }

  if (state.phase === "intro") {
    return (
      <SceneFrame scene={sceneImage} contentKey="intro">
        <QFHud />
        <EnhancedDialogue
          key="qf-intro-dialogue"
          dialogues={currentNode.introDialogue}
          isActive={true}
          onComplete={() => {
            setShowNodeIntro(false);
            finishIntro();
          }}
        />
      </SceneFrame>
    );
  }

  const handleChooseQuestion = (q: QFQuestion) => {
    if (responseDialogueActive) return;
    chooseQuestion(q);
    setResponseDialogue(q.responseDialogue ?? []);
    setResponseDialogueActive(true);
  };

  const handleResponseComplete = () => {
    setResponseDialogueActive(false);
    finishResponse();
  };

  if (responseDialogueActive && state.pendingQuestion && responseDialogue.length > 0) {
    return (
      <SceneFrame scene={sceneImage} contentKey={`response-${state.pendingQuestion.id}`}>
        <QFHud />
        <EnhancedDialogue
          key={`qf-response-${state.pendingQuestion.id}`}
          dialogues={responseDialogue}
          isActive={true}
          onComplete={handleResponseComplete}
        />
      </SceneFrame>
    );
  }

  if (currentNode.introDialogue.length > 0 && showNodeIntro) {
    return (
      <SceneFrame scene={sceneImage} contentKey={`node-intro-${currentNode.id}`}>
        <QFHud />
        <EnhancedDialogue
          key={`qf-node-intro-${currentNode.id}`}
          dialogues={currentNode.introDialogue}
          isActive={true}
          onComplete={() => setShowNodeIntro(false)}
        />
      </SceneFrame>
    );
  }

  if (!currentNode.questions || currentNode.questions.length === 0) {
    return (
      <SceneFrame scene={sceneImage} contentKey={`no-questions-${currentNode.id}`}>
        <QFHud />
        <div className="min-h-screen flex items-center justify-center p-6" dir="rtl">
          <div className="max-w-md w-full rounded-2xl border border-border bg-card/80 p-5 text-center backdrop-blur-md">
            <p className="text-foreground font-bold mb-2">لا توجد أسئلة متاحة في هذه الجولة</p>
            <p className="text-sm text-muted-foreground">اختَر "إعادة" من الأعلى للبدء من جديد.</p>
          </div>
        </div>
      </SceneFrame>
    );
  }

  return (
    <SceneFrame scene={sceneImage} contentKey={`questions-${currentNode.id}`}>
      <QFHud />
      <div className="min-h-screen flex flex-col justify-end pb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}>
          <QFQuestionCards
            questions={currentNode.questions}
            onChoose={handleChooseQuestion}
            disabled={responseDialogueActive}
          />
        </motion.div>
      </div>
    </SceneFrame>
  );
};
