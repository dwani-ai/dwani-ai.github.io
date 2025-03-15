import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_SANJEEVINI_BACKEND_APP_API_URL;

export const fetchUserDiabetestData = createAsyncThunk<
string[], 
  {
    page?: number;
    appointment_day_after?: string;
    appointment_day_before?: string;
    user_id?: number;
  } & { rejectValue: string }, { rejectValue: string }>(
      'sanjeeviniApp/fetchUserDiabetestData',
      async (args:any, thunkAPI:any) => {
        try {
          let url = API_URL + 'userdiabetesapp/?page=';
          if (args.page) {
            url += args.page;
          }
          if (args.appointment_day_after) {
            url += `&appointment_day_after=${args.appointment_day_after}`;
          }
          if (args.appointment_day_before) {
            url += `&appointment_day_before=${args.appointment_day_before}`;
          }
          if (args.user_id) {
            url += `&user_id=${args.user_id}`;
          }
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const userData = data.results.map((rawUser: any) => ({
            id: rawUser.id,
            appointment_day: rawUser.appointment_day,
            //appointment_time: new Date(rawUser.appointment_time).toISOString().slice(11, 19),
            doctor_name: rawUser.doctor_name,
            status: rawUser.status,
            observations: rawUser.observations
            // map other properties as needed
          }));
          return userData;
        } catch (error) {
          return thunkAPI.rejectWithValue('Failed to fetch user.');
        }
      }
  );
interface User {
  id: bigint;
  appointment_day: string;
  appointment_time: string;
  doctor_name: string;
  status: string;
  observations: string;
}
interface UserState {
  userData: User[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}
const initialState: UserState = {
  userData: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 0,
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder:any) => {
    builder
        .addCase(fetchUserDiabetestData.pending, (state:any) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserDiabetestData.fulfilled, (state:any, action:any) => {
          state.loading = false;
          state.userData.push(...action.payload);
          state.totalPages = action.meta.arg.total_pages;
        })
        .addCase(fetchUserDiabetestData.rejected, (state:any, action:any) => {
          state.loading = false;
          state.error = action.error.message || 'Something went wrong';
        });
  },
});
export default userSlice.reducer;
