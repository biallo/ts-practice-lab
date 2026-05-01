import type { Lesson } from "./types";

export const templateLiteralTypesLesson: Lesson = {
  id: "template-literal-types",
  title: "模板字面量类型",
  difficulty: "进阶",
  goal: "用字符串拼接能力在类型层面生成更精确的字符串 union。",
  concept: [
    "模板字面量类型使用和 JS 模板字符串类似的语法，但它发生在类型层面。",
    "它可以把多个字符串 union 组合成新的字符串 union。",
    "常见用途包括事件名、路由名、CSS token、对象字段派生命名。"
  ],
  jsThinking:
    "JS 里可以运行时拼接字符串，但拼错事件名或 key 通常要运行后才发现。",
  tsThinking:
    "TS 可以在类型层面拼接字符串，让合法字符串集合提前变成可检查的类型。",
  example: `type Field = "name" | "email";
type EventName = \`\${Field}Changed\`;

const event: EventName = "nameChanged";

type Size = "sm" | "md" | "lg";
type ButtonClass = \`button-\${Size}\`;`,
  exercise: {
    prompt: "用模板字面量类型生成 route:home、route:settings、route:profile。",
    starter: `type Page = "home" | "settings" | "profile";

type RouteEvent = string;`,
    answer: `type Page = "home" | "settings" | "profile";

type RouteEvent = \`route:\${Page}\`;`,
    explanation:
      "模板字面量类型会把 Page 的每个成员放进字符串模板里，得到 \"route:home\" | \"route:settings\" | \"route:profile\"。"
  },
  debugCase: {
    title: "模板字面量类型只能拼接可转换成字符串的类型",
    broken: `type User = {
  id: number;
};

type UserEvent = \`\${User}Changed\`;`,
    fixed: `type Field = "id" | "name";

type UserEvent = \`\${Field}Changed\`;`,
    reason:
      "模板字面量类型适合拼接 string、number、boolean、bigint、null、undefined 等字面量类型，不适合直接拼接对象类型。"
  },
  checklist: [
    "能读懂 `prefix:${Union}` 这种类型写法",
    "能用模板字面量类型生成字符串 union",
    "知道它是类型层面的字符串组合"
  ]
};
