import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Stack,
  Grid,
} from '@mui/material';
// routes
import { randomNumberRange } from '../../_mock';
import _mock from '../../_mock/_mock';
import { AppTopAuthors } from '../../sections/@dashboard/general/app';
import { PATH_APP } from '../../routes/paths';
// mock
import { _userList } from '../../_mock/arrays';
// components
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
import VariableAppTopAuthor from '../../sections/@dashboard/general/app/VariableAppTopAuthor';
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
import ShopProductSearch from '../../sections/@dashboard/e-commerce/shop/ShopProductSearch';
import { useDispatch, useSelector } from '../../redux/store';
import {
  getFeaturevalueMap,
  setCurrentSelectedFeatureMapValues,
  updateFeatureValueMap,
} from '../../redux/slices/features';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

const TABLE_HEAD = [
  { id: 'name', label: 'Primary Data', align: 'left' },
  { id: 'company', label: 'Pareto', align: 'left' },
  // { id: 'role', label: 'Role', align: 'left' },
  { id: 'isVerified', label: 'Variable Map', align: 'center' },
  { id: 'status', label: 'Options', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserListPage() {
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
  } = useTable();

  console.log(selected);
  useEffect(() => {
    dispatch(setCurrentSelectedFeatureMapValues(selected));
    // eslint-disable-next-line
  }, [selected]);

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');
  const featuremapvalues = [
    {
      name: '',
      percent: 0,
      variableMapped: '',
    },
  ];
  const [tableData, setTableData] = useState(featuremapvalues);
  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');
  const feature = useSelector((state) => state.feature);
  const dataFiltered = applyFilter({
    inputData: tableData,
    filterName,
  });

  console.log(feature);

  const {featureColumns} = feature.currentSelection;

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

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

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
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
  const dispatch = useDispatch();
  const currentSelection = useSelector((state) => state.feature.currentSelection);
  const value = {
    projectKey: currentSelection.projectKey,
    dSource: currentSelection.currentDsKey,
    feature: 'Loan_Type',
  };
  const body = {
    fsProject: feature.currentSelection.category,
    fsCategory: feature.currentSelection.subCategory,
    dSource: feature.currentSelection.currentDsKey,
  };
  function getVariableMapData(data) {
    value.feature = data;
    dispatch(getFeaturevalueMap({ value, body }));
  }
  const [selectedVariables, setSelectedVariables] = useState({ variables: {}, key: '' });

  useEffect(() => {
    dispatch(getFeaturevalueMap({ value, body }));
    // eslint-disable-next-line
  }, []);
  const currentfeaturemapvalue = feature.currentSelection.currentFeatureMapValue;
  useEffect(() => {
    const currData = currentfeaturemapvalue[0][Object.keys(currentfeaturemapvalue[0])[0]];

    console.log(currData);
    setTableData([...currData]);
    const key = currentSelection.currentSelectedFeatureCiColumn;
    const variables = currentSelection.currentFeatureValueMapVariables[0];
    console.log(key ? variables[key] : variables);
    setSelectedVariables({ variables, key });

    // eslint-disable-next-line
  }, [currentfeaturemapvalue]);

  console.log(currentSelection.currentFeatureMapValue);
  // setTableData(currentSelection.currentFeatureMapValue)

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
    // navigate(PATH_APP    .user.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const index = 1;
  const _appAuthors = [
    {
      id: 1,
      name: _mock.name.fullName(index),
      avatar: _mock.image.avatar(index),
      favourite: randomNumberRange(9999, 19999),
    },
    {
      id: 1,
      name: _mock.name.fullName(index),
      avatar: _mock.image.avatar(index),
      favourite: randomNumberRange(9999, 19999),
    },
    {
      id: 1,
      name: _mock.name.fullName(index),
      avatar: _mock.image.avatar(index),
      favourite: randomNumberRange(9999, 19999),
    },
    {
      id: 1,
      name: _mock.name.fullName(index),
      avatar: _mock.image.avatar(index),
      favourite: randomNumberRange(9999, 19999),
    },
  ];

  const [isSelected, setisSelected] = useState(false)
  const [mappedVariable, setmappedVariable] = useState(null)
  useEffect(() => {
    if (selected.length!==0) {setisSelected(true)} else {setisSelected(false)}
    console.log(selected)
    // eslint-disable-next-line
  }, [selected])
  console.log(isSelected)

  useEffect(() => {
    const d=feature.currentSelection.currentFeatureMapValue[0][feature.currentSelection.currentSelectedFeatureCiColumn]
    const updatedFeatureMapVariableValues=d?.map((item) => { 
      if (feature.currentSelection.currentSelectedFeatureMapValues.includes(item.name)) {
        return {...item,variableMapped:mappedVariable}
      }
      return {...item}
    })
    
    
    console.log(updatedFeatureMapVariableValues)
    dispatch(updateFeatureValueMap(updatedFeatureMapVariableValues))

    // dispatch()
  
// eslint-disable-next-line
  }, [mappedVariable])
  

  return (
    <>
      <Helmet>
        <title>Variable Mapping</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Variable Mapping"
          links={[
            { name: 'Dashboard', href: PATH_APP.general.app },
            // { name: 'User', href: PATH_APP.general.app },
            { name: 'Variable Mapping' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                to={PATH_APP.general.app}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Download Sample File
              </Button>
              <Button
                component={RouterLink}
                to={PATH_APP.general.app}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Upload Mapping File
              </Button>
            </Stack>
          }
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            {/* eslint-disable-next-line */}
            <VariableAppTopAuthor
              // eslint-disable-next-line
              getVariableMapData={getVariableMapData}
              title="CI Feature Column"
              cWidth={1}
              list={featureColumns}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Card>
              {/* <Stack sx={{ p: 4 }}>
                <ShopProductSearch />
              </Stack> */}
              <UserTableToolbar
                isFiltered={isFiltered}
                filterName={filterName}
                // filterRole={filterRole}
                // optionsRole={ROLE_OPTIONS}
                onFilterName={handleFilterName}
                // onFilterRole={handleFilterRole}
                onResetFilter={handleResetFilter}
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
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={handleOpenConfirm}>
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </Tooltip>
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
                          tableData.map((row) => row.name)
                        )
                      }
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <UserTableRow
                            setmappedVariable={setmappedVariable}
                            selectedvalues={selected}
                            isSelected={isSelected}
                            mappedVariable={mappedVariable}
                            data={selectedVariables}
                            key={row.name}
                            row={row}
                            selected={selected.includes(row.name)}
                            onSelectRow={() => {
                              onSelectRow(row.name);
                            }}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.name)}
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

function applyFilter({ inputData, filterName }) {
  // const stabilizedThis = inputData.map((el, index) => [el, index]);

  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  // inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  // if (filterRole !== 'all') {
  //   inputData = inputData.filter((user) => user.role === filterRole);
  // }

  return inputData;
}

// import { Helmet } from 'react-helmet-async';
// import { paramCase } from 'change-case';
// import { useState } from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// // @mui
// import {
//   Tab,
//   Tabs,
//   Card,
//   Table,
//   Button,
//   Tooltip,
//   Divider,
//   TableBody,
//   Container,
//   IconButton,
//   TableContainer,
//   Stack,
//   Grid,
// } from '@mui/material';
// // routes
// import { randomNumberRange } from '../../_mock';
// import _mock from '../../_mock/_mock';
// import { AppTopAuthors } from '../../sections/@dashboard/general/app';
// import { PATH_APP    } from '../../routes/paths';
// // mock
// import { _userList } from '../../_mock/arrays';
// // components
// import Iconify from '../../components/iconify';
// import Scrollbar from '../../components/scrollbar';
// import ConfirmDialog from '../../components/confirm-dialog';
// import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// import { useSettingsContext } from '../../components/settings';
// import {
//   useTable,
//   getComparator,
//   emptyRows,
//   TableNoData,
//   TableEmptyRows,
//   TableHeadCustom,
//   TableSelectedAction,
//   TablePaginationCustom,
// } from '../../components/table';
// // sections
// import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
// import ShopProductSearch from '../../sections/@dashboard/e-commerce/shop/ShopProductSearch';

// // ----------------------------------------------------------------------

// const STATUS_OPTIONS = ['all', 'active', 'banned'];

// const ROLE_OPTIONS = [
//   'all',
//   'ux designer',
//   'full stack designer',
//   'backend developer',
//   'project manager',
//   'leader',
//   'ui designer',
//   'ui/ux designer',
//   'front end developer',
//   'full stack developer',
// ];

// const TABLE_HEAD = [
//   { id: 'name', label: 'Name', align: 'left' },
//   { id: 'company', label: 'Company', align: 'left' },
//   // { id: 'role', label: 'Role', align: 'left' },
//   { id: 'isVerified', label: 'Verified', align: 'center' },
//   { id: 'status', label: 'Status', align: 'left' },
//   { id: '' },
// ];

// // ----------------------------------------------------------------------

// export default function UserListPage() {
//   const {
//     dense,
//     page,
//     order,
//     orderBy,
//     rowsPerPage,
//     setPage,
//     //
//     selected,
//     setSelected,
//     onSelectRow,
//     onSelectAllRows,
//     //
//     onSort,
//     onChangeDense,
//     onChangePage,
//     onChangeRowsPerPage,
//   } = useTable();

//   const { themeStretch } = useSettingsContext();

//   const navigate = useNavigate();

//   const [tableData, setTableData] = useState(_userList);

//   const [openConfirm, setOpenConfirm] = useState(false);

//   const [filterName, setFilterName] = useState('');

//   const [filterRole, setFilterRole] = useState('all');

//   const [filterStatus, setFilterStatus] = useState('all');

//   const dataFiltered = applyFilter({
//     inputData: tableData,
//     comparator: getComparator(order, orderBy),
//     filterName,
//     filterRole,
//     filterStatus,
//   });

//   const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   const denseHeight = dense ? 52 : 72;

//   const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';

//   const isNotFound =
//     (!dataFiltered.length && !!filterName) ||
//     (!dataFiltered.length && !!filterRole) ||
//     (!dataFiltered.length && !!filterStatus);

//   const handleOpenConfirm = () => {
//     setOpenConfirm(true);
//   };

//   const handleCloseConfirm = () => {
//     setOpenConfirm(false);
//   };

//   const handleFilterStatus = (event, newValue) => {
//     setPage(0);
//     setFilterStatus(newValue);
//   };

//   const handleFilterName = (event) => {
//     setPage(0);
//     setFilterName(event.target.value);
//   };

//   const handleFilterRole = (event) => {
//     setPage(0);
//     setFilterRole(event.target.value);
//   };

//   const handleDeleteRow = (id) => {
//     const deleteRow = tableData.filter((row) => row.id !== id);
//     setSelected([]);
//     setTableData(deleteRow);

//     if (page > 0) {
//       if (dataInPage.length < 2) {
//         setPage(page - 1);
//       }
//     }
//   };

//   const handleDeleteRows = (selectedRows) => {
//     const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
//     setSelected([]);
//     setTableData(deleteRows);

//     if (page > 0) {
//       if (selectedRows.length === dataInPage.length) {
//         setPage(page - 1);
//       } else if (selectedRows.length === dataFiltered.length) {
//         setPage(0);
//       } else if (selectedRows.length > dataInPage.length) {
//         const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
//         setPage(newPage);
//       }
//     }
//   };

//   const handleEditRow = (id) => {
//     // navigate(PATH_APP    .user.edit(paramCase(id)));
//   };

//   const handleResetFilter = () => {
//     setFilterName('');
//     setFilterRole('all');
//     setFilterStatus('all');
//   };

//   const index = 1;
//   const _appAuthors = [
//     {
//       id: 1,
//       name: _mock.name.fullName(index),
//       avatar: _mock.image.avatar(index),
//       favourite: randomNumberRange(9999, 19999),
//     },
//     {
//       id: 1,
//       name: _mock.name.fullName(index),
//       avatar: _mock.image.avatar(index),
//       favourite: randomNumberRange(9999, 19999),
//     },
//     {
//       id: 1,
//       name: _mock.name.fullName(index),
//       avatar: _mock.image.avatar(index),
//       favourite: randomNumberRange(9999, 19999),
//     },
//     {
//       id: 1,
//       name: _mock.name.fullName(index),
//       avatar: _mock.image.avatar(index),
//       favourite: randomNumberRange(9999, 19999),
//     },
//   ];

//   return (
//     <>
//       <Helmet>
//         <title> User: List | Minimal UI</title>
//       </Helmet>

//       <Container maxWidth={themeStretch ? false : 'lg'}>
//         <CustomBreadcrumbs
//           heading="User List"
//           links={[
//             { name: 'Dashboard', href: PATH_APP .general.app },
//             { name: 'User', href: PATH_APP  .general.app },
//             { name: 'List' },
//           ]}
//           action={
//             <Stack direction="row" spacing={2}>
//               <Button
//                 component={RouterLink}
//                 to={PATH_APP    .general.app}
//                 variant="contained"
//                 startIcon={<Iconify icon="eva:plus-fill" />}
//               >
//                 New User
//               </Button>
//               <Button
//                 component={RouterLink}
//                 to={PATH_APP    .general.app}
//                 variant="contained"
//                 startIcon={<Iconify icon="eva:plus-fill" />}
//               >
//                 New User
//               </Button>
//             </Stack>
//           }
//         />

//         <Grid container spacing={3}>
//           <Grid item xs={12} md={3}>
//             <AppTopAuthors title="CI Feature Column" list={_appAuthors} loadSearch/>
//           </Grid>
//           <Grid item xs={12} md={9}>
//             <Card>
//               <Stack sx={{ p: 4 }}>
//                 <ShopProductSearch />
//               </Stack>
//               <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
//                 <TableSelectedAction
//                   dense={dense}
//                   numSelected={selected.length}
//                   rowCount={tableData.length}
//                   onSelectAllRows={(checked) =>
//                     onSelectAllRows(
//                       checked,
//                       tableData.map((row) => row.id)
//                     )
//                   }
//                   action={
//                     <Tooltip title="Delete">
//                       <IconButton color="primary" onClick={handleOpenConfirm}>
//                         <Iconify icon="eva:trash-2-outline" />
//                       </IconButton>
//                     </Tooltip>
//                   }
//                 />

//                 <Scrollbar>
//                   <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
//                     <TableHeadCustom
//                       order={order}
//                       orderBy={orderBy}
//                       headLabel={TABLE_HEAD}
//                       rowCount={tableData.length}
//                       numSelected={selected.length}
//                       onSort={onSort}
//                       onSelectAllRows={(checked) =>
//                         onSelectAllRows(
//                           checked,
//                           tableData.map((row) => row.id)
//                         )
//                       }
//                     />

//                     <TableBody>
//                       {dataFiltered
//                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                         .map((row) => (
//                           <UserTableRow
//                             key={row.id}
//                             row={row}
//                             selected={selected.includes(row.id)}
//                             onSelectRow={() => onSelectRow(row.id)}
//                             onDeleteRow={() => handleDeleteRow(row.id)}
//                             onEditRow={() => handleEditRow(row.name)}
//                           />
//                         ))}

//                       <TableEmptyRows
//                         height={denseHeight}
//                         emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
//                       />

//                       <TableNoData isNotFound={isNotFound} />
//                     </TableBody>
//                   </Table>
//                 </Scrollbar>
//               </TableContainer>

//               <TablePaginationCustom
//                 count={dataFiltered.length}
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 onPageChange={onChangePage}
//                 onRowsPerPageChange={onChangeRowsPerPage}
//                 //
//                 dense={dense}
//                 onChangeDense={onChangeDense}
//               />
//             </Card>
//           </Grid>
//         </Grid>
//       </Container>

//       <ConfirmDialog
//         open={openConfirm}
//         onClose={handleCloseConfirm}
//         title="Delete"
//         content={
//           <>
//             Are you sure want to delete <strong> {selected.length} </strong> items?
//           </>
//         }
//         action={
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => {
//               handleDeleteRows(selected);
//               handleCloseConfirm();
//             }}
//           >
//             Delete
//           </Button>
//         }
//       />
//     </>
//   );
// }

// // ----------------------------------------------------------------------

// function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
//   const stabilizedThis = inputData.map((el, index) => [el, index]);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (filterName) {
//     inputData = inputData.filter(
//       (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
//     );
//   }

//   if (filterStatus !== 'all') {
//     inputData = inputData.filter((user) => user.status === filterStatus);
//   }

//   if (filterRole !== 'all') {
//     inputData = inputData.filter((user) => user.role === filterRole);
//   }

//   return inputData;
// }
