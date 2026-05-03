import type { Lesson } from "../data/lessons";

type LessonHeaderProps = {
  currentStatus: string;
  lesson: Lesson;
};

export function LessonHeader({ currentStatus, lesson }: LessonHeaderProps) {
  return (
    <header className="hero-panel">
      <div>
        <span className="eyebrow">
          {lesson.difficulty} · {currentStatus}
        </span>
        <h1>{lesson.title}</h1>
        <p>{lesson.goal}</p>
      </div>
    </header>
  );
}
