import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  if (inline) {
    return <code className={className}>{children}</code>;
  }

  return (
    <SyntaxHighlighter
      style={atomDark}
      language={language}
      PreTag="div" // Render as a div to avoid extra <pre> tag nesting
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};
