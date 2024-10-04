import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea } from '../types';
import { RootState } from '../store';

interface IdeasState {
  ideas: Idea[];
  recentlyViewed: string[]; // Array of idea IDs
  recentlyViewedMap: { [key: string]: Idea }; // Hashmap of ideas
  submittedIdeas: Idea[];
  upvotedIdeas: { [key: string]: boolean };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isLoaded: boolean;
}

const initialState: IdeasState = {
  ideas: [],
  recentlyViewed: [],
  recentlyViewedMap: {},
  submittedIdeas: [],
  upvotedIdeas: {},
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
        upvotedIdeas: string[];
      }>
    ) => {
      state.ideas = action.payload.ideas;
      state.submittedIdeas = action.payload.submittedIdeas;
      state.upvotedIdeas = action.payload.upvotedIdeas.reduce(
        (acc, ideaId) => {
          acc[ideaId] = true;
          return acc;
        },
        {} as { [key: string]: boolean }
      );
      // Update recentlyViewed structure
      state.recentlyViewed = action.payload.recentlyViewed.map((idea) =>
        idea._id.toString()
      );
      state.recentlyViewedMap = action.payload.recentlyViewed.reduce(
        (acc, idea) => {
          acc[idea._id.toString()] = idea;
          return acc;
        },
        {} as { [key: string]: Idea }
      );
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
      const { ideaId, isUpvoted } = action.payload;

      // Update the idea in the main ideas array
      const idea = state.ideas.find((i) => i._id.toString() === ideaId);
      if (idea) {
        idea.isUpvoted = isUpvoted;
        idea.upvotes += isUpvoted ? 1 : -1;

        // Update recentlyViewedMap if the idea is in that list
        if (state.recentlyViewedMap[ideaId]) {
          state.recentlyViewedMap[ideaId] = {
            ...state.recentlyViewedMap[ideaId],
            isUpvoted,
            upvotes: idea.upvotes,
          };
        }

        // Update submittedIdeas if the idea is in that list
        const submittedIdea = state.submittedIdeas.find(
          (i) => i._id.toString() === ideaId
        );
        if (submittedIdea) {
          submittedIdea.isUpvoted = isUpvoted;
          submittedIdea.upvotes = idea.upvotes;
        }

        // Update upvotedIdeas
        if (isUpvoted) {
          state.upvotedIdeas[ideaId] = true;
        } else {
          delete state.upvotedIdeas[ideaId];
        }
      }
    },
    addIdea: (state, action: PayloadAction<Idea>) => {
      const newIdea = action.payload;
      const ideaId = newIdea._id.toString();

      // Add to recentlyViewed
      if (!state.recentlyViewedMap[ideaId]) {
        state.recentlyViewed.unshift(ideaId);
        state.recentlyViewedMap[ideaId] = newIdea;

        // Limit the size to 50
        if (state.recentlyViewed.length > 50) {
          const removedId = state.recentlyViewed.pop();
          if (removedId) {
            delete state.recentlyViewedMap[removedId];
          }
        }
      }

      // Add to main ideas array if not already present
      if (!state.ideas.some((idea) => idea._id.toString() === ideaId)) {
        state.ideas.push(newIdea);
      }
    },
    addRecentlyViewed: (state, action: PayloadAction<Idea>) => {
      const ideaId = action.payload._id.toString();

      // Remove the idea from its current position if it exists
      const existingIndex = state.recentlyViewed.indexOf(ideaId);
      if (existingIndex !== -1) {
        state.recentlyViewed.splice(existingIndex, 1);
      }

      // Add the idea to the front of the array
      state.recentlyViewed.unshift(ideaId);

      // Update the hashmap
      state.recentlyViewedMap[ideaId] = action.payload;

      // Limit the size to 50
      if (state.recentlyViewed.length > 50) {
        const removedId = state.recentlyViewed.pop();
        if (removedId) {
          delete state.recentlyViewedMap[removedId];
        }
      }
    },
    removeRecentlyViewed: (state, action: PayloadAction<string>) => {
      const ideaId = action.payload;
      state.recentlyViewed = state.recentlyViewed.filter((id) => id !== ideaId);
      delete state.recentlyViewedMap[ideaId];
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
      state.recentlyViewed = state.recentlyViewed.filter((id) => id !== ideaId);
      delete state.recentlyViewedMap[ideaId];
      delete state.upvotedIdeas[ideaId];
    },
    updateIdea: (state, action: PayloadAction<Idea>) => {
      console.log('action.payload: ', action.payload);
      const index = state.ideas.findIndex(
        (idea) => idea._id.toString() === action.payload._id.toString()
      );
      if (index !== -1) {
        state.ideas[index] = action.payload;
      }
      const submittedIndex = state.submittedIdeas.findIndex(
        (idea) => idea._id.toString() === action.payload._id.toString()
      );
      if (submittedIndex !== -1) {
        state.submittedIdeas[submittedIndex] = action.payload;
      }
    },
    addUpvotedIdea: (state, action: PayloadAction<string>) => {
      state.upvotedIdeas[action.payload] = true;
    },
    removeUpvotedIdea: (state, action: PayloadAction<string>) => {
      delete state.upvotedIdeas[action.payload];
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
  updateIdea,
} = ideasSlice.actions;

// Selectors
export const selectIsIdeaUpvoted = (state: RootState, ideaId: string) =>
  !!state.ideas.upvotedIdeas[ideaId];

export const selectRecentlyViewedIdeas = (state: RootState) =>
  state.ideas.recentlyViewed.map((id) => state.ideas.recentlyViewedMap[id]);

export default ideasSlice.reducer;
