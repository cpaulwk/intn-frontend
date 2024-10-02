import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea } from '../types';

interface IdeasState {
  ideas: Idea[];
  recentlyViewed: Idea[];
  submittedIdeas: Idea[];
  upvotedIdeas: Idea[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isLoaded: boolean;
}

const initialState: IdeasState = {
  ideas: [],
  recentlyViewed: [],
  submittedIdeas: [],
  upvotedIdeas: [],
  status: 'idle',
  error: null,
  isLoaded: false,
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    fetchIdeasStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchIdeasSuccess: (
      state,
      action: PayloadAction<{
        ideas: Idea[];
        recentlyViewed: Idea[];
        submittedIdeas: Idea[];
        upvotedIdeas: Idea[];
      }>
    ) => {
      state.ideas = action.payload.ideas;
      state.recentlyViewed = action.payload.recentlyViewed;
      state.submittedIdeas = action.payload.submittedIdeas;
      state.upvotedIdeas = action.payload.upvotedIdeas;
      state.status = 'succeeded';
      state.isLoaded = true;
    },
    fetchIdeasError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    toggleUpvotedIdea: (
      state,
      action: PayloadAction<{ ideaId: string; isUpvoted: boolean }>
    ) => {
      const ideaId = action.payload.ideaId;
      const isUpvoted = action.payload.isUpvoted;

      // Update the idea in the main ideas array
      const idea = state.ideas.find((i) => i._id.toString() === ideaId);
      if (idea) {
        idea.isUpvoted = isUpvoted;
        idea.upvotes += isUpvoted ? 1 : -1;

        // Update recentlyViewed if the idea is in that list
        const recentlyViewedIdea = state.recentlyViewed.find(
          (i) => i._id.toString() === ideaId
        );
        if (recentlyViewedIdea) {
          recentlyViewedIdea.isUpvoted = isUpvoted;
        }

        // Update submittedIdeas if the idea is in that list
        const submittedIdea = state.submittedIdeas.find(
          (i) => i._id.toString() === ideaId
        );
        if (submittedIdea) {
          submittedIdea.isUpvoted = isUpvoted;
          submittedIdea.upvotes += isUpvoted ? 1 : -1;
        }

        // Update upvotedIdeas
        if (isUpvoted) {
          if (!state.upvotedIdeas.some((i) => i._id.toString() === ideaId)) {
            state.upvotedIdeas.push({ ...idea, isUpvoted: true });
          }
        } else {
          state.upvotedIdeas = state.upvotedIdeas.filter(
            (i) => i._id.toString() !== ideaId
          );
        }
      }
    },
    addIdea: (state, action: PayloadAction<Idea>) => {
      state.recentlyViewed.unshift(action.payload);
    },
    addRecentlyViewed: (state, action: PayloadAction<Idea>) => {
      const existingIndex = state.recentlyViewed.findIndex(
        (idea) => idea._id === action.payload._id
      );
      if (existingIndex !== -1) {
        state.recentlyViewed.splice(existingIndex, 1);
      }
      state.recentlyViewed.unshift(action.payload);
      if (state.recentlyViewed.length > 50) {
        state.recentlyViewed.pop();
      }
    },
    removeRecentlyViewed: (state, action: PayloadAction<string>) => {
      const ideaId = action.payload;
      state.recentlyViewed = state.recentlyViewed.filter(
        (idea) => idea._id.toString() !== ideaId
      );
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    createIdea: (state, action: PayloadAction<Idea>) => {
      state.ideas.push(action.payload);
      state.submittedIdeas.push(action.payload);
    },
    removeIdea: (state, action: PayloadAction<string>) => {
      const ideaId = action.payload;
      state.ideas = state.ideas.filter(
        (idea) => idea._id.toString() !== ideaId
      );
      state.submittedIdeas = state.submittedIdeas.filter(
        (idea) => idea._id.toString() !== ideaId
      );
      state.recentlyViewed = state.recentlyViewed.filter(
        (idea) => idea._id.toString() !== ideaId
      );
      state.upvotedIdeas = state.upvotedIdeas.filter(
        (idea) => idea._id.toString() !== ideaId
      );
    },
  },
});

export const {
  fetchIdeasStart,
  fetchIdeasSuccess,
  fetchIdeasError,
  toggleUpvotedIdea,
  addIdea,
  addRecentlyViewed,
  clearRecentlyViewed,
  createIdea,
  removeRecentlyViewed,
  removeIdea,
} = ideasSlice.actions;

export default ideasSlice.reducer;
