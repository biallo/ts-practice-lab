type CodeEditorProps = {
  label: string;
  onChange: (value: string) => void;
  tone?: "default" | "danger";
  value: string;
};

export function CodeEditor({ label, onChange, tone = "default", value }: CodeEditorProps) {
  return (
    <label className="editor-wrap">
      <span>{label}</span>
      <textarea
        className={`code-editor ${tone}`}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") {
            return;
          }

          event.preventDefault();

          const target = event.currentTarget;
          const indentation = "  ";
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const nextValue = `${value.slice(0, start)}${indentation}${value.slice(end)}`;

          onChange(nextValue);

          requestAnimationFrame(() => {
            target.selectionStart = start + indentation.length;
            target.selectionEnd = start + indentation.length;
          });
        }}
        spellCheck={false}
        value={value}
      />
    </label>
  );
}
