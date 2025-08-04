import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { copyToClipboard } from "../utils/clipboard";

type MarkdownMessageProps = {
  message: string;
};

export default function MarkdownMessage({ message }: MarkdownMessageProps) {
  return (
    <div className="prose prose-invert max-w-none text-sm">
      <ReactMarkdown
        components={{
          // Enhanced paragraph styling
          p: ({ children }) => (
            <p className="whitespace-pre-wrap leading-relaxed text-sm lg:text-base mb-4 text-gray-100">
              {children}
            </p>
          ),
          // Enhanced headings
          h1: ({ children }) => (
            <h1 className="text-xl lg:text-2xl font-bold text-white mb-4 mt-6 pb-2 border-b border-gradient-to-r from-[#00f5ff]/30 to-[#9d4edd]/30">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg lg:text-xl font-semibold text-[#00f5ff] mb-3 mt-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base lg:text-lg font-semibold text-[#9d4edd] mb-2 mt-4">
              {children}
            </h3>
          ),
          // Enhanced lists
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none space-y-2 mb-4 ml-4 counter-reset-item">
              {children}
            </ol>
          ),
          // Custom list items with gradient bullets
          li: ({ children }) => {
            return (
              <li className="relative pl-6 text-gray-100 leading-relaxed">
                <span className="absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] rounded-full"></span>
                <div>{children}</div>
              </li>
            );
          },
          // Enhanced blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#00f5ff] pl-4 py-2 my-4 bg-gradient-to-r from-white/5 to-white/10 rounded-r-lg italic text-gray-200">
              {children}
            </blockquote>
          ),
          // Enhanced strong/bold text
          strong: ({ children }) => (
            <strong className="font-bold text-white bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 px-1 py-0.5 rounded">
              {children}
            </strong>
          ),
          // Enhanced emphasis/italic
          em: ({ children }) => (
            <em className="italic text-[#40e0d0]">{children}</em>
          ),
          // Enhanced code blocks
          code: (
            props: React.HTMLAttributes<HTMLElement> & { inline?: boolean }
          ) => {
            const { inline, className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const code = Array.isArray(children)
              ? children
                  .map((child) => (typeof child === "string" ? child : ""))
                  .join("")
              : typeof children === "string"
              ? children
              : "";

            if (inline) {
              return (
                <code
                  className="bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 text-white px-2 py-1 rounded border border-[#00f5ff]/30 font-mono text-sm"
                  {...rest}
                >
                  {code}
                </code>
              );
            }

            return (
              <div className="relative group my-6">
                {/* Language label */}
                {match?.[1] && (
                  <div className="absolute top-0 left-4 -translate-y-1/2 z-10">
                    <span className="bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {match[1]}
                    </span>
                  </div>
                )}
                <div className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-lg overflow-hidden border border-white/10">
                  <SyntaxHighlighter
                    language={match?.[1] || "text"}
                    style={oneDark}
                    customStyle={{
                      padding: "1.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      background: "transparent",
                      margin: 0,
                    }}
                    wrapLines
                    PreTag="div"
                  >
                    {code}
                  </SyntaxHighlighter>
                  {/* Enhanced copy button */}
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(code, "Code copied to clipboard!")
                    }
                    className="absolute top-3 right-3 flex items-center space-x-1 px-3 py-1.5 text-xs bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 hover:from-[#00f5ff]/20 hover:to-[#9d4edd]/20 text-white border border-[#00f5ff]/30 hover:border-[#00f5ff]/50 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    title="Copy code to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-medium">Copy</span>
                  </button>
                </div>
              </div>
            );
          },
        }}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
}
