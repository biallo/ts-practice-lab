import type { Lesson } from "./types";

export const deepUtilityTypesLesson: Lesson = {
  id: "deep-utility-types",
  title: "深度工具类型",
  difficulty: "进阶",
  goal: "写出 DeepPartial、DeepReadonly 这类递归转换对象的类型。",
  concept: [
    "浅层 Partial 只影响第一层字段，深度工具类型会递归处理嵌套对象。",
    "递归工具类型通常用条件类型判断是否继续深入。",
    "数组和函数要谨慎处理，不同项目会有不同取舍。"
  ],
  jsThinking:
    "JS 里深层配置对象经常只改其中一小块。",
  tsThinking:
    "TS 可以让嵌套对象的每一层都变成可选或只读，贴近真实更新场景。",
  example: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Settings = {
  user: {
    profile: {
      name: string;
    };
  };
};

type SettingsPatch = DeepPartial<Settings>;`,
  exercise: {
    prompt: "写一个 DeepReadonly<T>，让嵌套对象字段也 readonly。",
    starter: `type DeepReadonly<T> = unknown;

type Config = {
  theme: {
    mode: "light" | "dark";
  };
};`,
    answer: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Config = {
  theme: {
    mode: "light" | "dark";
  };
};`,
    explanation:
      "先给当前层每个字段加 readonly。如果字段值还是 object，就递归应用 DeepReadonly。"
  },
  debugCase: {
    title: "Partial 只会影响第一层",
    broken: `type Settings = {
  profile: {
    name: string;
    email: string;
  };
};

type Patch = Partial<Settings>;

const patch: Patch = {
  profile: {
    name: "Ada"
  }
};`,
    fixed: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Settings = {
  profile: {
    name: string;
    email: string;
  };
};

type Patch = DeepPartial<Settings>;

const patch: Patch = {
  profile: {
    name: "Ada"
  }
};`,
    reason:
      "Partial<Settings> 只让 profile 可选，但一旦提供 profile，它里面的 name 和 email 仍按原类型要求。DeepPartial 会继续处理嵌套字段。"
  },
  checklist: [
    "知道浅层工具类型和深度工具类型的区别",
    "能用条件类型控制是否递归",
    "能写出简化版 DeepPartial 或 DeepReadonly"
  ]
};
