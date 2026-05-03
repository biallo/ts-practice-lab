type CodeBlockProps = {
  code: string;
  tone?: "default" | "success" | "danger";
};

export function CodeBlock({ code, tone = "default" }: CodeBlockProps) {
  return (
    <pre className={`code-block ${tone}`}>
      <code>{code}</code>
    </pre>
  );
}
