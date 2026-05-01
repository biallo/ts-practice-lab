import type { Lesson } from "./types";

export const typeTestsLesson: Lesson = {
  id: "type-tests",
  title: "类型测试入门",
  difficulty: "进阶",
  goal: "用类型断言测试工具类型是否得到预期结果。",
  concept: [
    "类型测试不会运行，它依赖 TypeScript 编译器报错或不报错。",
    "Expect 和 Equal 可以验证两个类型是否相等。",
    "@ts-expect-error 可以确认某行代码应该报错。"
  ],
  jsThinking:
    "JS 测试通常运行函数，检查返回值。",
  tsThinking:
    "TS 工具类型没有运行时值，需要用编译期测试确认推导结果正确。",
  example: `type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type Test = Expect<Equal<"a" | "b", "a" | "b">>;`,
  exercise: {
    prompt: "为 ArrayItem<T> 写一个类型测试。",
    starter: `type ArrayItem<T> = T extends Array<infer Item> ? Item : never;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type TestArrayItem = unknown;`,
    answer: `type ArrayItem<T> = T extends Array<infer Item> ? Item : never;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type TestArrayItem = Expect<Equal<ArrayItem<string[]>, string>>;`,
    explanation:
      "如果 ArrayItem<string[]> 不是 string，Equal 会得到 false，而 Expect<false> 会触发类型错误。"
  },
  debugCase: {
    title: "@ts-expect-error 必须真的有错误",
    broken: `// @ts-expect-error
const value: string = "hello";`,
    fixed: `// @ts-expect-error
const value: string = 123;`,
    reason:
      "@ts-expect-error 表示下一行应该报错。如果下一行没有错误，TS 会反过来提醒你这条注释失效。"
  },
  checklist: [
    "知道类型测试依赖编译期检查",
    "能读懂 Expect<Equal<A, B>>",
    "知道 @ts-expect-error 的用途"
  ]
};
