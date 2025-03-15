import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_SANJEEVINI_BACKEND_APP_API_URL;

export const fetchPrescriptionData = createAsyncThunk<
string[], 
  {
    page?: number;
    expiration_date_after?: string;
    expiration_date_before?: string;
    user_id?: number;
  } & { rejectValue: string }, { rejectValue: string }>(
      'sanjeeviniApp/fetchPrescriptionData',
      async (args:any, thunkAPI:any) => {
        try {
          let url = API_URL + 'prescriptionapp/?page=';
          if (args.page) {
            url += args.page;
          }
          if (args.expiration_date_after) {
            url += `&expiration_date_after=${args.expiration_date_after}`;
          }
          if (args.expiration_date_before) {
            url += `&expiration_date_before=${args.expiration_date_before}`;
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
            expiration_date: rawUser.expiration_date,
            issue_date: rawUser.issue_date,
            //appointment_time: new Date(rawUser.appointment_time).toISOString().slice(11, 19),
            doctor_full_name: rawUser.doctor_full_name,
            medication: rawUser.medication,
            dosage: rawUser.dosage,
            frequency : rawUser.frequency,
            refill_info : rawUser.refill_info,
            instructions : rawUser.instructions
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
  issue_date: string;
  expiration_date: string;
  doctor_full_name: string;
  medication: string;
  dosage: string;
  frequency: string;
  refill_info: string;
  instructions: string;
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
        .addCase(fetchPrescriptionData.pending, (state:any) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPrescriptionData.fulfilled, (state:any, action:any) => {
          state.loading = false;
          state.userData.push(...action.payload);
          state.totalPages = action.meta.arg.total_pages;
        })
        .addCase(fetchPrescriptionData.rejected, (state:any, action:any) => {
          state.loading = false;
          state.error = action.error.message || 'Something went wrong';
        });
  },
});
export default userSlice.reducer;
