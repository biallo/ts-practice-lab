import type { Lesson } from "./types";

export const objectsPropsLesson: Lesson = {
  id: "objects-props",
  title: "对象、type 和 React Props",
  difficulty: "常用",
  goal: "学会用 type 描述对象，并迁移到 React 组件 props。",
  concept: [
    "type 可以给对象结构起名字，之后到处复用。",
    "可选属性用 ?，表示这个字段可能不存在。",
    "React props 本质就是一个对象，所以对象类型是 React + TS 的核心。"
  ],
  jsThinking:
    "JS 组件常常靠调用者记住应该传哪些 props，漏传以后页面才出问题。",
  tsThinking:
    "TS 组件把 props 约束写在组件边界上，调用处会立刻得到提示。",
  example: `type UserCardProps = {
  name: string;
  role: "admin" | "member";
  avatarUrl?: string;
};

function UserCard({ name, role, avatarUrl }: UserCardProps) {
  return <article>{name} is {role}</article>;
}`,
  exercise: {
    prompt: "为 ProductCard 写一个 props 类型，并让 discountText 可选。",
    starter: `function ProductCard({ title, price, discountText }) {
  return (
    <section>
      <h3>{title}</h3>
      <p>{price}</p>
      {discountText && <strong>{discountText}</strong>}
    </section>
  );
}`,
    answer: `type ProductCardProps = {
  title: string;
  price: number;
  discountText?: string;
};

function ProductCard({ title, price, discountText }: ProductCardProps) {
  return (
    <section>
      <h3>{title}</h3>
      <p>{price}</p>
      {discountText && <strong>{discountText}</strong>}
    </section>
  );
}`,
    explanation:
      "title 用于展示文本，所以是 string。price 如果后续要计算或格式化，应该保持 number。discountText 不是每个商品都有，所以用 ?。"
  },
  debugCase: {
    title: "可选属性需要先判断再使用",
    broken: `type Profile = {
  name: string;
  bio?: string;
};

function getBioLength(profile: Profile) {
  return profile.bio.length;
}`,
    fixed: `type Profile = {
  name: string;
  bio?: string;
};

function getBioLength(profile: Profile) {
  return profile.bio?.length ?? 0;
}`,
    reason:
      "bio?: string 表示 bio 可能是 undefined。直接 .length 会有风险，使用 ?. 和 ?? 可以给缺失状态一个明确结果。"
  },
  checklist: [
    "能用 type 描述对象",
    "能区分必填和可选属性",
    "能给 React 函数组件 props 标类型"
  ]
};
