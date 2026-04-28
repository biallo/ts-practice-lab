# TS Practice Lab

一个给 JS / React 开发者练 TypeScript 的本地学习项目。它不是文档合集，而是一个可以跑起来的练习界面：

- 每课都有核心讲解
- 每课都有 TypeScript 练习题
- 每课都有错误代码和修正代码
- 可以标记完成并追踪进度
- 刷新或重启后会恢复上次学习位置和代码草稿

## 在线预览

https://biallo.github.io/ts-practice-lab/

## 运行

```bash
npm install
npm run dev
```

## 课程顺序

1. 给变量和函数补类型
2. 对象、type 和 React Props
3. Union 类型和类型收窄
4. React Hooks 的类型
5. unknown、泛型和工具类型
6. interface vs type
7. keyof 和索引访问类型
8. typeof 和 as const
9. 泛型约束 extends
10. 类型保护 type guard
11. API 响应泛型建模
12. satisfies 操作符
13. React children 和组件类型
14. tsconfig 和 strict 模式

## 你可以继续扩展

课程数据在 `src/data/lessons.ts`。想加一课，只要按现有 `Lesson` 结构追加对象即可。
