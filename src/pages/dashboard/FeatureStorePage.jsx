import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Stack } from '@mui/material';
import { useEffect } from 'react';
import { getCategory } from '../../redux/slices/features';
import { useDispatch, useSelector } from '../../redux/store';

// _mock_
import {
  _bankingContacts,
  _bankingCreditCard,
  _bankingRecentTransitions,
} from '../../_mock/arrays';
import { useSettingsContext } from '../../components/settings';
// sections
import {
  BankingContacts,
  BankingWidgetSummary,
  BankingInviteFriends,
  BankingQuickTransfer,
  BankingCurrentBalance,
  BankingBalanceStatistics,
  BankingRecentTransitions,
  BankingExpensesCategories,
} from '../../sections/@dashboard/general/banking';

// ----------------------------------------------------------------------
export default function FeatureStorePage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.feature);
  // console.log(category);

  useEffect(() => {
    dispatch(getCategory());
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Helmet>
        <title>Feature Store</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Stack
              justifyContent="space-around"
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
            >
              {category.slice(0, 3).map((item) => (
                <BankingWidgetSummary
                subCategories={item.categories}
                  title={item.name}
                  icon="eva:diagonal-arrow-right-up-fill"
                  content={item.descr}
                  total={18765}
                  chart={{
                    series: [41, 66, 76, 88, 174, 154, 157, 184],
                  }}
                />
              ))}
              {/* <BankingWidgetSummary
                title="Expenses"
                color="warning"
                icon="eva:diagonal-arrow-right-up-fill"
                content="Bank Statement (Deposit)"
                total={8938}
                chart={{
                  series: [41, 66, 76, 88, 174, 154, 157, 184],
                }}
              />
              <BankingWidgetSummary
                title="Expenses"
                color="error"
                icon="eva:diagonal-arrow-right-up-fill"
                content="Digital FootPrint"
                total={8938}
                chart={{
                  series: [41, 66, 76, 88, 174, 154, 157, 184],
                }}
              /> */}
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              // onClick={() => console.log('Hello')}
              justifyContent="space-around"
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
            >
              {category.slice(3, 6).map((item) => (
                <BankingWidgetSummary
                  title={item.name}
                  icon="eva:diagonal-arrow-right-up-fill"
                  content={item.descr}
                  total={18765}
                  chart={{
                    series: [41, 66, 76, 88, 174, 154, 157, 184],
                  }}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              justifyContent="space-around"
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
            >
              {category.slice(6, 9).map((item) => (
                <BankingWidgetSummary
                  title={item.name}
                  icon="eva:diagonal-arrow-right-up-fill"
                  content={item.descr}
                  total={18765}
                  chart={{
                    series: [41, 66, 76, 88, 174, 154, 157, 184],
                  }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
