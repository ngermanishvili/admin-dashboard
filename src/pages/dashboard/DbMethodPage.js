import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Switch, Container, Typography, Stack, Card } from '@mui/material';
// _mock_
import { _dbmethod } from '../../_mock/arrays';
// sections
import { DbMethodCard } from '../../sections/pricing';

// ----------------------------------------------------------------------

export default function DbMethodPage() {
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
        {/* <Typography variant="h3" align="center" paragraph>
          Flexible plans for your
          <br /> community&apos;s size and needs
        </Typography>

        <Typography align="center" sx={{ color: 'text.secondary' }}>
          Choose your plan and make modern online conversation magic
        </Typography> */}

        {/* <Box sx={{ my: 5 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Typography variant="overline" sx={{ mr: 1.5 }}>
              MONTHLY
            </Typography>

            <Switch />
            <Typography variant="overline" sx={{ ml: 1.5 }}>
              YEARLY (save 10%)
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            align="right"
            sx={{ color: 'text.secondary', display: 'block' }}
          >
            * Plus applicable taxes
          </Typography>
        </Box> */}

        <Card sx={{p:4}}>
        <Box  gap={4} display="grid" gridTemplateColumns={{ md: 'repeat(3, 1fr)' }}>
          {_dbmethod.map((card, index) => (
            <DbMethodCard key={card.subscription} card={card} index={index} />
          ))}
        </Box>
        </Card>
      </Container>
    </>
  );
}
