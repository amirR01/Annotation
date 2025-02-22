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

    // Clear existing highlights
    const text = messageRef.current.innerText;
    messageRef.current.innerHTML = text;

    // Sort annotations by start offset to ensure proper highlighting order
    const messageAnnotations = annotations
      .filter(a => a.messageIndex === messageIndex)
      .sort((a, b) => a.startOffset - b.startOffset);

    let lastIndex = 0;
    let newHtml = '';

    messageAnnotations.forEach(annotation => {
      // Add text before the annotation
      newHtml += text.slice(lastIndex, annotation.startOffset);

      // Add the highlighted text
      const highlightClass = annotation.type === 'violation' ? 'bg-red-200' : 'bg-green-200';
      const highlightedText = text.slice(annotation.startOffset, annotation.endOffset);
      newHtml += `<span class="${highlightClass} rounded px-1" title="${annotation.comment}">${highlightedText}</span>`;

      lastIndex = annotation.endOffset;
    });

    // Add any remaining text
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