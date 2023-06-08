import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Button, Typography, IconButton } from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

FilePanel.propTypes = {
  sx: PropTypes.object,
  link: PropTypes.string,
  onOpen: PropTypes.func,
  title: PropTypes.string,
  collapse: PropTypes.bool,
  subTitle: PropTypes.string,
  onCollapse: PropTypes.func,
};

export default function FilePanel({
  title,
  subTitle,
  link,
  onOpen,
  collapse,
  onCollapse,
  sx,
  ...other
}) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 3, ...sx }} {...other}>
      <Stack flexGrow={1}>
        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
          <Typography variant="h6"> {title} </Typography>

         
        </Stack>

     
      </Stack>

      {link && (
        <Button
          component={RouterLink}
          to={link}
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:chevron-right-fill" />}
        >
          View All
        </Button>
      )}

      {onCollapse && (
        <IconButton onClick={onCollapse}>
          <Iconify icon={collapse ? 'eva:chevron-down-fill' : 'eva:chevron-up-fill'} />
        </IconButton>
      )}
    </Stack>
  );
}
