import type { Lesson } from "./types";

export const valuesFunctionsLesson: Lesson = {
  id: "values-functions",
  title: "给变量和函数补类型",
  difficulty: "入门",
  goal: "把熟悉的 JS 函数变成有明确输入和输出的 TS 函数。",
  concept: [
    "类型标注是在变量、参数或返回值后面写 : 类型，例如 price: number、name: string。它描述的是这个位置允许放什么值。",
    "TypeScript 会根据初始值推断局部变量类型，例如 const count = 1 会被推断为 number。已经很明显的局部变量通常不用重复写 : number。",
    "函数参数是调用者传进来的值，TS 无法只靠函数体稳定猜出所有合法输入。给参数补类型，相当于在函数入口写清楚调用规则。",
    "返回值类型写在参数列表后面，例如 function fn(): string。简单函数可以让 TS 推断，公共函数或练习答案建议显式写出，后续改坏返回值时会立刻报错。",
    "字符串、数字、布尔值和数组是最常见的入门类型：string、number、boolean、string[]。写类型时先看这个值会被当成什么使用，而不是只看变量名。",
    "类型不是运行时代码，不会改变函数的执行结果；它的价值是在写代码时提前发现参数传错、方法用错、返回值不一致等问题。"
  ],
  jsThinking:
    "JS 里更关注函数运行时能不能工作，参数传错时常常要到运行后才发现。",
  tsThinking:
    "TS 里先描述函数允许接收什么，再让编辑器提前拦住不合理调用。",
  example: `const taxRate = 0.08; // TS 根据 0.08 推断 taxRate 是 number

function formatPrice(
  price: number, // 参数来自调用者，必须说明它应该是数字
  currency: "USD" | "CNY", // 只允许传入这两种货币文本
  includeTax = false // 有默认值时，TS 会推断它是 boolean
): string {
  const finalPrice = includeTax ? price * (1 + taxRate) : price;

  // 返回值标注为 string，所以这里必须返回格式化后的文本
  return \`\${currency} \${finalPrice.toFixed(2)}\`;
}

const label = formatPrice(19.9, "USD");
const labelWithTax = formatPrice(19.9, "CNY", true);

// formatPrice("19.9", "USD"); // 报错：price 必须是 number，不是 string`,
  exercise: {
    prompt: "给下面函数补上参数和返回值类型。",
    starter: `function createInitials(firstName, lastName) {
  return \`\${firstName[0]}\${lastName[0]}\`.toUpperCase();
}`,
    answer: `function createInitials(firstName: string, lastName: string): string {
  return \`\${firstName[0]}\${lastName[0]}\`.toUpperCase();
}`,
    explanation:
      "firstName 和 lastName 都会用字符串索引与 toUpperCase，所以它们应该是 string。函数最终返回字符串，因此返回值是 string。"
  },
  debugCase: {
    title: "为什么 number 不能直接当字符串拼方法用",
    broken: `function normalizeId(id: number) {
  return id.trim();
}`,
    fixed: `function normalizeId(id: number) {
  return String(id).trim();
}`,
    reason:
      "trim 是 string 的方法。TS 报错不是烦你，而是在提醒：如果 id 是 number，运行时根本没有 trim。先转成 string 后再调用。"
  },
  checklist: [
    "能判断什么时候依赖类型推断，什么时候手写类型",
    "能给函数参数补类型",
    "能读懂 string、number、boolean、string[]"
  ]
};
