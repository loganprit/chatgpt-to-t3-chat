export interface Attachment {
  file_name: string;
  file_type: string;
  extracted_content: string;
}

export interface Content {
  type: string;
  text: string;
  citations?: string[];
}

export interface Message {
  uuid: string;
  text: string;
  content: Content[];
  sender: string;
  created_at: string | number;
  updated_at: string | number;
}

export interface Conversation {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  chat_messages: Message[];
}

export interface Thread {
  id: string;
  title: string;
  user_edited_title: boolean;
  status: string;
  model: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}
