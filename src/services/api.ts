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
      ...rule,
      id: rule._id,
    }));
  },

  create: async (rule: Omit<Rule, 'id'>): Promise<Rule> => {
    const response = await api.post('/rules/', rule);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  update: async (id: string, rule: Partial<Rule>): Promise<Rule> => {
    const response = await api.put(`/rules/${id}`, rule);
    return {
      ...response.data,
      id: response.data._id,
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
      ...annotation,
      id: annotation._id,
      selections: annotation.selections.map((selection: any) => ({
        ...selection,
        messageIndex: selection.message_index,
      })),
    }));
  },

  create: async (annotation: {
    conversation_id: string;
    selections: Selection[];
    annotator: string;
  }): Promise<Annotation> => {
    const response = await api.post('/annotations/', {
      ...annotation,
      selections: annotation.selections.map(selection => ({
        ...selection,
        message_index: selection.messageIndex,
      })),
    });
    return {
      ...response.data,
      id: response.data._id,
      selections: response.data.selections.map((selection: any) => ({
        ...selection,
        messageIndex: selection.message_index,
      })),
    };
  },
};

export const conversationsApi = {
  getAll: async (): Promise<Conversation[]> => {
    const response = await api.get('/conversations/');
    return response.data.map((conversation: any) => ({
      ...conversation,
      id: conversation._id,
    }));
  },

  getById: async (id: string): Promise<Conversation> => {
    const response = await api.get(`/conversations/${id}`);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  create: async (conversation: Omit<Conversation, 'id'>): Promise<Conversation> => {
    const response = await api.post('/conversations/', conversation);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  update: async (id: string, conversation: Partial<Conversation>): Promise<Conversation> => {
    const response = await api.put(`/conversations/${id}`, conversation);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/conversations/${id}`);
  },
};