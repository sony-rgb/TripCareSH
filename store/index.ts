import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../reducers';

/**
 * Redux Setting
 * 
 * IMPORTANT: We persist 'auth' and 'connectivity' states to AsyncStorage.
 * This allows the app to remember the user's auth token and work offline.
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 100000,
  whitelist: ['auth', 'connectivity'], // Only persist these reducers
  debug: __DEV__, // Enable debug logging in development
};

let middleware = [thunk];
if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(...middleware));
const persistor = persistStore(store);

export {store, persistor}; 