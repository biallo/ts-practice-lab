import type { Lesson } from "./types";

export const valuesFunctionsLesson: Lesson = {
  id: "values-functions",
  title: "给变量和函数补类型",
  difficulty: "入门",
  goal: "把熟悉的 JS 函数变成有明确输入和输出的 TS 函数。",
  concept: [
    "TypeScript 会根据初始值推断类型，简单变量不必每次手写标注。",
    "函数参数通常需要显式标注，因为 TS 无法猜到调用者会传什么。",
    "返回值可以让 TS 推断；公共函数建议标出来，读代码更稳。"
  ],
  jsThinking:
    "JS 里更关注函数运行时能不能工作，参数传错时常常要到运行后才发现。",
  tsThinking:
    "TS 里先描述函数允许接收什么，再让编辑器提前拦住不合理调用。",
  example: `function formatPrice(price: number, currency: string): string {
  return \`\${currency} \${price.toFixed(2)}\`;
}

formatPrice(19.9, "USD");`,
  exercise: {
    prompt: "给下面函数补上参数和返回值类型。",
    starter: `function createInitials(firstName, lastName) {
  return \`\${firstName[0]}\${lastName[0]}\`.toUpperCase();
}`,
    answer: `function createInitials(firstName: string, lastName: string): string {
  return \`\${firstName[0]}\${lastName[0]}\`.toUpperCase();
}`,
    explanation:
      "firstName 和 lastName 都会用字符串索引与 toUpperCase，所以它们应该是 string。函数最终返回字符串，因此返回值是 string。"
  },
  debugCase: {
    title: "为什么 number 不能直接当字符串拼方法用",
    broken: `function normalizeId(id: number) {
  return id.trim();
}`,
    fixed: `function normalizeId(id: number) {
  return String(id).trim();
}`,
    reason:
      "trim 是 string 的方法。TS 报错不是烦你，而是在提醒：如果 id 是 number，运行时根本没有 trim。先转成 string 后再调用。"
  },
  checklist: [
    "能判断什么时候依赖类型推断，什么时候手写类型",
    "能给函数参数补类型",
    "能读懂 string、number、boolean、string[]"
  ]
};
