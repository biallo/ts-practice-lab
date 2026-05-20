import type { Lesson } from "./types";

export const typedEventBusLesson: Lesson = {
  id: "typed-event-bus",
  title: "类型安全事件总线",
  difficulty: "进阶",
  goal: "用映射类型约束事件名和 payload 的对应关系。",
  concept: [
    "事件总线的核心类型是 EventMap：事件名作为 key，payload 作为 value。",
    "emit/on 的事件名用 keyof EventMap 限制，这样不能触发未注册的事件名。",
    "payload 类型用 EventMap[K] 根据事件名精确推导，确保 login 必须传 login 的 payload。",
    "泛型 K 把事件名和 payload 绑定在同一次调用里，避免它们各自变成互不相关的 union。",
    "如果某个事件没有 payload，可以用 undefined、void 或单独设计无 payload 重载，取决于项目风格。"
  ],
  jsThinking:
    "JS 事件名通常是字符串，payload 传错形状要到监听器里才发现。",
  tsThinking:
    "TS 可以让每个事件名绑定自己的 payload 类型，emit 和 on 两边同时受保护。",
  example: `type Events = {
  login: { userId: string }; // login 事件必须带 userId
  logout: undefined; // logout 没有额外 payload
};

function emit<K extends keyof Events>(event: K, payload: Events[K]) {
  // K 把 event 和 payload 绑定起来：event 是 login 时 payload 就是 { userId: string }
  console.log(event, payload);
}

emit("login", { userId: "u1" });`,
  exercise: {
    prompt: "给 on 函数补类型，让 handler 的 payload 跟事件名匹配。",
    starter: `type Events = {
  saved: { id: number };
  failed: { message: string };
};

function on(event, handler) {
  console.log(event, handler);
}`,
    answer: `type Events = {
  saved: { id: number };
  failed: { message: string };
};

function on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
  console.log(event, handler);
}`,
    explanation:
      "K 是具体事件名，Events[K] 会取出这个事件对应的 payload 类型。选择 saved 时 payload 就是 { id: number }。"
  },
  debugCase: {
    title: "事件名和 payload 不能各自独立",
    broken: `type Events = {
  saved: { id: number };
  failed: { message: string };
};

function emit(event: keyof Events, payload: Events[keyof Events]) {
  console.log(event, payload);
}`,
    fixed: `type Events = {
  saved: { id: number };
  failed: { message: string };
};

function emit<K extends keyof Events>(event: K, payload: Events[K]) {
  console.log(event, payload);
}`,
    reason:
      "Events[keyof Events] 会把所有 payload 混成 union，失去事件名和 payload 的对应关系。用 K 把两者绑定起来。"
  },
  checklist: [
    "能设计 EventMap",
    "能用 keyof 限制事件名",
    "能用 EventMap[K] 绑定 payload"
  ]
};
