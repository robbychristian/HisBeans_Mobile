import {combineReducers, configureStore} from '@reduxjs/toolkit';

import authSlice from './auth/User';
import menuSlice from './menu/Menu';

export const combinedReducers = combineReducers({
  auth: authSlice.reducer,
  menu: menuSlice.reducer,
});

const rootReducer = (state, action) => {
  return combinedReducers(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
