import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/auth/authSlice';
import upvotedIdeasReducer from './features/auth/upvotedIdeasSlice';
import ideasReducer from './features/auth/ideaSlice';

const authPersistConfig = {
  key: 'auth',
  version: 1,
  storage,
};

const upvotedIdeasPersistConfig = {
  key: 'upvotedIdeas',
  version: 1,
  storage,
};

const ideasPersistConfig = {
  key: 'ideas',
  version: 1,
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUpvotedIdeasReducer = persistReducer(upvotedIdeasPersistConfig, upvotedIdeasReducer);;
const persistedIdeasReducer = persistReducer(ideasPersistConfig, ideasReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    upvotedIdeas: persistedUpvotedIdeasReducer,
    ideas: persistedIdeasReducer,
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
