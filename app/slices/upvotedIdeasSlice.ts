import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea } from '../types';
interface UpvotedIdeasState {
  upvotedIdeas: Idea[];
  upvotedIdeasIds: string[];
}

const initialState: UpvotedIdeasState = {
  upvotedIdeas: [],
  upvotedIdeasIds: [],
};

const upvotedIdeasSlice = createSlice({
  name: 'upvotedIdeas',
  initialState,
  reducers: {
    setUpvotedIdeas: (state, action: PayloadAction<Idea[]>) => {
      state.upvotedIdeas = action.payload;
    },
    addUpvotedIdea: (state, action: PayloadAction<string>) => {
      state.upvotedIdeasIds.push(action.payload);
    },
    removeUpvotedIdea: (state, action: PayloadAction<string>) => {
      state.upvotedIdeasIds = state.upvotedIdeasIds.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const { setUpvotedIdeas, addUpvotedIdea, removeUpvotedIdea } =
  upvotedIdeasSlice.actions;
export default upvotedIdeasSlice.reducer;
