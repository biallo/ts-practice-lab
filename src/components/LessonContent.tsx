import { CheckCircle2, Code2, Lightbulb, RefreshCw, RotateCcw, Wrench } from "lucide-react";
import { useMemo } from "react";
import type { Lesson } from "../data/lessons";
import { normalizeCode } from "../utils/code";
import { CodeBlock } from "./CodeBlock";
import { CodeEditor } from "./CodeEditor";
import { PanelTitle } from "./PanelTitle";
import type { TabId } from "./tabConfig";

type LessonContentProps = {
  debugDraft: string;
  debugResult: string;
  isDone: boolean;
  lesson: Lesson;
  markDone: () => void;
  practiceDraft: string;
  practiceResult: string;
  setDebugDraft: (value: string) => void;
  setDebugResult: (value: string) => void;
  setPracticeDraft: (value: string) => void;
  setPracticeResult: (value: string) => void;
  setShowAnswer: (value: boolean) => void;
  setShowFix: (value: boolean) => void;
  showAnswer: boolean;
  showFix: boolean;
  tab: TabId;
};

export function LessonContent({
  debugDraft,
  debugResult,
  isDone,
  lesson,
  markDone,
  practiceDraft,
  practiceResult,
  setDebugDraft,
  setDebugResult,
  setPracticeDraft,
  setPracticeResult,
  setShowAnswer,
  setShowFix,
  showAnswer,
  showFix,
  tab
}: LessonContentProps) {
  if (tab === "practice") {
    return (
      <PracticeLesson
        lesson={lesson}
        practiceDraft={practiceDraft}
        practiceResult={practiceResult}
        setPracticeDraft={setPracticeDraft}
        setPracticeResult={setPracticeResult}
        setShowAnswer={setShowAnswer}
        showAnswer={showAnswer}
      />
    );
  }

  if (tab === "debug") {
    return (
      <DebugLesson
        debugDraft={debugDraft}
        debugResult={debugResult}
        lesson={lesson}
        setDebugDraft={setDebugDraft}
        setDebugResult={setDebugResult}
        setShowFix={setShowFix}
        showFix={showFix}
      />
    );
  }

  if (tab === "review") {
    return <ReviewLesson isDone={isDone} lesson={lesson} markDone={markDone} />;
  }

  return <ExplainLesson lesson={lesson} />;
}

type PracticeLessonProps = {
  lesson: Lesson;
  practiceDraft: string;
  practiceResult: string;
  setPracticeDraft: (value: string) => void;
  setPracticeResult: (value: string) => void;
  setShowAnswer: (value: boolean) => void;
  showAnswer: boolean;
};

function PracticeLesson({
  lesson,
  practiceDraft,
  practiceResult,
  setPracticeDraft,
  setPracticeResult,
  setShowAnswer,
  showAnswer
}: PracticeLessonProps) {
  const checkPractice = () => {
    const matched = normalizeCode(practiceDraft) === normalizeCode(lesson.exercise.answer);
    setPracticeResult(matched ? "看起来和参考答案一致。" : "还不完全一样。可以先对照提示，再决定要不要看答案。");
  };

  return (
    <section className="content-grid">
      <article className="panel wide">
        <PanelTitle icon={<Code2 size={19} />} title="练习题" />
        <p className="lead">{lesson.exercise.prompt}</p>
        <CodeEditor label="你的代码" onChange={setPracticeDraft} value={practiceDraft} />
        <div className="button-row">
          <button className="primary" onClick={checkPractice} type="button">
            <CheckCircle2 size={18} />
            <span>检查答案</span>
          </button>
          <button className="primary" onClick={() => setShowAnswer(!showAnswer)} type="button">
            <Lightbulb size={18} />
            <span>{showAnswer ? "隐藏答案" : "查看答案"}</span>
          </button>
          <button
            className="secondary"
            onClick={() => {
              setPracticeDraft(lesson.exercise.starter);
              setPracticeResult("");
            }}
            type="button"
          >
            <RefreshCw size={18} />
            <span>重置</span>
          </button>
        </div>
        {practiceResult && <p className="result-note">{practiceResult}</p>}
      </article>

      {showAnswer && (
        <article className="panel answer-panel">
          <PanelTitle icon={<CheckCircle2 size={19} />} title="参考答案" />
          <CodeBlock code={lesson.exercise.answer} tone="success" />
          <p>{lesson.exercise.explanation}</p>
        </article>
      )}
    </section>
  );
}

type DebugLessonProps = {
  debugDraft: string;
  debugResult: string;
  lesson: Lesson;
  setDebugDraft: (value: string) => void;
  setDebugResult: (value: string) => void;
  setShowFix: (value: boolean) => void;
  showFix: boolean;
};

function DebugLesson({
  debugDraft,
  debugResult,
  lesson,
  setDebugDraft,
  setDebugResult,
  setShowFix,
  showFix
}: DebugLessonProps) {
  const checkDebugFix = () => {
    const matched = normalizeCode(debugDraft) === normalizeCode(lesson.debugCase.fixed);
    setDebugResult(matched ? "修正结果和参考版本一致。" : "还没完全修好。重点看类型报错背后的原因。");
  };

  return (
    <section className="content-grid">
      <article className="panel">
        <PanelTitle icon={<Wrench size={19} />} title={lesson.debugCase.title} />
        <p className="lead">在这里直接修改错误代码，试着把它改到类型安全。</p>
        <CodeEditor label="你的修正" onChange={setDebugDraft} tone="danger" value={debugDraft} />
        <div className="button-row">
          <button className="primary" onClick={checkDebugFix} type="button">
            <CheckCircle2 size={18} />
            <span>检查修正</span>
          </button>
          <button
            className="secondary"
            onClick={() => {
              setDebugDraft(lesson.debugCase.broken);
              setDebugResult("");
            }}
            type="button"
          >
            <RefreshCw size={18} />
            <span>重置</span>
          </button>
        </div>
        {debugResult && <p className="result-note">{debugResult}</p>}
      </article>

      <article className="panel">
        <PanelTitle icon={<RotateCcw size={19} />} title="修正版本" />
        <button className="secondary" onClick={() => setShowFix(!showFix)} type="button">
          {showFix ? "隐藏修正" : "显示修正"}
        </button>
        {showFix && (
          <>
            <CodeBlock code={lesson.debugCase.fixed} tone="success" />
            <p>{lesson.debugCase.reason}</p>
          </>
        )}
      </article>
    </section>
  );
}

type ReviewLessonProps = {
  isDone: boolean;
  lesson: Lesson;
  markDone: () => void;
};

function ReviewLesson({ isDone, lesson, markDone }: ReviewLessonProps) {
  return (
    <section className="content-grid">
      <article className="panel wide">
        <PanelTitle icon={<CheckCircle2 size={19} />} title="本课检查清单" />
        <ul className="checklist">
          {lesson.checklist.map((item) => (
            <li key={item}>
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button className={isDone ? "primary done-action" : "primary"} onClick={markDone} type="button">
          <CheckCircle2 size={18} />
          <span>{isDone ? "已完成" : "标记为已完成"}</span>
        </button>
      </article>
    </section>
  );
}

function ExplainLesson({ lesson }: { lesson: Lesson }) {
  const comparison = useMemo(
    () => [
      { label: "JS 思维", value: lesson.jsThinking },
      { label: "TS 思维", value: lesson.tsThinking }
    ],
    [lesson.jsThinking, lesson.tsThinking]
  );

  return (
    <section className="content-grid">
      <article className="panel">
        <PanelTitle icon={<Lightbulb size={19} />} title="核心讲解" />
        <ul className="concept-list">
          {lesson.concept.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="panel">
        <PanelTitle icon={<Code2 size={19} />} title="代码示例" />
        <CodeBlock code={lesson.example} />
      </article>

      {comparison.map((item) => (
        <article className="panel compact" key={item.label}>
          <span className="compare-label">{item.label}</span>
          <p>{item.value}</p>
        </article>
      ))}
    </section>
  );
}
