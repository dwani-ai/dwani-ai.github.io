import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {combineReducers} from 'redux';
import UserDataReducer from './reducer/UserDataReducer';
import DoctorDataReducer from './reducer/DoctorDataReducer';
import HeartDataReducer from './reducer/user/HeartDataReducer';
import WeightDataReducer from './reducer/user/WeightDataReducer';
import DiabetesDataReducer from './reducer/user/DiabetesDataReducer';
import MaternityDataReducer from './reducer/user/MaternityDataReducer';
import PrescriptionDataReducer from './reducer/user/PrescriptionDataReducer';
import UserAppointmentDataReducer from './reducer/user/UserAppointmentDataReducer';
import DoctorAppointmentDataReducer from './reducer/doctor/DoctorAppointmentDataReducer';


const reducer = combineReducers({
  userDataList: UserDataReducer, 
  doctorDataList: DoctorDataReducer,
  userHeartDataList: HeartDataReducer,
  userWeightDataList : WeightDataReducer,
  userDiabetesDataList : DiabetesDataReducer,
  userMaternityDataList : MaternityDataReducer,
  userPrescriptionDataList: PrescriptionDataReducer,
  userAppointmentDataList : UserAppointmentDataReducer,
  doctorAppointmentDataList : DoctorAppointmentDataReducer,
});

export const store = configureStore({
  reducer: reducer,
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
