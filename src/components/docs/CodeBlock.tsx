"use client";

import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
  title?: string;
};

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string, lang: string): string {
  const l = lang.toLowerCase();
  let html = escapeHtml(code);

  if (l === "text" || l === "txt") {
    return html;
  }

  if (l === "bash" || l === "shell" || l === "sh") {
    // Comments
    html = html.replace(/(^|\n)(#.*)$/gm, (_m, p1, p2) => `${p1}<span class="text-muted-foreground/60 italic">${p2}</span>`);
    // Strings
    html = html.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|`[^`]*?`)/g, '<span class="text-success">$1</span>');
    // Flags --xxx
    html = html.replace(/(--[\w-]+)/g, '<span class="text-info">$1</span>');
    // Commands
    html = html.replace(
      /\b(npm|pnpm|yarn|npx|tsc|node|git)\b/g,
      '<span class="text-primary">$1</span>',
    );
    return html;
  }

  if (l === "json") {
    // Keys: "key":
    html = html.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="text-primary">$1</span>$2');
    // Strings (remaining quoted values)
    html = html.replace(/(:\s*)(&quot;[^&]*?&quot;)/g, '$1<span class="text-success">$2</span>');
    // Booleans / null
    html = html.replace(/:\s*\b(true|false|null)\b/g, ': <span class="text-info">$1</span>');
    // Numbers
    html = html.replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="text-warning">$1</span>');
    return html;
  }

  // TypeScript / JavaScript (default)
  // Comments // and /* */
  html = html.replace(/(\/\/.*)$/gm, '<span class="text-muted-foreground/60 italic">$1</span>');
  html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-muted-foreground/60 italic">$1</span>');
  // Strings: " ", ' ', ` `
  html = html.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|`[^`]*?`)/g, (m) => {
    // Don't re-highlight inside already highlighted comments - simple: if contains muted class, skip? Already done after comments, strings inside comments already wrapped, but okay.
    return `<span class="text-success">${m}</span>`;
  });
  // Keywords
  html = html.replace(
    /\b(import|from|const|let|var|async|await|new|if|else|try|catch|instanceof|return|export|default|class|extends|implements|interface|type|function|for|while|switch|case|break|throw|throws|extends|of|in|as)\b/g,
    '<span class="text-primary">$1</span>',
  );
  // Built-in types / Promise
  html = html.replace(
    /\b(string|number|boolean|void|Promise|Error|DelokError|DelokConfigurationError|DelokNetworkError|DelokTimeoutError|DelokHttpError)\b/g,
    '<span class="text-info">$1</span>',
  );
  // Numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-warning">$1</span>');
  // Properties after dot: .info .warn etc - keep foreground but subtle
  // Level strings like "development" already handled as strings

  return html;
}

export function CodeBlock({ code, language = "bash", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => highlight(code, language), [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-background/50 px-3 py-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {title ?? language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code
          className="text-foreground"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
