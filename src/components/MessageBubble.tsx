import React from 'react';
import { format } from 'date-fns';
import type { Message } from '../types';
import clsx from 'clsx';

interface Props {
  message: Message;
  isFirst: boolean;
}

export function MessageBubble({ message, isFirst }: Props) {
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
      <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
    </div>
  );
}