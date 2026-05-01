import type { Lesson } from "./types";

export const reactHooksLesson: Lesson = {
  id: "react-hooks",
  title: "React Hooks 的类型",
  difficulty: "常用",
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
};
