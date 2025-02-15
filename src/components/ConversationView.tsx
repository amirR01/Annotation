import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageCircle, Link as LinkIcon } from 'lucide-react';
import type { Conversation, Selection, Rule } from '../types';
import { MessageBubble } from './MessageBubble';
import { AnnotationSidebar } from './AnnotationSidebar';

interface Props {
  conversation: Conversation;
  onAnnotationCreate: (annotation: Selection) => void;
}

// Example rules - in real app, these would come from props or API
const exampleRules: Rule[] = [
  {
    id: '1',
    domainId: 'ethics',
    name: 'Respectful Communication',
    description: 'Communication should be respectful and avoid harmful language.',
    category: 'Communication',
  },
  {
    id: '2',
    domainId: 'ethics',
    name: 'Cultural Sensitivity',
    description: 'Content should be culturally sensitive and avoid stereotypes.',
    category: 'Culture',
  },
  {
    id: '3',
    domainId: 'ethics',
    name: 'Personal Privacy',
    description: 'Respect personal privacy and avoid sharing sensitive information.',
    category: 'Privacy',
  },
];

export function ConversationView({ conversation, onAnnotationCreate }: Props) {
  const [selectedText, setSelectedText] = useState('');
  const [selection, setSelection] = useState<Omit<Selection, 'ruleId' | 'type' | 'comment'> | null>(null);

  const handleMouseUp = () => {
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.isCollapsed) return;

    const range = windowSelection.getRangeAt(0);
    const text = windowSelection.toString().trim();
    
    if (text) {
      setSelectedText(text);
      setSelection({
        text,
        startOffset: range.startOffset,
        endOffset: range.endOffset
      });
    }
  };

  const handleAnnotationCreate = ({ ruleId, type, comment }: {
    ruleId: string;
    type: 'violation' | 'compliance';
    comment: string;
  }) => {
    if (!selection) return;

    onAnnotationCreate({
      ...selection,
      ruleId,
      type,
      comment
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{conversation.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <MessageCircle size={16} />
            <span>{conversation.length} messages</span>
            <span>•</span>
            <span>
              {format(new Date(conversation.last_updated), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            {conversation.categories.map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <a
          href={conversation.post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <LinkIcon size={16} />
          Original Post
        </a>
      </div>

      <div className="space-y-4" onMouseUp={handleMouseUp}>
        {conversation.conversation.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isFirst={index === 0}
          />
        ))}
      </div>

      {selectedText && (
        <AnnotationSidebar
          selectedText={selectedText}
          rules={exampleRules}
          onClose={() => {
            setSelectedText('');
            setSelection(null);
          }}
          onAnnotate={handleAnnotationCreate}
        />
      )}
    </div>
  );
}