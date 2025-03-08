# ChatGPT to T3 Chat Converter

A utility to convert ChatGPT chat exports to a format compatible with t3.chat's import feature.

## Prerequisites

- Node.js
- npm/yarn
- ChatGPT account with chat history

## Installation

1. Clone this repository
2. Install dependencies:

```bash
pnpm install
```

## Usage

### 1. Export ChatGPT Data

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click on your profile picture > Settings > Data controls > Export data
3. Wait for the email from OpenAI containing your data
4. Download and unzip the data
5. Place the conversations.json file in a `data` directory at the project root

### 2. Convert Your Data

The conversion process happens in two steps:

```bash
# Step 1: Clean and prepare conversations
pnpm run clean

# Step 2: Convert to T3 Chat format
pnpm run convert
```

This will generate a JSON file in the format: `t3chat-import-{timestamp}.json`

### 3. Import to T3 Chat

1. Visit [t3.chat](https://t3.chat)
2. Go to Settings > History & Sync
3. Use the import feature with your generated JSON file

## How It Works

The converter:

1. Removes empty conversations and duplicate messages from network errors
2. Processes threads and messages to match T3 Chat's schema
3. Validates the converted data
4. Outputs a compatible JSON file

## Note

Theo is constantly updating T3 Chat, so this script might not work for very long. Also, the script does not support any attachments.

## Scripts

- `pnpm run clean` - Clean and prepare conversations
- `pnpm run convert` - Convert to T3 Chat format
- `pnpm run typecheck` - Type check the codebase

## PSA

If you'd like to convert your Claude chats to T3 Chat, check out my [repo](https://github.com/loganprit/claude-to-t3-chat)!
