import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="markdown-body p-6 bg-white rounded-lg shadow-sm border border-gray-100 h-full overflow-y-auto">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Override standard elements for Tailwind styling if needed
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 border-b pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3 mt-6" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 text-gray-800 leading-relaxed" {...props} />,
          code: ({node, inline, className, children, ...props}: any) => {
            return !inline ? (
               <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm my-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-pink-600 font-mono" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;