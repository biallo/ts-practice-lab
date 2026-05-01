import type { Lesson } from "./types";

export const mappedTypesLesson: Lesson = {
  id: "mapped-types",
  title: "映射类型 mapped types",
  difficulty: "进阶",
  goal: "用 [K in keyof T] 批量转换对象类型的属性。",
  concept: [
    "映射类型会遍历 key union，并为每个 key 生成新属性。",
    "[K in keyof T] 是很多工具类型的基础写法。",
    "可以在映射时添加或移除 readonly、? 等修饰符。"
  ],
  jsThinking:
    "JS 里可以遍历对象 key 生成新对象。",
  tsThinking:
    "TS 也能在类型层面遍历对象 key，生成新的对象类型。",
  example: `type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type User = {
  id: number;
  name: string;
};

type UserPatch = MyPartial<User>;`,
  exercise: {
    prompt: "写一个 ReadonlyCopy<T>，让对象所有属性都变成 readonly。",
    starter: `type ReadonlyCopy<T> = unknown;

type Todo = {
  id: number;
  title: string;
};

type ReadonlyTodo = ReadonlyCopy<Todo>;`,
    answer: `type ReadonlyCopy<T> = {
  readonly [K in keyof T]: T[K];
};

type Todo = {
  id: number;
  title: string;
};

type ReadonlyTodo = ReadonlyCopy<Todo>;`,
    explanation:
      "[K in keyof T] 会遍历 T 的每个字段，readonly 修饰符会让生成出来的字段不可重新赋值。"
  },
  debugCase: {
    title: "映射类型要遍历 key，不是遍历 value",
    broken: `type OptionalValues<T> = {
  [K in T]?: T[K];
};`,
    fixed: `type OptionalValues<T> = {
  [K in keyof T]?: T[K];
};`,
    reason:
      "K 需要是一组属性名，所以要用 keyof T。T 本身是整个对象类型，不能直接拿来当 key union。"
  },
  checklist: [
    "能读懂 [K in keyof T]",
    "能用 T[K] 保留原字段类型",
    "能写出简单的 Partial 或 Readonly"
  ]
};
