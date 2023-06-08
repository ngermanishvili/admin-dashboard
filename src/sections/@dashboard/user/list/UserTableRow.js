import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Menu,
  FormControl,
  InputLabel,
  Select,
  DialogActions,
  TextField,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
// components
import { useDispatch, useSelector } from '../../../../redux/store';
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { updateFeatureValueMap } from '../../../../redux/slices/features';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  data: PropTypes.object,
  setmappedVariable: PropTypes.func,
  isSelected: PropTypes.bool,
  mappedVariable: PropTypes.any,
  selectedvalues: PropTypes.any,
};

const filter = createFilterOptions();

export default function UserTableRow({
  selectedvalues,
  mappedVariable,
  isSelected,
  setmappedVariable,
  data,
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const menuData = data.variables[data.key];
  console.log(menuData);
  const { name, percent, variableMapped } = row;

  const feature = useSelector(
    (state) => state.feature.currentSelection.currentSelectedFeatureMapValues
  );
  useEffect(() => {
    if (isSelected) {
      console.log(name);
      console.log(feature.includes(name));
    }
    // eslint-disable-next-line
  }, [isSelected, feature]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const [value, setValue] = useState(variableMapped);
  const [open, toggleOpen] = useState(false);

  const dispatch = useDispatch();
  const featureState = useSelector((state) => state.feature);
  useEffect(() => {
    const d =
      featureState.currentSelection.currentFeatureMapValue[0][
        featureState.currentSelection.currentSelectedFeatureCiColumn
      ];
    const updatedFeatureMapVariableValues = d?.map((item) => {
      if (item.name === name) {
        return { ...item, variableMapped: value };
      }
      return { ...item };
    });

    console.log(updatedFeatureMapVariableValues);
    dispatch(updateFeatureValueMap(updatedFeatureMapVariableValues));

    // dispatch()

    // eslint-disable-next-line
  }, [value]);

  const handleClose = () => {
    setDialogValue({
      element: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({
    element: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (feature.includes(name)) {
      setmappedVariable(dialogValue);
      setValue(variableMapped);
    } else {
      setValue(dialogValue);
    }
    handleClose();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={name} src={avatarUrl} /> */}

            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{percent}</TableCell>

        {/* <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {role}
        </TableCell> */}

        {/* <TableCell align="center">
          <Iconify
            icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isVerified && { color: 'warning.main' }),
            }}
          />
        </TableCell> */}

        <TableCell align="left">
          {/* <Label
            variant="soft"
            color={(status === 'banned' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label> */}
          {/* <FormControl
            sx={{ m: 0.5, minWidth: 100, background: '#078DEE', borderRadius: 1, color: 'white' }}
          >
            <InputLabel sx={{ color: 'white' }} id="demo-controlled-open-select-label">
              {Data === '' ? 'Select' : ''}
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={Data}
              // label="Data"
              onChange={handleChange}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
          {/* {menuData &&  menuData?.valueMapInfo.map(item=>

                <MenuItem value={item}>
                {item}
              </MenuItem>
              )
              
                }
            </Select>
          </FormControl> */}
          <>
            <Autocomplete
              value={variableMapped}
              onChange={(event, newValue) => {
                console.log(newValue);
                if (newValue.includes('Add ')) {
                  // timeout to avoid instant validation of the dialog's form.
                  console.log(newValue);
                  setTimeout(() => {
                    toggleOpen(true);
                    setDialogValue(newValue.replaceAll('Add ', ''));
                  });
                } else if (newValue && newValue.inputValue) {
                  console.log(newValue);
                  toggleOpen(true);
                  setDialogValue(newValue.inputValue);
                } else {
                  console.log(newValue);
                  if (feature.includes(name)) {
                    setmappedVariable(newValue);
                    setValue(variableMapped);
                  } else {
                    setValue(newValue);
                  }
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                console.log(params);
                if (params.inputValue !== '') {
                  console.log(filtered);
                  filtered.push(`Add ${params.inputValue}`);
                }

                return filtered;
              }}
              id="Variable"
              options={(menuData && menuData?.valueMapInfo) || []}
              getOptionLabel={(option) => {
                // e.g value selected with enter, right from the input
                // if (typeof option === 'string') {
                // return option;
                // }
                if (option.inputValue) {
                  return option.inputValue;
                }
                console.log(option);
                return option;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => <li {...props}>{option}</li>}
              sx={{ width: 100 }}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Variable" />}
            />
            <Dialog open={open} onClose={handleClose}>
              <form onSubmit={handleSubmit}>
                <DialogTitle>Add a new variable mapping field</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Did you not find the variable you were looking for? Add it here.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    value={dialogValue}
                    onChange={(event) => setDialogValue(event.target.value)}
                    label="title"
                    type="text"
                    variant="standard"
                  />
                  {/* <TextField
                    margin="dense"
                    id="name"
                    value={dialogValue.year}
                    onChange={(event) =>
                      setDialogValue({
                        ...dialogValue,
                        year: event.target.value,
                      })
                    }
                    label="year"
                    type="number"
                    variant="standard"
                  /> */}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Add</Button>
                </DialogActions>
              </form>
            </Dialog>
          </>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
