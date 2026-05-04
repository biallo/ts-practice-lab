import { useId, useLayoutEffect, useRef } from "react";
import { highlightCode } from "../utils/highlight";

type CodeEditorProps = {
  label: string;
  onChange: (value: string) => void;
  tone?: "default" | "danger";
  value: string;
};

function getSelectionOffsets(root: HTMLElement) {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);

  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
    return null;
  }

  const startRange = range.cloneRange();
  startRange.selectNodeContents(root);
  startRange.setEnd(range.startContainer, range.startOffset);

  const endRange = range.cloneRange();
  endRange.selectNodeContents(root);
  endRange.setEnd(range.endContainer, range.endOffset);

  return {
    end: endRange.toString().length,
    start: startRange.toString().length
  };
}

function restoreSelection(root: HTMLElement, offset: number) {
  const selection = window.getSelection();

  if (!selection) {
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let current = walker.nextNode();

  while (current) {
    const length = current.textContent?.length ?? 0;

    if (remaining <= length) {
      const range = document.createRange();
      range.setStart(current, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    remaining -= length;
    current = walker.nextNode();
  }

  const range = document.createRange();
  range.selectNodeContents(root);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function getEditorText(root: HTMLElement) {
  return root.textContent ?? "";
}

export function CodeEditor({ label, onChange, tone = "default", value }: CodeEditorProps) {
  const editorId = useId();
  const editorRef = useRef<HTMLDivElement>(null);
  const pendingCaretOffset = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.textContent !== value) {
      editorRef.current.textContent = value;
    }

    if (pendingCaretOffset.current === null) {
      return;
    }

    restoreSelection(editorRef.current, pendingCaretOffset.current);
    pendingCaretOffset.current = null;
  }, [value]);

  const replaceSelectedText = (text: string) => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    const selection = getSelectionOffsets(editor);
    const start = selection?.start ?? value.length;
    const end = selection?.end ?? value.length;
    const nextValue = `${value.slice(0, start)}${text}${value.slice(end)}`;

    pendingCaretOffset.current = start + text.length;
    onChange(nextValue);
  };

  return (
    <div className="editor-wrap">
      <span id={editorId}>{label}</span>
      <div className={`code-editor-frame ${tone}`}>
        <pre aria-hidden="true" className="code-editor-highlight">
          <code dangerouslySetInnerHTML={{ __html: highlightCode(value) }} />
        </pre>
        <div
          aria-labelledby={editorId}
          className="code-editor"
          contentEditable
          onInput={(event) => {
            const nextValue = getEditorText(event.currentTarget);
            pendingCaretOffset.current = getSelectionOffsets(event.currentTarget)?.start ?? nextValue.length;
            onChange(nextValue);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Tab" && event.key !== "Enter") {
              return;
            }

            event.preventDefault();
            replaceSelectedText(event.key === "Tab" ? "  " : "\n");
          }}
          onPaste={(event) => {
            event.preventDefault();
            replaceSelectedText(event.clipboardData.getData("text/plain"));
          }}
          role="textbox"
          spellCheck={false}
          suppressContentEditableWarning
        >
          {value}
        </div>
      </div>
    </div>
  );
}
