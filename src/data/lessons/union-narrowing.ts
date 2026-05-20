import type { Lesson } from "./types";

export const unionNarrowingLesson: Lesson = {
  id: "union-narrowing",
  title: "Union 类型和类型收窄",
  difficulty: "常用",
  goal: "用 union 表达多种可能，并通过判断把类型缩小到安全范围。",
  concept: [
    "A | B 表示一个值可能是 A，也可能是 B。使用前必须先确认当前到底是哪一种。",
    "收窄就是通过判断把宽类型变成更具体的类型，例如 typeof value === \"string\" 后才能调用字符串方法。",
    "对象 union 常用共同字段区分分支，例如 status、type、kind。判断共同字段后，TS 会知道当前分支有哪些独有字段。",
    "in 判断适合检查对象是否拥有某个字段，例如 \"data\" in response 后才能安全访问 response.data。",
    "React 里常用 union 表达加载、成功、失败等 UI 状态，避免一个对象里堆满可选字段。"
  ],
  jsThinking:
    "JS 会在一个变量里塞不同形状的数据，再靠运行时判断分支。",
  tsThinking:
    "TS 可以把这些分支变成显式的类型，缺一个状态时编辑器会提醒你。",
  example: `type LoadState =
  | { status: "loading" } // 加载中：没有数据也没有错误信息
  | { status: "success"; data: string[] } // 成功：这个分支才有 data
  | { status: "error"; message: string }; // 失败：这个分支才有 message

function renderItems(state: LoadState) {
  // 判断 status 后，TS 会把 state 收窄成 success 分支
  if (state.status === "success") {
    return state.data.join(", ");
  }

  // 这里 state 被收窄成 error 分支，可以安全读取 message
  if (state.status === "error") {
    return state.message;
  }

  // 剩下的情况就是 loading
  return "Loading...";
}`,
  exercise: {
    prompt: "补全 Result 类型，让 handleResult 在不同状态下安全访问字段。",
    starter: `type Result = unknown;

function handleResult(result: Result) {
  if (result.ok) {
    return result.value.toUpperCase();
  }

  return result.error;
}`,
    answer: `type Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

function handleResult(result: Result) {
  if (result.ok) {
    return result.value.toUpperCase();
  }

  return result.error;
}`,
    explanation:
      "ok 是区分字段。判断 result.ok 后，TS 知道 true 分支里有 value，false 分支里有 error。"
  },
  debugCase: {
    title: "没有收窄就访问 union 独有字段",
    broken: `type ApiResponse =
  | { data: string[] }
  | { error: string };

function getFirst(response: ApiResponse) {
  return response.data[0];
}`,
    fixed: `type ApiResponse =
  | { data: string[] }
  | { error: string };

function getFirst(response: ApiResponse) {
  if ("data" in response) {
    return response.data[0];
  }

  return response.error;
}`,
    reason:
      "ApiResponse 不保证一定有 data。用 \"data\" in response 判断后，TS 才能确定当前分支的数据形状。"
  },
  checklist: [
    "能写出 string | number 这样的 union",
    "能用字面量字段区分不同状态",
    "能理解类型收窄为什么能消除报错"
  ]
};
