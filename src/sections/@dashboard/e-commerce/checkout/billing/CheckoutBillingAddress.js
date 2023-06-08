import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Grid, Card, Button, Typography, Stack, Box } from '@mui/material';
// _mock
import { Link, useNavigate } from 'react-router-dom';
import { dispatch, useSelector } from '../../../../../redux/store';
import { changeCurrentDataMapState, changeCurrentDsKey } from '../../../../../redux/slices/features';
import { _addressBooks } from '../../../../../_mock/arrays';
import { navigateTo } from '../../../../../utils/navigate';
// components
import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
//
import CheckoutSummary from '../CheckoutSummary';
import CheckoutBillingNewAddressForm from './CheckoutBillingNewAddressForm';
import { PATH_APP } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

CheckoutBillingAddress.propTypes = {
  checkout: PropTypes.object,
  onBackStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function CheckoutBillingAddress({ checkout, onBackStep, onCreateBilling }) {
  const { total, discount, subtotal } = checkout;

  const currentSelection = useSelector(state=>state.feature.currentSelection)
  console.log(currentSelection)

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
const checkActive= (key,checkVal)=>{
  console.log(key,checkVal)
  /* eslint-disable */
  if(key==checkVal) return true;
return false;
}
console.log(currentSelection.dataMap)
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
        {currentSelection.dataMap?.map((item,keyVal)=>{
          
          console.log(item)
          let stage = ""
        currentSelection.dSourceStatus[item.dsKey]?.forEach(item=>{
            if((item.status.toLowerCase())=="in progress"){
              stage=item.stage
            }
          })

          return<AddressItem
          buttonName={stage}
              keyVal={keyVal}
              address={`${item.dataName} data`}
              // onCreateBilling={() => onCreateBilling(address)}
            />
        })}

          <Stack direction="row" justifyContent="center">
            <Button
              size="small"
              color="inherit"
              onClick={onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Back
            </Button>

           
          </Stack>
        </Grid>
      </Grid>

      <CheckoutBillingNewAddressForm
        open={open}
        onClose={handleClose}
        onCreateBilling={onCreateBilling}
      />
    </>
  );
}


// ----------------------------------------------------------------------

AddressItem.propTypes = {
  address: PropTypes.object,
  onCreateBilling: PropTypes.func,
  isActive:PropTypes.bool,
  keyVal:PropTypes.number,
  buttonName:PropTypes.string
};

function AddressItem({ buttonName,keyVal, address, onCreateBilling }) {

  

  const navigate = useNavigate()
  const { receiver, fullAddress, addressType, isDefault } = address;
  
  const currentSelection = useSelector(state=>state.feature.currentSelection)
  const currentDataMap = currentSelection.currentDataMap;
  const isActive = keyVal===currentSelection.currentDataMap;

  console.log(isActive)
  return (
    <Card onClick={()=>{
      dispatch(changeCurrentDsKey(keyVal+1))
    }} 
      sx={{
        p: 3,
        mb: 3,
      }}
    >
      <Stack
        spacing={2}
        alignItems={{
          md: 'flex-end',
        }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
      >
        <Stack flexGrow={1} spacing={1}>
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle1">
              &nbsp;
              <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
                &nbsp;
              </Box>
            </Typography>
          </Stack>

          <Typography sx={{color:"text.secondary"}} variant="body2">{address}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            &nbsp;
          </Typography>
        </Stack>

        <Stack flexDirection="row" alignSelf="center" flexWrap="wrap" flexShrink={0}>
          {/* {!isDefault && (
            <Button variant="outlined" size="small" color="inherit" sx={{ mr: 1 }}>
              Delete
          </Button>
          )} */}

          {/* <Link state={currentDataMap} to={PATH_APP.general.connectUpload}> */}
          <Button  variant="outlined" size="small" onClick={()=>{
            dispatch(changeCurrentDsKey(keyVal+1))
            navigate(PATH_APP.general.connectUpload)
          }}>
            {buttonName}
          </Button>
          {/* </Link> */}
        </Stack>
      </Stack>
    </Card>
  );
}
