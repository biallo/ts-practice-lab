import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessons } from "../data/lessons";
import type { Lesson } from "../data/lessons";

type LessonHeaderProps = {
  activeIndex: number;
  currentStatus: string;
  lesson: Lesson;
  onNextLesson: () => void;
  onPreviousLesson: () => void;
};

export function LessonHeader({
  activeIndex,
  currentStatus,
  lesson,
  onNextLesson,
  onPreviousLesson
}: LessonHeaderProps) {
  return (
    <header className="hero-panel">
      <div>
        <span className="eyebrow">
          {lesson.difficulty} · {currentStatus}
        </span>
        <h1>{lesson.title}</h1>
        <p>{lesson.goal}</p>
      </div>
      <div className="hero-actions">
        <button disabled={activeIndex === 0} onClick={onPreviousLesson} type="button" title="上一课">
          <ChevronLeft size={18} />
          <span>上一课</span>
        </button>
        <button disabled={activeIndex === lessons.length - 1} onClick={onNextLesson} type="button" title="下一课">
          <span>下一课</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </header>
  );
}
