import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../../config/api';

const initialState = {
  loading: false,
  username: '',
  password: '',
  userDetails: [],
  token: undefined,
  error: undefined,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (inputs, {rejectWithValue, dispatch}) => {
    const {fname, lname, username, email, password, role, cnumber, status} =
      inputs;
    try {
      const response = await api.post('api/register', {
        fname: fname,
        lname: lname,
        username: username,
        email: email,
        password: password,
        role: role,
        cnumber: cnumber,
        status: status,
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (inputs, {rejectWithValue, dispatch}) => {
    const {username, password} = inputs;
    try {
      const response = await api.post('api/login', {
        username: username,
        password: password,
      });
      if (response.status == 201) {
        AsyncStorage.setItem('username', JSON.stringify(username));
        AsyncStorage.setItem('password', JSON.stringify(password));
      }
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  },
);

export const editProfile = createAsyncThunk(
  'auth/editProfile',
  async (inputs, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.post('api/editProfile', inputs);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername: (state, {payload}) => {
      state.username = payload;
    },
    setPassword: (state, {payload}) => {
      state.password = payload;
    },
    logoutUser: (state, {payload}) => {
      state.username = '';
      state.password = '';
      state.userDetails = [];
      state.token = undefined;
      AsyncStorage.removeItem('user_details');
      AsyncStorage.removeItem('username');
      AsyncStorage.removeItem('password');
    },
  },
  extraReducers: builder => {
    builder.addCase(registerUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, {payload}) => {
      state.loading = false;
      state.userDetails = payload.data.user;
      state.token = payload.data.token;
    });
    builder.addCase(registerUser.rejected, (state, {payload}) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(loginUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, {payload}) => {
      state.loading = false;
      state.userDetails = payload.data.user;
      AsyncStorage.setItem('user_details', JSON.stringify(payload.data.user));
      state.token = payload.data.token;
    });
    builder.addCase(loginUser.rejected, (state, {payload}) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(editProfile.pending, state => {
      state.loading = true;
    });
    builder.addCase(editProfile.fulfilled, (state, {payload}) => {
      state.loading = false;
      AsyncStorage.setItem('user_details', JSON.stringify(payload.data));
      state.userDetails = payload.data;
    });
    builder.addCase(editProfile.rejected, (state, {payload}) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {setUsername, setPassword, logoutUser} = authSlice.actions;

export default authSlice;
