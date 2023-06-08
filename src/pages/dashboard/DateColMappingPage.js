import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  Input,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { format, formatRelative } from 'date-fns';
import { RHFSelect } from '../../components/hook-form';
// routes
import { PATH_APP, PATH_DASHBOARD } from '../../routes/paths';
// utils
import { fTimestamp } from '../../utils/formatTime';
// _mock_
import { _allFiles } from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import ConfirmDialog from '../../components/confirm-dialog';
import { fileFormat } from '../../components/file-thumbnail';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator } from '../../components/table';
import { useDispatch, useSelector } from '../../redux/store';
import {
  getColumnsNames,
  setCurrentEndDate,
  setCurrentStartDate,
  setDateColFormat,
  setDateColName,
} from '../../redux/slices/features';
import DateRangePicker, { useDateRangePicker } from '../../components/date-range-picker';
// sections
import {
  FileListView,
  FileGridView,
  FileFilterType,
  FileFilterName,
  FileFilterButton,
  FileChangeViewButton,
  FileNewFolderDialog,
} from '../../sections/@dashboard/file';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['paid', 'unpaid', 'overdue', 'draft'];

const FILE_TYPE_OPTIONS = [
  'folder',
  'txt',
  'zip',
  'audio',
  'image',
  'video',
  'word',
  'excel',
  'powerpoint',
  'pdf',
  'photoshop',
  'illustrator',
];

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    open: openPicker,
    // onOpen: onOpenPicker,
    // onClose: onClosePicker,
    onReset: onResetPicker,
    isSelected: isSelectedValuePicker,
    isError,
    shortLabel,
  } = useDateRangePicker(null, null);

  const { themeStretch } = useSettingsContext();

  const [view, setView] = useState('list');

  const [filterName, setFilterName] = useState('');

  const [tableData, setTableData] = useState(_allFiles);

  const [filterType, setFilterType] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openUploadFile, setOpenUploadFile] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterType,
    filterStartDate: startDate,
    filterEndDate: endDate,
    isError: !!isError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterType) ||
    (!dataFiltered.length && !!endDate && !!startDate);

  const isFiltered = !!filterName || !!filterType.length || (!!startDate && !!endDate);

  const handleChangeView = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleFilterName = (event) => {
    table.setPage(0);
    setFilterName(event.target.value);
  };
  const feature = useSelector((state) => state.feature);

  const handleChangeStartDate = (newValue) => {
    table.setPage(0);
    const date = new Date(newValue);
    // const value = date.toLocaleDateString();
    onChangeStartDate(newValue);
    const fDate = new Date(date);
    const dFormat = feature.currentSelection.dateColNameFormat;
    const newFormat = dFormat.replace('YYYY', 'yyyy');
    const formatDD = newFormat.replace('DD', 'dd');
    const res = format(fDate, formatDD);
    console.log(res);
    dispatch(setCurrentStartDate(res));
  };

  const handleChangeEndDate = (newValue) => {
    table.setPage(0);
    const date = new Date(newValue);
    onChangeEndDate(newValue);
    const value = date.toLocaleDateString();
    const fDate = new Date(date);
    const dFormat = feature.currentSelection.dateColNameFormat;
    const newFormat = dFormat.replace('YYYY', 'yyyy');
    const formatDD = newFormat.replace('DD', 'dd');
    const res = format(fDate, formatDD);
    console.log(res);
    dispatch(setCurrentEndDate(res));
  };

  const handleFilterType = (type) => {
    const checked = filterType.includes(type)
      ? filterType.filter((value) => value !== type)
      : [...filterType, type];

    table.setPage(0);
    setFilterType(checked);
  };

  const handleDeleteItem = (id) => {
    const { page, setPage, setSelected } = table;
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteItems = (selected) => {
    const { page, rowsPerPage, setPage, setSelected } = table;
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selected.length === dataFiltered.length) {
        setPage(0);
      } else if (selected.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selected.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleClearAll = () => {
    if (onResetPicker) {
      onResetPicker();
    }
    setFilterName('');
    setFilterType([]);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  };

  // ---------------------------------------

  const dispatch = useDispatch();

  const [dateColName, setdateColName] = useState('');
  const [dateColFormat, setdateColFormat] = useState('');

  useEffect(() => {
    dispatch(setDateColName(dateColName));
    dispatch(setDateColFormat(dateColFormat));
    // eslint-disable-next-line
  }, [dateColName, dateColFormat]);
  const handleDateColName = (e) => {
    setdateColName(e.target.value);
  };
  const handleDateColFormat = (e) => {
    setdateColFormat(e.target.value);
  };

  const currData = useSelector((state) => state.feature.currentSelection);
  console.log(currData);
  useEffect(() => {
    dispatch(
      getColumnsNames(currData.currentDsKey, currData.table.tableNames[currData.table.selected])
    );
    // eslint-disable-next-line
  }, []);
  const columnsData = useSelector((state) => state.feature.currentSelection.columnNames);

  return (
    <>
      <Helmet>
        <title> Data Operations | S7</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Data Lineage"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'DB Connection',
              href: PATH_DASHBOARD.root,
            },
            { name: 'XYZ Database' },
          ]}
        />

        <Stack
          spacing={2.5}
          //   direction={{ xs: 'column', md: 'row' }}
          //   alignItems={{ xs: 'flex-end', md: 'center' }}
          //   justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Stack
            spacing={1}
            // direction={{ xs: 'column', md: 'row' }}
            alignItems={{ md: 'center' }}
            sx={{ width: 1 }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'text.primary',
                textAlign: 'left',
                width: '1',
              }}
            >
              Date Column Mapping
            </Typography>
            <Stack spacing={1}>
              <Card>
                <Stack direction="column" justifyContent="center" alignItems="center" padding={2}>
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="space-between"
                    margin={2}
                  >
                    <Typography
                      variant="subtitle1"
                      xs={{ color: 'text.secondary', paddingLeft: '10px' }}
                    >
                      Select the date columns and select the format for the date used in your data
                      set
                    </Typography>
                    <Stack direction="column" margin={5} spacing={5}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={3}
                      >
                        <Stack justifyContent="start" fullWidth>
                          <Typography variant="subtitle2">CI Database</Typography>
                        </Stack>
                        <Stack justifyContent="flex-start" fullWidth>
                          <Typography variant="subtitle2">CI Database</Typography>
                        </Stack>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={3}>
                        <TextField id="date-column" value="Date Column" fullWidth />
                        <Stack justifyContent="" alignItems="center">
                          <Typography variant="body2">:</Typography>
                        </Stack>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          {/* <InputLabel id="simple-select-label">Age</InputLabel> */}
                          <Select
                            labelId="simple--label"
                            id="date-column-value"
                            value={dateColName}
                            label=""
                            onChange={handleDateColName}
                          >
                            {columnsData.map((item, key) => (
                              <MenuItem value={item.COLUMN_NAME}>{item.COLUMN_NAME}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={3}>
                        <TextField fullWidth value="Date Format" />
                        <Stack justifyContent="" alignItems="center">
                          <Typography variant="body2">:</Typography>
                        </Stack>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          {/* <InputLabel id="simple-select-label">Age</InputLabel> */}
                          <Select
                            type="date"
                            fullWidth
                            labelId="simple--label"
                            id=""
                            value={dateColFormat}
                            label=""
                            onChange={handleDateColFormat}
                          >
                            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                            <MenuItem value="YYYY-MM-DD HH:MI:SS">YYYY-MM-DD HH:MI:SS</MenuItem>
                            <MenuItem value="YYYY/MM/DD">YYYY/MM/DD</MenuItem>
                            <MenuItem value="DD/MM/YY">DD/MM/YY</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Stack>
                    {/* <Stack direction="row" spacing={5}>
                      <Stack direction="column" spacing={3}>
                        <TextField type="date" none fullWidth label="                  " />
                      </Stack>
                    </Stack> */}
                    <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
                      <LoadingButton variant="contained">Save</LoadingButton>
                    </Stack>
                  </Stack>
                  {/* <DateRangePicker
                    variant="calendar"
                    startDate={startDate}
                    endDate={endDate}
                    onChangeStartDate={handleChangeStartDate}
                    onChangeEndDate={handleChangeEndDate}
                    open={openPicker}
                    onClose={() => {}}
                    isSelected={isSelectedValuePicker}
                    isError={isError}
                  /> */}
                </Stack>
              </Card>

              {/* 
              <FileFilterType
                filterType={filterType}
                onFilterType={handleFilterType}
                optionsType={FILE_TYPE_OPTIONS}
                onReset={() => setFilterType([])}
              />

              {isFiltered && (
                <Button
                  variant="soft"
                  color="error"
                  onClick={handleClearAll}
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                  Clear
                </Button>
              )} */}
            </Stack>
            {/* <FileFilterName filterName={filterName} onFilterName={handleFilterName} /> */}
            <Typography
              variant="h4"
              sx={{
                color: 'text.primary',
                textAlign: 'left',
                width: '1',
              }}
            >
              Data Lineage
            </Typography>
            <Stack spacing={1}>
              <Stack>
                <DateRangePicker
                  variant="calendar"
                  startDate={startDate}
                  endDate={endDate}
                  onChangeStartDate={handleChangeStartDate}
                  onChangeEndDate={handleChangeEndDate}
                  open={openPicker}
                  onClose={() => {}}
                  isSelected={isSelectedValuePicker}
                  isError={isError}
                />
              </Stack>
              <FileFilterButton
                sx={{ width: 0.5 }}
                isSelected={!!isSelectedValuePicker}
                startIcon={<Iconify icon="eva:calendar-fill" />}
                onClick={() => {}}
              >
                {isSelectedValuePicker ? shortLabel : 'Select Date'}
              </FileFilterButton>
              {/* 
              <FileFilterType
                filterType={filterType}
                onFilterType={handleFilterType}
                optionsType={FILE_TYPE_OPTIONS}
                onReset={() => setFilterType([])}
              />

              {isFiltered && (
                <Button
                  variant="soft"
                  color="error"
                  onClick={handleClearAll}
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                  Clear
                </Button>
              )} */}
            </Stack>
          </Stack>

          {/* <FileChangeViewButton value={view} onChange={handleChangeView} /> */}
        </Stack>

        {/* {view === 'list' ? (
          <FileListView
            table={table}
            tableData={tableData}
            dataFiltered={dataFiltered}
            onDeleteRow={handleDeleteItem}
            isNotFound={isNotFound}
            onOpenConfirm={handleOpenConfirm}
          />
        ) : (
          <FileGridView
            table={table}
            data={tableData}
            dataFiltered={dataFiltered}
            onDeleteItem={handleDeleteItem}
            onOpenConfirm={handleOpenConfirm}
          />
        )}
      </Container>

      <FileNewFolderDialog open={openUploadFile} onClose={handleCloseUploadFile} /> */}

        {/* <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems(table.selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      /> */}
        <Stack direction="row" justifyContent="end" spacing={3} marginTop={3}>
        <Link to={PATH_APP.general.columnimport}>
          <Button sx={{ scale: '1.1' }}>
            Skip
          </Button>
          </Link>

          {isError ? (
            <Button
              sx={{ scale: '1.1' }}
              onClick={() => {
                <Navigate to={PATH_APP.general.columnimport} />;
              }}
              disabled={isError}
              variant="contained"
            >
              Next
            </Button>
          ) : (
            <Link to={PATH_APP.general.columnimport}>
              <Button
                sx={{ scale: '1.1' }}
                onClick={() => {
                  <Navigate to={PATH_APP.general.columnimport} />;
                }}
                disabled={isError}
                variant="contained"
              >
                Next
              </Button>
            </Link>
          )}
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterType,
  filterStartDate,
  filterEndDate,
  isError,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterType.length) {
    inputData = inputData.filter((file) => filterType.includes(fileFormat(file.type)));
  }

  if (filterStartDate && filterEndDate && !isError) {
    inputData = inputData.filter(
      (file) =>
        fTimestamp(file.dateCreated) >= fTimestamp(filterStartDate) &&
        fTimestamp(file.dateCreated) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
