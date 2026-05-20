import type { Lesson } from "./types";

export const recursiveTypesLesson: Lesson = {
  id: "recursive-types",
  title: "递归类型",
  difficulty: "进阶",
  goal: "描述树、菜单、评论、多层 JSON 这类自引用数据结构。",
  concept: [
    "递归类型是在类型定义里引用自己，用来表达一层数据里还可以包含同样结构的下一层数据。",
    "它适合描述树结构、嵌套导航、文件目录、评论回复、多级分类等数据。",
    "对象递归常见写法是 children?: Node[]，表示子节点数组里的每一项仍是 Node。",
    "递归字段通常是可选的，否则叶子节点也会被迫继续拥有子节点。",
    "写递归工具类型时要有终止条件，否则类型会过深或失控。"
  ],
  jsThinking:
    "JS 里树结构通常就是对象里再放 children 数组。",
  tsThinking:
    "TS 可以把这种自引用结构显式写出来，让每一层 children 都有同样约束。"
  ,
  example: `type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[]; // 子节点仍然是 TreeNode，这就是递归
};

const menu: TreeNode = {
  id: "docs",
  label: "文档",
  // 每个 children 元素都必须符合 TreeNode
  children: [{ id: "intro", label: "介绍" }]
};`,
  exercise: {
    prompt: "给评论树 CommentNode 补上递归 replies 类型。",
    starter: `type CommentNode = {
  id: string;
  body: string;
  replies?: unknown;
};`,
    answer: `type CommentNode = {
  id: string;
  body: string;
  replies?: CommentNode[];
};`,
    explanation:
      "每条回复本身还是一条评论，所以 replies 应该是 CommentNode[]。这就是最常见的递归对象类型。"
  },
  debugCase: {
    title: "递归数组别忘了元素类型",
    broken: `type MenuItem = {
  label: string;
  children?: [];
};`,
    fixed: `type MenuItem = {
  label: string;
  children?: MenuItem[];
};`,
    reason:
      "children?: [] 表示只能是空元组，不能放子菜单。children?: MenuItem[] 才表示每个子项也是菜单项。"
  },
  checklist: [
    "能写出自引用对象类型",
    "能描述树形 children 数据",
    "知道递归工具类型需要终止条件"
  ]
};
