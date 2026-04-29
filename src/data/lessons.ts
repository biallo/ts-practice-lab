export type Difficulty = "入门" | "常用" | "进阶";

export type Exercise = {
  prompt: string;
  starter: string;
  answer: string;
  explanation: string;
};

export type DebugCase = {
  title: string;
  broken: string;
  fixed: string;
  reason: string;
};

export type Lesson = {
  id: string;
  title: string;
  difficulty: Difficulty;
  minutes: number;
  goal: string;
  concept: string[];
  jsThinking: string;
  tsThinking: string;
  example: string;
  exercise: Exercise;
  debugCase: DebugCase;
  checklist: string[];
};

export const lessons: Lesson[] = [
  {
    id: "values-functions",
    title: "给变量和函数补类型",
    difficulty: "入门",
    minutes: 15,
    goal: "把熟悉的 JS 函数变成有明确输入和输出的 TS 函数。",
    concept: [
      "TypeScript 会根据初始值推断类型，简单变量不必每次手写标注。",
      "函数参数通常需要显式标注，因为 TS 无法猜到调用者会传什么。",
      "返回值可以让 TS 推断；公共函数建议标出来，读代码更稳。"
    ],
    jsThinking:
      "JS 里更关注函数运行时能不能工作，参数传错时常常要到运行后才发现。",
    tsThinking:
      "TS 里先描述函数允许接收什么，再让编辑器提前拦住不合理调用。",
    example: `function formatPrice(price: number, currency: string): string {
  return \`\${currency} \${price.toFixed(2)}\`;
}

formatPrice(19.9, "USD");`,
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
  },
  {
    id: "objects-props",
    title: "对象、type 和 React Props",
    difficulty: "常用",
    minutes: 20,
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
  },
  {
    id: "union-narrowing",
    title: "Union 类型和类型收窄",
    difficulty: "常用",
    minutes: 20,
    goal: "用 union 表达多种可能，并通过判断把类型缩小到安全范围。",
    concept: [
      "A | B 表示值可能是 A，也可能是 B。",
      "使用 typeof、in、状态字段等判断后，TS 会自动收窄类型。",
      "React 里常用 union 表达加载、成功、失败等 UI 状态。"
    ],
    jsThinking:
      "JS 会在一个变量里塞不同形状的数据，再靠运行时判断分支。",
    tsThinking:
      "TS 可以把这些分支变成显式的类型，缺一个状态时编辑器会提醒你。",
    example: `type LoadState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function renderItems(state: LoadState) {
  if (state.status === "success") {
    return state.data.join(", ");
  }

  if (state.status === "error") {
    return state.message;
  }

  return "Loading...";
}`,
    exercise: {
      prompt: "补全 Result 类型，让 handleResult 在不同状态下安全访问字段。",
      starter: `type Result = unknown;

function handleResult(result: Result) {
  if (result.ok) {
    return result.value.toUpperCase();
  }

  return result.error;
}`,
      answer: `type Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

function handleResult(result: Result) {
  if (result.ok) {
    return result.value.toUpperCase();
  }

  return result.error;
}`,
      explanation:
        "ok 是区分字段。判断 result.ok 后，TS 知道 true 分支里有 value，false 分支里有 error。"
    },
    debugCase: {
      title: "没有收窄就访问 union 独有字段",
      broken: `type ApiResponse =
  | { data: string[] }
  | { error: string };

function getFirst(response: ApiResponse) {
  return response.data[0];
}`,
      fixed: `type ApiResponse =
  | { data: string[] }
  | { error: string };

function getFirst(response: ApiResponse) {
  if ("data" in response) {
    return response.data[0];
  }

  return response.error;
}`,
      reason:
        "ApiResponse 不保证一定有 data。用 \"data\" in response 判断后，TS 才能确定当前分支的数据形状。"
    },
    checklist: [
      "能写出 string | number 这样的 union",
      "能用字面量字段区分不同状态",
      "能理解类型收窄为什么能消除报错"
    ]
  },
  {
    id: "react-hooks",
    title: "React Hooks 的类型",
    difficulty: "常用",
    minutes: 25,
    goal: "掌握 useState、表单事件、useRef 的常见 TS 写法。",
    concept: [
      "useState 初始值足够明确时，TS 可以自动推断。",
      "初始值是 null 或空数组时，经常需要写泛型。",
      "表单事件常用 React.ChangeEvent<HTMLInputElement>。"
    ],
    jsThinking:
      "JS 里状态初始值随手写，之后 setState 放什么都可以。",
    tsThinking:
      "TS 里状态类型会约束后续更新，避免组件某次渲染拿到意外形状。",
    example: `type User = {
  id: number;
  name: string;
};

const [user, setUser] = useState<User | null>(null);
const [tags, setTags] = useState<string[]>([]);

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  setTags(event.target.value.split(","));
}`,
    exercise: {
      prompt: "给下面的 useState 和 input change 事件补类型。",
      starter: `type Todo = {
  id: number;
  title: string;
  done: boolean;
};

const [todos, setTodos] = useState([]);

function handleTitleChange(event) {
  console.log(event.target.value);
}`,
      answer: `type Todo = {
  id: number;
  title: string;
  done: boolean;
};

const [todos, setTodos] = useState<Todo[]>([]);

function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}`,
      explanation:
        "空数组无法告诉 TS 元素类型，所以 useState<Todo[]>([]) 很常见。input 的 onChange 事件类型是 React.ChangeEvent<HTMLInputElement>。"
    },
    debugCase: {
      title: "null 初始状态不能假装一直有值",
      broken: `type User = {
  name: string;
};

const [user, setUser] = useState<User | null>(null);

return <h1>{user.name}</h1>;`,
      fixed: `type User = {
  name: string;
};

const [user, setUser] = useState<User | null>(null);

return <h1>{user?.name ?? "未登录"}</h1>;`,
      reason:
        "user 初始值是 null。渲染时必须处理空状态，否则首次渲染就可能读取 null.name。"
    },
    checklist: [
      "能给空数组状态写泛型",
      "能处理 User | null 状态",
      "能写出常见表单事件类型"
    ]
  },
  {
    id: "unknown-generics",
    title: "unknown、泛型和工具类型",
    difficulty: "进阶",
    minutes: 30,
    goal: "写出更可复用的类型，同时避免 any 带来的类型逃逸。",
    concept: [
      "any 会关闭类型检查，unknown 会要求你在使用前先判断。",
      "泛型适合表达输入和输出之间的类型关系。",
      "Pick、Omit、Partial、Record 是业务项目里非常常见的工具类型。"
    ],
    jsThinking:
      "JS 里工具函数通常很自由，但调用处拿到什么类型只能靠人记住。",
    tsThinking:
      "TS 的泛型让工具函数保持灵活，同时把输入输出关系交给编译器追踪。",
    example: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

type User = {
  id: number;
  name: string;
  email: string;
};

type UserPreview = Pick<User, "id" | "name">;
type UserPatch = Partial<Omit<User, "id">>;`,
    exercise: {
      prompt: "把下面的 any 改成泛型，让函数保留数组元素类型。",
      starter: `function last(items: any[]) {
  return items[items.length - 1];
}

const value = last([1, 2, 3]);`,
      answer: `function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

const value = last([1, 2, 3]);`,
      explanation:
        "T 表示数组元素类型。传 number[] 时返回 number | undefined，传 string[] 时返回 string | undefined。空数组可能没有最后一项，所以包含 undefined。"
    },
    debugCase: {
      title: "unknown 必须先检查再使用",
      broken: `function parseName(value: unknown) {
  return value.toUpperCase();
}`,
      fixed: `function parseName(value: unknown) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return "";
}`,
      reason:
        "unknown 的意思是现在不知道它是什么。你必须用 typeof 或其他方式缩小范围后，才能调用 string 方法。"
    },
    checklist: [
      "知道 any 和 unknown 的区别",
      "能写一个简单泛型函数",
      "能用 Pick、Omit、Partial 描述派生类型"
    ]
  },
  {
    id: "interface-vs-type",
    title: "interface vs type",
    difficulty: "常用",
    minutes: 20,
    goal: "理解 interface 和 type 的差异，知道在项目里如何选择。",
    concept: [
      "interface 常用于描述对象形状，尤其是组件 props、类实例、公共 API。",
      "type 更通用，可以描述 union、tuple、函数类型、工具类型组合。",
      "interface 可以声明合并；type 不能重复声明同名类型。"
    ],
    jsThinking:
      "JS 里对象只是临时约定，多个地方都能随手传类似结构。",
    tsThinking:
      "TS 里可以把对象契约命名，让组件、函数和模块之间共享同一份约束。",
    example: `interface User {
  id: number;
  name: string;
}

type Status = "idle" | "loading" | "success";

type UserCardProps = User & {
  status: Status;
};`,
    exercise: {
      prompt: "把 ButtonProps 改成 interface，并保留 onClick 的函数类型。",
      starter: `type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};`,
      answer: `interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}`,
      explanation:
        "这里是标准对象形状，用 interface 很自然。onClick 是一个没有参数、没有返回值的函数，所以写成 () => void。"
    },
    debugCase: {
      title: "type 可以表达 union，interface 不适合",
      broken: `interface RequestStatus = "idle" | "loading" | "error";`,
      fixed: `type RequestStatus = "idle" | "loading" | "error";`,
      reason:
        "interface 描述对象结构，不能直接等于 union。字面量 union 用 type 更合适。"
    },
    checklist: [
      "知道 interface 常用来描述对象",
      "知道 type 更适合 union 和组合类型",
      "能读懂函数类型属性"
    ]
  },
  {
    id: "keyof-indexed-access",
    title: "keyof 和索引访问类型",
    difficulty: "进阶",
    minutes: 25,
    goal: "学会从已有对象类型里提取字段名和字段值类型。",
    concept: [
      "keyof T 会得到对象类型 T 的所有 key 的 union。",
      "T[K] 可以取出某个字段对应的 value 类型。",
      "keyof 和泛型结合后，可以写出安全的 getProperty 这类工具函数。"
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

type UserKey = keyof User;
type UserName = User["name"];

function getValue<T, K extends keyof T>(item: T, key: K): T[K] {
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
  },
  {
    id: "typeof-as-const",
    title: "typeof 和 as const",
    difficulty: "进阶",
    minutes: 25,
    goal: "从真实 JS 常量中生成类型，减少重复声明。",
    concept: [
      "typeof 可以在类型位置拿到变量的类型。",
      "as const 会让数组和对象保持更精确的字面量类型。",
      "typeof array[number] 是从常量数组生成 union 的常见写法。"
    ],
    jsThinking:
      "JS 里常量数组只负责运行时数据，类型需要靠人另外记一份。",
    tsThinking:
      "TS 可以让运行时常量反推出类型，让数据源和类型源保持一致。",
    example: `const roles = ["admin", "member", "guest"] as const;

type Role = typeof roles[number];

const roleLabels: Record<Role, string> = {
  admin: "管理员",
  member: "成员",
  guest: "访客"
};`,
    exercise: {
      prompt: "从 tabs 常量里推导出 TabId 类型。",
      starter: `const tabs = ["home", "settings", "profile"];

type TabId = string;`,
      answer: `const tabs = ["home", "settings", "profile"] as const;

type TabId = typeof tabs[number];`,
      explanation:
        "没有 as const 时 tabs 会被推断成 string[]。加上 as const 后，typeof tabs[number] 得到 \"home\" | \"settings\" | \"profile\"。"
    },
    debugCase: {
      title: "没有 as const 会丢失字面量信息",
      broken: `const statuses = ["idle", "loading", "success"];

type Status = typeof statuses[number];

const current: Status = "anything";`,
      fixed: `const statuses = ["idle", "loading", "success"] as const;

type Status = typeof statuses[number];

const current: Status = "idle";`,
      reason:
        "普通数组会被推断成 string[]，所以 Status 只是 string。as const 会保留每一项的字面量类型。"
    },
    checklist: [
      "知道 typeof 在类型位置的用途",
      "知道 as const 会保留字面量类型",
      "能从常量数组生成 union 类型"
    ]
  },
  {
    id: "generic-constraints",
    title: "泛型约束 extends",
    difficulty: "进阶",
    minutes: 25,
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
  },
  {
    id: "type-guards",
    title: "类型保护 type guard",
    difficulty: "进阶",
    minutes: 30,
    goal: "把运行时判断封装成 TS 能理解的类型收窄函数。",
    concept: [
      "value is SomeType 是自定义类型保护的返回类型。",
      "type guard 常用于 unknown、API 数据、数组 filter。",
      "好的类型保护同时服务运行时安全和编译期推断。"
    ],
    jsThinking:
      "JS 里判断函数只返回 true 或 false，调用者需要自己记住 true 代表什么。",
    tsThinking:
      "TS 的 type guard 可以告诉编译器：如果返回 true，这个值就是某个具体类型。",
    example: `function isString(value: unknown): value is string {
  return typeof value === "string";
}

const values: unknown[] = ["a", 1, "b"];
const strings = values.filter(isString);`,
    exercise: {
      prompt: "写一个 isUser 类型保护，判断 unknown 是否是 User。",
      starter: `type User = {
  id: number;
  name: string;
};

function isUser(value: unknown) {
  return Boolean(value);
}`,
      answer: `type User = {
  id: number;
  name: string;
};

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}`,
      explanation:
        "value is User 是关键。因为 unknown 可能是 null，所以要先判断 object 且不为 null，再用 in 检查字段。"
    },
    debugCase: {
      title: "boolean 判断不会自动变成类型保护",
      broken: `function isNumber(value: unknown) {
  return typeof value === "number";
}

function double(value: unknown) {
  if (isNumber(value)) {
    return value * 2;
  }
}`,
      fixed: `function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function double(value: unknown) {
  if (isNumber(value)) {
    return value * 2;
  }
}`,
      reason:
        "如果 isNumber 只返回 boolean，TS 不知道 true 分支里 value 是 number。返回类型写成 value is number 后才能收窄。"
    },
    checklist: [
      "能写出 value is Type",
      "能安全判断 unknown 对象",
      "知道 filter 可以配合类型保护"
    ]
  },
  {
    id: "api-modeling",
    title: "API 响应泛型建模",
    difficulty: "进阶",
    minutes: 30,
    goal: "用泛型描述可复用的 API 响应结构。",
    concept: [
      "很多接口共享 success、message、data 这类外壳结构。",
      "ApiResponse<T> 可以让 data 的类型随具体接口变化。",
      "异步函数常见返回类型是 Promise<ApiResponse<T>>。"
    ],
    jsThinking:
      "JS 里 fetch 后的数据结构靠接口文档和记忆维护。",
    tsThinking:
      "TS 可以把接口返回结构显式建模，让 data 在不同接口里拥有准确类型。",
    example: `type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type User = {
  id: number;
  name: string;
};

async function fetchUser(): Promise<ApiResponse<User>> {
  const response = await fetch("/api/user");
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
  },
  {
    id: "satisfies-operator",
    title: "satisfies 操作符",
    difficulty: "进阶",
    minutes: 25,
    goal: "在校验对象形状的同时，保留对象自身的精确类型。",
    concept: [
      "satisfies 会检查一个值是否满足某个类型，但不会强行把值变宽。",
      "它很适合配置对象、映射表、路由表、主题 token。",
      "相比 as，satisfies 更像校验，不是强制断言。"
    ],
    jsThinking:
      "JS 配置对象写错 key 或 value，通常要运行后才知道。",
    tsThinking:
      "TS 可以用 satisfies 检查配置，同时保留每个字段的字面量信息。",
    example: `type Theme = {
  mode: "light" | "dark";
  accent: string;
};

const theme = {
  mode: "dark",
  accent: "#1b7f79"
} satisfies Theme;`,
    exercise: {
      prompt: "用 satisfies 校验 routeLabels 必须覆盖所有 Route。",
      starter: `type Route = "home" | "settings" | "profile";

const routeLabels = {
  home: "首页",
  settings: "设置",
  profile: "个人中心"
};`,
      answer: `type Route = "home" | "settings" | "profile";

const routeLabels = {
  home: "首页",
  settings: "设置",
  profile: "个人中心"
} satisfies Record<Route, string>;`,
      explanation:
        "Record<Route, string> 要求 home、settings、profile 都存在。satisfies 会检查完整性，同时保留对象本身的精确字段。"
    },
    debugCase: {
      title: "as 断言可能掩盖错误",
      broken: `type Route = "home" | "settings";

const routeLabels = {
  home: "首页"
} as Record<Route, string>;`,
      fixed: `type Route = "home" | "settings";

const routeLabels = {
  home: "首页",
  settings: "设置"
} satisfies Record<Route, string>;`,
      reason:
        "as 更像告诉 TS 别管我，容易掩盖缺失字段。satisfies 会认真检查对象是否满足目标类型。"
    },
    checklist: [
      "知道 satisfies 和 as 的差别",
      "能用 satisfies 校验配置对象",
      "能结合 Record 检查映射表完整性"
    ]
  },
  {
    id: "react-children-component-props",
    title: "React children 和组件类型",
    difficulty: "常用",
    minutes: 25,
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
  },
  {
    id: "tsconfig-strict",
    title: "tsconfig 和 strict 模式",
    difficulty: "进阶",
    minutes: 20,
    goal: "理解 strict 相关配置为什么会影响日常 TS 体验。",
    concept: [
      "strict 是一组更严格类型检查的总开关。",
      "noImplicitAny 会阻止参数偷偷变成 any。",
      "strictNullChecks 会要求你认真处理 null 和 undefined。"
    ],
    jsThinking:
      "JS 项目通常靠代码审查和测试发现空值、参数遗漏这类问题。",
    tsThinking:
      "TS strict 会把这些隐性风险提前变成编辑器和构建阶段的提醒。",
    example: `{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}`,
    exercise: {
      prompt: "在 strictNullChecks 下修复 user 可能为 null 的问题。",
      starter: `type User = {
  name: string;
};

function greet(user: User | null) {
  return user.name.toUpperCase();
}`,
      answer: `type User = {
  name: string;
};

function greet(user: User | null) {
  return user?.name.toUpperCase() ?? "游客";
}`,
      explanation:
        "strictNullChecks 会保留 null 的风险。用 ?. 和 ?? 可以同时处理有用户和无用户两种情况。"
    },
    debugCase: {
      title: "noImplicitAny 会要求参数有类型",
      broken: `function sum(a, b) {
  return a + b;
}`,
      fixed: `function sum(a: number, b: number): number {
  return a + b;
}`,
      reason:
        "开启 noImplicitAny 后，TS 不允许参数默默变成 any。把参数和返回值写清楚，调用方也会得到准确提示。"
    },
    checklist: [
      "知道 strict 是严格检查总开关",
      "知道 noImplicitAny 解决什么问题",
      "知道 strictNullChecks 为什么重要"
    ]
  },
  {
    id: "conditional-types",
    title: "条件类型",
    difficulty: "进阶",
    minutes: 30,
    goal: "用 T extends U ? X : Y 根据类型条件生成新类型。",
    concept: [
      "条件类型的形式是 T extends U ? TrueType : FalseType。",
      "它不是运行时 if，而是在类型层面根据 T 是否满足 U 来选择结果。",
      "条件类型常用于工具类型、API 类型转换、根据输入类型推导输出类型。"
    ],
    jsThinking:
      "JS 里根据值做 if 判断，运行时决定走哪个分支。",
    tsThinking:
      "TS 可以根据类型做条件判断，让类型本身也能表达分支逻辑。",
    example: `type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;
type B = IsString<number>;

type MessageOf<T> = T extends { message: string } ? string : never;`,
    exercise: {
      prompt: "写一个 ToArray<T>：如果 T 已经是数组就保持原样，否则包成数组。",
      starter: `type ToArray<T> = unknown;

type A = ToArray<string>;
type B = ToArray<number[]>;`,
      answer: `type ToArray<T> = T extends unknown[] ? T : T[];

type A = ToArray<string>;
type B = ToArray<number[]>;`,
      explanation:
        "T extends unknown[] 用来判断 T 是否是数组类型。string 会变成 string[]，number[] 已经是数组，所以保持 number[]。"
    },
    debugCase: {
      title: "条件类型不是运行时判断",
      broken: `type IsNumber<T> = T === number ? true : false;`,
      fixed: `type IsNumber<T> = T extends number ? true : false;`,
      reason:
        "类型层面不能使用 ===。条件类型使用 extends 判断 T 是否能赋值给目标类型。"
    },
    checklist: [
      "能读懂 T extends U ? X : Y",
      "知道条件类型发生在类型层面",
      "能写一个简单的条件工具类型"
    ]
  },
  {
    id: "infer-types",
    title: "infer 推断",
    difficulty: "进阶",
    minutes: 30,
    goal: "在条件类型里用 infer 从已有类型中提取局部类型。",
    concept: [
      "infer 只能出现在条件类型的 extends 分支中。",
      "它像是在类型匹配时声明一个临时类型变量。",
      "ReturnType、Parameters 这类工具类型背后都用到了类似思路。"
    ],
    jsThinking:
      "JS 里可以从数组或函数结果里拿值，但类型信息不会自动被提取出来。",
    tsThinking:
      "TS 可以从数组、Promise、函数类型里推断出内部类型，再拿去组合新类型。",
    example: `type ArrayItem<T> = T extends Array<infer Item> ? Item : never;

type User = { id: number; name: string };
type UserItem = ArrayItem<User[]>;

type PromiseValue<T> = T extends Promise<infer Value> ? Value : T;`,
    exercise: {
      prompt: "写一个 GetPromiseValue<T>，提取 Promise 里的值类型。",
      starter: `type GetPromiseValue<T> = unknown;

type User = {
  id: number;
};

type Result = GetPromiseValue<Promise<User>>;`,
      answer: `type GetPromiseValue<T> = T extends Promise<infer Value> ? Value : T;

type User = {
  id: number;
};

type Result = GetPromiseValue<Promise<User>>;`,
      explanation:
        "Promise<infer Value> 会在匹配 Promise 时把内部类型命名为 Value。Promise<User> 的 Value 就是 User。"
    },
    debugCase: {
      title: "infer 不能随便独立使用",
      broken: `type Item = infer T;`,
      fixed: `type ItemOf<T> = T extends Array<infer Item> ? Item : never;`,
      reason:
        "infer 必须放在条件类型的 extends 匹配结构里，用来从被匹配的类型中提取某一部分。"
    },
    checklist: [
      "知道 infer 是类型层面的临时变量",
      "能从数组类型中提取元素类型",
      "能从 Promise 类型中提取 resolved value 类型"
    ]
  },
  {
    id: "mapped-types",
    title: "映射类型 mapped types",
    difficulty: "进阶",
    minutes: 30,
    goal: "用 [K in keyof T] 批量转换对象类型的属性。",
    concept: [
      "映射类型会遍历 key union，并为每个 key 生成新属性。",
      "[K in keyof T] 是很多工具类型的基础写法。",
      "可以在映射时添加或移除 readonly、? 等修饰符。"
    ],
    jsThinking:
      "JS 里可以遍历对象 key 生成新对象。",
    tsThinking:
      "TS 也能在类型层面遍历对象 key，生成新的对象类型。",
    example: `type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type User = {
  id: number;
  name: string;
};

type UserPatch = MyPartial<User>;`,
    exercise: {
      prompt: "写一个 ReadonlyCopy<T>，让对象所有属性都变成 readonly。",
      starter: `type ReadonlyCopy<T> = unknown;

type Todo = {
  id: number;
  title: string;
};

type ReadonlyTodo = ReadonlyCopy<Todo>;`,
      answer: `type ReadonlyCopy<T> = {
  readonly [K in keyof T]: T[K];
};

type Todo = {
  id: number;
  title: string;
};

type ReadonlyTodo = ReadonlyCopy<Todo>;`,
      explanation:
        "[K in keyof T] 会遍历 T 的每个字段，readonly 修饰符会让生成出来的字段不可重新赋值。"
    },
    debugCase: {
      title: "映射类型要遍历 key，不是遍历 value",
      broken: `type OptionalValues<T> = {
  [K in T]?: T[K];
};`,
      fixed: `type OptionalValues<T> = {
  [K in keyof T]?: T[K];
};`,
      reason:
        "K 需要是一组属性名，所以要用 keyof T。T 本身是整个对象类型，不能直接拿来当 key union。"
    },
    checklist: [
      "能读懂 [K in keyof T]",
      "能用 T[K] 保留原字段类型",
      "能写出简单的 Partial 或 Readonly"
    ]
  },
  {
    id: "utility-types-deep",
    title: "深入内置工具类型",
    difficulty: "进阶",
    minutes: 30,
    goal: "熟悉项目中高频出现的 Partial、Required、Pick、Omit、ReturnType、Parameters。",
    concept: [
      "工具类型是 TS 已经帮你写好的类型转换函数。",
      "Pick 和 Omit 用于从对象类型里选择或排除字段。",
      "ReturnType 和 Parameters 可以从函数类型里提取返回值和参数列表。"
    ],
    jsThinking:
      "JS 里复用对象结构时，经常手动复制字段或靠注释说明差异。",
    tsThinking:
      "TS 可以基于已有类型派生新类型，减少重复并保持同步。",
    example: `type User = {
  id: number;
  name: string;
  email: string;
};

type UserPreview = Pick<User, "id" | "name">;
type UserForm = Omit<User, "id">;
type UserPatch = Partial<UserForm>;`,
    exercise: {
      prompt: "从 User 类型派生 CreateUserInput 和 UpdateUserInput。",
      starter: `type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
};

type CreateUserInput = unknown;
type UpdateUserInput = unknown;`,
      answer: `type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
};

type CreateUserInput = Omit<User, "id">;
type UpdateUserInput = Partial<CreateUserInput>;`,
      explanation:
        "创建用户时通常还没有 id，所以用 Omit<User, \"id\">。更新用户时只提交变化字段，所以用 Partial<CreateUserInput>。"
    },
    debugCase: {
      title: "Pick 的第二个参数必须是已有 key",
      broken: `type User = {
  id: number;
  name: string;
};

type UserPreview = Pick<User, "id" | "email">;`,
      fixed: `type User = {
  id: number;
  name: string;
};

type UserPreview = Pick<User, "id" | "name">;`,
      reason:
        "Pick<User, K> 中的 K 必须来自 keyof User。User 没有 email 字段，所以不能选择 email。"
    },
    checklist: [
      "能用 Pick 和 Omit 派生对象类型",
      "能用 Partial 表达局部更新",
      "知道 ReturnType 和 Parameters 用来提取函数信息"
    ]
  },
  {
    id: "discriminated-unions",
    title: "Discriminated Union 可辨识联合",
    difficulty: "进阶",
    minutes: 30,
    goal: "用统一的状态字段建模复杂 UI 和业务状态。",
    concept: [
      "可辨识联合通常有一个共同字段，比如 status、type、kind。",
      "每个分支根据这个字段携带不同数据。",
      "switch 搭配 never 可以检查是否漏处理状态。"
    ],
    jsThinking:
      "JS 状态对象常常混着 data、error、loading，字段是否存在要靠约定。",
    tsThinking:
      "TS 可以让每种状态拥有独立形状，只有对应分支才能访问对应数据。",
    example: `type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function getMessage(state: LoadState<string[]>) {
  switch (state.status) {
    case "success":
      return state.data.join(", ");
    case "error":
      return state.message;
    default:
      return "等待中";
  }
}`,
    exercise: {
      prompt: "把表单状态建模为 discriminated union，并在成功分支读取 userId。",
      starter: `type SubmitState = unknown;

function getSubmitText(state: SubmitState) {
  if (state.status === "success") {
    return state.userId;
  }

  return state.status;
}`,
      answer: `type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; userId: number }
  | { status: "error"; message: string };

function getSubmitText(state: SubmitState) {
  if (state.status === "success") {
    return String(state.userId);
  }

  return state.status;
}`,
      explanation:
        "status 是共同辨识字段。判断 status === \"success\" 后，TS 知道这个分支一定有 userId。"
    },
    debugCase: {
      title: "不要把所有字段都做成可选",
      broken: `type RequestState = {
  status: "loading" | "success" | "error";
  data?: string[];
  message?: string;
};

function render(state: RequestState) {
  if (state.status === "success") {
    return state.data.join(", ");
  }
}`,
      fixed: `type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function render(state: RequestState) {
  if (state.status === "success") {
    return state.data.join(", ");
  }

  return "";
}`,
      reason:
        "把 data 和 message 都设成可选会让 TS 认为 success 时 data 仍可能不存在。分支对象能表达更准确的状态关系。"
    },
    checklist: [
      "能设计共同辨识字段",
      "能在分支中访问对应数据",
      "知道可选字段不等于状态建模"
    ]
  },
  {
    id: "react-events-forms",
    title: "React 事件和表单类型",
    difficulty: "常用",
    minutes: 30,
    goal: "掌握 input、form、select、textarea 的常见事件类型。",
    concept: [
      "input onChange 常用 React.ChangeEvent<HTMLInputElement>。",
      "form onSubmit 常用 React.FormEvent<HTMLFormElement>。",
      "不同元素要写不同的 HTMLElement 类型，比如 HTMLSelectElement、HTMLTextAreaElement。"
    ],
    jsThinking:
      "JS 里 event.target.value 能跑就行，但 target 到底是什么元素不明确。",
    tsThinking:
      "TS 里事件类型会告诉你 target/currentTarget 上有哪些安全可用的属性。",
    example: `function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}

function handleRoleChange(event: React.ChangeEvent<HTMLSelectElement>) {
  console.log(event.target.value);
}`,
    exercise: {
      prompt: "给表单提交和 textarea 输入事件补类型。",
      starter: `function handleSubmit(event) {
  event.preventDefault();
}

function handleBioChange(event) {
  return event.target.value.trim();
}`,
      answer: `function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function handleBioChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
  return event.target.value.trim();
}`,
      explanation:
        "表单提交事件对应 HTMLFormElement。textarea 的输入变化对应 HTMLTextAreaElement，这样 target.value 就是安全的 string。"
    },
    debugCase: {
      title: "select 事件不要写成 input 元素",
      broken: `function handleRoleChange(event: React.ChangeEvent<HTMLInputElement>) {
  return event.target.value;
}`,
      fixed: `function handleRoleChange(event: React.ChangeEvent<HTMLSelectElement>) {
  return event.target.value;
}`,
      reason:
        "select 和 input 是不同 DOM 元素。虽然都有 value，但事件类型应匹配实际元素，后续访问 selectedOptions 等属性时才准确。"
    },
    checklist: [
      "能写 input change 事件类型",
      "能写 form submit 事件类型",
      "能区分 input、select、textarea 的元素类型"
    ]
  },
  {
    id: "typed-config-objects",
    title: "类型安全的配置对象",
    difficulty: "进阶",
    minutes: 30,
    goal: "组合 as const、keyof typeof、Record、satisfies 写出安全配置表。",
    concept: [
      "配置对象通常既是运行时数据，也是类型来源。",
      "keyof typeof config 可以从对象 key 生成 union。",
      "satisfies 可以校验配置结构，同时保留字面量类型。"
    ],
    jsThinking:
      "JS 配置表写起来方便，但 key 写错或漏配置不容易提前发现。",
    tsThinking:
      "TS 可以让配置对象成为单一事实来源，既驱动页面，也生成类型约束。",
    example: `const tabConfig = {
  home: { label: "首页", path: "/" },
  settings: { label: "设置", path: "/settings" },
  profile: { label: "个人中心", path: "/profile" }
} as const;

type TabId = keyof typeof tabConfig;`,
    exercise: {
      prompt: "用 satisfies 校验每个 tab 都有 label 和 path，并推导 TabId。",
      starter: `const tabs = {
  home: { label: "首页", path: "/" },
  settings: { label: "设置", path: "/settings" }
};

type TabId = string;`,
      answer: `const tabs = {
  home: { label: "首页", path: "/" },
  settings: { label: "设置", path: "/settings" }
} satisfies Record<string, { label: string; path: string }>;

type TabId = keyof typeof tabs;`,
      explanation:
        "satisfies 会检查每个配置项都有 label 和 path。keyof typeof tabs 会得到 \"home\" | \"settings\"。"
    },
    debugCase: {
      title: "只写 Record<string, ...> 会丢失具体 key",
      broken: `const routes: Record<string, { path: string }> = {
  home: { path: "/" },
  settings: { path: "/settings" }
};

type RouteId = keyof typeof routes;`,
      fixed: `const routes = {
  home: { path: "/" },
  settings: { path: "/settings" }
} satisfies Record<string, { path: string }>;

type RouteId = keyof typeof routes;`,
      reason:
        "显式标成 Record<string, ...> 后，keyof 只会得到 string。用 satisfies 可以校验 value 结构，同时保留具体 key。"
    },
    checklist: [
      "能用 keyof typeof 从对象生成 key union",
      "能用 satisfies 校验配置项结构",
      "知道什么时候避免把对象直接标成 Record<string, ...>"
    ]
  },
  {
    id: "api-error-modeling",
    title: "API 与错误响应建模",
    difficulty: "进阶",
    minutes: 35,
    goal: "用泛型和 discriminated union 同时建模成功响应和失败响应。",
    concept: [
      "真实接口通常有成功和失败两种结构。",
      "ApiResult<T> 可以让成功分支携带 T，失败分支携带错误信息。",
      "调用方判断 ok 后，TS 会自动收窄到成功或失败分支。"
    ],
    jsThinking:
      "JS 里常常假设接口成功，然后在运行时遇到 error 才补判断。",
    tsThinking:
      "TS 可以把成功和失败都写进类型里，逼迫调用方处理两种结果。",
    example: `type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

type User = {
  id: number;
  name: string;
};

function renderUser(result: ApiResult<User>) {
  if (result.ok) {
    return result.data.name;
  }

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
  },
  {
    id: "template-literal-types",
    title: "模板字面量类型",
    difficulty: "进阶",
    minutes: 30,
    goal: "用字符串拼接能力在类型层面生成更精确的字符串 union。",
    concept: [
      "模板字面量类型使用和 JS 模板字符串类似的语法，但它发生在类型层面。",
      "它可以把多个字符串 union 组合成新的字符串 union。",
      "常见用途包括事件名、路由名、CSS token、对象字段派生命名。"
    ],
    jsThinking:
      "JS 里可以运行时拼接字符串，但拼错事件名或 key 通常要运行后才发现。",
    tsThinking:
      "TS 可以在类型层面拼接字符串，让合法字符串集合提前变成可检查的类型。",
    example: `type Field = "name" | "email";
type EventName = \`\${Field}Changed\`;

const event: EventName = "nameChanged";

type Size = "sm" | "md" | "lg";
type ButtonClass = \`button-\${Size}\`;`,
    exercise: {
      prompt: "用模板字面量类型生成 route:home、route:settings、route:profile。",
      starter: `type Page = "home" | "settings" | "profile";

type RouteEvent = string;`,
      answer: `type Page = "home" | "settings" | "profile";

type RouteEvent = \`route:\${Page}\`;`,
      explanation:
        "模板字面量类型会把 Page 的每个成员放进字符串模板里，得到 \"route:home\" | \"route:settings\" | \"route:profile\"。"
    },
    debugCase: {
      title: "模板字面量类型只能拼接可转换成字符串的类型",
      broken: `type User = {
  id: number;
};

type UserEvent = \`\${User}Changed\`;`,
      fixed: `type Field = "id" | "name";

type UserEvent = \`\${Field}Changed\`;`,
      reason:
        "模板字面量类型适合拼接 string、number、boolean、bigint、null、undefined 等字面量类型，不适合直接拼接对象类型。"
    },
    checklist: [
      "能读懂 `prefix:${Union}` 这种类型写法",
      "能用模板字面量类型生成字符串 union",
      "知道它是类型层面的字符串组合"
    ]
  },
  {
    id: "key-remapping",
    title: "Key remapping 键名重映射",
    difficulty: "进阶",
    minutes: 35,
    goal: "在映射类型中用 as 改写对象 key，生成新对象类型。",
    concept: [
      "键名重映射写在 mapped type 的 as 后面。",
      "它常和模板字面量类型、Capitalize、Exclude 一起使用。",
      "可以把字段变成 getX 方法，也可以过滤掉不需要的字段。"
    ],
    jsThinking:
      "JS 里可以遍历对象生成一组新 key。",
    tsThinking:
      "TS 可以在类型层面遍历对象 key，并把 key 改造成新的命名规则。",
    example: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type User = {
  name: string;
  age: number;
};

type UserGetters = Getters<User>;`,
    exercise: {
      prompt: "把对象字段生成 onXChange 回调 props。",
      starter: `type ChangeHandlers<T> = unknown;

type Form = {
  name: string;
  age: number;
};`,
      answer: `type ChangeHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}Change\`]: (value: T[K]) => void;
};

type Form = {
  name: string;
  age: number;
};`,
      explanation:
        "K 遍历原字段，as 后面生成新的 key。T[K] 让每个回调的 value 类型仍然对应原字段。"
    },
    debugCase: {
      title: "Capitalize 需要字符串类型",
      broken: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<K>}\`]: () => T[K];
};`,
      fixed: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};`,
      reason:
        "keyof T 可能包含 string、number、symbol。Capitalize 只能处理 string，所以常用 string & K 把 key 限制到字符串部分。"
    },
    checklist: [
      "能读懂 [K in keyof T as NewKey]",
      "能用模板字面量生成新 key",
      "知道 string & K 的作用"
    ]
  },
  {
    id: "recursive-types",
    title: "递归类型",
    difficulty: "进阶",
    minutes: 30,
    goal: "描述树、菜单、评论、多层 JSON 这类自引用数据结构。",
    concept: [
      "递归类型是在类型定义里引用自己。",
      "它适合描述树结构、嵌套导航、文件目录、评论回复等数据。",
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
  children?: TreeNode[];
};

const menu: TreeNode = {
  id: "docs",
  label: "文档",
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
  },
  {
    id: "deep-utility-types",
    title: "深度工具类型",
    difficulty: "进阶",
    minutes: 35,
    goal: "写出 DeepPartial、DeepReadonly 这类递归转换对象的类型。",
    concept: [
      "浅层 Partial 只影响第一层字段，深度工具类型会递归处理嵌套对象。",
      "递归工具类型通常用条件类型判断是否继续深入。",
      "数组和函数要谨慎处理，不同项目会有不同取舍。"
    ],
    jsThinking:
      "JS 里深层配置对象经常只改其中一小块。",
    tsThinking:
      "TS 可以让嵌套对象的每一层都变成可选或只读，贴近真实更新场景。",
    example: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Settings = {
  user: {
    profile: {
      name: string;
    };
  };
};

type SettingsPatch = DeepPartial<Settings>;`,
    exercise: {
      prompt: "写一个 DeepReadonly<T>，让嵌套对象字段也 readonly。",
      starter: `type DeepReadonly<T> = unknown;

type Config = {
  theme: {
    mode: "light" | "dark";
  };
};`,
      answer: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Config = {
  theme: {
    mode: "light" | "dark";
  };
};`,
      explanation:
        "先给当前层每个字段加 readonly。如果字段值还是 object，就递归应用 DeepReadonly。"
    },
    debugCase: {
      title: "Partial 只会影响第一层",
      broken: `type Settings = {
  profile: {
    name: string;
    email: string;
  };
};

type Patch = Partial<Settings>;

const patch: Patch = {
  profile: {
    name: "Ada"
  }
};`,
      fixed: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Settings = {
  profile: {
    name: string;
    email: string;
  };
};

type Patch = DeepPartial<Settings>;

const patch: Patch = {
  profile: {
    name: "Ada"
  }
};`,
      reason:
        "Partial<Settings> 只让 profile 可选，但一旦提供 profile，它里面的 name 和 email 仍按原类型要求。DeepPartial 会继续处理嵌套字段。"
    },
    checklist: [
      "知道浅层工具类型和深度工具类型的区别",
      "能用条件类型控制是否递归",
      "能写出简化版 DeepPartial 或 DeepReadonly"
    ]
  },
  {
    id: "function-overloads",
    title: "函数重载 overload",
    difficulty: "进阶",
    minutes: 30,
    goal: "让一个函数根据不同参数形式返回不同的精确类型。",
    concept: [
      "函数重载由多个重载签名和一个实现签名组成。",
      "调用方只能看到重载签名，函数体使用实现签名。",
      "当返回类型取决于参数组合时，重载比宽泛 union 更清晰。"
    ],
    jsThinking:
      "JS 里一个函数可以接 string 或 number，然后运行时判断。",
    tsThinking:
      "TS 可以把不同调用方式分别声明出来，让返回值类型跟着参数变化。"
    ,
    example: `function parseValue(value: string): string[];
function parseValue(value: number): number;
function parseValue(value: string | number) {
  if (typeof value === "string") {
    return value.split(",");
  }

  return value * 2;
}

const tags = parseValue("a,b");
const count = parseValue(2);`,
    exercise: {
      prompt: "给 formatInput 添加重载：string 返回 string，number 返回 number。",
      starter: `function formatInput(value: string | number) {
  if (typeof value === "string") {
    return value.trim();
  }

  return Number(value.toFixed(2));
}`,
      answer: `function formatInput(value: string): string;
function formatInput(value: number): number;
function formatInput(value: string | number) {
  if (typeof value === "string") {
    return value.trim();
  }

  return Number(value.toFixed(2));
}`,
      explanation:
        "toFixed 会返回 string。如果题目要求 number 分支仍返回 number，就要用 Number(...) 转回数字。重载让调用方能得到精确返回值。"
    },
    debugCase: {
      title: "实现签名要覆盖所有重载参数",
      broken: `function read(value: string): string;
function read(value: number): number;
function read(value: string) {
  return value;
}`,
      fixed: `function read(value: string): string;
function read(value: number): number;
function read(value: string | number) {
  return value;
}`,
      reason:
        "实现签名必须能接住所有重载签名的参数。既然有 number 重载，实现参数就不能只写 string。"
    },
    checklist: [
      "知道重载签名和实现签名的区别",
      "能为不同参数声明不同返回类型",
      "知道实现签名必须覆盖所有重载"
    ]
  },
  {
    id: "typed-event-bus",
    title: "类型安全事件总线",
    difficulty: "进阶",
    minutes: 35,
    goal: "用映射类型约束事件名和 payload 的对应关系。",
    concept: [
      "事件总线的核心类型是 EventMap：事件名对应 payload。",
      "emit/on 的事件名用 keyof EventMap 限制。",
      "payload 类型用 EventMap[K] 根据事件名精确推导。"
    ],
    jsThinking:
      "JS 事件名通常是字符串，payload 传错形状要到监听器里才发现。",
    tsThinking:
      "TS 可以让每个事件名绑定自己的 payload 类型，emit 和 on 两边同时受保护。",
    example: `type Events = {
  login: { userId: string };
  logout: undefined;
};

function emit<K extends keyof Events>(event: K, payload: Events[K]) {
  console.log(event, payload);
}

emit("login", { userId: "u1" });`,
    exercise: {
      prompt: "给 on 函数补类型，让 handler 的 payload 跟事件名匹配。",
      starter: `type Events = {
  saved: { id: number };
  failed: { message: string };
};

function on(event, handler) {
  console.log(event, handler);
}`,
      answer: `type Events = {
  saved: { id: number };
  failed: { message: string };
};

function on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
  console.log(event, handler);
}`,
      explanation:
        "K 是具体事件名，Events[K] 会取出这个事件对应的 payload 类型。选择 saved 时 payload 就是 { id: number }。"
    },
    debugCase: {
      title: "事件名和 payload 不能各自独立",
      broken: `type Events = {
  saved: { id: number };
  failed: { message: string };
};

function emit(event: keyof Events, payload: Events[keyof Events]) {
  console.log(event, payload);
}`,
      fixed: `type Events = {
  saved: { id: number };
  failed: { message: string };
};

function emit<K extends keyof Events>(event: K, payload: Events[K]) {
  console.log(event, payload);
}`,
      reason:
        "Events[keyof Events] 会把所有 payload 混成 union，失去事件名和 payload 的对应关系。用 K 把两者绑定起来。"
    },
    checklist: [
      "能设计 EventMap",
      "能用 keyof 限制事件名",
      "能用 EventMap[K] 绑定 payload"
    ]
  },
  {
    id: "typed-route-params",
    title: "类型安全路由参数",
    difficulty: "进阶",
    minutes: 35,
    goal: "从路径字符串中提取 :id 这类动态参数名。",
    concept: [
      "模板字面量类型可以匹配字符串模式。",
      "infer 可以从路径片段中提取参数名。",
      "递归条件类型可以继续处理剩余路径。"
    ],
    jsThinking:
      "JS 路由参数名通常藏在字符串里，params.id 是否存在靠人记。",
    tsThinking:
      "TS 可以从路径字符串推导 params 对象，让路径和参数类型保持同步。",
    example: `type ExtractParam<Path extends string> =
  Path extends \`:\${infer Param}\` ? Param : never;

type A = ExtractParam<":id">;`,
    exercise: {
      prompt: "写一个提取单段路由参数的类型 ExtractParam。",
      starter: `type ExtractParam<Path extends string> = unknown;

type UserParam = ExtractParam<":userId">;
type StaticParam = ExtractParam<"settings">;`,
      answer: `type ExtractParam<Path extends string> =
  Path extends \`:\${infer Param}\` ? Param : never;

type UserParam = ExtractParam<":userId">;
type StaticParam = ExtractParam<"settings">;`,
      explanation:
        "如果 Path 符合 :xxx，就用 infer Param 提取 xxx；否则没有参数，返回 never。"
    },
    debugCase: {
      title: "没有递归就只能处理一段",
      broken: `type RouteParams<Path extends string> =
  Path extends \`/\${infer Segment}\`
    ? Segment extends \`:\${infer Param}\`
      ? Record<Param, string>
      : {}
    : {};`,
      fixed: `type RouteParams<Path extends string> =
  Path extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? Record<Param, string> & RouteParams<Rest>
    : Path extends \`\${string}:\${infer Param}\`
      ? Record<Param, string>
      : {};

type Params = RouteParams<"/users/:id/posts/:postId">;`,
      reason:
        "多参数路径需要继续分析剩余字符串。递归条件类型可以逐段提取 id、postId 等参数。"
    },
    checklist: [
      "能用模板字面量类型匹配字符串结构",
      "能用 infer 提取路径参数名",
      "知道递归可以处理多段路径"
    ]
  },
  {
    id: "nested-field-paths",
    title: "嵌套字段路径类型",
    difficulty: "进阶",
    minutes: 35,
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
  },
  {
    id: "zod-runtime-validation",
    title: "Zod 与运行时校验",
    difficulty: "进阶",
    minutes: 35,
    goal: "理解 TypeScript 类型和运行时数据校验的边界。",
    concept: [
      "TypeScript 类型编译后会消失，不能校验真实接口数据。",
      "Zod 这类 schema 库可以在运行时检查 unknown 数据。",
      "z.infer 可以从 schema 推导 TypeScript 类型，让校验和类型共用一个来源。"
    ],
    jsThinking:
      "JS 里接口返回什么就直接用，遇到脏数据时才在页面上暴露问题。",
    tsThinking:
      "TS 负责编译期约束，Zod 负责运行时校验，两者配合可以守住接口边界。",
    example: `import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
});

type User = z.infer<typeof UserSchema>;

function parseUser(value: unknown): User {
  return UserSchema.parse(value);
}`,
    exercise: {
      prompt: "用 z.infer 从 ProductSchema 推导 Product 类型。",
      starter: `import { z } from "zod";

const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number()
});

type Product = unknown;`,
      answer: `import { z } from "zod";

const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number()
});

type Product = z.infer<typeof ProductSchema>;`,
      explanation:
        "typeof ProductSchema 拿到 schema 的类型，z.infer 会从 schema 里推导出对应的 TS 类型。"
    },
    debugCase: {
      title: "as User 不等于运行时校验",
      broken: `type User = {
  id: number;
  name: string;
};

function parseUser(value: unknown): User {
  return value as User;
}`,
      fixed: `import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
});

type User = z.infer<typeof UserSchema>;

function parseUser(value: unknown): User {
  return UserSchema.parse(value);
}`,
      reason:
        "as User 只是类型断言，不会检查真实数据。schema.parse 会在运行时验证数据结构，不符合时抛出错误。"
    },
    checklist: [
      "知道 TS 类型不会存在于运行时",
      "知道 schema.parse 会做真实校验",
      "能用 z.infer 从 schema 推导类型"
    ]
  },
  {
    id: "type-tests",
    title: "类型测试入门",
    difficulty: "进阶",
    minutes: 30,
    goal: "用类型断言测试工具类型是否得到预期结果。",
    concept: [
      "类型测试不会运行，它依赖 TypeScript 编译器报错或不报错。",
      "Expect 和 Equal 可以验证两个类型是否相等。",
      "@ts-expect-error 可以确认某行代码应该报错。"
    ],
    jsThinking:
      "JS 测试通常运行函数，检查返回值。",
    tsThinking:
      "TS 工具类型没有运行时值，需要用编译期测试确认推导结果正确。",
    example: `type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type Test = Expect<Equal<"a" | "b", "a" | "b">>;`,
    exercise: {
      prompt: "为 ArrayItem<T> 写一个类型测试。",
      starter: `type ArrayItem<T> = T extends Array<infer Item> ? Item : never;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type TestArrayItem = unknown;`,
      answer: `type ArrayItem<T> = T extends Array<infer Item> ? Item : never;

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type TestArrayItem = Expect<Equal<ArrayItem<string[]>, string>>;`,
      explanation:
        "如果 ArrayItem<string[]> 不是 string，Equal 会得到 false，而 Expect<false> 会触发类型错误。"
    },
    debugCase: {
      title: "@ts-expect-error 必须真的有错误",
      broken: `// @ts-expect-error
const value: string = "hello";`,
      fixed: `// @ts-expect-error
const value: string = 123;`,
      reason:
        "@ts-expect-error 表示下一行应该报错。如果下一行没有错误，TS 会反过来提醒你这条注释失效。"
    },
    checklist: [
      "知道类型测试依赖编译期检查",
      "能读懂 Expect<Equal<A, B>>",
      "知道 @ts-expect-error 的用途"
    ]
  }
];
