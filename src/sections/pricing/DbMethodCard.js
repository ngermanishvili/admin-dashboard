import PropTypes from 'prop-types';
// @mui
import { Card, Button, Typography, Box, Stack } from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
// assets
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

DbMethodCard.propTypes = {
  sx: PropTypes.object,
  card: PropTypes.object,
  index: PropTypes.number,
};

export default function DbMethodCard({ card, index, sx, ...other }) {
  const { subscription, price, caption, lists,description, labelAction } = card;

  return (
    <Card
      sx={{
        p: 0,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        boxShadow: (theme) => theme.customShadows.z24,
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        // ...((index === 0 || index === 2) && {
        //   boxShadow: 'none',
        //   bgcolor: 'background.default',
        // }),
        
      }}
      
    >
      {/* {index === 1 && (
        <Label color="info" sx={{ top: 16, right: 16, position: 'absolute' }}>
          POPULAR
        </Label>
      )} */}

      {/* <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {subscription}
      </Typography> */}

      <Stack spacing={1} direction="column" sx={{p:7,display:"flex",aspectRatio:1 , height:"300px",background:"linear-gradient(to bottom, #DC4E66, #4F3AB9)" }}>
        {/* {(index === 1 || index === 2) && <Typography variant="h5">$</Typography>} */}
        <Box sx={{borderRadius:"1rem",height:"2rem",width:"2rem",bgcolor:"white"}}/>
        <Typography variant="h4">{labelAction}</Typography>

          <Typography component="span" sx={{ alignSelf: 'center', color: 'whitesmoke' ,opacity:0.7}}>
            {description}
          </Typography>
      </Stack>

      {/* <Typography
        variant="caption"
        sx={{
          color: 'primary.main',
          textTransform: 'capitalize',
        }}
      >
        {caption}
      </Typography> */}

      {/* <Box sx={{ width: 80, height: 80, mt: 5 }}>
        {(subscription === 'basic' && <PlanFreeIcon />) ||
          (subscription === 'starter' && <PlanStarterIcon />) || <PlanPremiumIcon />}
      </Box> */}

      <Stack component="ul"  spacing={2} sx={{ p: 5,pb:0, m: 0, alignSelf:"self-start",flexGrow:1 }}>
        {lists.map((item) => (
          <Stack
            key={item.primaryText}
            component="li"
            direction="column"
            
            justifyContent="space-evenly"
            alignItems="left"
            spacing={1}
            sx={{
              typography: 'body2',
              my:1
            }}
          >
            {/* <Iconify
              icon={item.isAvailable ? 'eva:checkmark-fill' : 'eva:close-fill'}
              width={16}
              sx={{
                color: item.isAvailable ? 'primary.main' : 'inherit',
              }}
            /> */}
            <Typography sx={{color:"text.primary"}}  variant="subtitle1">{item.primaryText}</Typography>
            <Typography sx={{color:"text.disabled"}} variant="subtitle2">{item.secondaryText}</Typography>
          </Stack>
        ))}
      </Stack>

      <Button sx={{m:2,mx:10}}  size="large" variant="contained" >
        {labelAction}
      </Button>
    </Card>
  );
}
