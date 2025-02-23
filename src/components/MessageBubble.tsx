import React from 'react';
import { format } from 'date-fns';
import type { Message, Selection } from '../types';
import clsx from 'clsx';

interface Props {
  message: Message;
  isFirst: boolean;
  messageIndex: number;
  annotations: Selection[];
}

export function MessageBubble({ message, isFirst, messageIndex, annotations }: Props) {
  const messageRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (!messageRef.current) return;
  
    const text = message.message;
    let newHtml = '';
    let lastIndex = 0;
  
    // Sort annotations by startOffset
    const messageAnnotations = annotations
      .filter(a => a.messageIndex === messageIndex)
      .sort((a, b) => a.startOffset - b.startOffset);
  
    messageAnnotations.forEach(annotation => {
      newHtml += text.slice(lastIndex, annotation.startOffset);
  
      if (annotation.type === 'violation' && annotation.violationType === 'text') {
        // Highlight existing text violations in red
        const highlightClass = 'bg-red-200';
        const highlightedText = text.slice(annotation.startOffset, annotation.endOffset);
        newHtml += `<span class="${highlightClass} text-black rounded px-1" title="${annotation.comment}">${highlightedText}</span>`;
  
      } else if (annotation.type === 'violation' && annotation.violationType === 'missing' && annotation.replacementSuggestion) {
        // Insert missing text inline without extra spacing and use orange for visibility
        newHtml += `<span class="bg-orange-100 text-black px-1 rounded" title="Missing text: ${annotation.comment}">{${annotation.replacementSuggestion}}</span>`;
      }
  
      lastIndex = annotation.endOffset;
    });
  
    newHtml += text.slice(lastIndex);
    messageRef.current.innerHTML = newHtml;
  }, [messageIndex, annotations]);
  

  return (
    <div className={clsx(
      'p-4 rounded-lg',
      isFirst ? 'bg-indigo-50' : 'bg-gray-50'
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{message.author}</span>
        <span className="text-sm text-gray-500">
          {format(new Date(message.timestamp), 'MMM d, yyyy h:mm a')}
        </span>
      </div>
      <p ref={messageRef} className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
    </div>
  );
}