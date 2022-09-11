import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { request } from './AuthService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ?  typeof user === 'object'  ? user.token ? user : null : null : null ,
  isLoading: false,
  error: '',
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (user, thunkAPI) => {
    try {
      const data = await request('/users/register', 'POST', user);
      return data
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (user, thunkAPI) => {
    try {
      const data = await request('/users/login', 'POST', user);
      return data
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, action) => ({ ...state, user: null})
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(registerUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = ''
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    // login
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
      state.error = ''
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const {logout} = authSlice.actions

export default authSlice.reducer
