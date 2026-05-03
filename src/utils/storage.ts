import { lessons } from "../data/lessons";
import { tabs, type TabId } from "../components/tabConfig";

export type Progress = Record<string, boolean>;
export type Drafts = Record<string, string>;

export const STORAGE_KEYS = {
  activeLessonId: "ts-lab.activeLessonId",
  activeTab: "ts-lab.activeTab",
  progress: "ts-lab.progress",
  practiceDrafts: "ts-lab.practiceDrafts",
  debugDrafts: "ts-lab.debugDrafts"
} as const;

export function loadActiveLessonId() {
  const savedLessonId = loadString(STORAGE_KEYS.activeLessonId);
  return lessons.some((lesson) => lesson.id === savedLessonId) ? savedLessonId : lessons[0].id;
}

export function loadActiveTab(): TabId {
  const savedTab = loadString(STORAGE_KEYS.activeTab);
  return isTabId(savedTab) ? savedTab : "explain";
}

export function loadRecord<T extends Record<string, unknown>>(
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

export function saveValue(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch {
    // localStorage can be unavailable in private browsing or restricted environments.
  }
}

export function isProgress(value: unknown): value is Progress {
  return isRecordOf(value, "boolean");
}

export function isDrafts(value: unknown): value is Drafts {
  return isRecordOf(value, "string");
}

function loadString(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function isTabId(value: unknown): value is TabId {
  return typeof value === "string" && tabs.some((tab) => tab.id === value);
}

function isRecordOf(value: unknown, type: "boolean" | "string") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((item) => typeof item === type);
}
