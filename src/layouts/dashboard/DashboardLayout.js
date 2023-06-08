import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { useDispatch, useSelector } from '../../redux/store';
import { changeCurrentDataMapState, dSourceStatus } from '../../redux/slices/features';
// components
import { useSettingsContext } from '../../components/settings';
//
import Main from './Main';
import Header from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
import NavHorizontal from './nav/NavHorizontal';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const feature = useSelector((state) => state.feature);

  const dispatch = useDispatch()
  const location = useLocation()
  

  const currentstate = useSelector((state) => state.feature.currentSelection.dSourceStatus);
  let stepmap = [];
  Object.keys(currentstate).forEach((item, key) => {
    // console.log(item);
    currentstate[item].forEach((subItem, subKey) => {
      if (subItem.status.toLowerCase() === 'in progress') {
        // console.log(item, key);
        // console.log(subItem, subKey);
        // if(!stepmap.includes({key,subKey}))
        // stepmap.push({key,subKey})
        stepmap = [...stepmap, { key, subKey }];
      }
    });
  });
  
  
  useEffect(() => {
    dispatch(dSourceStatus())
    dispatch(changeCurrentDataMapState(stepmap));
        // eslint-disable-next-line
      }, [location])

  const proKey = feature.currentSelection.projectKey;

  useEffect(() => {
    dispatch(dSourceStatus(proKey));
    dispatch(changeCurrentDataMapState(stepmap));
    // eslint-disable-next-line
  }, [location,proKey]);

  const featuredscourcestatus = feature.currentSelection.dSourceStatus;

  const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} />;

  if (isNavHorizontal) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        {isDesktop ? <NavHorizontal /> : renderNavVertical}

        <Main>
          <Outlet />
        </Main>
      </>
    );
  }

  if (isNavMini) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {isDesktop ? <NavMini /> : renderNavVertical}

          <Main>
            <Outlet />
          </Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={handleOpen} />

      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}

        <Main>
          <Outlet />
        </Main>
      </Box>
    </>
  );
}
