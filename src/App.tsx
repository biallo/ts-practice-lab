import { useEffect, useRef, useState } from "react";
import { LessonContent } from "./components/LessonContent";
import { LessonHeader } from "./components/LessonHeader";
import { LessonTabs } from "./components/LessonTabs";
import { Sidebar } from "./components/Sidebar";
import type { TabId } from "./components/tabConfig";
import { lessons } from "./data/lessons";
import type { Lesson } from "./data/lessons";
import { scrollWorkspaceToTop } from "./utils/scroll";
import {
  isDrafts,
  isProgress,
  loadActiveLessonId,
  loadActiveTab,
  loadRecord,
  saveValue,
  STORAGE_KEYS,
  type Drafts,
  type Progress
} from "./utils/storage";

function App() {
  const workspaceRef = useRef<HTMLElement>(null);
  const [activeLessonId, setActiveLessonId] = useState(loadActiveLessonId);
  const [activeTab, setActiveTab] = useState<TabId>(loadActiveTab);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const [progress, setProgress] = useState<Progress>(() => loadRecord<Progress>(STORAGE_KEYS.progress, isProgress));
  const [practiceDrafts, setPracticeDrafts] = useState<Drafts>(() =>
    loadRecord<Drafts>(STORAGE_KEYS.practiceDrafts, isDrafts)
  );
  const [debugDrafts, setDebugDrafts] = useState<Drafts>(() => loadRecord<Drafts>(STORAGE_KEYS.debugDrafts, isDrafts));
  const [practiceResult, setPracticeResult] = useState("");
  const [debugResult, setDebugResult] = useState("");

  const activeIndex = Math.max(lessons.findIndex((lesson) => lesson.id === activeLessonId), 0);
  const activeLesson = lessons[activeIndex];
  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);
  const currentStatus = progress[activeLesson.id] ? "已完成" : "学习中";

  const selectLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setActiveTab("explain");
    setShowAnswer(false);
    setShowFix(false);
    setPracticeResult("");
    setDebugResult("");
    scrollWorkspaceToTop(workspaceRef.current);
  };

  const nextLesson = () => {
    const next = lessons[Math.min(activeIndex + 1, lessons.length - 1)];
    selectLesson(next);
  };

  const previousLesson = () => {
    const previous = lessons[Math.max(activeIndex - 1, 0)];
    selectLesson(previous);
  };

  const markDone = () => {
    setProgress((current) => ({
      ...current,
      [activeLesson.id]: true
    }));
  };

  useEffect(() => {
    saveValue(STORAGE_KEYS.activeLessonId, activeLessonId);
  }, [activeLessonId]);

  useEffect(() => {
    saveValue(STORAGE_KEYS.activeTab, activeTab);
  }, [activeTab]);

  useEffect(() => {
    saveValue(STORAGE_KEYS.progress, progress);
  }, [progress]);

  useEffect(() => {
    saveValue(STORAGE_KEYS.practiceDrafts, practiceDrafts);
  }, [practiceDrafts]);

  useEffect(() => {
    saveValue(STORAGE_KEYS.debugDrafts, debugDrafts);
  }, [debugDrafts]);

  return (
    <main className="app-shell">
      <Sidebar
        activeLesson={activeLesson}
        completedCount={completedCount}
        onLessonSelect={selectLesson}
        progress={progress}
        progressPercent={progressPercent}
      />

      <section className="workspace" ref={workspaceRef}>
        <LessonHeader
          activeIndex={activeIndex}
          currentStatus={currentStatus}
          lesson={activeLesson}
          onNextLesson={nextLesson}
          onPreviousLesson={previousLesson}
        />

        <LessonTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <LessonContent
          debugDraft={debugDrafts[activeLesson.id] ?? activeLesson.debugCase.broken}
          debugResult={debugResult}
          isDone={Boolean(progress[activeLesson.id])}
          lesson={activeLesson}
          markDone={markDone}
          practiceDraft={practiceDrafts[activeLesson.id] ?? activeLesson.exercise.starter}
          practiceResult={practiceResult}
          setDebugDraft={(value) =>
            setDebugDrafts((current) => ({
              ...current,
              [activeLesson.id]: value
            }))
          }
          setDebugResult={setDebugResult}
          setPracticeDraft={(value) =>
            setPracticeDrafts((current) => ({
              ...current,
              [activeLesson.id]: value
            }))
          }
          setPracticeResult={setPracticeResult}
          setShowAnswer={setShowAnswer}
          setShowFix={setShowFix}
          showAnswer={showAnswer}
          showFix={showFix}
          tab={activeTab}
        />
      </section>
    </main>
  );
}

export default App;
