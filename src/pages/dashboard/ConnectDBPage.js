import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { PATH_APP } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import { ConnectDBForm } from '../../sections/@dashboard/blog';
import { useSelector, useDispatch } from '../../redux/store';
import { getFormFields } from '../../redux/slices/features';

// ----------------------------------------------------------------------

export default function BlogNewPostPage() {
  const { themeStretch } = useSettingsContext();

  const location = useLocation();
  const dispatch = useDispatch();
  console.log(location.state);
  const feature = useSelector((state) => state.feature.currentSelection.currentDsKey);
  // const dSourceId = feature.currentSelection.currentDsKey;
  useEffect(() => {
    dispatch(getFormFields(feature, location.state));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Helmet>
        <title> Connect Database </title>
      </Helmet>

      <Container maxWidth="lg">
        <ConnectDBForm />
      </Container>
    </>
  );
}
