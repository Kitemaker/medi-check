'use client';

import type { UIMessage } from 'ai';
import { isToolUIPart, isTextUIPart } from 'ai';
import ReactMarkdown from 'react-markdown';
import { ToolInvocationCard } from './tool-invocation';
import { MediCheckAvatar } from '@/components/ui/logo';

interface MessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-2'}`}>
        {!isUser && (
          <div className="mb-1 flex items-center gap-2">
            <MediCheckAvatar size={24} />
            <span className="text-xs font-medium text-gray-500">MediCheck</span>
          </div>
        )}

        {message.parts.map((part, i) => {
          if (isTextUIPart(part) && part.text) {
            if (isUser) {
              return (
                <div
                  key={i}
                  className="rounded-2xl rounded-tr-sm bg-teal-600 px-4 py-2.5 text-white"
                >
                  <p className="text-sm leading-relaxed">{part.text}</p>
                </div>
              );
            }

            return (
              <div
                key={i}
                className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-gray-800 shadow-sm ring-1 ring-gray-100"
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 text-sm leading-relaxed last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-2 ml-4 list-disc space-y-1 text-sm last:mb-0">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 ml-4 list-decimal space-y-1 text-sm last:mb-0">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    h1: ({ children }) => (
                      <h1 className="mb-2 text-base font-bold text-gray-900">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-1.5 text-sm font-bold text-gray-900">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-1 text-sm font-semibold text-gray-900">{children}</h3>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">
                        {children}
                      </code>
                    ),
                    hr: () => <hr className="my-2 border-gray-200" />,
                  }}
                >
                  {part.text}
                </ReactMarkdown>
              </div>
            );
          }

          if (isToolUIPart(part)) {
            const toolName = part.type.replace(/^tool-/, '');
            return (
              <ToolInvocationCard
                key={i}
                toolName={toolName}
                part={part}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
