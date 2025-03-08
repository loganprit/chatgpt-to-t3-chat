import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import type { Conversation, Message } from "./types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update file paths to be relative to project root
const conversationsPath = path.join(
  __dirname,
  "data",
  "conversations.json"
);
const cleanedConversationsPath = path.join(
  __dirname,
  "data",
  "cleaned_conversations.json"
);

const isMessageEmpty = (message: Message): boolean => {
  return !message.text.trim();
};

// Extract messages from mapping tree
const extractMessages = (mapping: any): Message[] => {
  if (!mapping) return [];
  
  return Object.values(mapping)
    .filter((node: any) => node.message && node.message.content)
    .map((node: any) => ({
      uuid: node.message.id,
      text: node.message.content.parts?.join('') || '',
      content: [{
        type: node.message.content.content_type || 'text',
        text: node.message.content.parts?.join('') || ''
      }],
      sender: node.message.author.role,
      created_at: node.message.create_time || new Date().toISOString(),
      updated_at: node.message.update_time || node.message.create_time || new Date().toISOString()
    }))
    .filter(message => !isMessageEmpty(message));
};

// Clean each conversation
const cleanConversation = (conversation: any) => {
  // Skip archived conversations
  if (conversation.is_archived === true) return null;

  const messages = extractMessages(conversation.mapping);
  
  // Skip conversations with no messages
  if (messages.length === 0) return null;

  return {
    uuid: conversation.conversation_id,
    name: conversation.title,
    created_at: new Date(conversation.create_time * 1000).toISOString(),
    updated_at: new Date(conversation.update_time * 1000).toISOString(),
    chat_messages: messages
  };
};

const isValidConversation = (conversation: unknown): conversation is Conversation => {
  return conversation !== null 
    && typeof conversation === 'object'
    && 'uuid' in conversation
    && 'chat_messages' in conversation;
};

try {
  if (!fs.existsSync(conversationsPath)) {
    throw new Error(`Conversations file not found at ${conversationsPath}`);
  }

  const conversations = JSON.parse(fs.readFileSync(conversationsPath, "utf8"));

  // Clean each conversation and filter out null results
  const cleanedConversations = conversations
    .map(cleanConversation)
    .filter(isValidConversation);

  // Write the cleaned data back to the file
  fs.writeFileSync(
    cleanedConversationsPath,
    JSON.stringify(cleanedConversations, null, 2)
  );

  console.log(`Successfully cleaned ${conversations.length} conversations`);
} catch (error) {
  console.error("Error processing conversations:", error instanceof Error ? error.message : error);
  process.exit(1);
}
