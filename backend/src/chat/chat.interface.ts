export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChat {
  _id?: string;
  userId: string;
  title: string;
  messages: IMessage[];
  isShared: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChatCreate {
  message: string;
  chatId?: string;
}

export interface IChatUpdate {
  title: string;
}

export interface IChatResponse {
  chat: IChat;
  response: string;
}
