import React, { useState } from 'react';
import { ConversationView } from './components/ConversationView';
import { RulesManagement } from './components/RulesManagement';
import type { Selection, Rule } from './types';

// Example conversation data
const exampleConversation = {
  "_id": {"$oid": "67ab5cbfa0e3c13e75e895b2"},
  "categories": ["ethical", "social"],
  "conversation": [
    {
      "author": "Hesperus07",
      "message": "my culture is very conservative and bigoted. I love the ancient legacy, the art, and the modern art and I have hobbies that I really enjoy related to the culture, but the overall theme culture is just awful. It's kinda religious and shitty and I can't really identify as a one of it. My culture hate me, I'm a sin. I like it but it hate me unfortunately",
      "timestamp": "2025-01-29T19:28:43+00:00"
    },
    {
      "author": "Economy-Spirit5651",
      "message": "Where are you from?? \n\nI am russian and that's extremely triggering. I feel repulsion towards it. I feel embarrassed when sharing my ethnicity. I will not come to russia at least in the nearest future. and i identify as cosmopolitan (citizen of the whole world) :)",
      "timestamp": "2025-01-30T08:02:20+00:00"
    },
    {
      "author": "Hesperus07",
      "message": "China. I'm very embarrassed",
      "timestamp": "2025-01-30T08:15:55+00:00"
    },
    {
      "author": "Economy-Spirit5651",
      "message": "Well at least we can be embarrassed together. My sister lives in Shanghai btw. My first love was a chinese girl so I physically can't think anything bad about your nation lol)))",
      "timestamp": "2025-01-30T08:17:46+00:00"
    }
  ],
  "last_updated": "2025-02-11T14:20:47.330699+00:00",
  "length": 4,
  "post_url": "https://www.reddit.com/r/CPTSD/comments/1id29po/anyone_find_their_own_culture_triggering/",
  "title": "Anyone find their own culture triggering?"
};

// Example rules data
const initialRules: Rule[] = [
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
    domainId: 'privacy',
    name: 'Personal Privacy',
    description: 'Respect personal privacy and avoid sharing sensitive information.',
    category: 'Privacy',
  },
];

function App() {
  const [annotations, setAnnotations] = useState<Selection[]>([]);
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [view, setView] = useState<'conversation' | 'rules'>('conversation');

  const handleAnnotationCreate = (annotation: Selection) => {
    setAnnotations((prev) => [...prev, annotation]);
    console.log('New annotation:', annotation);
  };

  const handleRuleCreate = (rule: Omit<Rule, 'id'>) => {
    const newRule = {
      ...rule,
      id: crypto.randomUUID(),
    };
    setRules((prev) => [...prev, newRule]);
  };

  const handleRuleUpdate = (updatedRule: Rule) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === updatedRule.id ? updatedRule : rule))
    );
  };

  const handleRuleDelete = (ruleId: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setView('conversation')}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  view === 'conversation'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Conversation
              </button>
              <button
                onClick={() => setView('rules')}
                className={`ml-8 inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  view === 'rules'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rules
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {view === 'conversation' ? (
          <ConversationView
            conversation={exampleConversation}
            onAnnotationCreate={handleAnnotationCreate}
          />
        ) : (
          <RulesManagement
            rules={rules}
            onRuleCreate={handleRuleCreate}
            onRuleUpdate={handleRuleUpdate}
            onRuleDelete={handleRuleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default App;