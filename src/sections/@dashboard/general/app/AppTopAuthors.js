import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Stack, Card, Avatar, CardHeader, Typography, Paper } from '@mui/material';
import { useState } from 'react';
// utils
import { useLocation } from 'react-router';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import { ShopProductSearch } from '../../e-commerce/shop';

// ----------------------------------------------------------------------

AppTopAuthors.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
  subheader: PropTypes.string,
  loadSearch: PropTypes.bool,
  cWidth:PropTypes.number
};

export default function AppTopAuthors({cWidth, title, subheader, list, ...other }) {
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

      <Stack spacing={2} sx={{ pt: 2 }}>
        
        {list.map((item, index) => (
          <AuthorItem key={index} featureName={item} index={index} />
        ))}
      </Stack>
    </Paper>
  );
}

// ----------------------------------------------------------------------

AuthorItem.propTypes = {
  featureName: PropTypes.string,

  index: PropTypes.number,
};

function AuthorItem({ featureName, index }) {
  return (
    <Stack sx={{ bgcolor: 'white', width: '100%' }} direction="row" alignItems="center" spacing={2}>
      <Box sx={{ flexGrow: 1, p: 1.5 }}>
        <Typography sx={{ color: 'black' }} variant="subtitle2">
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
  );
}
