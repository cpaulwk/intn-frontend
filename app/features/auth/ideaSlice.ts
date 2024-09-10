import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea } from '../../types';

interface IdeasState {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
}

const initialState: IdeasState = {
  ideas: [],
  loading: false,
  error: null,
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    fetchIdeasStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchIdeasSuccess: (state, action: PayloadAction<Idea[]>) => {
      state.ideas = action.payload;
      state.loading = false;
    },
    fetchIdeasError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    createIdea: (state, action: PayloadAction<Idea>) => {
      state.ideas.push(action.payload);
    },
    updateIdea: (state, action: PayloadAction<Idea>) => {
      state.ideas = state.ideas.map(idea =>
        idea._id === action.payload._id ? action.payload : idea
      );
    },
    deleteIdea: (state, action: PayloadAction<string>) => {
      state.ideas = state.ideas.filter(idea => idea._id !== action.payload);
    },
  },
});

export const {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasError,
  createIdea,
  updateIdea,
  deleteIdea,
} = ideasSlice.actions;

export default ideasSlice.reducer;