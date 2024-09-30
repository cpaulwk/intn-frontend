import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea } from '../types';

interface IdeasState {
  ideas: Idea[];
  submittedIdeas: Idea[];
  upvotedIdeas: Idea[];
  loading: boolean;
  error: string | null;
}

const initialState: IdeasState = {
  ideas: [],
  submittedIdeas: [],
  upvotedIdeas: [],
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
      state.submittedIdeas.push(action.payload);
    },
    updateIdea: (state, action: PayloadAction<Idea>) => {
      const updateIdeaInArray = (array: Idea[]) => {
        const index = array.findIndex(
          (idea) => idea._id === action.payload._id
        );
        if (index !== -1) {
          array[index] = action.payload;
        }
      };
      updateIdeaInArray(state.ideas);
      updateIdeaInArray(state.submittedIdeas);
      updateIdeaInArray(state.upvotedIdeas);
    },
    deleteIdea: (state, action: PayloadAction<string>) => {
      const removeIdeaFromArray = (array: Idea[]) =>
        array.filter((idea) => idea._id !== action.payload);
      state.ideas = removeIdeaFromArray(state.ideas);
      state.submittedIdeas = removeIdeaFromArray(state.submittedIdeas);
      state.upvotedIdeas = removeIdeaFromArray(state.upvotedIdeas);
    },
    setSubmittedIdeas: (state, action: PayloadAction<Idea[]>) => {
      state.submittedIdeas = action.payload;
    },
    setUpvotedIdeas: (state, action: PayloadAction<Idea[]>) => {
      state.upvotedIdeas = action.payload;
    },
    toggleUpvotedIdea: (
      state,
      action: PayloadAction<{ ideaId: string; isUpvoted: boolean }>
    ) => {
      const { ideaId, isUpvoted } = action.payload;
      const updateUpvoteStatus = (array: Idea[]) => {
        const idea = array.find((i) => i._id === ideaId);
        if (idea) {
          idea.isUpvoted = isUpvoted;
          idea.upvotes += isUpvoted ? 1 : -1;
        }
      };
      updateUpvoteStatus(state.ideas);
      updateUpvoteStatus(state.submittedIdeas);
      updateUpvoteStatus(state.upvotedIdeas);

      if (isUpvoted) {
        const ideaToAdd = state.ideas.find((i) => i._id === ideaId);
        if (ideaToAdd && !state.upvotedIdeas.some((i) => i._id === ideaId)) {
          state.upvotedIdeas.push(ideaToAdd);
        }
      } else {
        state.upvotedIdeas = state.upvotedIdeas.filter((i) => i._id !== ideaId);
      }
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
  setSubmittedIdeas,
  setUpvotedIdeas,
  toggleUpvotedIdea,
} = ideasSlice.actions;

export default ideasSlice.reducer;
