import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Stack, Button, Container, TextField, InputAdornment } from '@mui/material';
// routes
import { useLocation } from 'react-router';
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
import DateRangePicker, { useDateRangePicker } from '../../components/date-range-picker';
import { getDatabase } from '../../redux/slices/features';
// sections
import {
  FileListView,
  FileGridView,
  ConnectGridView,
  FileFilterType,
  FileFilterName,
  FileFilterButton,
  FileChangeViewButton,
  FileNewFolderDialog,
} from '../../sections/@dashboard/file';
import { useDispatch, useSelector } from '../../redux/store';
import { navigateTo } from '../../utils/navigate';

// ----------------------------------------------------------------------

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

export default function ConnectUploadPage() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    open: openPicker,
    onOpen: onOpenPicker,
    onClose: onClosePicker,
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

  const handleChangeStartDate = (newValue) => {
    table.setPage(0);
    onChangeStartDate(newValue);
  };

  const handleChangeEndDate = (newValue) => {
    table.setPage(0);
    onChangeEndDate(newValue);
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

  const dispatch = useDispatch();
  const data = useSelector((state) => state);
  const location = useLocation();
  // console.log(location);
  // console.log(data.feature.dbName);
  const dbName = useSelector((state) => state.feature.dbName);
  console.log(dbName);
  
    const upload = [
      { Name: 'Upload CSV File', Type: 'Local File' },
      { Name: 'Upload JSON File', Type: 'Local File' },
    ];
    const apisource = [
      { Name: 'Api Data Source', Type: 'Local File' },
      { Name: 'Api Data Source', Type: 'Local File' },
    ];
  const [filteredDbs, setFilteredDbs] = useState([...dbName]);
  const [filteredupload, setFilteredupload] = useState([...upload]);
  const [filteredApiSource, setFilteredApiSource] = useState([...apisource]);

  useEffect(() => {
    setFilteredDbs([...dbName]);
  }, [dbName]);


  useEffect(() => {
    dispatch(getDatabase());
    // setFilteredDbs(dbName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    console.log(query);
    if (query === '') {
      setFilteredDbs([...dbName]);
      setFilteredupload([...upload])
      setFilteredApiSource([...apisource])
      return;
    }
    const newDb = dbName.filter(({ Name, Type }) =>
      Name.toLowerCase().includes(query.toLowerCase())
    );
    const newUplaod = upload.filter(({ Name, Type }) =>
    Name.toLowerCase().includes(query.toLowerCase())
    );
    const newApiSource = apisource.filter(({ Name, Type }) =>
    Name.toLowerCase().includes(query.toLowerCase())
    );
    console.log(newDb);
    // setData(newData);
    setFilteredDbs(newDb);
    setFilteredupload(newUplaod);
    setFilteredApiSource(newApiSource);
  };

  navigateTo(data.feature.currentSelection)

  return (
    <>
      <Helmet>
        <title> DB Connections | S7</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Database Connections and File Upload"
          links={[
            {
              name: 'Dashboard',
              href: PATH_APP.root,
            },
            { name: 'Connections' },
          ]}
          action={
            null
          }
        />

        <Stack
          spacing={2.5}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Stack
            spacing={1}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ md: 'center' }}
            sx={{ width: 1 }}
          >
            <TextField
              fullWidth
              size="small"
              // value={filteredDbs}
              onChange={handleSearch}
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <>
                <FileFilterButton
                  isSelected={!!isSelectedValuePicker}
                  startIcon={<Iconify icon="eva:calendar-fill" />}
                  onClick={onOpenPicker}
                >
                  {isSelectedValuePicker ? shortLabel : 'Select Date'}
                </FileFilterButton>

                <DateRangePicker
                  variant="calendar"
                  startDate={startDate}
                  endDate={endDate}
                  onChangeStartDate={handleChangeStartDate}
                  onChangeEndDate={handleChangeEndDate}
                  open={openPicker}
                  onClose={onClosePicker}
                  isSelected={isSelectedValuePicker}
                  isError={isError}
                />
              </>

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
              )}
            </Stack> */}
          </Stack>

          {/* <FileChangeViewButton value={view} onChange={handleChangeView} /> */}
        </Stack>

        <ConnectGridView
          title="Connections"
          table={table}
          data={tableData}
          dataFiltered={filteredDbs}
          onDeleteItem={handleDeleteItem}
          onOpenConfirm={handleOpenConfirm}
          routeTo={PATH_APP.general.connectdb}
        />
        <br />
        <ConnectGridView
          title="Connections"
          table={table}
          data={tableData}
          twoRow
          dataFiltered={filteredupload}
          onDeleteItem={handleDeleteItem}
          onOpenConfirm={handleOpenConfirm}
          routeTo={PATH_APP.general.uploadfile}
        />
        <br />
        <ConnectGridView
          title="Connections"
          table={table}
          data={tableData}
          twoRow
          dataFiltered={filteredApiSource}
          onDeleteItem={handleDeleteItem}
          onOpenConfirm={handleOpenConfirm}
          routeTo={PATH_APP.general.connectdb}
        />
      </Container>

      {/* <FileNewFolderDialog open={openUploadFile} onClose={handleCloseUploadFile} /> */}

      <ConfirmDialog
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
      />
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
