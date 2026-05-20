import type { Lesson } from "./types";

export const keyofIndexedAccessLesson: Lesson = {
  id: "keyof-indexed-access",
  title: "keyof 和索引访问类型",
  difficulty: "进阶",
  goal: "学会从已有对象类型里提取字段名和字段值类型。",
  concept: [
    "keyof T 会得到对象类型 T 的所有 key 的 union，例如 keyof User 可能是 \"id\" | \"name\"。",
    "T[K] 是索引访问类型，可以取出某个字段对应的 value 类型，例如 User[\"name\"] 是 string。",
    "K extends keyof T 表示 K 必须是 T 真正拥有的字段名，不能随便传任意字符串。",
    "函数返回 T[K] 时，返回值类型会跟随 key 变化；传 \"id\" 返回 number，传 \"name\" 返回 string。",
    "keyof 和泛型结合后，可以写出安全的 getProperty、表格列读取、表单字段读取等工具函数。"
  ],
  jsThinking:
    "JS 里 obj[key] 很灵活，但 key 写错只能运行时才发现。",
  tsThinking:
    "TS 可以把 key 限制为对象真正拥有的字段，并自动推断返回值类型。",
  example: `type User = {
  id: number;
  name: string;
  email: string;
};

// 得到 "id" | "name" | "email"
type UserKey = keyof User;

// 取出 name 字段对应的 value 类型，也就是 string
type UserName = User["name"];

function getValue<T, K extends keyof T>(item: T, key: K): T[K] {
  // key 被限制为真实字段，所以 item[key] 是安全的
  return item[key];
}`,
  exercise: {
    prompt: "补全 getValue 的类型，让 key 只能是对象已有字段。",
    starter: `function getValue(item, key) {
  return item[key];
}`,
    answer: `function getValue<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}`,
    explanation:
      "K extends keyof T 表示 K 必须是 T 的字段名。返回值 T[K] 会根据 key 精确变化，比如 key 是 name 就返回 name 的类型。"
  },
  debugCase: {
    title: "任意 string 不能安全索引对象",
    broken: `type User = {
  id: number;
  name: string;
};

function readUser(user: User, key: string) {
  return user[key];
}`,
    fixed: `type User = {
  id: number;
  name: string;
};

function readUser(user: User, key: keyof User) {
  return user[key];
}`,
    reason:
      "key: string 太宽了，可能传入 age、title 等不存在字段。keyof User 会把 key 限制为 \"id\" | \"name\"。"
  },
  checklist: [
    "能解释 keyof 的结果是字段名 union",
    "能使用 T[K] 提取字段值类型",
    "能写出安全读取对象属性的函数"
  ]
};
