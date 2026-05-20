import type { Lesson } from "./types";

export const inferTypesLesson: Lesson = {
  id: "infer-types",
  title: "infer 推断",
  difficulty: "进阶",
  goal: "在条件类型里用 infer 从已有类型中提取局部类型。",
  concept: [
    "infer 只能出现在条件类型的 extends 匹配结构中，不能独立声明或在普通类型别名里随便使用。",
    "它像是在类型匹配时声明一个临时类型变量，把匹配到的局部类型取出来。",
    "常见提取目标包括数组元素、Promise resolved value、函数返回值、函数参数列表。",
    "不匹配时通常返回 never 或原类型，取决于这个工具类型的业务含义。",
    "ReturnType、Parameters 这类内置工具类型背后都用到了类似思路。"
  ],
  jsThinking:
    "JS 里可以从数组或函数结果里拿值，但类型信息不会自动被提取出来。",
  tsThinking:
    "TS 可以从数组、Promise、函数类型里推断出内部类型，再拿去组合新类型。",
  example: `type ArrayItem<T> = T extends Array<infer Item> ? Item : never;

type User = { id: number; name: string };

// User[] 匹配 Array<infer Item>，所以 Item 被推断为 User
type UserItem = ArrayItem<User[]>;

// Promise<infer Value> 会提取 Promise 内部最终 resolved 的值类型
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
