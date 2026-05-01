import type { Lesson } from "./types";

export const typedConfigObjectsLesson: Lesson = {
  id: "typed-config-objects",
  title: "类型安全的配置对象",
  difficulty: "进阶",
  goal: "组合 as const、keyof typeof、Record、satisfies 写出安全配置表。",
  concept: [
    "配置对象通常既是运行时数据，也是类型来源。",
    "keyof typeof config 可以从对象 key 生成 union。",
    "satisfies 可以校验配置结构，同时保留字面量类型。"
  ],
  jsThinking:
    "JS 配置表写起来方便，但 key 写错或漏配置不容易提前发现。",
  tsThinking:
    "TS 可以让配置对象成为单一事实来源，既驱动页面，也生成类型约束。",
  example: `const tabConfig = {
  home: { label: "首页", path: "/" },
  settings: { label: "设置", path: "/settings" },
  profile: { label: "个人中心", path: "/profile" }
} as const;

type TabId = keyof typeof tabConfig;`,
  exercise: {
    prompt: "用 satisfies 校验每个 tab 都有 label 和 path，并推导 TabId。",
    starter: `const tabs = {
  home: { label: "首页", path: "/" },
  settings: { label: "设置", path: "/settings" }
};

type TabId = string;`,
    answer: `const tabs = {
  home: { label: "首页", path: "/" },
  settings: { label: "设置", path: "/settings" }
} satisfies Record<string, { label: string; path: string }>;

type TabId = keyof typeof tabs;`,
    explanation:
      "satisfies 会检查每个配置项都有 label 和 path。keyof typeof tabs 会得到 \"home\" | \"settings\"。"
  },
  debugCase: {
    title: "只写 Record<string, ...> 会丢失具体 key",
    broken: `const routes: Record<string, { path: string }> = {
  home: { path: "/" },
  settings: { path: "/settings" }
};

type RouteId = keyof typeof routes;`,
    fixed: `const routes = {
  home: { path: "/" },
  settings: { path: "/settings" }
} satisfies Record<string, { path: string }>;

type RouteId = keyof typeof routes;`,
    reason:
      "显式标成 Record<string, ...> 后，keyof 只会得到 string。用 satisfies 可以校验 value 结构，同时保留具体 key。"
  },
  checklist: [
    "能用 keyof typeof 从对象生成 key union",
    "能用 satisfies 校验配置项结构",
    "知道什么时候避免把对象直接标成 Record<string, ...>"
  ]
};
