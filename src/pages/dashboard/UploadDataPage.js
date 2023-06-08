import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Grid, Container, Box, Stepper, Step, StepLabel, Button } from '@mui/material';
// routes
import { Navigate, useLocation } from 'react-router';
import { PATH_APP } from '../../routes/paths';
// redux
import {
  changeCurrentDataMapState,
  changeCurrentDsKey,
  changeDataMapState,
  createProject,
  incrementCurrentState,
  saveCurCategory,
  saveCurSubCategory,
  saveDataMap,
} from '../../redux/slices/features';
import { useDispatch, useSelector } from '../../redux/store';
import {
  resetCart,
  getCart,
  nextStep,
  backStep,
  gotoStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
} from '../../redux/slices/product';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import {
  CheckoutCart,
  CheckoutSteps,
  CheckoutPayment,
  CheckoutOrderComplete,
  CheckoutBillingAddress,
} from '../../sections/@dashboard/e-commerce/checkout';

// ----------------------------------------------------------------------

const STEPS = ['Data Upload', 'Feature Mapping', 'Value Mapping', 'Computation'];

// ----------------------------------------------------------------------

export default function UploadDataPage() {
  const navigate = useNavigate();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { cart, billing, activeStep } = checkout;

  const completed = activeStep === STEPS.length;

  const location = useLocation();
  const data = location.state;
  const currentstate = useSelector((state) => state.feature.currentSelection);
 

  console.log(currentstate);

  useEffect(() => {
    if (data) {
      console.log(data);
      dispatch(saveCurSubCategory(data.subCategory.name));
      dispatch(saveCurCategory(data.category));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    if (currentstate.subCategory) {
      dispatch(saveDataMap(currentstate));

      const value = {
        pName: 'Project Name',
        description: 'describe project',
        fsProject: currentstate.category,
        fsCategory: currentstate.subCategory,
      };

      console.log('...............');
      dispatch(createProject(value));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentstate.subCategory]);

  function handleState(increment) {
    dispatch(changeDataMapState(currentstate.dataMap[currentstate.currentDataMap].currentStep));
  }

  // useEffect(() => {
  //   dispatch(getCart(cart));
  // }, [dispatch, cart]);

  // useEffect(() => {
  //   if (activeStep === 1) {
  //     dispatch(createBilling(null));
  //   }
  // }, [dispatch, activeStep]);

  const handleNextStep = () => {
    dispatch(nextStep());
  };

  const handleBackStep = () => {
    dispatch(backStep());
  };

  const handleGotoStep = (step) => {
    dispatch(gotoStep(step));
  };

  const handleApplyDiscount = (value) => {
    if (cart.length) {
      dispatch(applyDiscount(value));
    }
  };

  const handleDeleteCart = (productId) => {
    dispatch(deleteCart(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleCreateBilling = (address) => {
    dispatch(createBilling(address));
    dispatch(nextStep());
  };

  const handleApplyShipping = (value) => {
    dispatch(applyShipping(value));
  };

  const handleReset = () => {
    if (completed) {
      dispatch(resetCart());
      navigate(PATH_APP.general.app, { replace: true });
    }
  };

  function checkStateOfDataMap(value) {
    // currentstate
  }
  const currentDataMap = currentstate.currentDataMap;
  const steps = currentstate.dataMap;
  console.log(steps);
  if (data) {
    return (
      <>
        <Helmet>
          <title> Upload Data</title>
        </Helmet>

        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Data Upload"
            links={[
              { name: 'Feature Store', href: PATH_APP.general.feature },
              {
                name: 'Banking Usecase',
              },
              { name: 'Upload' },
            ]}
          />

          <Grid container justifyContent={completed ? 'center' : 'flex-start'}>
            <Grid item xs={12} md={12}>
              <Box sx={{ width: '100%', m: 2 }}>
                <Stepper activeStep={currentDataMap} alternativeLabel>
                  {steps.map((label, key) => (
                    <Step key={key}>
                      <StepLabel
                        onClick={() => {
                          console.log(key);
                          dispatch(changeCurrentDsKey(key + 1));
                        }}
                      >
                        {label.dataName}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <CheckoutSteps activeStep={activeStep} steps={STEPS} />
            </Grid>
          </Grid>

          <CheckoutBillingAddress
            // state={currentstate.dataMap[0].currentStep}
            checkout={checkout}
            onBackStep={handleBackStep}
            onCreateBilling={handleCreateBilling}
          />
          {/* 
          <Button
            sx={{ fontSize: '1.5rem', borderRadius: '20rem' }}
            onClick={() => {
              handleState();
            }}
          >
            +
          </Button> */}
          {/* {completed ? (
            <CheckoutOrderComplete open={completed} onReset={handleReset} onDownloadPDF={() => {}} />
          ) : (
            <>
              {activeStep === 0 && (
                <CheckoutCart
                  checkout={checkout}
                  onNextStep={handleNextStep}
                  onDeleteCart={handleDeleteCart}
                  onApplyDiscount={handleApplyDiscount}
                  onIncreaseQuantity={handleIncreaseQuantity}
                  onDecreaseQuantity={handleDecreaseQuantity}
                />
              )}
              {activeStep === 1 && (
                <CheckoutBillingAddress
                  checkout={checkout}
                  onBackStep={handleBackStep}
                  onCreateBilling={handleCreateBilling}
                />
              )}
              {activeStep === 2 && billing && (
                <CheckoutPayment
                  checkout={checkout}
                  onNextStep={handleNextStep}
                  onBackStep={handleBackStep}
                  onGotoStep={handleGotoStep}
                  onApplyShipping={handleApplyShipping}
                  onReset={handleReset}
                />
              )}
            </>
          )} */}
        </Container>
      </>
    );
  }
  return <Navigate to={PATH_APP.general.feature} />;
}
