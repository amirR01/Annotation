import axios from 'axios';
import type { Rule, Selection, Annotation, Conversation } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const rulesApi = {
  getAll: async (): Promise<Rule[]> => {
    const response = await api.get('/rules/');
    return response.data.map((rule: any) => ({
      id: rule._id,
      domain: rule.domain,
      name: rule.name,
      description: rule.description,
      category: rule.category,
    }));
  },

  create: async (rule: Omit<Rule, 'id'>): Promise<Rule> => {
    const response = await api.post('/rules/', rule);
    return {
      id: response.data._id,
      domain: response.data.domain,
      name: response.data.name,
      description: response.data.description,
      category: response.data.category,
    };
  },

  update: async (id: string, rule: Partial<Rule>): Promise<Rule> => {
    const response = await api.put(`/rules/${id}`, rule);
    return {
      id: response.data._id,
      domain: response.data.domain,
      name: response.data.name,
      description: response.data.description,
      category: response.data.category,
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/rules/${id}`);
  },
};

export const annotationsApi = {
  getByConversation: async (conversationId: string): Promise<Annotation[]> => {
    const response = await api.get('/annotations/', {
      params: { conversation_id: conversationId },
    });
    return response.data.map((annotation: any) => ({
      id: annotation._id,
      conversationId: annotation.conversation_id,
      selections: annotation.selections.map((selection: any) => ({
        messageIndex: selection.message_index,
        startOffset: selection.start_offset,
        endOffset: selection.end_offset,
        ruleId: selection.rule_id,
        type: selection.type,
        comment: selection.comment,
      })),
      annotator: annotation.annotator,
      timestamp: annotation.timestamp,
    }));
  },

  create: async (annotation: {
    conversation_id: string;
    selections: Selection[];
    annotator: string;
  }): Promise<Annotation> => {
    const payload = {
      conversation_id: annotation.conversation_id,
      selections: annotation.selections.map(selection => ({
        message_index: selection.messageIndex,
        start_offset: selection.startOffset,
        end_offset: selection.endOffset,
        rule_id: selection.ruleId,
        type: selection.type,
        comment: selection.comment,
      })),
      annotator: annotation.annotator,
    };

    const response = await api.post('/annotations/', payload);
    return {
      id: response.data._id,
      conversationId: response.data.conversation_id,
      selections: response.data.selections.map((selection: any) => ({
        messageIndex: selection.message_index,
        startOffset: selection.start_offset,
        endOffset: selection.end_offset,
        ruleId: selection.rule_id,
        type: selection.type,
        comment: selection.comment,
      })),
      annotator: response.data.annotator,
      timestamp: response.data.timestamp,
    };
  },
};

export const conversationsApi = {
  getAll: async (): Promise<Conversation[]> => {
    const response = await api.get('/conversations/');
    return response.data.map((conversation: any) => ({
      id: conversation._id,
      title: conversation.title,
      categories: conversation.categories,
      conversation: conversation.conversation.map((msg: any) => ({
        author: msg.author,
        message: msg.message,
        timestamp: msg.timestamp,
      })),
      postUrl: conversation.post_url,
      length: conversation.length,
      lastUpdated: conversation.last_updated,
      domain: conversation.domain,
    }));
  },

  getById: async (id: string): Promise<Conversation> => {
    const response = await api.get(`/conversations/${id}`);
    return {
      id: response.data._id,
      title: response.data.title,
      categories: response.data.categories,
      conversation: response.data.conversation.map((msg: any) => ({
        author: msg.author,
        message: msg.message,
        timestamp: msg.timestamp,
      })),
      postUrl: response.data.post_url,
      length: response.data.length,
      lastUpdated: response.data.last_updated,
      domain: response.data.domain,
    };
  },

  create: async (conversation: Omit<Conversation, 'id'>): Promise<Conversation> => {
    const payload = {
      title: conversation.title,
      categories: conversation.categories,
      conversation: conversation.conversation,
      post_url: conversation.postUrl,
      length: conversation.length,
      last_updated: conversation.lastUpdated,
      domain: conversation.domain,
    };

    const response = await api.post('/conversations/', payload);
    return {
      id: response.data._id,
      title: response.data.title,
      categories: response.data.categories,
      conversation: response.data.conversation.map((msg: any) => ({
        author: msg.author,
        message: msg.message,
        timestamp: msg.timestamp,
      })),
      postUrl: response.data.post_url,
      length: response.data.length,
      lastUpdated: response.data.last_updated,
      domain: response.data.domain,
    };
  },

  update: async (id: string, conversation: Partial<Conversation>): Promise<Conversation> => {
    const payload = {
      ...(conversation.title && { title: conversation.title }),
      ...(conversation.categories && { categories: conversation.categories }),
      ...(conversation.conversation && { conversation: conversation.conversation }),
      ...(conversation.postUrl && { post_url: conversation.postUrl }),
      ...(conversation.length && { length: conversation.length }),
      ...(conversation.lastUpdated && { last_updated: conversation.lastUpdated }),
      ...(conversation.domain && { domain: conversation.domain }),
    };

    const response = await api.put(`/conversations/${id}`, payload);
    return {
      id: response.data._id,
      title: response.data.title,
      categories: response.data.categories,
      conversation: response.data.conversation.map((msg: any) => ({
        author: msg.author,
        message: msg.message,
        timestamp: msg.timestamp,
      })),
      postUrl: response.data.post_url,
      length: response.data.length,
      lastUpdated: response.data.last_updated,
      domain: response.data.domain,
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/conversations/${id}`);
  },
};