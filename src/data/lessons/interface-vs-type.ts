import type { Lesson } from "./types";

export const interfaceVsTypeLesson: Lesson = {
  id: "interface-vs-type",
  title: "interface vs type",
  difficulty: "常用",
  goal: "理解 interface 和 type 的差异，知道在项目里如何选择。",
  concept: [
    "interface 常用于描述对象形状，尤其是组件 props、类实例、公共 API。",
    "type 更通用，可以描述 union、tuple、函数类型、工具类型组合。",
    "interface 可以声明合并；type 不能重复声明同名类型。"
  ],
  jsThinking:
    "JS 里对象只是临时约定，多个地方都能随手传类似结构。",
  tsThinking:
    "TS 里可以把对象契约命名，让组件、函数和模块之间共享同一份约束。",
  example: `interface User {
  id: number;
  name: string;
}

type Status = "idle" | "loading" | "success";

type UserCardProps = User & {
  status: Status;
};`,
  exercise: {
    prompt: "把 ButtonProps 改成 interface，并保留 onClick 的函数类型。",
    starter: `type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};`,
    answer: `interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}`,
    explanation:
      "这里是标准对象形状，用 interface 很自然。onClick 是一个没有参数、没有返回值的函数，所以写成 () => void。"
  },
  debugCase: {
    title: "type 可以表达 union，interface 不适合",
    broken: `interface RequestStatus = "idle" | "loading" | "error";`,
    fixed: `type RequestStatus = "idle" | "loading" | "error";`,
    reason:
      "interface 描述对象结构，不能直接等于 union。字面量 union 用 type 更合适。"
  },
  checklist: [
    "知道 interface 常用来描述对象",
    "知道 type 更适合 union 和组合类型",
    "能读懂函数类型属性"
  ]
};
