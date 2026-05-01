import type { Lesson } from "./types";

export const utilityTypesDeepLesson: Lesson = {
  id: "utility-types-deep",
  title: "深入内置工具类型",
  difficulty: "进阶",
  goal: "熟悉项目中高频出现的 Partial、Required、Pick、Omit、ReturnType、Parameters。",
  concept: [
    "工具类型是 TS 已经帮你写好的类型转换函数。",
    "Pick 和 Omit 用于从对象类型里选择或排除字段。",
    "ReturnType 和 Parameters 可以从函数类型里提取返回值和参数列表。"
  ],
  jsThinking:
    "JS 里复用对象结构时，经常手动复制字段或靠注释说明差异。",
  tsThinking:
    "TS 可以基于已有类型派生新类型，减少重复并保持同步。",
  example: `type User = {
  id: number;
  name: string;
  email: string;
};

type UserPreview = Pick<User, "id" | "name">;
type UserForm = Omit<User, "id">;
type UserPatch = Partial<UserForm>;`,
  exercise: {
    prompt: "从 User 类型派生 CreateUserInput 和 UpdateUserInput。",
    starter: `type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
};

type CreateUserInput = unknown;
type UpdateUserInput = unknown;`,
    answer: `type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
};

type CreateUserInput = Omit<User, "id">;
type UpdateUserInput = Partial<CreateUserInput>;`,
    explanation:
      "创建用户时通常还没有 id，所以用 Omit<User, \"id\">。更新用户时只提交变化字段，所以用 Partial<CreateUserInput>。"
  },
  debugCase: {
    title: "Pick 的第二个参数必须是已有 key",
    broken: `type User = {
  id: number;
  name: string;
};

type UserPreview = Pick<User, "id" | "email">;`,
    fixed: `type User = {
  id: number;
  name: string;
};

type UserPreview = Pick<User, "id" | "name">;`,
    reason:
      "Pick<User, K> 中的 K 必须来自 keyof User。User 没有 email 字段，所以不能选择 email。"
  },
  checklist: [
    "能用 Pick 和 Omit 派生对象类型",
    "能用 Partial 表达局部更新",
    "知道 ReturnType 和 Parameters 用来提取函数信息"
  ]
};
