import type { Lesson } from "./types";

export const reactChildrenComponentPropsLesson: Lesson = {
  id: "react-children-component-props",
  title: "React children 和组件类型",
  difficulty: "常用",
  goal: "掌握 React children、组件作为 props、回调 props 的常见类型。",
  concept: [
    "children 通常写成 React.ReactNode。",
    "组件作为 props 时，可以用 React.ComponentType<Props>。",
    "回调 props 要把参数和返回值写清楚，调用方会得到准确提示。"
  ],
  jsThinking:
    "JS 里 children 和组件 props 都能传，但传错通常只能靠页面表现发现。",
  tsThinking:
    "TS 可以把可渲染内容、组件类型、回调签名都写在 props 边界上。",
  example: `type PanelProps = {
  title: string;
  children: React.ReactNode;
};

function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}`,
  exercise: {
    prompt: "给 List 组件补 props 类型，包括 items 和 onSelect。",
    starter: `function List({ items, onSelect }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}`,
    answer: `type ListItem = {
  id: number;
  name: string;
};

type ListProps = {
  items: ListItem[];
  onSelect: (id: number) => void;
};

function List({ items, onSelect }: ListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}`,
    explanation:
      "items 是数组，每一项至少有 id 和 name。onSelect 会接收 item.id，所以参数类型是 number，返回值不关心时写 void。"
  },
  debugCase: {
    title: "children 不是 string，可能是任何可渲染内容",
    broken: `type CardProps = {
  children: string;
};

function Card({ children }: CardProps) {
  return <div>{children}</div>;
}`,
    fixed: `type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return <div>{children}</div>;
}`,
    reason:
      "children 可以是字符串、数字、元素、数组、null 等。React.ReactNode 更符合 React 的真实渲染能力。"
  },
  checklist: [
    "能给 children 标 React.ReactNode",
    "能写回调 props 类型",
    "能给列表组件 props 建模"
  ]
};
