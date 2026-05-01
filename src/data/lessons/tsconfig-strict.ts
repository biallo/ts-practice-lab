import type { Lesson } from "./types";

export const tsconfigStrictLesson: Lesson = {
  id: "tsconfig-strict",
  title: "tsconfig 和 strict 模式",
  difficulty: "进阶",
  goal: "理解 strict 相关配置为什么会影响日常 TS 体验。",
  concept: [
    "strict 是一组更严格类型检查的总开关。",
    "noImplicitAny 会阻止参数偷偷变成 any。",
    "strictNullChecks 会要求你认真处理 null 和 undefined。"
  ],
  jsThinking:
    "JS 项目通常靠代码审查和测试发现空值、参数遗漏这类问题。",
  tsThinking:
    "TS strict 会把这些隐性风险提前变成编辑器和构建阶段的提醒。",
  example: `{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}`,
  exercise: {
    prompt: "在 strictNullChecks 下修复 user 可能为 null 的问题。",
    starter: `type User = {
  name: string;
};

function greet(user: User | null) {
  return user.name.toUpperCase();
}`,
    answer: `type User = {
  name: string;
};

function greet(user: User | null) {
  return user?.name.toUpperCase() ?? "游客";
}`,
    explanation:
      "strictNullChecks 会保留 null 的风险。用 ?. 和 ?? 可以同时处理有用户和无用户两种情况。"
  },
  debugCase: {
    title: "noImplicitAny 会要求参数有类型",
    broken: `function sum(a, b) {
  return a + b;
}`,
    fixed: `function sum(a: number, b: number): number {
  return a + b;
}`,
    reason:
      "开启 noImplicitAny 后，TS 不允许参数默默变成 any。把参数和返回值写清楚，调用方也会得到准确提示。"
  },
  checklist: [
    "知道 strict 是严格检查总开关",
    "知道 noImplicitAny 解决什么问题",
    "知道 strictNullChecks 为什么重要"
  ]
};
