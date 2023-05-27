import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../../config/api';

const initialState = {
  loading: false,
  menu: [],
  menuInput: undefined,
  featured: [],
  error: undefined,
};

export const getAllFeatured = createAsyncThunk(
  'menu/getAllFeatured',
  async ({rejectWithValue, payload}) => {
    try {
      const response = await api.get('api/getAllFeatured');
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  },
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, {payload}) => {
      state.menu = payload;
    },
    setMenuInput: (state, {payload}) => {
      state.menuInput = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getAllFeatured.pending, state => {
      state.loading = true;
    });
    builder.addCase(getAllFeatured.fulfilled, (state, {payload}) => {
      state.loading = false;
      console.log(payload);
      state.featured = payload;
    });
    builder.addCase(getAllFeatured.rejected, (state, {payload}) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {setMenu} = menuSlice.actions;

export default menuSlice;