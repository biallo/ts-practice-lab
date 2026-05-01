import type { Lesson } from "./types";

export const genericConstraintsLesson: Lesson = {
  id: "generic-constraints",
  title: "泛型约束 extends",
  difficulty: "进阶",
  goal: "让泛型保持灵活，同时要求传入值至少具备某些字段。",
  concept: [
    "T extends SomeShape 表示 T 必须满足 SomeShape 的最低要求。",
    "泛型约束不会丢掉额外字段，返回值仍然可以保持完整类型。",
    "在列表、选择器、表格组件中，泛型约束非常常见。"
  ],
  jsThinking:
    "JS 里函数只要运行到 item.id 才知道有没有 id。",
  tsThinking:
    "TS 可以要求传入对象至少有 id，同时保留对象自己的其他字段类型。",
  example: `function getId<T extends { id: number }>(item: T): number {
  return item.id;
}

const user = getId({ id: 1, name: "Ada" });`,
  exercise: {
    prompt: "给 findById 加泛型约束，要求数组元素必须有 id。",
    starter: `function findById(items, id: number) {
  return items.find((item) => item.id === id);
}`,
    answer: `function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}`,
    explanation:
      "T extends { id: number } 保证 item.id 可以安全访问。返回值是 T | undefined，因为 find 可能找不到。"
  },
  debugCase: {
    title: "没有约束时不能访问泛型字段",
    broken: `function getName<T>(item: T) {
  return item.name;
}`,
    fixed: `function getName<T extends { name: string }>(item: T) {
  return item.name;
}`,
    reason:
      "泛型 T 默认可以是任何类型，包括 number 或 null。加上 extends { name: string } 后，TS 才允许访问 name。"
  },
  checklist: [
    "能解释 T extends {...} 的含义",
    "能给泛型函数添加最低字段要求",
    "知道 find 的返回值可能是 undefined"
  ]
};
