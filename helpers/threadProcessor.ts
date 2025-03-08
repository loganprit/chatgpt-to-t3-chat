import { Conversation, Thread } from '../types/index.js';
import { messageProcessor } from "./messageProcessor.js";
import type { ProcessedMessage } from "./messageProcessor.js";

export const threadProcessor = {
  createThread: (conversation: Conversation, index: number): Thread => {
    return {
      title: conversation.name || `Conversation ${index + 1}`,
      id: conversation.uuid,
      user_edited_title: conversation.name ? true : false,
      status: "done",
      model: "gpt-4o",
      created_at: conversation.created_at || new Date().toISOString(),
      updated_at:
        conversation.updated_at ||
        conversation.created_at ||
        new Date().toISOString(),
      last_message_at:
        conversation.updated_at ||
        conversation.created_at ||
        new Date().toISOString(),
    };
  },

  processConversation: (
    conversation: Conversation, 
    index: number,
    t3ChatFormat: { threads: Thread[], messages: ProcessedMessage[] }
  ) => {
    if (!conversation || !conversation.uuid) return null;

    const thread = threadProcessor.createThread(conversation, index);
    const messages = conversation.chat_messages?.map(msg => 
      messageProcessor.createMessage(msg, thread.id)
    ).filter(msg => msg !== null) || [];

    return {
      thread,
      messages
    };
  },

  validateThreads: (threads: Thread[], messages: ProcessedMessage[]): Thread[] => {
    return threads.filter((thread) => {
      return (
        thread &&
        typeof thread === "object" &&
        thread.id &&
        thread.title &&
        messages.some((m) => m.threadId === thread.id)
      );
    });
  }
};
