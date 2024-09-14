import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea } from '../types';

interface RecentlyViewedState {
  ideas: Idea[];
}

const initialState: RecentlyViewedState = {
  ideas: [],
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addRecentlyViewed: (state, action: PayloadAction<Idea>) => {
      const existingIndex = state.ideas.findIndex(idea => idea._id === action.payload._id);
      if (existingIndex !== -1) {
        state.ideas.splice(existingIndex, 1);
      }
      state.ideas.unshift(action.payload);
      if (state.ideas.length > 5) {
        state.ideas.pop();
      }
    },
    clearRecentlyViewed: (state) => {
      state.ideas = [];
    },
  },
});

export const { addRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
