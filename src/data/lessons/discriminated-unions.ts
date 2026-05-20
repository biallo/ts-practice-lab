import type { Lesson } from "./types";

export const discriminatedUnionsLesson: Lesson = {
  id: "discriminated-unions",
  title: "Discriminated Union 可辨识联合",
  difficulty: "进阶",
  goal: "用统一的状态字段建模复杂 UI 和业务状态。",
  concept: [
    "可辨识联合通常有一个共同字段，比如 status、type、kind，这个字段用来区分当前是哪种状态。",
    "每个分支根据辨识字段携带不同数据：success 有 data，error 有 message，loading 可能什么都没有。",
    "判断辨识字段后，TS 会把对象收窄到对应分支，独有字段只在正确分支里可访问。",
    "switch 很适合处理多个状态，配合 never 可以检查是否漏掉新增状态。",
    "相比把所有字段都设成可选，可辨识联合能表达“某状态一定有某字段”的关系。"
  ],
  jsThinking:
    "JS 状态对象常常混着 data、error、loading，字段是否存在要靠约定。",
  tsThinking:
    "TS 可以让每种状态拥有独立形状，只有对应分支才能访问对应数据。",
  example: `type LoadState<T> =
  | { status: "idle" } // 初始态
  | { status: "loading" } // 请求中
  | { status: "success"; data: T } // 成功态才有 data
  | { status: "error"; message: string }; // 失败态才有 message

function getMessage(state: LoadState<string[]>) {
  switch (state.status) {
    case "success":
      // state 已收窄为 success 分支
      return state.data.join(", ");
    case "error":
      // state 已收窄为 error 分支
      return state.message;
    default:
      return "等待中";
  }
}`,
  exercise: {
    prompt: "把表单状态建模为 discriminated union，并在成功分支读取 userId。",
    starter: `type SubmitState = unknown;

function getSubmitText(state: SubmitState) {
  if (state.status === "success") {
    return state.userId;
  }

  return state.status;
}`,
    answer: `type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; userId: number }
  | { status: "error"; message: string };

function getSubmitText(state: SubmitState) {
  if (state.status === "success") {
    return String(state.userId);
  }

  return state.status;
}`,
    explanation:
      "status 是共同辨识字段。判断 status === \"success\" 后，TS 知道这个分支一定有 userId。"
  },
  debugCase: {
    title: "不要把所有字段都做成可选",
    broken: `type RequestState = {
  status: "loading" | "success" | "error";
  data?: string[];
  message?: string;
};

function render(state: RequestState) {
  if (state.status === "success") {
    return state.data.join(", ");
  }
}`,
    fixed: `type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function render(state: RequestState) {
  if (state.status === "success") {
    return state.data.join(", ");
  }

  return "";
}`,
    reason:
      "把 data 和 message 都设成可选会让 TS 认为 success 时 data 仍可能不存在。分支对象能表达更准确的状态关系。"
  },
  checklist: [
    "能设计共同辨识字段",
    "能在分支中访问对应数据",
    "知道可选字段不等于状态建模"
  ]
};
