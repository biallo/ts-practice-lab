import type { Lesson } from "./types";

export const inferTypesLesson: Lesson = {
  id: "infer-types",
  title: "infer 推断",
  difficulty: "进阶",
  goal: "在条件类型里用 infer 从已有类型中提取局部类型。",
  concept: [
    "infer 只能出现在条件类型的 extends 分支中。",
    "它像是在类型匹配时声明一个临时类型变量。",
    "ReturnType、Parameters 这类工具类型背后都用到了类似思路。"
  ],
  jsThinking:
    "JS 里可以从数组或函数结果里拿值，但类型信息不会自动被提取出来。",
  tsThinking:
    "TS 可以从数组、Promise、函数类型里推断出内部类型，再拿去组合新类型。",
  example: `type ArrayItem<T> = T extends Array<infer Item> ? Item : never;

type User = { id: number; name: string };
type UserItem = ArrayItem<User[]>;

type PromiseValue<T> = T extends Promise<infer Value> ? Value : T;`,
  exercise: {
    prompt: "写一个 GetPromiseValue<T>，提取 Promise 里的值类型。",
    starter: `type GetPromiseValue<T> = unknown;

type User = {
  id: number;
};

type Result = GetPromiseValue<Promise<User>>;`,
    answer: `type GetPromiseValue<T> = T extends Promise<infer Value> ? Value : T;

type User = {
  id: number;
};

type Result = GetPromiseValue<Promise<User>>;`,
    explanation:
      "Promise<infer Value> 会在匹配 Promise 时把内部类型命名为 Value。Promise<User> 的 Value 就是 User。"
  },
  debugCase: {
    title: "infer 不能随便独立使用",
    broken: `type Item = infer T;`,
    fixed: `type ItemOf<T> = T extends Array<infer Item> ? Item : never;`,
    reason:
      "infer 必须放在条件类型的 extends 匹配结构里，用来从被匹配的类型中提取某一部分。"
  },
  checklist: [
    "知道 infer 是类型层面的临时变量",
    "能从数组类型中提取元素类型",
    "能从 Promise 类型中提取 resolved value 类型"
  ]
};
