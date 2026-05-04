const KEYWORDS = new Set([
  "abstract",
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "declare",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "implements",
  "import",
  "in",
  "infer",
  "instanceof",
  "interface",
  "is",
  "keyof",
  "let",
  "module",
  "namespace",
  "never",
  "new",
  "null",
  "of",
  "private",
  "protected",
  "public",
  "readonly",
  "return",
  "satisfies",
  "set",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield"
]);

const BUILTIN_TYPES = new Set([
  "Array",
  "Awaited",
  "Boolean",
  "Date",
  "Error",
  "Exclude",
  "Extract",
  "HTMLElement",
  "HTMLFormElement",
  "HTMLInputElement",
  "HTMLSelectElement",
  "HTMLTextAreaElement",
  "InstanceType",
  "Map",
  "NonNullable",
  "Number",
  "Omit",
  "Parameters",
  "Partial",
  "Pick",
  "Promise",
  "React",
  "Readonly",
  "Record",
  "Required",
  "ReturnType",
  "Set",
  "String",
  "boolean",
  "number",
  "object",
  "string",
  "symbol",
  "unknown"
]);

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function token(className: string, value: string) {
  return `<span class="syntax-${className}">${escapeHtml(value)}</span>`;
}

function isIdentifierStart(character: string) {
  return /[A-Za-z_$]/.test(character);
}

function isIdentifierPart(character: string) {
  return /[A-Za-z0-9_$]/.test(character);
}

function readQuoted(code: string, start: number) {
  const quote = code[start];
  let index = start + 1;

  while (index < code.length) {
    if (code[index] === "\\") {
      index += 2;
      continue;
    }

    if (code[index] === quote) {
      index += 1;
      break;
    }

    index += 1;
  }

  return index;
}

export function highlightCode(code: string) {
  let html = "";
  let index = 0;

  while (index < code.length) {
    const character = code[index];
    const next = code[index + 1];

    if (character === "/" && next === "/") {
      const end = code.indexOf("\n", index);
      const tokenEnd = end === -1 ? code.length : end;
      html += token("comment", code.slice(index, tokenEnd));
      index = tokenEnd;
      continue;
    }

    if (character === "/" && next === "*") {
      const end = code.indexOf("*/", index + 2);
      const tokenEnd = end === -1 ? code.length : end + 2;
      html += token("comment", code.slice(index, tokenEnd));
      index = tokenEnd;
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      const end = readQuoted(code, index);
      html += token("string", code.slice(index, end));
      index = end;
      continue;
    }

    if (/\d/.test(character)) {
      const match = code.slice(index).match(/^\d(?:[\d_]*(?:\.\d[\d_]*)?)?(?:e[+-]?\d+)?/i);
      const value = match?.[0] ?? character;
      html += token("number", value);
      index += value.length;
      continue;
    }

    if (isIdentifierStart(character)) {
      let end = index + 1;

      while (end < code.length && isIdentifierPart(code[end])) {
        end += 1;
      }

      const value = code.slice(index, end);

      if (KEYWORDS.has(value)) {
        html += token("keyword", value);
      } else if (BUILTIN_TYPES.has(value)) {
        html += token("type", value);
      } else {
        const nextCode = code.slice(end).match(/^\s*([(<])/);
        html += nextCode?.[1] === "(" ? token("function", value) : escapeHtml(value);
      }

      index = end;
      continue;
    }

    if (/[{}[\]().,:;?+\-*/%=!|&<>]/.test(character)) {
      html += token("punctuation", character);
      index += 1;
      continue;
    }

    html += escapeHtml(character);
    index += 1;
  }

  return html;
}
