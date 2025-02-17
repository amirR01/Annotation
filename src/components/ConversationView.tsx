import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MessageCircle, Link as LinkIcon } from 'lucide-react';
import type { Conversation, Selection, Rule, Annotation } from '../types';
import { MessageBubble } from './MessageBubble';
import { AnnotationSidebar } from './AnnotationSidebar';
import { rulesApi, annotationsApi } from '../services/api';

interface Props {
  conversation: Conversation;
  onAnnotationCreate: (annotation: Selection) => void;
}

export function ConversationView({ conversation, onAnnotationCreate }: Props) {
  const [selectedText, setSelectedText] = useState('');
  const [selection, setSelection] = useState<Omit<Selection, 'ruleId' | 'type' | 'comment'> | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRules();
    loadAnnotations();
  }, [conversation.id]);

  const loadRules = async () => {
    try {
      const fetchedRules = await rulesApi.getAll();
      setRules(fetchedRules);
      setError(null);
    } catch (err) {
      setError('Failed to load rules. Please try again later.');
      console.error('Error loading rules:', err);
    }
  };

  const loadAnnotations = async () => {
    try {
      const fetchedAnnotations = await annotationsApi.getByConversation(conversation.id);
      setAnnotations(fetchedAnnotations);
      setError(null);
    } catch (err) {
      setError('Failed to load annotations. Please try again later.');
      console.error('Error loading annotations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseUp = (messageIndex: number) => {
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.isCollapsed) return;

    const range = windowSelection.getRangeAt(0);
    const text = windowSelection.toString().trim();
    
    if (text) {
      setSelectedText(text);
      setSelection({
        messageIndex,
        startOffset: range.startOffset,
        endOffset: range.endOffset
      });
    }
  };

  const handleAnnotationCreate = async ({ ruleId, type, comment }: {
    ruleId: string;
    type: 'violation' | 'compliance';
    comment: string;
  }) => {
    if (!selection) return;

    const newAnnotation = {
      ...selection,
      ruleId,
      type,
      comment
    };

    await onAnnotationCreate(newAnnotation);
    await loadAnnotations(); // Reload annotations to show the new one
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Flatten all selections from all annotations for easier access
  const allSelections = annotations.flatMap(a => a.selections);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

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
          <div className="mt-2">
            <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 rounded-full">
              {conversation.domain}
            </span>
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

      <div className="space-y-4">
        {conversation.conversation.map((message, index) => (
          <div key={index} onMouseUp={() => handleMouseUp(index)}>
            <MessageBubble
              message={message}
              isFirst={index === 0}
              messageIndex={index}
              annotations={allSelections}
            />
          </div>
        ))}
      </div>

      {selectedText && (
        <AnnotationSidebar
          selectedText={selectedText}
          rules={rules.filter(rule => rule.domain === conversation.domain)}
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