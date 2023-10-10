import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    firstName: '',
    lastName: '',
    username: '',
    userId: '',
    colorId: '',
    avatarId: '',
    avatarSrc: '',
    currentTheme: '',
    isPlayer: false,
    playerId: '',
    hasProfilePic: false,
    profilePic: {},
  },
  reducers: {
    setProfile(state, action) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
    setIsPlayer(state, action) {
      state.isPlayer = action.payload.isPlayer;
    },
    setPlayer(state, action) {
      state.playerId = action.payload.playerId;
      state.isPlayer = action.payload.isPlayer;
    },
    setCurrentTheme(state, action) {
      state.currentTheme = action.payload.currentTheme;
    },
    setColorId(state, action) {
      state.colorId = action.payload.colorId;
    },
    setAvatar(state, action) {
      state.avatarId = action.payload.avatarId;
      state.avatarSrc = action.payload.avatarSrc;
    },
    setProfilePic(state, action) {
      state.hasProfilePic = action.payload.hasProfilePic;
      state.profilePic = { id: action.payload.profilePic.tgId, name: action.payload.profilePic.photoPath };
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
