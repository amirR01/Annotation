import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import type { Rule } from '../types';
import { rulesApi } from '../services/api';

interface Props {
  onRuleCreate: (rule: Omit<Rule, 'id'>) => void;
  onRuleUpdate: (rule: Rule) => void;
  onRuleDelete: (ruleId: string) => void;
}

interface EditingRule extends Omit<Rule, 'id'> {
  id?: string;
}

export function RulesManagement({ onRuleCreate, onRuleUpdate, onRuleDelete }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingRule, setEditingRule] = useState<EditingRule | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [domains] = useState(['Education', 'Ethics', 'Privacy', 'Security', 'Content']);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setIsLoading(true);
      const fetchedRules = await rulesApi.getAll();
      setRules(fetchedRules);
      setError(null);
    } catch (err) {
      setError('Failed to load rules. Please try again later.');
      console.error('Error loading rules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    try {
      if (editingRule.id) {
        const updatedRule = await rulesApi.update(editingRule.id, editingRule);
        setRules(prev => prev.map(rule => 
          rule.id === updatedRule.id ? updatedRule : rule
        ));
        onRuleUpdate(updatedRule);
      } else {
        const newRule = await rulesApi.create(editingRule);
        setRules(prev => [...prev, newRule]);
        onRuleCreate(editingRule);
      }

      setEditingRule(null);
      setIsAdding(false);
      setError(null);
    } catch (err) {
      setError('Failed to save rule. Please try again.');
      console.error('Error saving rule:', err);
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      await rulesApi.delete(ruleId);
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
      onRuleDelete(ruleId);
      setError(null);
    } catch (err) {
      setError('Failed to delete rule. Please try again.');
      console.error('Error deleting rule:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Group rules by domain
  const groupedRules = rules.reduce((acc, rule) => {
    if (!acc[rule.domain]) {
      acc[rule.domain] = [];
    }
    acc[rule.domain].push(rule);
    return acc;
  }, {} as Record<string, Rule[]>);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rules Management</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingRule({
              domain: domains[0],
              name: '',
              description: '',
              category: '',
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          disabled={isAdding || !!editingRule}
        >
          <Plus size={20} />
          Add Rule
        </button>
      </div>

      {(isAdding || editingRule) && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            {editingRule?.id ? 'Edit Rule' : 'Add New Rule'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <select
                value={editingRule?.domain}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, domain: e.target.value } : null)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editingRule?.name}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editingRule?.description}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={editingRule?.category}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, category: e.target.value } : null)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingRule(null);
                  setIsAdding(false);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Save size={20} />
                {editingRule?.id ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {domains.map((domain) => {
          const domainRules = groupedRules[domain] || [];
          if (domainRules.length === 0) return null;

          return (
            <div key={domain} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {domain}
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {domainRules.map((rule) => (
                  <div key={rule.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {rule.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {rule.description}
                        </p>
                        <span className="mt-2 inline-block px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full">
                          {rule.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingRule(rule)}
                          className="p-1 text-gray-400 hover:text-gray-500"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}