import type { Lesson } from "./types";

export const reactChildrenComponentPropsLesson: Lesson = {
  id: "react-children-component-props",
  title: "React children 和组件类型",
  difficulty: "常用",
  goal: "掌握 React children、组件作为 props、回调 props 的常见类型。",
  concept: [
    "children 表示组件标签中间传入的可渲染内容，通常写成 React.ReactNode。",
    "React.ReactNode 覆盖字符串、数字、元素、数组、null 等常见渲染结果，比 string 更符合真实 children。",
    "组件作为 props 时，可以用 React.ComponentType<Props>，并把被传组件需要的 props 也描述出来。",
    "回调 props 要写清楚参数和返回值，例如 onSelect: (id: number) => void，这会同时约束调用方和组件内部。",
    "列表组件的 props 通常要给 item 建模，因为 key、展示字段和回调参数都依赖 item 的结构。"
  ],
  jsThinking:
    "JS 里 children 和组件 props 都能传，但传错通常只能靠页面表现发现。",
  tsThinking:
    "TS 可以把可渲染内容、组件类型、回调签名都写在 props 边界上。",
  example: `type PanelProps = {
  title: string; // 普通文本 prop
  children: React.ReactNode; // children 可以是文本、元素、数组或 null
};

function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {/* 这里渲染调用方放在 <Panel>...</Panel> 中间的内容 */}
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
