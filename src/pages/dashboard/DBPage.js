// eslint-disable
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Box, Card, Button, Typography, Stack, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from '../../redux/store';
import { PATH_APP } from '../../routes/paths';
import { getTableName, setSelectedTable } from '../../redux/slices/features';
// components
import Iconify from '../../components/iconify';
import { ShopProductSearch } from '../../sections/@dashboard/e-commerce/shop';
import { BlogPostCommentForm } from '../../sections/@dashboard/blog';

// ----------------------------------------------------------------------
import { _userFollowers as followers } from '../../_mock/arrays';
import { CustomTextField } from '../../components/custom-input';

export default function DBPage() {
  const dispatch = useDispatch();
  const tableNames = useSelector((state) => state.feature.currentSelection.table.tableNames);
  const dSourceId = useSelector((state) => state.feature.currentSelection.currentDsKey);

  console.log(tableNames);
  useEffect(() => {
    dispatch(getTableName(dSourceId));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setData(tableNames);
  }, [tableNames]);

   function selectTable(id) {
    if(selected === id) {
      dispatch(setSelectedTable(null)); // deselect if selected table is clicked again
    } else {
      dispatch(setSelectedTable(id));
    }
  }

  const selected = useSelector((state) => state.feature.currentSelection.table.selected);

const [data, setData] = useState([...tableNames]);
const [query, setQuery] = useState('');
const [queryExecuted, setQueryExecuted] = useState(false);

const handleSearch = (e) => {
  const searchQuery = e.target.value;
  if (searchQuery === '') {
    setData(tableNames);
    return;
  }
  const newData = tableNames.filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()));
  setData(newData);
};

const handleQueryChange = (e) => {
  setQuery(e.target.value);
  if (selected !== null) {
    dispatch(setSelectedTable(null));
  }
};

const handleExecuteQuery = () => {
  // Execute the query
  // Set queryExecuted to true
  setQueryExecuted(true);
};

const queryButtonEnabled = query.trim() !== '' && selected === null;
const tableSelectEnabled = query.trim() === '' || !queryExecuted;
const importButtonEnabled = (selected !== null || queryExecuted);
  return (
    <>
      <Stack
        spacing={4}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" sx={{ my: 5 }}>
          Tables
        </Typography>

        {/* <ShopProductSearch sx={{alignSelf:"end"}}/> */}
        <CustomTextField
          onChange={handleSearch}
          // {...params}
          width={220}
          placeholder="Search..."
          // onKeyUp={handleKeyUp}
          InputProps={{
            // ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {data?.map((name, key) => (
          /* eslint-disable react/jsx-no-bind */
          <FollowerCard key={key} id={key} select={selectTable} selectedId={selected} Name={name} />
        ))}
      </Box>
      <br />
      <br />
      <Card
        sx={{
          p: 3,
        }}
      >
        <Stack
          sx={{
            px: { md: 5 },
          }}
        >
          <Stack direction="row" sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Run Query</Typography>

            <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
              {/* ({post.comments.length}) */}
            </Typography>
          </Stack>

          <BlogPostCommentForm name="query" placeholder="Run query" commentButton="execute" />

          {/* <Divider sx={{ mt: 5, mb: 2 }} /> */}
        </Stack>

        <br />
        <br />

       
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          // color="inherit"
          size="large"
          variant="outlined"
          // loading={loadingSave && isSubmitting}
          // onClick={handleSubmit(handleSaveAsDraft)}
        >
          Back
        </LoadingButton>

        <Link to={PATH_APP.general.datecolmapping}>
          <LoadingButton
            size="large"
            variant="contained"
            // loading={loadingSend && isSubmitting}
            // onClick={handleSubmit(handleCreateAndSend)}
          >
            {/* {isEdit ? 'Update' : 'Create'} & Send */}Import
          </LoadingButton>
        </Link>
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

FollowerCard.propTypes = {
  Name: PropTypes.string,
  select: PropTypes.func,
  id: PropTypes.number,
  selectedId: PropTypes.number,
};

function FollowerCard({ Name, id, select, selectedId }) {
  // console.log(Name);

  return (
    <Card
      sx={{
        p: 4,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} /> */}

      <Box
        sx={{
          pl: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          pr: 1,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Typography variant="subtitle2" noWrap>
          {Name}
        </Typography>

        <Stack spacing={0.5} direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
          {/* <Iconify icon="eva:pin-fill" width={16} sx={{ flexShrink: 0 }} /> */}

          <Typography variant="body2" component="span" noWrap>
            400 Records
          </Typography>
        </Stack>
      </Box>

      <Button
        size="small"
        onClick={() => select(id)}
        variant={selectedId === id ? 'text' : 'outlined'}
        color={selectedId === id ? 'primary' : 'inherit'}
        startIcon={selectedId === id && <Iconify icon="eva:checkmark-fill" />}
        sx={{ flexShrink: 0 }}
      >
        {selectedId === id ? 'Selected' : 'Select'}
      </Button>
    </Card>
  );
}
