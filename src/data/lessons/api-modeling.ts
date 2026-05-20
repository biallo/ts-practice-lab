import type { Lesson } from "./types";

export const apiModelingLesson: Lesson = {
  id: "api-modeling",
  title: "API 响应泛型建模",
  difficulty: "进阶",
  goal: "用泛型描述可复用的 API 响应结构。",
  concept: [
    "很多接口共享 success、message、data 这类外壳结构，差异主要在 data 的具体形状。",
    "ApiResponse<T> 把可变化的 data 抽成泛型参数，让同一个响应外壳复用于 User、Product、Order 等模型。",
    "T 应该代表业务数据本身，不要把整个响应对象再塞进 T，否则会重复嵌套。",
    "异步函数常见返回类型是 Promise<ApiResponse<T>>，表示 await 之后才能拿到响应结构。",
    "给 API 函数标返回类型可以让调用方在读取 data 时获得准确字段提示。"
  ],
  jsThinking:
    "JS 里 fetch 后的数据结构靠接口文档和记忆维护。",
  tsThinking:
    "TS 可以把接口返回结构显式建模，让 data 在不同接口里拥有准确类型。",
  example: `type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T; // T 只代表真正的业务数据
};

type User = {
  id: number;
  name: string;
};

async function fetchUser(): Promise<ApiResponse<User>> {
  const response = await fetch("/api/user");
  // 真实项目通常还会在这里做运行时校验
  return response.json();
}`,
  exercise: {
    prompt: "把 getProducts 的返回值改成 Promise<ApiResponse<Product[]>>。",
    starter: `type Product = {
  id: number;
  title: string;
};

async function getProducts() {
  const response = await fetch("/api/products");
  return response.json();
}`,
    answer: `type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type Product = {
  id: number;
  title: string;
};

async function getProducts(): Promise<ApiResponse<Product[]>> {
  const response = await fetch("/api/products");
  return response.json();
}`,
    explanation:
      "ApiResponse<T> 描述响应外壳，Product[] 描述 data。组合起来就是 Promise<ApiResponse<Product[]>>。"
  },
  debugCase: {
    title: "把数组类型和响应外壳混在一起",
    broken: `type ApiResponse = {
  success: boolean;
  data: Product[];
};

type Product = {
  id: number;
  title: string;
};

type UserResponse = ApiResponse;`,
    fixed: `type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type Product = {
  id: number;
  title: string;
};

type ProductResponse = ApiResponse<Product[]>;`,
    reason:
      "如果 ApiResponse 写死 data: Product[]，它就不能复用于 User、Order 等接口。把 data 抽成泛型更灵活。"
  },
  checklist: [
    "能写出 ApiResponse<T>",
    "能给 async 函数标 Promise 返回类型",
    "能区分响应外壳和 data 类型"
  ]
};
