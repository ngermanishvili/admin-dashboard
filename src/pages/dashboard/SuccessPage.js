import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Switch, Container, Typography, Stack, Card, LinearProgress, Button } from '@mui/material';
// _mock_
import { _dbmethod } from '../../_mock/arrays';
// sections
import { DbMethodCard } from '../../sections/pricing';

// ----------------------------------------------------------------------

export default function SuccessPage() {
  return (
    <>
      <Helmet>
        <title> Pricing | Minimal UI</title>
      </Helmet>

      <Container
        sx={{
          pt: 15,
          pb: 10,
          minHeight: 1,
        }}
      >
        <Card sx={{ p: 4 }}>
            <Box sx={{wodth:"100%",my:2}}><LinearProgress variant="determinate" sx={{ height: '10px' }} value={100} /></Box>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Box
              sx={{
                width: '150px',
                borderRadius: '10rem',
                height: '150px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                m: 4,
                bgcolor: '#69C2D2',
              }}
            >
              <img
                width="120"
                height="120"
                src="https://img.icons8.com/ios-glyphs/500/ffffff/checkmark--v1.png"
                alt="checkmark--v1"
              />
            </Box>

            <Box sx={{flexDirection:"column",display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',}}>
                <Typography sx={{m:2,alignSelf:"center",color:"#69C2D2"}} variant='h4'>100%</Typography>
                <Typography  sx={{m:2}} variant='h6'>Data Upload Complete:</Typography>
                <Typography  sx={{m:2,color:"text.secondary",textAlign:"center"}} variant='subtitle2'>Great news! Your analysis is now complete, and the results have been pushed to your database. Explore the insights and visualizations to make informeddecisions and empower your banking, fintech, or insurance use cases. Get ready to harness the power of data with Cyborg Intell ODA Feature Store</Typography>
            </Box>
            <Box
                 sx={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                 }}   
                    >
                <Button sx={{color:"white",m:2}} variant='outlined'>Dashboard</Button>
                <Button sx={{color:"white",m:2}} variant='outlined'><img width="20"  height="20" src="https://img.icons8.com/android/24/ffffff/plus.png" alt="plus"/>&nbsp; New Run</Button>
            </Box>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
