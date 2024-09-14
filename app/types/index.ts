import { Types } from 'mongoose';

export interface Idea {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  upvotes: number;
  username: string;
}

// Add other shared types and interfaces here
