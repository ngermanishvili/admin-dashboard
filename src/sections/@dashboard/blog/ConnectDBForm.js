import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import {
  Grid,
  Stack,
  Divider,
  MenuItem,
  Backdrop,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
  Card,
} from '@mui/material';
import * as Yup from "yup"
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
// components
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_APP } from '../../../routes/paths';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
//
import { FormSchema } from './schema';
import ValuesPreview from './ValuesPreview';
import { useDispatch, useSelector } from '../../../redux/store';
import { chnageCurrentDataMapCurrentState, setupConnection } from '../../../redux/slices/features';

// ----------------------------------------------------------------------

export const defaultValues = {
  age: 0,
  email: '',
  fullName: '',
  //
  editor: '',
  switch: false,
  radioGroup: '',
  autocomplete: null,
  //
  password: '',
  confirmPassword: '',
  //
  startDate: new Date(),
  endDate: null,
  //
  singleUpload: null,
  multiUpload: [],
  //
  singleSelect: '',
  multiSelect: [],
  //
  checkbox: false,
  multiCheckbox: [],
  //
  slider: 8,
  sliderRange: [15, 80],
};

ConnectDBForm.propTypes = {
  debug: PropTypes.bool,
};

export default function ConnectDBForm({ debug }) {
  const location = useLocation();
  const header = location.state;
  // console.log(header);  
  const [showPassword, setShowPassword] = useState(false);
  
  const data = useSelector((state) => state.feature.formFields);
  console.log(data);



  const parsingSchema={}
    const yupCu = Yup;
      Object.keys(data).forEach((item)=>{
        console.log(item)
        const type =data[item].type.toLowerCase()
        let s= ""
        if(type === "password"){
           s = `yupCu.string()`
        }else{
           s = `yupCu.${type}()`
        }
        let news=""
        if(data[item].isMendatory){
           news = s.concat(`.required('${data[item].name} is required')`)
        }else{
          news = s
        }
        // eslint-disable-next-line
        "use strict";
        console.log(news)
        // eslint-disable-next-line
        parsingSchema[item] = eval(String(news))
      })
      console.log(parsingSchema)
  





  const schema = Yup.object().shape(parsingSchema);
  
  const methods = useForm({
    resolver: yupResolver(schema),
    // defaultValues,
  });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const dispatch = useDispatch();
  const formdata = useSelector((state) => state.feature.formFields);
  console.log(formdata);
  function camelize(str) {
    // eslint-disable-next-line
    const key = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
    return key;
  }
  // eslint-disable-next-line
  let tempForData = {};
  const navigate = useNavigate()
  
  const dSourceId = useSelector((state) => state.feature.currentSelection.currentDsKey);

  const onSubmit = async (value) => {
    console.log(value)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // dispatch(formatFormData(data))
    try {
      const response = await axios.get('http://localhost:3000/connector-string');
      console.log(response.data);
      tempForData = { ...response.data.posts };
    } catch (error) {
      console.log('error occured');
    }

    Object.keys(value).forEach((key) => {
      const tempkey = key;
      key = camelize(key);
      tempForData[key].value = value[tempkey];
      console.log(tempForData[key].value);
    });
    console.log(tempForData);
    reset();
    console.log(dSourceId);
      dispatch(setupConnection(tempForData,dSourceId));
    dispatch(chnageCurrentDataMapCurrentState(1));
    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate(PATH_APP.general.dbname)
  };

  useEffect(() => {
    // eslint-disable-next-line
  }, [dispatch, tempForData]);

  


  return (
    <>
      {isSubmitting && (
        <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <Container maxWidth="md">
        <Card sx={{ mb: 5, py: 3 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid flex="row" justifyContent="center" container spacing={5}>
              <Grid item xs={12} md={10}>
                <Stack spacing={4}>
                  <Typography variant="h4">Connect To {header}</Typography>
                  {Object.keys(data)?.map((item, key) => {
                    if (data[item].name === 'Password' || data[item].name==='password')
                      return (
                        <Block>
                          <RHFTextField name="password" label="Password" type="password"  />
                        </Block>
                      );
                    return (
                      <Block>
                        <RHFTextField type={data[item].type} name={item} label={data[item].name}/>
                      </Block>
                    );
                  })}
                  <Stack sx={{ pt: 5 }} direction="row" justifyContent="space-between">
                  <Link to="/app/connect-upload">
                    <LoadingButton
                      size="medium"
                      type="submit"
                      variant="outlined"
                      loading={isSubmitting}
                    >
                      Cancel
                    </LoadingButton>
                      </Link>
                    <Stack direction="row" spacing={2}>
                      
                      {/* <Link to={PATH_APP.general.dbname}> */}
                        <LoadingButton
                          color="info"
                          size="medium"
                          type="submit"
                          variant="contained"
                          loading={isSubmitting}
                        >
                          Check DB Connection
                        </LoadingButton>
                      {/* </Link> */}
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            {debug}
          </FormProvider>
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

Block.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  sx: PropTypes.object,
};

function Block({ label = 'RHFTextField', sx, children }) {
  return (
    <Stack spacing={1} sx={{ width: 1, ...sx }}>
      {children}
    </Stack>
  );
}
