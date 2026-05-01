import type { Lesson } from "./types";

export const functionOverloadsLesson: Lesson = {
  id: "function-overloads",
  title: "函数重载 overload",
  difficulty: "进阶",
  goal: "让一个函数根据不同参数形式返回不同的精确类型。",
  concept: [
    "函数重载由多个重载签名和一个实现签名组成。",
    "调用方只能看到重载签名，函数体使用实现签名。",
    "当返回类型取决于参数组合时，重载比宽泛 union 更清晰。"
  ],
  jsThinking:
    "JS 里一个函数可以接 string 或 number，然后运行时判断。",
  tsThinking:
    "TS 可以把不同调用方式分别声明出来，让返回值类型跟着参数变化。"
  ,
  example: `function parseValue(value: string): string[];
function parseValue(value: number): number;
function parseValue(value: string | number) {
  if (typeof value === "string") {
    return value.split(",");
  }

  return value * 2;
}

const tags = parseValue("a,b");
const count = parseValue(2);`,
  exercise: {
    prompt: "给 formatInput 添加重载：string 返回 string，number 返回 number。",
    starter: `function formatInput(value: string | number) {
  if (typeof value === "string") {
    return value.trim();
  }

  return Number(value.toFixed(2));
}`,
    answer: `function formatInput(value: string): string;
function formatInput(value: number): number;
function formatInput(value: string | number) {
  if (typeof value === "string") {
    return value.trim();
  }

  return Number(value.toFixed(2));
}`,
    explanation:
      "toFixed 会返回 string。如果题目要求 number 分支仍返回 number，就要用 Number(...) 转回数字。重载让调用方能得到精确返回值。"
  },
  debugCase: {
    title: "实现签名要覆盖所有重载参数",
    broken: `function read(value: string): string;
function read(value: number): number;
function read(value: string) {
  return value;
}`,
    fixed: `function read(value: string): string;
function read(value: number): number;
function read(value: string | number) {
  return value;
}`,
    reason:
      "实现签名必须能接住所有重载签名的参数。既然有 number 重载，实现参数就不能只写 string。"
  },
  checklist: [
    "知道重载签名和实现签名的区别",
    "能为不同参数声明不同返回类型",
    "知道实现签名必须覆盖所有重载"
  ]
};
