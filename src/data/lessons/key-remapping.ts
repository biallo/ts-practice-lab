import type { Lesson } from "./types";

export const keyRemappingLesson: Lesson = {
  id: "key-remapping",
  title: "Key remapping 键名重映射",
  difficulty: "进阶",
  goal: "在映射类型中用 as 改写对象 key，生成新对象类型。",
  concept: [
    "键名重映射写在 mapped type 的 as 后面。",
    "它常和模板字面量类型、Capitalize、Exclude 一起使用。",
    "可以把字段变成 getX 方法，也可以过滤掉不需要的字段。"
  ],
  jsThinking:
    "JS 里可以遍历对象生成一组新 key。",
  tsThinking:
    "TS 可以在类型层面遍历对象 key，并把 key 改造成新的命名规则。",
  example: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type User = {
  name: string;
  age: number;
};

type UserGetters = Getters<User>;`,
  exercise: {
    prompt: "把对象字段生成 onXChange 回调 props。",
    starter: `type ChangeHandlers<T> = unknown;

type Form = {
  name: string;
  age: number;
};`,
    answer: `type ChangeHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}Change\`]: (value: T[K]) => void;
};

type Form = {
  name: string;
  age: number;
};`,
    explanation:
      "K 遍历原字段，as 后面生成新的 key。T[K] 让每个回调的 value 类型仍然对应原字段。"
  },
  debugCase: {
    title: "Capitalize 需要字符串类型",
    broken: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<K>}\`]: () => T[K];
};`,
    fixed: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};`,
    reason:
      "keyof T 可能包含 string、number、symbol。Capitalize 只能处理 string，所以常用 string & K 把 key 限制到字符串部分。"
  },
  checklist: [
    "能读懂 [K in keyof T as NewKey]",
    "能用模板字面量生成新 key",
    "知道 string & K 的作用"
  ]
};
