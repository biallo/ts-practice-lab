import type { Lesson } from "./types";

export const deepUtilityTypesLesson: Lesson = {
  id: "deep-utility-types",
  title: "深度工具类型",
  difficulty: "进阶",
  goal: "写出 DeepPartial、DeepReadonly 这类递归转换对象的类型。",
  concept: [
    "浅层 Partial 只影响第一层字段，深度工具类型会递归处理嵌套对象里的每一层字段。",
    "递归工具类型通常用条件类型判断是否继续深入，例如 T[K] extends object ? ... : T[K]。",
    "映射类型负责遍历当前层字段，条件类型负责判断字段值是否还需要递归。",
    "数组和函数要谨慎处理，不同项目会有不同取舍；入门版本通常先关注普通对象。",
    "深度工具类型适合配置补丁、表单草稿、只读配置等需要跨层级转换的场景。"
  ],
  jsThinking:
    "JS 里深层配置对象经常只改其中一小块。",
  tsThinking:
    "TS 可以让嵌套对象的每一层都变成可选或只读，贴近真实更新场景。",
  example: `type DeepPartial<T> = {
  // 当前层字段变可选；如果字段值还是对象，就继续递归
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Settings = {
  user: {
    profile: {
      name: string;
    };
  };
};

// SettingsPatch 允许只提供 user.profile.name 这一小块
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
