import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@mui/material/Box';
import {Button, Typography} from '@mui/material';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DataGrid, GridColDef, GridToolbarContainer, useGridApiContext}
  from '@mui/x-data-grid';
import {fetchUserDiabetestData} from '../../redux/reducer/user/DiabetesDataReducer';
import {RootState, AppDispatch} from '../../redux/store';
import dayjs,{ Dayjs } from 'dayjs';
import {LineChart} from '@mui/x-charts/LineChart';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';


interface Message {
  id: bigint;
  appointment_day: string;
  appointment_time: string;
  doctor_name: string;
  status: string;
  observations: string;
}

const columns: GridColDef<Message>[] = [
  {field: 'id', headerName: 'ID', width: 90},
  {
    field: 'appointment_day',
    headerName: 'Day',
    width: 150,
    editable: false,
  },
  {
    field: 'appointment_time',
    headerName: 'Time',
    width: 150,
    editable: false,
  },
  {
    field: 'doctor_name',
    headerName: 'Doctor',
    width: 150,
    editable: false,
  },
  {
    field: 'status',
    width: 150,
    headerName: 'Status',
    editable: false,
  },
  {
    field: 'observations',
    headerName: 'Observations',
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

const DiabetesChart: React.FC = () => {
  const [timerows, setTimerows] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState(true); // add loading state
  const [showChart, setShowChart] = useState(true);


  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const userId = 1;

  const userDiabetesDataList = useSelector((state: RootState) =>
    state.userDiabetesDataList.userData);

  //console.log(userDiabetesDataList);

  useEffect(() => {
    if (loading) {
    dispatch(
      fetchUserDiabetestData({
        page: 1,
        appointment_day_after: todayDate,
        appointment_day_before: nextSevenDays,
        user_id: userId,
        rejectValue: 'Failed to fetch Appointment.',
      })
  ).then(() => setLoading(false));
}
}, [dispatch, todayDate, nextSevenDays, userId, loading]);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredData = userDiabetesDataList.filter((item:any) => {
        const itemDate = dayjs(item.appointment_day);
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });
      setTimerows(filteredData);
    } else {
      setTimerows(userDiabetesDataList);
    }
  }, [userDiabetesDataList, startDate, endDate]);

  return (
    <Box sx={{height: '100%'}}>
      <Typography variant="h6" gutterBottom>
        Diabetes Chart
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

      <FormControlLabel
  control={
    <Switch
      checked={showChart}
      onChange={() => setShowChart(!showChart)}
      name="toggleView"
    />
  }
  label={showChart ? "Show Data Grid" : "Show Chart"}
/>
{showChart ? (

      <LineChart
      xAxis={[{data: [1, 2, 3, 5, 8, 10]}]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}
      width={500}
      height={300}
    />
  ) : (
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
    )}

    </Box>
  );
};

export default DiabetesChart;
