import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import sumBy from 'lodash/sumBy';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Grid,
  Box,
  Typography,
} from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// utils
import { fTimestamp } from '../../utils/formatTime';
// _mock_
import { _bankingRecentTransitions, _invoices } from '../../_mock/arrays';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import InvoiceAnalytic from '../../sections/@dashboard/invoice/InvoiceAnalytic';
import { InvoiceTableRow, FeatureTableToolbar } from '../../sections/@dashboard/invoice/list';
import {
  BankingBalanceStatistics,
  BankingExpensesCategories,
  BankingRecentTransitions,
} from '../../sections/@dashboard/general/banking';
import { ChartArea, ChartRadialBar, ChartsRadarBar } from '../../sections/_examples/extra/chart';
// import FeatureTableToolbar from 'src/sections/@dashboard/invoice/list/FeatureTableToolbar';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'all',
  'full stack development',
  'backend development',
  'ui design',
  'ui/ux design',
  'front end development',
];

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Client', align: 'left' },
  { id: 'createDate', label: 'Create', align: 'left' },
  { id: 'dueDate', label: 'Due', align: 'left' },
  { id: 'price', label: 'Amount', align: 'center', width: 140 },
  { id: 'sent', label: 'Sent', align: 'center', width: 140 },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function FeatureAnalysisPage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState(_invoices);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState(null);

  const [filterService, setFilterService] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterStatus !== 'all' ||
    filterName !== '' ||
    filterService !== 'all' ||
    (!!filterStartDate && !!filterEndDate);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalPrice'
    );

  const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: tableData.length },
    { value: 'paid', label: 'Paid', color: 'success', count: getLengthByStatus('paid') },
    { value: 'unpaid', label: 'Unpaid', color: 'warning', count: getLengthByStatus('unpaid') },
    { value: 'overdue', label: 'Overdue', color: 'error', count: getLengthByStatus('overdue') },
    { value: 'draft', label: 'Draft', color: 'default', count: getLengthByStatus('draft') },
  ];

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterService = (event) => {
    setPage(0);
    setFilterService(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_APP.invoice.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_APP.invoice.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterService('all');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Dashboard"
          links={[
            {
              name: 'Dashboard',
              href: PATH_APP.root,
            },
            // {
            //   name: 'Invoices',
            //   href: PATH_APP.invoice.root,
            // },
            {
              name: 'Feature Computation and Analysis',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_APP.invoice.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Run
            </Button>
          }
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            {/* <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Credit Bureau"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalPrice')}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />

              <InvoiceAnalytic
                title="Bank St. (Dep)"
                total={getLengthByStatus('paid')}
                percent={getPercentByStatus('paid')}
                price={getTotalPriceByStatus('paid')}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />

              <InvoiceAnalytic
                title="Dig. Footprint"
                total={getLengthByStatus('unpaid')}
                percent={getPercentByStatus('unpaid')}
                price={getTotalPriceByStatus('unpaid')}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />

              <InvoiceAnalytic
                title="Payment Data"
                total={getLengthByStatus('overdue')}
                percent={getPercentByStatus('overdue')}
                price={getTotalPriceByStatus('overdue')}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />

              <InvoiceAnalytic
                title="Bank St. (Lend.)"
                total={getLengthByStatus('draft')}
                percent={getPercentByStatus('draft')}
                price={getTotalPriceByStatus('draft')}
                icon="eva:file-fill"
                color={theme.palette.text.secondary}
              />
            </Stack> */}
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <FeatureTableToolbar
            filterName={filterName}
            isFiltered={isFiltered}
            filterService={filterService}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            optionsService={SERVICE_OPTIONS}
            filterStartDate={filterStartDate}
            onResetFilter={handleResetFilter}
            onFilterService={handleFilterService}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="ic:round-send" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="eva:printer-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={handleOpenConfirm}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <Container sx={{ my: 5 }} maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* <Stack spacing={3}> */}
            {/* <BankingBalanceStatistics
            title="Balance Statistics"
            subheader="(+43% Income | +12% Expense) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              colors: [theme.palette.primary.main, theme.palette.warning.main],
              series: [
                {
                  type: 'Week',
                  data: [
                    { name: 'Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
                    { name: 'Expenses', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                  ],
                },
                {
                  type: 'Month',
                  data: [
                    { name: 'Income', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    { name: 'Expenses', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                  ],
                },
                {
                  type: 'Year',
                  data: [
                    { name: 'Income', data: [76, 42, 29, 41, 27, 138, 117, 86, 63] },
                    { name: 'Expenses', data: [80, 55, 34, 114, 80, 130, 15, 28, 55] },
                  ],
                },
              ],
            }}
          /> */}

            <BankingExpensesCategories
              title="Expenses Categories"
              chart={{
                series: [
                  { label: 'Category 1', value: 14 },
                  { label: 'Category 2', value: 23 },
                  { label: 'Category 3', value: 21 },
                  { label: 'Category 4', value: 17 },
                  { label: 'Category 5', value: 15 },
                  { label: 'Category 6', value: 10 },
                  { label: 'Category 7', value: 12 },
                  { label: 'Category 8', value: 17 },
                  { label: 'Category 9', value: 21 },
                ],
                colors: [
                  theme.palette.primary.main,
                  theme.palette.warning.dark,
                  theme.palette.success.darker,
                  theme.palette.error.main,
                  theme.palette.info.dark,
                  theme.palette.info.darker,
                  theme.palette.success.main,
                  theme.palette.warning.main,
                  theme.palette.info.main,
                ],
              }}
            />

            {/* <BankingRecentTransitions
            title="Recent Transitions"
            tableData={_bankingRecentTransitions}
            tableLabels={[
              { id: 'description', label: 'Description' },
              { id: 'date', label: 'Date' },
              { id: 'amount', label: 'Amount' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          /> */}
            {/* </Stack> */}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Box sx={{ p: 2, width: 1 }}>
                <Typography variant="h5">Sale By Gender</Typography>
                <ChartRadialBar />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ my: 5 }} maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* <Stack spacing={3}> */}
            {/* <BankingBalanceStatistics
            title="Balance Statistics"
            subheader="(+43% Income | +12% Expense) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              colors: [theme.palette.primary.main, theme.palette.warning.main],
              series: [
                {
                  type: 'Week',
                  data: [
                    { name: 'Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
                    { name: 'Expenses', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                  ],
                },
                {
                  type: 'Month',
                  data: [
                    { name: 'Income', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    { name: 'Expenses', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                  ],
                },
                {
                  type: 'Year',
                  data: [
                    { name: 'Income', data: [76, 42, 29, 41, 27, 138, 117, 86, 63] },
                    { name: 'Expenses', data: [80, 55, 34, 114, 80, 130, 15, 28, 55] },
                  ],
                },
              ],
            }}
          /> */}
            <BankingBalanceStatistics
              title="Balance Statistics"
              subheader="(+43% Income | +12% Expense) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                colors: [theme.palette.primary.main, theme.palette.warning.main],
                series: [
                  {
                    type: 'Week',
                    data: [
                      { name: 'Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
                      { name: 'Expenses', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                    ],
                  },
                  {
                    type: 'Month',
                    data: [
                      { name: 'Income', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                      { name: 'Expenses', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                    ],
                  },
                  {
                    type: 'Year',
                    data: [
                      { name: 'Income', data: [76, 42, 29, 41, 27, 138, 117, 86, 63] },
                      { name: 'Expenses', data: [80, 55, 34, 114, 80, 130, 15, 28, 55] },
                    ],
                  },
                ],
              }}
            />

            {/* <BankingRecentTransitions
            title="Recent Transitions"
            tableData={_bankingRecentTransitions}
            tableLabels={[
              { id: 'description', label: 'Description' },
              { id: 'date', label: 'Date' },
              { id: 'amount', label: 'Amount' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          /> */}
            {/* </Stack> */}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Box sx={{ p: 2, width: 1 }}>
                <Typography variant="h5">Analysis</Typography>
                <ChartsRadarBar />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ my: 5 }} maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <Box sx={{ p: 5 }}>
                <ChartArea />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
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
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
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
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        invoice.invoiceTo.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === filterStatus);
  }

  if (filterService !== 'all') {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((c) => c.service === filterService)
    );
  }

  if (filterStartDate && filterEndDate) {
    inputData = inputData.filter(
      (invoice) =>
        fTimestamp(invoice.createDate) >= fTimestamp(filterStartDate) &&
        fTimestamp(invoice.createDate) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
