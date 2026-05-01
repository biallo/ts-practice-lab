import type { Lesson } from "./types";

export const nestedFieldPathsLesson: Lesson = {
  id: "nested-field-paths",
  title: "嵌套字段路径类型",
  difficulty: "进阶",
  goal: "从嵌套对象类型生成 user.name、address.city 这类字段路径。",
  concept: [
    "字段路径类型常用于表单、表格列、错误对象和配置面板。",
    "它结合 keyof、模板字面量类型和递归类型。",
    "为了降低复杂度，通常先只支持普通对象，不处理数组。"
  ],
  jsThinking:
    "JS 表单字段路径常写成字符串，拼错后提交或校验时才发现。",
  tsThinking:
    "TS 可以从表单数据类型生成合法路径 union，让字段名字符串也变安全。"
  ,
  example: `type FieldPath<T> = {
  [K in keyof T & string]: T[K] extends object
    ? K | \`\${K}.\${FieldPath<T[K]>}\`
    : K;
}[keyof T & string];

type FormValues = {
  user: {
    name: string;
  };
  active: boolean;
};

type Path = FieldPath<FormValues>;`,
  exercise: {
    prompt: "写一个浅层 FieldName<T>，只提取对象第一层 key。",
    starter: `type FieldName<T> = unknown;

type Form = {
  name: string;
  email: string;
};`,
    answer: `type FieldName<T> = keyof T & string;

type Form = {
  name: string;
  email: string;
};`,
    explanation:
      "字段名通常要当字符串使用。keyof T 可能包含 number 或 symbol，所以用 keyof T & string 取字符串 key。"
  },
  debugCase: {
    title: "递归路径要把当前 key 和子路径拼起来",
    broken: `type FieldPath<T> = {
  [K in keyof T & string]: T[K] extends object
    ? FieldPath<T[K]>
    : K;
}[keyof T & string];`,
    fixed: `type FieldPath<T> = {
  [K in keyof T & string]: T[K] extends object
    ? K | \`\${K}.\${FieldPath<T[K]>}\`
    : K;
}[keyof T & string];`,
    reason:
      "只返回子路径会得到 name，却丢掉 user.name 的完整路径。需要用模板字面量把当前 key 和子路径连接起来。"
  },
  checklist: [
    "知道字段路径类型解决什么问题",
    "能用 keyof T & string 提取字符串 key",
    "能读懂递归路径拼接"
  ]
};
