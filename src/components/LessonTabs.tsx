import { tabs, type TabId } from "./tabConfig";

type LessonTabsProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

export function LessonTabs({ activeTab, onTabChange }: LessonTabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label="学习步骤">
      {tabs.map((tab) => (
        <button
          aria-selected={activeTab === tab.id}
          className={activeTab === tab.id ? "tab active" : "tab"}
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
