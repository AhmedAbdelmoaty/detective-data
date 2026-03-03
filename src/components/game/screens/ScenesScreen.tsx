import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { QuestionPicker } from "../QuestionPicker";
import { useGame } from "@/contexts/GameContext";
import { INTRO_SCENES, QUESTION_POINTS, TRUST_LOST_ENDING } from "@/data/case1";
import type { QuestionOption, SceneDialogue } from "@/data/case1";
import abuSaeed1 from "@/assets/scenes/abu-saeed-1.png";
import abuSaeed2 from "@/assets/scenes/abu-saeed-2.png";
import abuSaeed3 from "@/assets/scenes/abu-saeed-3.png";
import abuSaeed4 from "@/assets/scenes/abu-saeed-4.png";

interface ScenesScreenProps {
  onComplete: () => void;
}

const sceneBgs = [abuSaeed1, abuSaeed2, abuSaeed3, abuSaeed4];

type ScenePhase = "dialogue-before" | "question" | "dialogue-after";

export const ScenesScreen = ({ onComplete }: ScenesScreenProps) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [scenePhase, setScenePhase] = useState<ScenePhase>("dialogue-before");
  const [responseDialogues, setResponseDialogues] = useState<SceneDialogue[]>([]);
  const [trustLostScreen, setTrustLostScreen] = useState(false);
  const [bridgeDialogues, setBridgeDialogues] = useState<SceneDialogue[]>([]);
  const { addToNotebook, isInNotebook, recordQuestionChoice, state } = useGame();

  const scene = INTRO_SCENES[currentScene];
  const questionPoint = QUESTION_POINTS.find(qp => qp.sceneIndex === currentScene);
  const savedNoteIds = [...Array(100)].map((_, i) => `S${i}`).filter(id => isInNotebook(id));

  // Get the opening dialogues for the current scene
  // For scenes after the first, prepend bridge dialogues from previous choice
  const getOpeningDialogues = useCallback((): SceneDialogue[] => {
    const sceneDialogues = scene?.dialogues || [];
    if (currentScene === 0) return sceneDialogues;

    // Get the bridge from the previous scene based on what was chosen
    const prevScene = INTRO_SCENES[currentScene - 1];
    const prevChoice = state.questionChoices[currentScene - 1];
    
    let bridge: SceneDialogue[] = [];
    if (prevScene?.bridgeVariants && prevChoice) {
      const optionIndex = prevChoice.endsWith("A") ? "after1" : prevChoice.endsWith("B") ? "after2" : "after3";
      bridge = prevScene.bridgeVariants[optionIndex] || [];
    }

    // Also get the scene-specific opener based on previous choice (for scenes with dynamic openers)
    let dynamicOpener: SceneDialogue[] = [];
    if (currentScene === 1) {
      // Scene 2 has fully dynamic openers based on scene 1 choice
      if (prevChoice?.endsWith("A")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "وأنا عندي عادة… كل آخر أسبوع بكتب رقم تقريبي في الدفتر من اللي شفته… وبعدين أقارنه بتقرير نورة. المرة دي الفرق أكبر من المعتاد.", mood: "neutral" }];
      } else if (prevChoice?.endsWith("B")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "من السبت ده وأنا ببص على الرقم اللي بيطلع آخر اليوم… وبقارنه باللي في دماغي. الفرق كبير المرة دي.", mood: "neutral" }];
      } else {
        dynamicOpener = [{ characterId: "abuSaeed", text: "خليني أقولك حاجة… أنا عندي دفتر ببص فيه كل أسبوع. والرقم اللي فيه مش زي اللي في التقرير. الفرق المرة دي كبير.", mood: "neutral" }];
      }
    } else if (currentScene === 2) {
      if (prevChoice?.endsWith("A")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "في أيام تلاقي الداخلين كتير وتقول نهارده هيتقفل كويس… وبعدين تلاقي الرقم مش زي ما توقعت.", mood: "neutral" }];
      } else if (prevChoice?.endsWith("B")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "الغريبة إن الفواتير ثابتة بس الرقم بينزل. يعني في أيام فيها فواتير كتير بس الرقم النهائي برضو أقل.", mood: "neutral" }];
      } else {
        dynamicOpener = [{ characterId: "abuSaeed", text: "بعيدا عن اللي قلته… أنا لاحظ حاجة تانية. مش كل الأيام زي بعض.", mood: "neutral" }];
      }
    } else if (currentScene === 3) {
      if (prevChoice?.endsWith("A")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "وأنا بشوف حاجة في المحل… الناس بتدخل بتقيس بتسأل… وبعدين بتطلع بحاجة خفيفة.", mood: "neutral" }];
      } else if (prevChoice?.endsWith("B")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "والغريب إن الناس مش بتشتكي من البضاعة… بس بتلاقيهم بيقيسوا كتير وبيمشوا بحاجة واحدة بس.", mood: "neutral" }];
      } else {
        dynamicOpener = [{ characterId: "abuSaeed", text: "بس بغض النظر… خليني أقولك اللي بشوفه بعيني. الناس بتدخل… بتقيس…", mood: "neutral" }];
      }
    } else if (currentScene === 4) {
      if (prevChoice?.endsWith("A")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "وبالنسبة لسياسة المحل… أنا اللي يهمني إن الزبون يطلع مطمن. لو مقاس مش مظبوط بنبدل، ولو معجبتوش بيرجعها عادي.", mood: "neutral" }];
      } else if (prevChoice?.endsWith("B")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "الناس موجودة وده كويس. بس عندنا برضو سياسة مرنة… لو حد عايز يبدل أو يرجع، مش بنقفل الباب في وشه.", mood: "neutral" }];
      } else {
        dynamicOpener = [{ characterId: "abuSaeed", text: "بعيدا عن اللي قلته… خليني أقولك عن حاجة تانية في المحل. عندنا سياسة مرنة في المرتجعات والاستبدال.", mood: "neutral" }];
      }
    } else if (currentScene === 5) {
      if (prevChoice?.endsWith("A")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "خالد مدير الصالة… ونورة على الكاشير. خالد ساعات بيقولي 'النهارده في حركة بس الشراء قليل'. ونورة بتشتكي من الضغط آخر اليوم.", mood: "neutral" }];
      } else if (prevChoice?.endsWith("B")) {
        dynamicOpener = [{ characterId: "abuSaeed", text: "نورة على الكاشير وخالد في الصالة. الاتنين معايا من فترة. خالد بيقولي 'النهارده الشراء قليل'… مش عارف يقصد إيه بالظبط.", mood: "neutral" }];
      } else {
        dynamicOpener = [{ characterId: "abuSaeed", text: "الموظفين نفسهم… خالد ونورة. خالد بيقول 'الشراء قليل' ونورة بتشتكي من الضغط. مفيش تغيير في الناس.", mood: "neutral" }];
      }
    }

    return [...bridge, ...dynamicOpener, ...sceneDialogues];
  }, [scene, currentScene, state.questionChoices]);

  // Split dialogues: before question point and after
  const getBeforeDialogues = useCallback(() => {
    const allDialogues = getOpeningDialogues();
    if (!questionPoint) return allDialogues;
    
    // afterDialogueIndex is relative to the scene's own dialogues
    // But we prepended bridge+dynamic, so we need to adjust
    if (questionPoint.afterDialogueIndex === -1) {
      // Question appears immediately after bridge/dynamic opener
      return allDialogues;
    }
    
    // Show all dialogues (bridge + dynamic + scene) then question
    return allDialogues;
  }, [getOpeningDialogues, questionPoint]);

  const handleBeforeComplete = () => {
    if (questionPoint && !state.questionChoices[currentScene]) {
      setScenePhase("question");
    } else {
      handleSceneComplete();
    }
  };

  const handleQuestionSelect = (option: QuestionOption) => {
    recordQuestionChoice(currentScene, option.id, option.insight, option.trustCost);

    // Save insight to notebook if exists
    if (option.insight) {
      addToNotebook({ text: option.insight, source: "story", sourceId: `QI-${currentScene}` });
    }

    // Check trust after recording
    const newTrust = state.trustBudget + option.trustCost;
    if (newTrust <= 0) {
      setTrustLostScreen(true);
      return;
    }

    // Build response dialogues
    setResponseDialogues([...option.response]);
    setScenePhase("dialogue-after");
  };

  const handleAfterComplete = () => {
    handleSceneComplete();
  };

  const handleSceneComplete = () => {
    if (currentScene < INTRO_SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
      setScenePhase("dialogue-before");
      setResponseDialogues([]);
    } else {
      onComplete();
    }
  };

  const handleSaveNote = (saveId: string, saveText: string) => {
    addToNotebook({ text: saveText, source: "story", sourceId: saveId });
  };

  // Trust lost screen
  if (trustLostScreen) {
    return (
      <div className="relative h-screen overflow-hidden">
        <img src={sceneBgs[currentScene % sceneBgs.length]} alt="Scene" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div className="text-6xl mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}>
            🚪
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-3">{TRUST_LOST_ENDING.title}</h2>
          <p className="text-muted-foreground mb-6 max-w-md">{TRUST_LOST_ENDING.description}</p>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 mb-6 max-w-md text-right">
            <p className="text-sm font-bold text-primary mb-2">💡 الدرس المستفاد</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{TRUST_LOST_ENDING.lesson}</p>
          </div>
          <motion.button
            onClick={() => {
              setCurrentScene(0);
              setScenePhase("dialogue-before");
              setResponseDialogues([]);
              setTrustLostScreen(false);
            }}
            className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 حاول تاني
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentDialogues = scenePhase === "dialogue-after" ? responseDialogues : getBeforeDialogues();
  const currentOnComplete = scenePhase === "dialogue-after" ? handleAfterComplete : handleBeforeComplete;

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={sceneBgs[currentScene % sceneBgs.length]} alt="Scene" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {INTRO_SCENES.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i === currentScene ? "bg-primary" : i < currentScene ? "bg-primary/50" : "bg-muted"}`} />
        ))}
      </div>

      {/* Scene counter */}
      <div className="absolute top-4 right-4 z-30 px-3 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
        <span className="text-sm text-muted-foreground">المشهد {currentScene + 1}/{INTRO_SCENES.length}</span>
      </div>

      {/* Trust indicator */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1 px-3 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
        <span className="text-sm text-muted-foreground">ثقة أبو سعيد:</span>
        {[...Array(3)].map((_, i) => (
          <span key={i} className={`text-lg ${i < state.trustBudget ? "opacity-100" : "opacity-20"}`}>
            {i < state.trustBudget ? "🟢" : "⚫"}
          </span>
        ))}
      </div>

      {/* Question picker */}
      <AnimatePresence>
        {scenePhase === "question" && questionPoint && (
          <QuestionPicker options={questionPoint.options} onSelect={handleQuestionSelect} />
        )}
      </AnimatePresence>

      {/* Dialogue */}
      {scenePhase !== "question" && scene && currentDialogues.length > 0 && (
        <motion.div className="fixed inset-0 z-20" key={`dialogue-${currentScene}-${scenePhase}`}>
          <EnhancedDialogue
            dialogues={currentDialogues}
            isActive={true}
            onComplete={currentOnComplete}
            allowClickOutside={false}
            onSaveNote={handleSaveNote}
            savedNoteIds={savedNoteIds}
          />
        </motion.div>
      )}
    </div>
  );
};
