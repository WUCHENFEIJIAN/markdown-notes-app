import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownPreviewProps {
  content: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用时静默失败
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-[11px] rounded-md bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-cyan-300 hover:border-cyan-400/30 backdrop-blur-sm transition"
    >
      {copied ? '已复制' : '复制'}
    </button>
  );
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const components = {
    code({ className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const codeText = String(children).replace(/\n$/, '');
      if (match) {
        return (
          <div className="group relative my-6">
            <SyntaxHighlighter
              language={match[1]}
              style={oneDark}
              showLineNumbers
              PreTag="div"
              customStyle={{
                margin: 0,
                borderRadius: '6px',
                fontSize: '13px',
                background: '#0d0d10',
                padding: '14px 16px',
                fontFamily:
                  '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Consolas, monospace',
              }}
              lineNumberStyle={{
                color: 'rgba(255,255,255,0.25)',
                paddingRight: '12px',
                userSelect: 'none',
              }}
            >
              {codeText}
            </SyntaxHighlighter>
            <CopyButton text={codeText} />
          </div>
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    pre({ children }: any) {
      return <>{children}</>;
    },
  };

  return (
    <section className="flex-1 min-w-0 flex flex-col overflow-hidden bg-panel-preview">
      <div className="flex-1 overflow-y-auto">
        <div className="markdown-body max-w-3xl mx-auto px-12 py-10">
          {content.trim() ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={components as any}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-zinc-500">预览区为空，开始在中间编辑器输入内容吧。</p>
          )}
        </div>
      </div>
    </section>
  );
}
