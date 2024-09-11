import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UpvotedIdeasState {
  upvotedIdeas: string[];
}

const initialState: UpvotedIdeasState = {
  upvotedIdeas: [],
};

const upvotedIdeasSlice = createSlice({
  name: 'upvotedIdeas',
  initialState,
  reducers: {
    setUpvotedIdeas: (state, action: PayloadAction<string[]>) => {
      state.upvotedIdeas = action.payload;
    },
    addUpvotedIdea: (state, action: PayloadAction<string>) => {
      state.upvotedIdeas.push(action.payload);
    },
    removeUpvotedIdea: (state, action: PayloadAction<string>) => {
      state.upvotedIdeas = state.upvotedIdeas.filter(id => id !== action.payload);
    },
  },
});

export const { setUpvotedIdeas, addUpvotedIdea, removeUpvotedIdea } = upvotedIdeasSlice.actions;
export default upvotedIdeasSlice.reducer;