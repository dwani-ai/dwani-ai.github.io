import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@mui/material/Box';
import {Button, Typography} from '@mui/material';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DataGrid, GridColDef, GridToolbarContainer, useGridApiContext}
  from '@mui/x-data-grid';
import {fetchPrescriptionData} from '../../redux/reducer/user/PrescriptionDataReducer';
import {RootState, AppDispatch} from '../../redux/store';
import dayjs,{ Dayjs } from 'dayjs';

interface Message {
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

const columns: GridColDef<Message>[] = [
  {field: 'id', headerName: 'ID', width: 90},
  {
    field: 'expiration_date',
    headerName: 'Expiration Date',
    width: 150,
    editable: false,
  },
  {
    field: 'issue_date',
    headerName: 'Issue Date',
    width: 150,
    editable: false,
  },
  {
    field: 'doctor_full_name',
    headerName: 'Doctor',
    width: 150,
    editable: false,
  },
  {
    field: 'medication',
    width: 150,
    headerName: 'Medication',
    editable: false,
  },
  {
    field: 'dosage',
    headerName: 'Dosage',
    width: 150,
    editable: false,
  },
  {
    field: 'frequency',
    headerName: 'Frequency',
    width: 150,
    editable: false,
  },
  {
    field: 'refill_info',
    headerName: 'Refill Info',
    width: 150,
    editable: false,
  },
  {
    field: 'instructions',
    headerName: 'Instructions',
    width: 150,
    editable: false,
  },
];

/** render
 * @return {return}
 */
function CustomExportButton() {
  const apiRef = useGridApiContext();

  const handleExport = () => {
    apiRef.current.exportDataAsCsv();
  };

  return (
    <Button onClick={handleExport}>
      Download CSV
    </Button>
  );
}

/** render
 * @return {return}
 */
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <CustomExportButton />
    </GridToolbarContainer>
  );
}

const todayDate = new Date().toISOString().slice(0, 10);
const today = new Date();
const nextSevenDays = new Date(today.getTime() +
  (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);

const Prescriptions: React.FC = () => {
  const [timerows, setTimerows] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState(true); // add loading state

  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const userId = 1;

  const userPrescriptionDataList = useSelector((state: RootState) =>
    state.userPrescriptionDataList.userData);

  //console.log(userPrescriptionDataList);

  useEffect(() => {
    if (loading) {
    dispatch(
      fetchPrescriptionData({
        page: 1,
        expiration_date_after: todayDate,
        expiration_date_before: nextSevenDays,
        user_id: userId,
        rejectValue: 'Failed to fetch Prescription.',
      })
  ).then(() => setLoading(false));
}
}, [dispatch, todayDate, nextSevenDays, userId, loading]);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredData = userPrescriptionDataList.filter((item:any) => {
        const itemDate = dayjs(item.expiration_date);
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });
      setTimerows(filteredData);
    } else {
      setTimerows(userPrescriptionDataList);
    }
  }, [userPrescriptionDataList, startDate, endDate]);

  return (
    <Box sx={{height: '100%'}}>
      <Typography variant="h6" gutterBottom>
        Prescription
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={(newValue) => {
          setStartDate(newValue);
        }}
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={(newValue) => {
          setEndDate(newValue);
        }}
      />
    </LocalizationProvider>
    <DataGrid
        rows={timerows}
        columns={columns}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            csvOptions: {allColumns: true, fileName: 'gridData'},
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default Prescriptions;
