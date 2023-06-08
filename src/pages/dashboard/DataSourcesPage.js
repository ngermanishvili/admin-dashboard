import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Stack, Button, Container } from '@mui/material';
// routes
import { Navigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from '../../redux/store';
import { saveCurCategory, saveSubCategories } from '../../redux/slices/features';
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

export default function DataSources() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const location = useLocation();
  const data = location.state;
  console.log(data);
  const dispatch = useDispatch();
  const features = useSelector((state) => state.feature);
  console.log(features);
  useEffect(() => {
    if (data) {
      dispatch(saveSubCategories(data.subCategories));
    }
    // eslint-disable-next-line
  }, [location, data]);

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
  if (data)
    return (
      <>
        <Helmet>
          <title>Datasource Types</title>
        </Helmet>

        <Container maxWidth={themeStretch ? false : 'lg'}>
          <FileGridView
            title="Datasources Types"
            table={table}
            // data={data}
            dataTitle={data.title}
            dataFiltered={features.subCategories}
            onDeleteItem={handleDeleteItem}
            onOpenConfirm={handleOpenConfirm}
            routeTo={PATH_APP.general.dataUpload}
          />
        </Container>
      </>
    );
  return <Navigate to={PATH_APP.general.feature} />;
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
