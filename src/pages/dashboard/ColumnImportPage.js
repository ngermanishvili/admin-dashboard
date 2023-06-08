// ColumnImportPage
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button, Typography, Container, InputAdornment } from '@mui/material';
// routes
import { useSelector, useDispatch } from '../../redux/store';
import { saveColumn } from '../../redux/slices/features';
import { PATH_APP, PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch } from '../../components/hook-form';
//
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/CustomBreadcrumbs';
import CustomSwitch from '../../components/hook-form/CustomSwitch';
import { CustomTextField } from '../../components/custom-input';
import Iconify from '../../components/iconify/Iconify';

// ----------------------------------------------------------------------

export default function BlogNewPostForm() {
  const dispatch = useDispatch();
  const [changedState, setchangedState] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const [isSelected, setIsSelected] = useState(false);
  const columnnames = useSelector((state) => state.feature.currentSelection.columnNames);

  const [data, setData] = useState([...columnnames]);

  // console.log(data);

  const defValues = [];
  columnnames.forEach((i) => {
    // console.log(Array.isArray(defValues))
    const tempObj = { name: i.COLUMN_NAME, val: false };
    defValues.push(tempObj);
  });
  const [selectedArray, setSelectedArray] = useState(defValues);

  useEffect(() => {
    const tSelectedArray = [...selectedArray];
    dispatch(saveColumn(tSelectedArray));
    // eslint-disable-next-line
  }, [changedState]);
  const NewBlogSchema = Yup.object();

  const methods = useForm({
    // resolver: yupResolver(NewBlogSchema),
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // console.log(data);
      console.log(selectedArray);
      enqueueSnackbar('Columns Imported Successfully!');
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAll = () => {
    setIsSelected((prev) => !prev);
  };

  const selected = (switchObject) => {
    // const currVal = selectedArray.filter((item) => item.name === obj.name);
    // eslint-disable-next-line
    let currVal = selectedArray.find((item) => item.name === switchObject.name);
    currVal.val = switchObject.val;
    setSelectedArray(selectedArray);
    setchangedState((state) => state + 1);
  };
  const handleSearch = (e) => {
    const query = e.target.value;
    console.log(query);
    if (query === '') {
      setData(columnnames);
      return;
    }
    const newData = columnnames.filter(({COLUMN_NAME,DATA_TYPE}) => COLUMN_NAME.toLowerCase().includes(query.toLowerCase()));
    console.log(newData);
    // setData(newData);
    setData(newData);
  };
  // console.log(columnnames)

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container
        maxWidth={false}
        sx={{
          overflowY: 'hidden',
        }}
      >
        <CustomBreadcrumbs
          heading="Column Import"
          links={[
            {
              name: 'Dashboard',
              href: PATH_APP.root,
            },

            {
              name: 'Column Mapping',
            },
          ]}
        />

        <Grid container display="flex" justifyContent="center" alignItems="center" spacing={3}>
          <Grid item xs={10} md={5}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ my: 2 }}>
                Choose the column you wish to import
              </Typography>
              <Typography variant="subtitle1" sx={{ my: 1, color: 'text.secondary' }}>
                Select the specific columns you want to import from the uploaded data{' '}
              </Typography>

              <Stack direction="row" justifyContent="space-between">
                <CustomTextField
                  onChange={handleSearch}
                  width="70%"
                  
                  placeholder="Search..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <RHFSwitch
                  onClick={handleSelectAll}
                  name=""
                  label="Select All"
                  value="Select"
                  sx={{
                    mb: 1,
                    mx: 0,
                    width: 1,
                    flexDirection: 'row-reverse',
                    justifyContent: 'end',
                  }}
                />
              </Stack>
              <Stack
                spacing={3}
                sx={{
                  overflowY: 'scroll',
                  maxHeight: '50%',
                }}
              >
                <div style={{maxHeight:400}} id="switches">
                  {data.map((item, key) => (
                    <CustomSwitch
                      allSelected={isSelected}
                      name={item.COLUMN_NAME}
                      label={item.COLUMN_NAME}
                      labelPlacement="start"
                      setAsSelected={selected}
                      sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                    />
                  ))}
                </div>
              </Stack>
              <Stack direction="row" justifyContent="end" spacing={1.5} sx={{ mt: 3 }}>
              <Link to={PATH_APP.general.mapping}>
                <Button size="large">
                  Skip
                </Button>
                </Link>

                <Link to={PATH_APP.general.mapping}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                  >
                    Next
                  </LoadingButton>
                </Link>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
