import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type MarkdownMessageProps = {
  message: string;
};

export default function MarkdownMessage({ message }: MarkdownMessageProps) {
  return (
    <div className="prose prose-invert max-w-none text-sm">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="whitespace-pre-wrap leading-relaxed text-sm lg:text-base">
              {children}
            </p>
          ),
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
                  className="bg-gray-800 text-white px-1 py-0.5 rounded"
                  {...rest}
                >
                  {code}
                </code>
              );
            }

            return (
              <div className="relative group my-4">
                <SyntaxHighlighter
                  language={match?.[1] || "text"}
                  style={oneDark}
                  customStyle={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                  wrapLines
                  PreTag="div"
                >
                  {code}
                </SyntaxHighlighter>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <Copy className="w-4 h-4 inline-block mr-1" />
                  Copy
                </button>
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
