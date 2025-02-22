export interface Message {
  author: string;
  message: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  categories: string[];
  conversation: Message[];
  postUrl: string;
  length: number;
  lastUpdated: string;
  domain: string;
}

export type ViolationType = 'text' | 'missing';

export interface Selection {
  messageIndex: number;
  startOffset: number;
  endOffset: number;
  ruleId: string;
  type: 'violation' | 'compliance';
  violationType?: ViolationType;
  comment: string;
  replacementSuggestion?: string;
}

export interface Annotation {
  id: string;
  conversationId: string;
  selection: Selection;
  annotator: string;
  timestamp: string;
}

export interface Rule {
  id: string;
  domain: string;
  name: string;
  description: string;
  category: string;
}