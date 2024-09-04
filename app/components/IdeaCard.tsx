// app/components/IdeaCard.tsx
import React from 'react';

interface IdeaCardProps {
  idea: {
    id: number;
    title: string;
    description: string;
    votes: number;
  };
  onUpvote: (id: number) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onUpvote }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-black p-4 rounded-xl">
      <h1 className="text-2xl font-bold">{idea.title}</h1>
      <p className="text-sm font-semibold">{idea.description}</p>
      <div className="flex justify-between">
        <p className="text-sm font-normal">
          Offer tailored subscription boxes filled with unique, high-quality products for pets based on their breed, size, age, and preferences. Curate items like toys, treats, grooming supplies, and...
        </p>
        <div >
          <button
            onClick={() => onUpvote(idea.id)}
            className="flex justify-end items-center space-x-1 text-sm font-semibold mt-2 px-4 py-2 rounded"
          >
            <span>▲</span>
            <span>Upvote {idea.votes}</span>
          </button>
        </div>
      </div>
    </div>
    // <div className="idea-card bg-gray-200 p-4 rounded-lg mb-4 shadow">
    //   <h2 className="text-2xl font-semibold">{idea.title}</h2>
    //   <p className="text-gray-700">{idea.description}</p>
    //   <button
    //         onClick = {() => onUpvote(idea.id)}
    // className = "mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    //   >
    //     Upvote
    //   </button>
    //   <p className="mt-1 text-gray-500">Votes: {idea.votes}</p>
    // </div>
  );
};

export default IdeaCard;
