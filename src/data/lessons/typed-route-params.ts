import type { Lesson } from "./types";

export const typedRouteParamsLesson: Lesson = {
  id: "typed-route-params",
  title: "类型安全路由参数",
  difficulty: "进阶",
  goal: "从路径字符串中提取 :id 这类动态参数名。",
  concept: [
    "模板字面量类型可以匹配字符串模式，例如判断某段路径是否形如 :id。",
    "infer 可以从匹配到的路径片段中提取参数名，把 \":userId\" 里的 userId 变成类型。",
    "条件类型负责判断当前字符串是否符合动态参数格式，不符合时通常返回 never 或空对象。",
    "递归条件类型可以继续处理剩余路径，因此能从 /users/:id/posts/:postId 提取多个参数。",
    "这种技术适合把路由字符串和 params 对象绑定起来，减少路径改了但参数类型没改的错误。"
  ],
  jsThinking:
    "JS 路由参数名通常藏在字符串里，params.id 是否存在靠人记。",
  tsThinking:
    "TS 可以从路径字符串推导 params 对象，让路径和参数类型保持同步。",
  example: `type ExtractParam<Path extends string> =
  // 匹配 :xxx 时，用 infer Param 提取 xxx
  Path extends \`:\${infer Param}\` ? Param : never;

// A 的结果是 "id"
type A = ExtractParam<":id">;`,
  exercise: {
    prompt: "写一个提取单段路由参数的类型 ExtractParam。",
    starter: `type ExtractParam<Path extends string> = unknown;

type UserParam = ExtractParam<":userId">;
type StaticParam = ExtractParam<"settings">;`,
    answer: `type ExtractParam<Path extends string> =
  Path extends \`:\${infer Param}\` ? Param : never;

type UserParam = ExtractParam<":userId">;
type StaticParam = ExtractParam<"settings">;`,
    explanation:
      "如果 Path 符合 :xxx，就用 infer Param 提取 xxx；否则没有参数，返回 never。"
  },
  debugCase: {
    title: "没有递归就只能处理一段",
    broken: `type RouteParams<Path extends string> =
  Path extends \`/\${infer Segment}\`
    ? Segment extends \`:\${infer Param}\`
      ? Record<Param, string>
      : {}
    : {};`,
    fixed: `type RouteParams<Path extends string> =
  Path extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? Record<Param, string> & RouteParams<Rest>
    : Path extends \`\${string}:\${infer Param}\`
      ? Record<Param, string>
      : {};

type Params = RouteParams<"/users/:id/posts/:postId">;`,
    reason:
      "多参数路径需要继续分析剩余字符串。递归条件类型可以逐段提取 id、postId 等参数。"
  },
  checklist: [
    "能用模板字面量类型匹配字符串结构",
    "能用 infer 提取路径参数名",
    "知道递归可以处理多段路径"
  ]
};
