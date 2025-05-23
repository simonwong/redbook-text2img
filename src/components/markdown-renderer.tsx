'use client';

import Markdown from 'markdown-to-jsx';
import { formatMarkdownContent } from '@/lib/markdown-parser';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const formattedContent = formatMarkdownContent(content);
  
  const options = {
    overrides: {
      h1: {
        props: {
          className: 'text-3xl font-bold mb-4 leading-tight'
        }
      },
      h2: {
        props: {
          className: 'text-2xl font-bold mb-3 leading-tight'
        }
      },
      h3: {
        props: {
          className: 'text-xl font-bold mb-2 leading-tight'
        }
      },
      h4: {
        props: {
          className: 'text-lg font-bold mb-2 leading-tight'
        }
      },
      h5: {
        props: {
          className: 'text-base font-bold mb-2 leading-tight'
        }
      },
      h6: {
        props: {
          className: 'text-sm font-bold mb-2 leading-tight'
        }
      },
      p: {
        props: {
          className: 'mb-4 leading-relaxed'
        }
      },
      strong: {
        props: {
          className: 'font-bold'
        }
      },
      em: {
        props: {
          className: 'italic'
        }
      },
      ul: {
        props: {
          className: 'mb-4 pl-6 space-y-1'
        }
      },
      ol: {
        props: {
          className: 'mb-4 pl-6 space-y-1'
        }
      },
      li: {
        props: {
          className: 'list-disc'
        }
      },
      blockquote: {
        props: {
          className: 'border-l-4 border-gray-300 pl-4 italic my-4'
        }
      },
      code: {
        props: {
          className: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono'
        }
      },
      pre: {
        props: {
          className: 'bg-gray-100 p-4 rounded-lg overflow-x-auto my-4'
        }
      }
    }
  };
  
  return (
    <div className={className}>
      <Markdown options={options}>
        {formattedContent}
      </Markdown>
    </div>
  );
} 