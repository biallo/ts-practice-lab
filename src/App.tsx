import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  GraduationCap,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Wrench
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { lessons } from "./data/lessons";
import type { Lesson } from "./data/lessons";

type TabId = "explain" | "practice" | "debug" | "review";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "explain", label: "讲解" },
  { id: "practice", label: "练习" },
  { id: "debug", label: "改错" },
  { id: "review", label: "复盘" }
];

type Progress = Record<string, boolean>;
type Drafts = Record<string, string>;

const STORAGE_KEYS = {
  activeLessonId: "ts-lab.activeLessonId",
  activeTab: "ts-lab.activeTab",
  progress: "ts-lab.progress",
  practiceDrafts: "ts-lab.practiceDrafts",
  debugDrafts: "ts-lab.debugDrafts"
} as const;

function App() {
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

  const activeIndex = lessons.findIndex((lesson) => lesson.id === activeLessonId);
  const activeLesson = lessons[activeIndex];
  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const nextLesson = () => {
    const next = lessons[Math.min(activeIndex + 1, lessons.length - 1)];
    selectLesson(next);
  };

  const previousLesson = () => {
    const previous = lessons[Math.max(activeIndex - 1, 0)];
    selectLesson(previous);
  };

  const selectLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setActiveTab("explain");
    setShowAnswer(false);
    setShowFix(false);
    setPracticeResult("");
    setDebugResult("");
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

  const currentStatus = progress[activeLesson.id] ? "已完成" : "学习中";

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="课程列表">
        <div className="brand">
          <div className="brand-mark">
            <GraduationCap size={24} />
          </div>
          <div>
            <p>TS Practice Lab</p>
            <span>给 React 开发者的 TypeScript 训练场</span>
          </div>
        </div>

        <div className="progress-block">
          <div className="progress-row">
            <span>总体进度</span>
            <strong>{progressPercent}%</strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div style={{ width: `${progressPercent}%` }} />
          </div>
          <p>{completedCount} / {lessons.length} 个主题完成</p>
        </div>

        <label className="mobile-lesson-picker">
          <span>当前课程</span>
          <select
            onChange={(event) => {
              const lesson = lessons.find((item) => item.id === event.target.value);
              if (lesson) {
                selectLesson(lesson);
              }
            }}
            value={activeLesson.id}
          >
            {lessons.map((lesson, index) => (
              <option key={lesson.id} value={lesson.id}>
                {String(index + 1).padStart(2, "0")} · {lesson.title}
              </option>
            ))}
          </select>
        </label>

        <nav className="lesson-list">
          {lessons.map((lesson, index) => (
            <button
              className={lesson.id === activeLesson.id ? "lesson-item active" : "lesson-item"}
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              type="button"
            >
              <span className="lesson-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="lesson-copy">
                <strong>{lesson.title}</strong>
                <small>{lesson.difficulty} · {lesson.minutes} 分钟</small>
              </span>
              {progress[lesson.id] && <CheckCircle2 className="done-icon" size={18} />}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="hero-panel">
          <div>
            <span className="eyebrow">{activeLesson.difficulty} · {currentStatus}</span>
            <h1>{activeLesson.title}</h1>
            <p>{activeLesson.goal}</p>
          </div>
          <div className="hero-actions">
            <button disabled={activeIndex === 0} onClick={previousLesson} type="button" title="上一课">
              <ChevronLeft size={18} />
              <span>上一课</span>
            </button>
            <button disabled={activeIndex === lessons.length - 1} onClick={nextLesson} type="button" title="下一课">
              <span>下一课</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </header>

        <div className="tabs" role="tablist" aria-label="学习步骤">
          {tabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "tab active" : "tab"}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <LessonContent
          lesson={activeLesson}
          markDone={markDone}
          practiceDraft={practiceDrafts[activeLesson.id] ?? activeLesson.exercise.starter}
          debugDraft={debugDrafts[activeLesson.id] ?? activeLesson.debugCase.broken}
          practiceResult={practiceResult}
          debugResult={debugResult}
          setPracticeDraft={(value) =>
            setPracticeDrafts((current) => ({
              ...current,
              [activeLesson.id]: value
            }))
          }
          setDebugDraft={(value) =>
            setDebugDrafts((current) => ({
              ...current,
              [activeLesson.id]: value
            }))
          }
          setPracticeResult={setPracticeResult}
          setDebugResult={setDebugResult}
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

type LessonContentProps = {
  debugDraft: string;
  debugResult: string;
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

function LessonContent({
  debugDraft,
  debugResult,
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
    const checkPractice = () => {
      const matched = normalizeCode(practiceDraft) === normalizeCode(lesson.exercise.answer);
      setPracticeResult(matched ? "看起来和参考答案一致。" : "还不完全一样。可以先对照提示，再决定要不要看答案。");
    };

    return (
      <section className="content-grid">
        <article className="panel wide">
          <PanelTitle icon={<Code2 size={19} />} title="练习题" />
          <p className="lead">{lesson.exercise.prompt}</p>
          <CodeEditor
            label="你的代码"
            onChange={setPracticeDraft}
            value={practiceDraft}
          />
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

  if (tab === "debug") {
    const checkDebugFix = () => {
      const matched = normalizeCode(debugDraft) === normalizeCode(lesson.debugCase.fixed);
      setDebugResult(matched ? "修正结果和参考版本一致。" : "还没完全修好。重点看类型报错背后的原因。");
    };

    return (
      <section className="content-grid">
        <article className="panel">
          <PanelTitle icon={<Wrench size={19} />} title={lesson.debugCase.title} />
          <p className="lead">在这里直接修改错误代码，试着把它改到类型安全。</p>
          <CodeEditor
            label="你的修正"
            onChange={setDebugDraft}
            tone="danger"
            value={debugDraft}
          />
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

  if (tab === "review") {
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
          <button className="primary" onClick={markDone} type="button">
            <CheckCircle2 size={18} />
            <span>标记为已完成</span>
          </button>
        </article>
      </section>
    );
  }

  return <ExplainLesson lesson={lesson} />;
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

function PanelTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="panel-title">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

function CodeBlock({ code, tone = "default" }: { code: string; tone?: "default" | "success" | "danger" }) {
  return (
    <pre className={`code-block ${tone}`}>
      <code>{code}</code>
    </pre>
  );
}

function CodeEditor({
  label,
  onChange,
  tone = "default",
  value
}: {
  label: string;
  onChange: (value: string) => void;
  tone?: "default" | "danger";
  value: string;
}) {
  return (
    <label className="editor-wrap">
      <span>{label}</span>
      <textarea
        className={`code-editor ${tone}`}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") {
            return;
          }

          event.preventDefault();

          const target = event.currentTarget;
          const indentation = "  ";
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const nextValue = `${value.slice(0, start)}${indentation}${value.slice(end)}`;

          onChange(nextValue);

          requestAnimationFrame(() => {
            target.selectionStart = start + indentation.length;
            target.selectionEnd = start + indentation.length;
          });
        }}
        spellCheck={false}
        value={value}
      />
    </label>
  );
}

function normalizeCode(code: string) {
  return code.replace(/\s+/g, "");
}

function loadActiveLessonId() {
  const savedLessonId = loadString(STORAGE_KEYS.activeLessonId);
  return lessons.some((lesson) => lesson.id === savedLessonId) ? savedLessonId : lessons[0].id;
}

function loadActiveTab(): TabId {
  const savedTab = loadString(STORAGE_KEYS.activeTab);
  return isTabId(savedTab) ? savedTab : "explain";
}

function loadString(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function loadRecord<T extends Record<string, unknown>>(
  key: string,
  isValid: (value: unknown) => value is T
): T {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return {} as T;
    }

    const parsed: unknown = JSON.parse(stored);
    return isValid(parsed) ? parsed : ({} as T);
  } catch {
    return {} as T;
  }
}

function saveValue(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch {
    // localStorage can be unavailable in private browsing or restricted environments.
  }
}

function isTabId(value: unknown): value is TabId {
  return typeof value === "string" && tabs.some((tab) => tab.id === value);
}

function isProgress(value: unknown): value is Progress {
  return isRecordOf(value, "boolean");
}

function isDrafts(value: unknown): value is Drafts {
  return isRecordOf(value, "string");
}

function isRecordOf(value: unknown, type: "boolean" | "string") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((item) => typeof item === type);
}

export default App;
