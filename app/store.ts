import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/auth/authSlice';
import upvotedIdeasReducer from './features/auth/upvotedIdeasSlice';

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

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUpvotedIdeasReducer = persistReducer(upvotedIdeasPersistConfig, upvotedIdeasReducer);;

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    upvotedIdeas: persistedUpvotedIdeasReducer,
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
