import { CheckCircle2, GraduationCap } from "lucide-react";
import { lessons } from "../data/lessons";
import type { Lesson } from "../data/lessons";

type SidebarProps = {
  activeLesson: Lesson;
  completedCount: number;
  progress: Record<string, boolean>;
  progressPercent: number;
  onLessonSelect: (lesson: Lesson) => void;
};

export function Sidebar({
  activeLesson,
  completedCount,
  onLessonSelect,
  progress,
  progressPercent
}: SidebarProps) {
  return (
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
        <p>
          {completedCount} / {lessons.length} 个主题完成
        </p>
      </div>

      <label className="mobile-lesson-picker">
        <span>当前课程</span>
        <select
          onChange={(event) => {
            const lesson = lessons.find((item) => item.id === event.target.value);
            if (lesson) {
              onLessonSelect(lesson);
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
        {lessons.map((lesson, index) => {
          const isActive = lesson.id === activeLesson.id;
          const isCompleted = Boolean(progress[lesson.id]);

          return (
            <button
              className={["lesson-item", isActive ? "active" : "", isCompleted ? "completed" : ""]
                .filter(Boolean)
                .join(" ")}
              key={lesson.id}
              onClick={() => onLessonSelect(lesson)}
              type="button"
            >
              <span className="lesson-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="lesson-copy">
                <strong>{lesson.title}</strong>
                <small>{lesson.difficulty}</small>
              </span>
              {isCompleted && <CheckCircle2 className="done-icon" size={18} />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
