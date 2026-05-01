import type { Lesson } from "./types";

export const reactEventsFormsLesson: Lesson = {
  id: "react-events-forms",
  title: "React 事件和表单类型",
  difficulty: "常用",
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
};
