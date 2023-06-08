import PropTypes from 'prop-types';
// @mui
import {
  Paper,
  Stack,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormHelperText,
  Card,
  Typography,
} from '@mui/material';
import { DatePicker, CalendarPicker } from '@mui/x-date-pickers';
// hooks
import useResponsive from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

DateRangePicker.propTypes = {
  open: PropTypes.bool,
  isError: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onChangeEndDate: PropTypes.func,
  onChangeStartDate: PropTypes.func,
  variant: PropTypes.oneOf(['input', 'calendar']),
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
};

export default function DateRangePicker({
  title = 'Select date range',
  variant = 'input',
  //
  startDate,
  endDate,
  //
  onChangeStartDate,
  onChangeEndDate,
  //
  open,
  onClose,
  //
  isError,
}) {
  const isDesktop = useResponsive('up', 'md');

  // const isCalendarView = variant === 'calendar';

  return (
    <Stack
      fullWidth
      // maxWidth={isCalendarView ? false : 'xs'}
      open={open}
      onClose={onClose}
      // PaperProps={{
      //   sx: {
      //     ...(isCalendarView && {
      //       maxWidth: 720,
      //     }),
      // },
    >
      <Stack sx={{ py: 2,fontSize:"1.3rem" }}>{title}</Stack>
      <Card sx={{p:2}}>
        <Stack
        // sx={{
        //   ...(isCalendarView &&
        //     isDesktop && {
        //       overflow: 'unset',
        //     }),
        // }}
        >
          <Stack
            spacing={3}
            direction="row"
            justifyContent="center"
            sx={{
              pt: 1,
              '& .MuiCalendarPicker-root': {
                ...(!isDesktop && {
                  width: 'auto',
                }),
              },
            }}
          >
            {/* {isCalendarView ? ( */}
            <>
            <Stack sx={{display:"flex" ,flexDirection:"column"}}>
                <Typography sx={{py:2,pl:1}}>From Date</Typography>
              <Stack
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'solid' }}
              >
                <CalendarPicker date={startDate} onChange={onChangeStartDate} />
              </Stack>
            </Stack>
            <Stack sx={{display:"flex" ,flexDirection:"column"}}>
            <Typography sx={{py:2,pl:1}}>To Date</Typography>

              <Stack
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'solid' }}
              >
                <CalendarPicker date={endDate} onChange={onChangeEndDate} />
              </Stack>
            </Stack>

            </>
          </Stack>

          {isError && (
            <FormHelperText error sx={{ px: 2 }}>
              End date must be later than start date
            </FormHelperText>
          )}
        </Stack>
      </Card>

      {/* <Stack direction="row" justifyContent="end" spacing={3} marginTop={3}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={isError} variant="contained" onClick={onClose}>
          Apply
        </Button>
      </Stack> */}
    </Stack>
  );
}
