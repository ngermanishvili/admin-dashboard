import PropTypes from 'prop-types';
// form
// @mui
import { Switch, FormControlLabel, FormHelperText } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

// ----------------------------------------------------------------------

CustomSwitch.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
  allSelected: PropTypes.bool,
  setAsSelected: PropTypes.func,
};

export default function CustomSwitch({ name, helperText, setAsSelected, allSelected, ...other }) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (allSelected) setIsChecked(false);
    const isSelected = isChecked || allSelected;
    const obj = { name, val: isSelected };
    // console.log(obj)
    setAsSelected(obj);
    // eslint-disable-next-line
  }, [allSelected, isChecked]);

  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            // {...field}
            onClick={() => setIsChecked((prev) => !prev)}
            checked={isChecked || allSelected}
          />
        }
        {...other}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </div>
  );
}
