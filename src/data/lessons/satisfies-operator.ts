import type { Lesson } from "./types";

export const satisfiesOperatorLesson: Lesson = {
  id: "satisfies-operator",
  title: "satisfies 操作符",
  difficulty: "进阶",
  goal: "在校验对象形状的同时，保留对象自身的精确类型。",
  concept: [
    "satisfies 会检查一个值是否满足某个类型，但不会强行把值变宽。",
    "它很适合配置对象、映射表、路由表、主题 token。",
    "相比 as，satisfies 更像校验，不是强制断言。"
  ],
  jsThinking:
    "JS 配置对象写错 key 或 value，通常要运行后才知道。",
  tsThinking:
    "TS 可以用 satisfies 检查配置，同时保留每个字段的字面量信息。",
  example: `type Theme = {
  mode: "light" | "dark";
  accent: string;
};

const theme = {
  mode: "dark",
  accent: "#1b7f79"
} satisfies Theme;`,
  exercise: {
    prompt: "用 satisfies 校验 routeLabels 必须覆盖所有 Route。",
    starter: `type Route = "home" | "settings" | "profile";

const routeLabels = {
  home: "首页",
  settings: "设置",
  profile: "个人中心"
};`,
    answer: `type Route = "home" | "settings" | "profile";

const routeLabels = {
  home: "首页",
  settings: "设置",
  profile: "个人中心"
} satisfies Record<Route, string>;`,
    explanation:
      "Record<Route, string> 要求 home、settings、profile 都存在。satisfies 会检查完整性，同时保留对象本身的精确字段。"
  },
  debugCase: {
    title: "as 断言可能掩盖错误",
    broken: `type Route = "home" | "settings";

const routeLabels = {
  home: "首页"
} as Record<Route, string>;`,
    fixed: `type Route = "home" | "settings";

const routeLabels = {
  home: "首页",
  settings: "设置"
} satisfies Record<Route, string>;`,
    reason:
      "as 更像告诉 TS 别管我，容易掩盖缺失字段。satisfies 会认真检查对象是否满足目标类型。"
  },
  checklist: [
    "知道 satisfies 和 as 的差别",
    "能用 satisfies 校验配置对象",
    "能结合 Record 检查映射表完整性"
  ]
};
