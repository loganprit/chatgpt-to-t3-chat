import path from "path";
import { fileURLToPath } from 'url';
import { readJsonFile, writeJsonFile, generateTimestamp } from "./helpers/utils.js";
import { threadProcessor } from "./helpers/threadProcessor.js";
import { messageProcessor } from "./helpers/messageProcessor.js";
import type { Conversation, Thread } from "./types/index.ts";
import type { ProcessedMessage } from "./helpers/messageProcessor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const conversationsPath = path.join(__dirname, "data", "cleaned_conversations.json");
  const conversations = readJsonFile(conversationsPath) as Conversation[];

  const t3ChatFormat: { threads: Thread[]; messages: ProcessedMessage[] } = {
    threads: [],
    messages: [],
  };

  conversations.forEach((conversation, index) => {
    const result = threadProcessor.processConversation(
      conversation,
      index,
      t3ChatFormat
    );
    if (result) {
      t3ChatFormat.threads.push(result.thread);
      t3ChatFormat.messages.push(...result.messages);
    }
  });

  t3ChatFormat.threads = threadProcessor.validateThreads(
    t3ChatFormat.threads,
    t3ChatFormat.messages
  );
  t3ChatFormat.messages = messageProcessor.validateMessages(
    t3ChatFormat.messages
  );

  const timestamp = generateTimestamp();
  const outputPath = path.join(__dirname, "data", `t3chat-import-${timestamp}.json`);
  writeJsonFile(outputPath, t3ChatFormat);

  console.log(`Conversion complete! Output saved to ${outputPath}`);
  console.log(
    `Converted ${t3ChatFormat.threads.length} threads and ${t3ChatFormat.messages.length} messages.`
  );
} catch (error) {
  console.error("Error during conversion:", error);
  process.exit(1);
}
