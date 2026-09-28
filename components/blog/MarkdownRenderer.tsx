import React from "react";

const renderInline = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-bold text-gray-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      parts.push(
        <em key={key++} className="italic text-gray-800">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-gray-100 text-red-600 font-mono text-xs"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={key} className="my-4 space-y-2 pl-2 text-gray-700">
        {listItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 leading-relaxed text-sm sm:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  const isTableSep = (line: string) =>
    /^\|?[\s:|\-]+\|?$/.test(line.replace(/\s/g, ""));

  const parseRow = (line: string) =>
    line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  const flushTable = (key: string) => {
    if (!tableRows.length) return;
    const [header, ...body] = tableRows;
    nodes.push(
      <div key={key} className="my-6 overflow-x-auto rounded-xl border border-gray-200 shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          {header && (
            <thead className="bg-gray-100 text-gray-800 font-bold border-b border-gray-200">
              <tr>
                {header.map((col, i) => (
                  <th key={i} className="px-4 py-3">
                    {renderInline(col)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-100 bg-white">
            {body.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-gray-700">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Table rows
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList(`list-before-table-${idx}`);
      if (!isTableSep(trimmed)) {
        tableRows.push(parseRow(trimmed));
      }
      return;
    }
    flushTable(`table-${idx}`);

    // Headings
    if (trimmed.startsWith("# ")) {
      flushList(`list-${idx}`);
      nodes.push(
        <h1 key={idx} className="text-2xl sm:text-3xl font-black text-gray-900 mt-8 mb-4 tracking-tight">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      flushList(`list-${idx}`);
      nodes.push(
        <h2 key={idx} className="text-xl sm:text-2xl font-bold text-gray-900 mt-7 mb-3 tracking-tight border-b border-gray-100 pb-2">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith("### ")) {
      flushList(`list-${idx}`);
      nodes.push(
        <h3 key={idx} className="text-base sm:text-lg font-bold text-gray-800 mt-5 mb-2">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    // Bullet items
    if (/^[-*•]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*•]\s+/, ""));
      return;
    }
    flushList(`list-${idx}`);

    // Paragraph
    if (trimmed) {
      nodes.push(
        <p key={idx} className="my-3 text-sm sm:text-base text-gray-700 leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList("list-end");
  flushTable("table-end");

  return <div className="markdown-content">{nodes}</div>;
}
