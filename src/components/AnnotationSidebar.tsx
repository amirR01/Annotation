import React from 'react';
import { X, Check, AlertTriangle, Plus } from 'lucide-react';
import type { Rule, ViolationType } from '../types';

interface Props {
  selectedText: string;
  messageIndex: number;
  rules: Rule[];
  onClose: () => void;
  onAnnotate: (annotation: {
    ruleId: string;
    type: 'violation' | 'compliance';
    violationType?: ViolationType;
    comment: string;
    replacementSuggestion?: string;
  }) => void;
}

export function AnnotationSidebar({ selectedText, messageIndex, rules, onClose, onAnnotate }: Props) {
  const [selectedRule, setSelectedRule] = React.useState<string>('');
  const [type, setType] = React.useState<'violation' | 'compliance'>('violation');
  const [violationType, setViolationType] = React.useState<ViolationType>(selectedText ? 'text' : 'missing');
  const [comment, setComment] = React.useState('');
  const [replacementSuggestion, setReplacementSuggestion] = React.useState(selectedText);

  // Update violation type when selectedText changes
  React.useEffect(() => {
    if (!selectedText && violationType === 'text') {
      setViolationType('missing');
    }
  }, [selectedText, violationType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;

    onAnnotate({
      ruleId: selectedRule,
      type,
      ...(type === 'violation' && { violationType }),
      comment,
      ...(type === 'violation' && { replacementSuggestion })
    });

    // Reset form
    setSelectedRule('');
    setType('violation');
    setViolationType(selectedText ? 'text' : 'missing');
    setComment('');
    setReplacementSuggestion('');
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
            {selectedText ? 'Selected Text' : 'Insertion Point'} (Message {messageIndex + 1})
          </label>
          <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
            {selectedText || '(Click location for missing text)'}
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

        {type === 'violation' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Violation Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="violationType"
                  value="text"
                  checked={violationType === 'text'}
                  onChange={(e) => setViolationType(e.target.value as ViolationType)}
                  className="text-red-500 focus:ring-red-500"
                  disabled={!selectedText}
                />
                <span className="ml-2 flex items-center text-sm text-gray-700">
                  <AlertTriangle size={16} className="text-red-500 mr-1" />
                  Text Violation
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="violationType"
                  value="missing"
                  checked={violationType === 'missing'}
                  onChange={(e) => setViolationType(e.target.value as ViolationType)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 flex items-center text-sm text-gray-700">
                  <Plus size={16} className="text-orange-500 mr-1" />
                  Missing Text
                </span>
              </label>
            </div>
          </div>
        )}

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

        {type === 'violation' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {violationType === 'text' ? 'Replacement Suggestion' : 'Missing Text Content'}
            </label>
            <textarea
              value={replacementSuggestion}
              onChange={(e) => setReplacementSuggestion(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              placeholder={violationType === 'text' ? "Suggest a replacement text..." : "Enter the missing text that should be here..."}
              required
            />
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={!selectedRule || rules.length === 0}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Annotation
          </button>
        </div>
      </form>
    </div>
  );
}