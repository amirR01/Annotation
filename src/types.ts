export interface Message {
  author: string;
  message: string;
  timestamp: string;
}

export interface Conversation {
  _id: {
    $oid: string;
  };
  categories: string[];
  conversation: Message[];
  last_updated: string;
  length: number;
  post_url: string;
  title: string;
}

export interface Selection {
  text: string;
  startOffset: number;
  endOffset: number;
  ruleId: string;
  type: 'violation' | 'compliance';
  comment: string;
}

export interface Annotation {
  conversationId: string;
  selections: Selection[];
  annotator: string;
  timestamp: string;
}

export interface Rule {
  id: string;
  domainId: string;
  name: string;
  description: string;
  category: string;
}