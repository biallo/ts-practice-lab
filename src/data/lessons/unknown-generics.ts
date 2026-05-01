import type { Lesson } from "./types";

export const unknownGenericsLesson: Lesson = {
  id: "unknown-generics",
  title: "unknown、泛型和工具类型",
  difficulty: "进阶",
  goal: "写出更可复用的类型，同时避免 any 带来的类型逃逸。",
  concept: [
    "any 会关闭类型检查，unknown 会要求你在使用前先判断。",
    "泛型适合表达输入和输出之间的类型关系。",
    "Pick、Omit、Partial、Record 是业务项目里非常常见的工具类型。"
  ],
  jsThinking:
    "JS 里工具函数通常很自由，但调用处拿到什么类型只能靠人记住。",
  tsThinking:
    "TS 的泛型让工具函数保持灵活，同时把输入输出关系交给编译器追踪。",
  example: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

type User = {
  id: number;
  name: string;
  email: string;
};

type UserPreview = Pick<User, "id" | "name">;
type UserPatch = Partial<Omit<User, "id">>;`,
  exercise: {
    prompt: "把下面的 any 改成泛型，让函数保留数组元素类型。",
    starter: `function last(items: any[]) {
  return items[items.length - 1];
}

const value = last([1, 2, 3]);`,
    answer: `function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

const value = last([1, 2, 3]);`,
    explanation:
      "T 表示数组元素类型。传 number[] 时返回 number | undefined，传 string[] 时返回 string | undefined。空数组可能没有最后一项，所以包含 undefined。"
  },
  debugCase: {
    title: "unknown 必须先检查再使用",
    broken: `function parseName(value: unknown) {
  return value.toUpperCase();
}`,
    fixed: `function parseName(value: unknown) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return "";
}`,
    reason:
      "unknown 的意思是现在不知道它是什么。你必须用 typeof 或其他方式缩小范围后，才能调用 string 方法。"
  },
  checklist: [
    "知道 any 和 unknown 的区别",
    "能写一个简单泛型函数",
    "能用 Pick、Omit、Partial 描述派生类型"
  ]
};
