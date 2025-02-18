import React from 'react';
import { X, Check, AlertTriangle, Trash2 } from 'lucide-react';
import type { Rule } from '../types';

interface PendingSelection {
  messageIndex: number;
  startOffset: number;
  endOffset: number;
  text: string;
}

interface Props {
  selections: PendingSelection[];
  rules: Rule[];
  onClose: () => void;
  onAnnotate: (annotation: {
    ruleId: string;
    type: 'violation' | 'compliance';
    comment: string;
  }) => void;
  onRemoveSelection: (index: number) => void;
}

export function AnnotationSidebar({ selections, rules, onClose, onAnnotate, onRemoveSelection }: Props) {
  const [selectedRule, setSelectedRule] = React.useState<string>('');
  const [type, setType] = React.useState<'violation' | 'compliance'>('violation');
  const [comment, setComment] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;

    onAnnotate({
      ruleId: selectedRule,
      type,
      comment
    });

    // Reset form
    setSelectedRule('');
    setType('violation');
    setComment('');
  };

  return (
    <div className="fixed right-4 top-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Annotation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selected Text ({selections.length})
          </label>
          <div className="space-y-2">
            {selections.map((selection, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                <div className="flex-grow">
                  <p className="text-sm text-gray-600">{selection.text}</p>
                  <span className="text-xs text-gray-500">Message {selection.messageIndex + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveSelection(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rule
          </label>
          {rules.length === 0 ? (
            <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
              No rules available for this domain. Please add rules first.
            </div>
          ) : (
            <select
              value={selectedRule}
              onChange={(e) => setSelectedRule(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a rule...</option>
              {rules.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {rule.name} ({rule.category})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="violation"
                checked={type === 'violation'}
                onChange={(e) => setType(e.target.value as 'violation')}
                className="text-red-500 focus:ring-red-500"
              />
              <span className="ml-2 flex items-center text-sm text-gray-700">
                <AlertTriangle size={16} className="text-red-500 mr-1" />
                Violation
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="compliance"
                checked={type === 'compliance'}
                onChange={(e) => setType(e.target.value as 'compliance')}
                className="text-green-500 focus:ring-green-500"
              />
              <span className="ml-2 flex items-center text-sm text-gray-700">
                <Check size={16} className="text-green-500 mr-1" />
                Compliance
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            placeholder="Add your comment here..."
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!selectedRule || rules.length === 0 || selections.length === 0}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Annotations ({selections.length})
          </button>
        </div>
      </form>
    </div>
  );
}