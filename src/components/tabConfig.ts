export type TabId = "explain" | "practice" | "debug" | "review";

export const tabs: Array<{ id: TabId; label: string }> = [
  { id: "explain", label: "讲解" },
  { id: "practice", label: "练习" },
  { id: "debug", label: "改错" },
  { id: "review", label: "复盘" }
];
