import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea } from '../types';
interface SubmittedIdeasState {
  submittedIdeas: Idea[];
  submittedIdeasIds: string[];
}

const initialState: SubmittedIdeasState = {
  submittedIdeas: [],
  submittedIdeasIds: [],
};

const submittedIdeasSlice = createSlice({
  name: 'submittedIdeas',
  initialState,
  reducers: {
    setSubmittedIdeas: (state, action: PayloadAction<Idea[]>) => {
      state.submittedIdeas = action.payload;
    },
    addSubmittedIdea: (state, action: PayloadAction<string>) => {
      state.submittedIdeasIds.push(action.payload);
    },
    removeSubmittedIdea: (state, action: PayloadAction<string>) => {
      state.submittedIdeasIds = state.submittedIdeasIds.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const { setSubmittedIdeas, addSubmittedIdea, removeSubmittedIdea } =
  submittedIdeasSlice.actions;
export default submittedIdeasSlice.reducer;
