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

export interface Selection {
  messageIndex: number;
  startOffset: number;
  endOffset: number;
  ruleId: string;
  type: 'violation' | 'compliance';
  comment: string;
}

export interface Annotation {
  id: string;
  conversationId: string;
  selections: Selection[];
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