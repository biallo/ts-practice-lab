import type { Lesson } from "./types";

export const typeGuardsLesson: Lesson = {
  id: "type-guards",
  title: "类型保护 type guard",
  difficulty: "进阶",
  goal: "把运行时判断封装成 TS 能理解的类型收窄函数。",
  concept: [
    "value is SomeType 是自定义类型保护的返回类型，它告诉 TS：函数返回 true 时 value 就是 SomeType。",
    "类型保护内部必须做真实的运行时判断，不能只靠类型断言，否则编译期看似安全，运行时仍可能出错。",
    "type guard 常用于 unknown、API 数据、本地存储数据、数组 filter。",
    "数组 filter 配合类型保护时，过滤后的数组会得到更具体的元素类型。",
    "好的类型保护同时服务运行时安全和编译期推断：既真的检查数据，也让调用处自动收窄。"
  ],
  jsThinking:
    "JS 里判断函数只返回 true 或 false，调用者需要自己记住 true 代表什么。",
  tsThinking:
    "TS 的 type guard 可以告诉编译器：如果返回 true，这个值就是某个具体类型。",
  example: `function isString(value: unknown): value is string {
  // 返回类型 value is string 会把 true 分支收窄成 string
  return typeof value === "string";
}

const values: unknown[] = ["a", 1, "b"];

// filter 识别 isString 后，strings 的类型是 string[]
const strings = values.filter(isString);`,
  exercise: {
    prompt: "写一个 isUser 类型保护，判断 unknown 是否是 User。",
    starter: `type User = {
  id: number;
  name: string;
};

function isUser(value: unknown) {
  return Boolean(value);
}`,
    answer: `type User = {
  id: number;
  name: string;
};

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}`,
    explanation:
      "value is User 是关键。因为 unknown 可能是 null，所以要先判断 object 且不为 null，再用 in 检查字段。"
  },
  debugCase: {
    title: "boolean 判断不会自动变成类型保护",
    broken: `function isNumber(value: unknown) {
  return typeof value === "number";
}

function double(value: unknown) {
  if (isNumber(value)) {
    return value * 2;
  }
}`,
    fixed: `function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function double(value: unknown) {
  if (isNumber(value)) {
    return value * 2;
  }
}`,
    reason:
      "如果 isNumber 只返回 boolean，TS 不知道 true 分支里 value 是 number。返回类型写成 value is number 后才能收窄。"
  },
  checklist: [
    "能写出 value is Type",
    "能安全判断 unknown 对象",
    "知道 filter 可以配合类型保护"
  ]
};
