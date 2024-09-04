// app/components/IdeaCard.tsx
import React from 'react';
import { Types } from 'mongoose';

interface Idea {
  _id: Types.ObjectId;
  title: string;
  description: string;
  upvotes: number;
}

interface IdeaCardProps {
  idea: Idea;
  onUpvote: (id: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onUpvote }) => {

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-black p-4 rounded-xl mb-4">
      <h1 className="text-2xl font-bold">{idea.title}</h1>
      <p className="text-sm font-semibold mb-2">Description</p>
      <div className="flex justify-between">
        <p className="text-sm font-normal">
        {idea.description}
        </p>
        <div >
          <button
            onClick={() => {
              onUpvote(idea._id.toString());
            }}
            className="flex justify-end items-center space-x-1 text-sm font-semibold mt-2 px-4 py-2 rounded"
          >
            <span>▲</span>
            <span>Upvote {idea.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
