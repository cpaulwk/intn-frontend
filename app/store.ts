import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import upvotedIdeasReducer from './slices/upvotedIdeasSlice';
import ideasReducer from './slices/ideaSlice';
import sidebarReducer from './slices/sidebarSlice';
import recentlyViewedReducer from './slices/recentlyViewedSlice';

const authPersistConfig = {
  key: 'auth',
  version: 1,
  storage,
};

const recentlyViewedPersistConfig = {
  key: 'recentlyViewed',
  version: 1,
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedRecentlyViewedReducer = persistReducer(
  recentlyViewedPersistConfig,
  recentlyViewedReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    upvotedIdeas: upvotedIdeasReducer,
    ideas: ideasReducer,
    sidebar: sidebarReducer,
    recentlyViewed: persistedRecentlyViewedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
