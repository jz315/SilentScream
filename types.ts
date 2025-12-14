export interface TimelineEvent {
  time: string;
  activity: string;
  mood: string;
  icon: 'clock' | 'book' | 'moon' | 'coffee' | 'alert';
}

export interface StatData {
  name: string;
  value: number;
  fullMark?: number;
}

export enum SentimentType {
  STRESS = 'STRESS',
  EXHAUSTION = 'EXHAUSTION',
  ANXIETY = 'ANXIETY',
  HOPE = 'HOPE'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}