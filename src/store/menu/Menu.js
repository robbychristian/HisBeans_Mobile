import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../../config/api';

const initialState = {
  loading: false,
  menu: [],
  orderInput: undefined,
  totalPrice: undefined,
  modeOfPayment: 'Cash',
  referenceNumber: '',
  voucherId: 0,
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
    setOrderInput: (state, {payload}) => {
      state.orderInput = payload.orderInput;
      state.totalPrice = payload.totalPrice;
    },
    setVoucherId: (state, {payload}) => {
      state.voucherId = payload;
    },
    setReferenceNumber: (state, {payload}) => {
      state.referenceNumber = payload;
    },
    clearAllInputs: state => {
      state.orderInput = undefined;
      state.totalPrice = undefined;
      state.voucherId = 0;
    },
    setModeOfPayment: (state, {payload}) => {
      state.modeOfPayment = payload;
    },
    clearTotalPrice: (state, {payload}) => {
      state.totalPrice = 0;
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

export const {
  setMenu,
  setOrderInput,
  setVoucherId,
  setReferenceNumber,
  clearAllInputs,
  setModeOfPayment,
  clearTotalPrice,
} = menuSlice.actions;

export default menuSlice;
