import type { Lesson } from "./types";

export const apiErrorModelingLesson: Lesson = {
  id: "api-error-modeling",
  title: "API 与错误响应建模",
  difficulty: "进阶",
  goal: "用泛型和 discriminated union 同时建模成功响应和失败响应。",
  concept: [
    "真实接口通常有成功和失败两种结构，不能只按成功返回建模。",
    "ApiResult<T> 可以让成功分支携带 T，失败分支携带错误码、错误信息等诊断字段。",
    "ok、status、type 这类字段可以作为辨识字段，让 TS 判断后自动收窄到成功或失败分支。",
    "成功分支才应该有 data，失败分支才应该有 error；不要把它们都做成可选字段混在一个对象里。",
    "调用方判断 ok 后再读取 data，会让错误处理成为类型要求的一部分，而不是靠记忆。"
  ],
  jsThinking:
    "JS 里常常假设接口成功，然后在运行时遇到 error 才补判断。",
  tsThinking:
    "TS 可以把成功和失败都写进类型里，逼迫调用方处理两种结果。",
  example: `type ApiResult<T> =
  | { ok: true; data: T } // 成功分支：携带业务数据
  | { ok: false; error: { code: string; message: string } }; // 失败分支：携带错误信息

type User = {
  id: number;
  name: string;
};

function renderUser(result: ApiResult<User>) {
  // 判断 ok 后，result 被收窄为成功分支
  if (result.ok) {
    return result.data.name;
  }

  // 这里 result 是失败分支，只能读取 error
  return result.error.message;
}`,
  exercise: {
    prompt: "把 getUserName 改成先判断 ok，再安全读取 data 或 error。",
    starter: `type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type User = {
  name: string;
};

function getUserName(result: ApiResult<User>) {
  return result.data.name;
}`,
    answer: `type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type User = {
  name: string;
};

function getUserName(result: ApiResult<User>) {
  if (result.ok) {
    return result.data.name;
  }

  return result.error;
}`,
    explanation:
      "ApiResult<User> 不保证一定成功。判断 result.ok 后，true 分支里有 data，false 分支里有 error。"
  },
  debugCase: {
    title: "错误分支没有 data",
    broken: `type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function readData<T>(result: ApiResult<T>) {
  return result.data;
}`,
    fixed: `type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function readData<T>(result: ApiResult<T>) {
  if (result.ok) {
    return result.data;
  }

  throw new Error(result.error);
}`,
    reason:
      "只有 ok: true 的分支才有 data。失败分支必须单独处理，否则调用方会误以为所有结果都有数据。"
  },
  checklist: [
    "能写出 ApiResult<T>",
    "能通过 ok 字段收窄成功和失败分支",
    "能为接口错误设计明确类型"
  ]
};
