import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// routes
import { PATH_APP } from '../routes/paths';
// components
import LoadingScreen from '../components/loading-screen';
//
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  // const { isAuthenticated, isInitialized, user } = useAuthContext();
  const { isAuthenticated, isInitialized } = useAuthContext();
  const user={
    isNew:true
  }
  if (isAuthenticated ) {
    if(user.isNew){
      return <Navigate to={PATH_APP.general.feature} />;
    }
    return <Navigate to={PATH_APP.root} />;
  }
  // if (isAuthenticated ) {
  //   if(user.isNew){
  //     return <Navigate to={PATH_APP.general.feature} />;
  //   }
  //   return <Navigate to={PATH_APP.root} />;
  // }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
