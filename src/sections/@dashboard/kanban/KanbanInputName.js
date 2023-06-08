import PropTypes from 'prop-types';
// @mui
import { InputBase, Typography } from '@mui/material';

// ----------------------------------------------------------------------

KanbanInputName.propTypes = {
  sx: PropTypes.object,
  value: PropTypes.string,
};

export default function KanbanInputName({ sx, value }) {
  return (
    <Typography
      variant="h6"
      sx={{
        flexGrow: 1,
        py: 1,
        // borderRadius: 1,
      }}
    >
      {value}
    </Typography>
  );
}
