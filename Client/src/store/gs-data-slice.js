import { createSlice } from '@reduxjs/toolkit';

const gsDataSlice = createSlice({
  name: 'gsData',
  initialState: {
    photoRoute: '',
    avatars: [],
    colors: [],
    types: [],
    startParamGameId: '',
    current: {},
    isInit: false,
  },
  reducers: {
    init(state, action) {
      state.photoRoute = action.payload.photoRoute;
      state.avatars = action.payload.avatars.map((avatar) => ({ id: avatar.id, name: avatar.photoPath }));
      state.colors = action.payload.colors;
      state.types = action.payload.types;
      state.startParamGameId = action.payload.startParamGameId;
      state.current = action.payload.current;
      state.isInit = true;
    },
    // setPhotoRoute(state, action) {
    //   state.photoRoute = action.payload.photoRoute;
    // },
    // setAvatars(state, action) {
    //   state.avatars = action.payload.avatars;
    // },
    // setColors(state, action) {
    //   state.colors = action.payload.colors;
    // },
  },
});

export const gsDataActions = gsDataSlice.actions;

export default gsDataSlice.reducer;
