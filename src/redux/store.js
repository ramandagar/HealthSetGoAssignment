import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'user', 'isAuthenticated'], 
};

const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
  whitelist: ['items', 'totalItems', 'totalAmount'], 
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  products: productsReducer, // products don't need persistence
  cart: persistReducer(cartPersistConfig, cartReducer),
});

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['products'], 
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store); 