import React from 'react';
import { format } from 'date-fns';
import type { Message, Selection } from '../types';
import clsx from 'clsx';

interface PendingSelection {
  messageIndex: number;
  startOffset: number;
  endOffset: number;
  text: string;
}

interface Props {
  message: Message;
  isFirst: boolean;
  messageIndex: number;
  annotations: Selection[];
  pendingSelections: PendingSelection[];
}

export function MessageBubble({ message, isFirst, messageIndex, annotations, pendingSelections }: Props) {
  const messageRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (!messageRef.current) return;

    // Clear existing highlights
    const text = messageRef.current.innerText;
    messageRef.current.innerHTML = text;

    // Combine existing annotations and pending selections
    const allHighlights = [
      ...annotations.filter(a => a.messageIndex === messageIndex).map(a => ({
        startOffset: a.startOffset,
        endOffset: a.endOffset,
        type: a.type,
        comment: a.comment,
        isPending: false
      })),
      ...pendingSelections.filter(s => s.messageIndex === messageIndex).map(s => ({
        startOffset: s.startOffset,
        endOffset: s.endOffset,
        type: 'pending' as const,
        comment: 'Pending annotation...',
        isPending: true
      }))
    ].sort((a, b) => a.startOffset - b.startOffset);

    let lastIndex = 0;
    let newHtml = '';

    allHighlights.forEach(highlight => {
      // Add text before the highlight
      newHtml += text.slice(lastIndex, highlight.startOffset);

      // Add the highlighted text
      const highlightClass = highlight.isPending
        ? 'bg-yellow-200'
        : highlight.type === 'violation'
        ? 'bg-red-200'
        : 'bg-green-200';
      
      const highlightedText = text.slice(highlight.startOffset, highlight.endOffset);
      newHtml += `<span class="${highlightClass} rounded px-1" title="${highlight.comment}">${highlightedText}</span>`;

      lastIndex = highlight.endOffset;
    });

    // Add any remaining text
    newHtml += text.slice(lastIndex);
    messageRef.current.innerHTML = newHtml;
  }, [messageIndex, annotations, pendingSelections]);

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