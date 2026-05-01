import type { Lesson } from "./types";

export const typeofAsConstLesson: Lesson = {
  id: "typeof-as-const",
  title: "typeof 和 as const",
  difficulty: "进阶",
  goal: "从真实 JS 常量中生成类型，减少重复声明。",
  concept: [
    "typeof 可以在类型位置拿到变量的类型。",
    "as const 会让数组和对象保持更精确的字面量类型。",
    "typeof array[number] 是从常量数组生成 union 的常见写法。"
  ],
  jsThinking:
    "JS 里常量数组只负责运行时数据，类型需要靠人另外记一份。",
  tsThinking:
    "TS 可以让运行时常量反推出类型，让数据源和类型源保持一致。",
  example: `const roles = ["admin", "member", "guest"] as const;

type Role = typeof roles[number];

const roleLabels: Record<Role, string> = {
  admin: "管理员",
  member: "成员",
  guest: "访客"
};`,
  exercise: {
    prompt: "从 tabs 常量里推导出 TabId 类型。",
    starter: `const tabs = ["home", "settings", "profile"];

type TabId = string;`,
    answer: `const tabs = ["home", "settings", "profile"] as const;

type TabId = typeof tabs[number];`,
    explanation:
      "没有 as const 时 tabs 会被推断成 string[]。加上 as const 后，typeof tabs[number] 得到 \"home\" | \"settings\" | \"profile\"。"
  },
  debugCase: {
    title: "没有 as const 会丢失字面量信息",
    broken: `const statuses = ["idle", "loading", "success"];

type Status = typeof statuses[number];

const current: Status = "anything";`,
    fixed: `const statuses = ["idle", "loading", "success"] as const;

type Status = typeof statuses[number];

const current: Status = "idle";`,
    reason:
      "普通数组会被推断成 string[]，所以 Status 只是 string。as const 会保留每一项的字面量类型。"
  },
  checklist: [
    "知道 typeof 在类型位置的用途",
    "知道 as const 会保留字面量类型",
    "能从常量数组生成 union 类型"
  ]
};
