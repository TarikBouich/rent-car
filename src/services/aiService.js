import api from './api';

const aiService = {
  async chat(messages, context) {
    const { data } = await api.post('/ai/chat', { messages, context });
    return data;
  },
};

export default aiService;
