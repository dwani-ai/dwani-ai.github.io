import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_SANJEEVINI_BACKEND_APP_API_URL;

export const fetchDoctorAppointmentData = createAsyncThunk<
string[], 
  {
    page?: number;
    appointment_day_after?: string;
    appointment_day_before?: string;
    doctor_id?: number;
  } & { rejectValue: string }, { rejectValue: string }>(
      'sanjeeviniApp/fetchDoctorAppointmentData',
      async (args:any, thunkAPI:any) => {
        try {
          let url = API_URL + 'doctorappointment/?page=';
          if (args.page) {
            url += args.page;
          }
          if (args.appointment_day_after) {
            url += `&appointment_day_after=${args.appointment_day_after}`;
          }
          if (args.appointment_day_before) {
            url += `&appointment_day_before=${args.appointment_day_before}`;
          }
          if (args.doctor_id) {
            url += `&doctor_id=${args.doctor_id}`;
          }
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const doctorData = data.results.map((rawDoctor: any) => ({
            id: rawDoctor.id,
            appointment_day: rawDoctor.appointment_day,
            //appointment_time: new Date(rawDoctor.appointment_time).toISOString().slice(11, 19),
            
            patient_name: rawDoctor.patient_name,
            status: rawDoctor.status,
            observations: rawDoctor.observations
            // map other properties as needed
          }));
          return doctorData;
        } catch (error) {
          return thunkAPI.rejectWithValue('Failed to fetch doctor.');
        }
      }
  );
interface Doctor {
  id: bigint;
  appointment_day: string;
  appointment_time: string;
  patient_name: string;
  status: string;
  observations: string;
}
interface DoctorState {
  doctorData: Doctor[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}
const initialState: DoctorState = {
  doctorData: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 0,
};
export const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {},
  extraReducers: (builder:any) => {
    builder
        .addCase(fetchDoctorAppointmentData.pending, (state:any) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchDoctorAppointmentData.fulfilled, (state:any, action:any) => {
          state.loading = false;
          state.doctorData.push(...action.payload);
          state.totalPages = action.meta.arg.total_pages;
        })
        .addCase(fetchDoctorAppointmentData.rejected, (state:any, action:any) => {
          state.loading = false;
          state.error = action.error.message || 'Something went wrong';
        });
  },
});
export default doctorSlice.reducer;
