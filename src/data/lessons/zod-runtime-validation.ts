import type { Lesson } from "./types";

export const zodRuntimeValidationLesson: Lesson = {
  id: "zod-runtime-validation",
  title: "Zod 与运行时校验",
  difficulty: "进阶",
  goal: "理解 TypeScript 类型和运行时数据校验的边界。",
  concept: [
    "TypeScript 类型编译后会消失，不能校验真实接口数据。",
    "Zod 这类 schema 库可以在运行时检查 unknown 数据。",
    "z.infer 可以从 schema 推导 TypeScript 类型，让校验和类型共用一个来源。"
  ],
  jsThinking:
    "JS 里接口返回什么就直接用，遇到脏数据时才在页面上暴露问题。",
  tsThinking:
    "TS 负责编译期约束，Zod 负责运行时校验，两者配合可以守住接口边界。",
  example: `import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
});

type User = z.infer<typeof UserSchema>;

function parseUser(value: unknown): User {
  return UserSchema.parse(value);
}`,
  exercise: {
    prompt: "用 z.infer 从 ProductSchema 推导 Product 类型。",
    starter: `import { z } from "zod";

const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number()
});

type Product = unknown;`,
    answer: `import { z } from "zod";

const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number()
});

type Product = z.infer<typeof ProductSchema>;`,
    explanation:
      "typeof ProductSchema 拿到 schema 的类型，z.infer 会从 schema 里推导出对应的 TS 类型。"
  },
  debugCase: {
    title: "as User 不等于运行时校验",
    broken: `type User = {
  id: number;
  name: string;
};

function parseUser(value: unknown): User {
  return value as User;
}`,
    fixed: `import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
});

type User = z.infer<typeof UserSchema>;

function parseUser(value: unknown): User {
  return UserSchema.parse(value);
}`,
    reason:
      "as User 只是类型断言，不会检查真实数据。schema.parse 会在运行时验证数据结构，不符合时抛出错误。"
  },
  checklist: [
    "知道 TS 类型不会存在于运行时",
    "知道 schema.parse 会做真实校验",
    "能用 z.infer 从 schema 推导类型"
  ]
};
