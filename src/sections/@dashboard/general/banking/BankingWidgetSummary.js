import PropTypes from 'prop-types';
// @mui
import { Link, Navigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, Box } from '@mui/material';
import { PATH_APP } from '../../../../routes/paths';
// utils
import { fCurrency, fPercent } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import Chart, { useChart } from '../../../../components/chart';


// ----------------------------------------------------------------------

BankingWidgetSummary.propTypes = {
  sx: PropTypes.object,
  chart: PropTypes.object,
  color: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
  content: PropTypes.string,
  subCategories:PropTypes.array,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default function BankingWidgetSummary({
  title,
  subCategories=[],
  total,
  icon,
  content,
  color = 'primary',
  chart,
  sx,
  ...other
}) {
  const theme = useTheme();

  const { series, options } = chart;

  const chartOptions = useChart({
    colors: [theme.palette[color].main],
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      labels: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    stroke: {
      width: 4,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => fCurrency(value),
        title: {
          formatter: () => '',
        },
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.56,
        opacityTo: 0.56,
      },
    },
    ...options,
  });

  return (
    <Link style={{textDecoration:"none"}} state={{title,subCategories}} to={PATH_APP.general.datasources}>
      <Card
  
  sx={{
    boxShadow: 0,
    color: theme.palette[color].darker,
    bgcolor: theme.palette[color].lighter,
    ...sx,
  }}
  {...other}
>
  <div>    <Iconify
    icon={icon}
    sx={{
      p: 1.5,
      top: 24,
      right: 24,
      width: 48,
      height: 48,
      borderRadius: '50%',
      position: 'absolute',
      color: theme.palette[color].lighter,
      bgcolor: theme.palette[color].dark,
    }}
  />
  </div>

  <Stack spacing={1} sx={{ p: 3 }}>
    <Typography variant="subtitle2">&nbsp;</Typography>

    <Typography variant="h3">&nbsp;</Typography>

    <TrendingInfo content={content} />
  </Stack>

  <Chart type="area" series={[{ data: series }]} options={chartOptions} height={120} />
</Card>
    </Link>
  );
}

// ----------------------------------------------------------------------

TrendingInfo.propTypes = {
  content: PropTypes.string,
};

function TrendingInfo({ content }) {
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={0.5}>
      <Iconify icon='eva:trending-up-fill' />

      <Typography variant="subtitle2" component="span">
        {/* {percent > 0 && '+'}

        {fPercent(percent)} */}

        <Box component="span" sx={{ opacity: 0.72, typography: 'body2' }}>
          {content}
        </Box>
      </Typography>
    </Stack>
  );
}
