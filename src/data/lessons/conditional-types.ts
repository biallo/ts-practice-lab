import type { Lesson } from "./types";

export const conditionalTypesLesson: Lesson = {
  id: "conditional-types",
  title: "条件类型",
  difficulty: "进阶",
  goal: "用 T extends U ? X : Y 根据类型条件生成新类型。",
  concept: [
    "条件类型的形式是 T extends U ? TrueType : FalseType。",
    "它不是运行时 if，而是在类型层面根据 T 是否满足 U 来选择结果。",
    "条件类型常用于工具类型、API 类型转换、根据输入类型推导输出类型。"
  ],
  jsThinking:
    "JS 里根据值做 if 判断，运行时决定走哪个分支。",
  tsThinking:
    "TS 可以根据类型做条件判断，让类型本身也能表达分支逻辑。",
  example: `type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;
type B = IsString<number>;

type MessageOf<T> = T extends { message: string } ? string : never;`,
  exercise: {
    prompt: "写一个 ToArray<T>：如果 T 已经是数组就保持原样，否则包成数组。",
    starter: `type ToArray<T> = unknown;

type A = ToArray<string>;
type B = ToArray<number[]>;`,
    answer: `type ToArray<T> = T extends unknown[] ? T : T[];

type A = ToArray<string>;
type B = ToArray<number[]>;`,
    explanation:
      "T extends unknown[] 用来判断 T 是否是数组类型。string 会变成 string[]，number[] 已经是数组，所以保持 number[]。"
  },
  debugCase: {
    title: "条件类型不是运行时判断",
    broken: `type IsNumber<T> = T === number ? true : false;`,
    fixed: `type IsNumber<T> = T extends number ? true : false;`,
    reason:
      "类型层面不能使用 ===。条件类型使用 extends 判断 T 是否能赋值给目标类型。"
  },
  checklist: [
    "能读懂 T extends U ? X : Y",
    "知道条件类型发生在类型层面",
    "能写一个简单的条件工具类型"
  ]
};
