import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Stack,
  Card,
  Avatar,
  CardHeader,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material';
import { useState } from 'react';
// utils
import { useLocation } from 'react-router';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import { ShopProductSearch } from '../../e-commerce/shop';
import { CustomTextField } from '../../../../components/custom-input';

// ----------------------------------------------------------------------

VariableAppTopAuthor.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
  subheader: PropTypes.string,
  loadSearch: PropTypes.bool,
  cWidth: PropTypes.number,
  getVariableMapData: PropTypes.func,
};

export default function VariableAppTopAuthor({
  getVariableMapData,
  cWidth,
  title,
  subheader,
  list,
  ...other
}) {
  const [data, setData] = useState([...list]);
  const [selected, setSelected] = useState(0);

  const handleSearch = (e) => {
    const query = e.target.value;
    console.log(query);
    if (query === '') {
      setData(list);
      return;
    }
    const newData = list.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
    console.log(newData);
    // setData(newData);
    setData(newData);
  };
  // console.log(list)
  return (
    <Paper
      variant="outlined"
      sx={{
        width: cWidth,
        py: 1,
        borderRadius: 1,
        borderStyle: 'dashed',
        bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.100' : 'background.default'),
      }}
      {...other}
    >
      <CardHeader sx={{ mb: 2 }} title={title} subheader={subheader} />
      <Stack
        direction="row"
        sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
        justifyContent="space-between"
      >
        <CustomTextField
          sx={{ width: '100%',px:1 }}
          onChange={handleSearch}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack spacing={2} sx={{ pt: 2 }}>
        {data.map((item, index) => (
          // eslint-disable-next-line
          <AuthorItem
            key={index}
            getVariableMapData={getVariableMapData}
            featureName={item}
            index={index}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </Stack>
    </Paper>
  );
}

// ----------------------------------------------------------------------

AuthorItem.propTypes = {
  featureName: PropTypes.string,

  index: PropTypes.number,
  getVariableMapData: PropTypes.func,
  selected: PropTypes.number,
  setSelected: PropTypes.func,
};

function AuthorItem({ getVariableMapData, featureName, index, selected, setSelected }) {
  return (
    // eslint-disable-next-line
    <div
      onClick={() => {
        getVariableMapData(featureName);
        setSelected(index);
      }}
    >
      <Stack
        sx={{
          bgcolor: selected === index ? 'white' : 'transparent',
          width: '100%',
          border: '1px solid gray',
          cursor: 'pointer',
        }}
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Box sx={{ flexGrow: 1, p: 1.2 }}>
          <Typography sx={{ color: selected === index ? 'black' : 'white' }} variant="subtitle2">
            {featureName}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'gray',
            }}
          >
            sample data :
          </Typography>
        </Box>
      </Stack>
    </div>
  );
}
