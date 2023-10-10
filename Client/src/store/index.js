import { configureStore } from '@reduxjs/toolkit';

import userSlice from './user-slice';
import gsDataSlice from './gs-data-slice';

const store = configureStore({
  reducer: { gsData: gsDataSlice, user: userSlice },
});

export default store;
