import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Link } from 'react-router-dom';
import { Box, Card, Stack, Button, Divider, MenuItem, Checkbox, IconButton } from '@mui/material';
// hooks
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
// utils
import { fData } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import TextMaxLine from '../../../../components/text-max-line';
import { useSnackbar } from '../../../../components/snackbar';
import ConfirmDialog from '../../../../components/confirm-dialog';
//
import FileShareDialog from '../portal/FileShareDialog';
import FileDetailsDrawer from '../portal/FileDetailsDrawer';
import FileNewFolderDialog from '../portal/FileNewFolderDialog';

// ----------------------------------------------------------------------

ConnectCard.propTypes = {
  sx: PropTypes.object,
  folder: PropTypes.object,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  image: PropTypes.string,
  noLogo: PropTypes.bool,
  routeTo:PropTypes.string,
  data:PropTypes.string,
  type:PropTypes.string
};

export default function ConnectCard({
data,
type,
  image,
  noLogo,
  routeTo,
  sx,
  ...other
}) {
    // console.log(data)
  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const [showCheckbox, setShowCheckbox] = useState(false);

  const [openShare, setOpenShare] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);

  const [itemName, setitemName] = useState(data);

  const [openEditFolder, setOpenEditFolder] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  // const [favorited, setFavorited] = useState(folder.isFavorited);

  // const handleFavorite = () => {
  //   setFavorited(!favorited);
  // };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleShowCheckbox = () => {
    setShowCheckbox(true);
  };

  const handleHideCheckbox = () => {
    setShowCheckbox(false);
  };

  const handleOpenShare = () => {
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setOpenShare(false);
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleOpenEditFolder = () => {
    setOpenEditFolder(true);
  };

  const handleCloseEditFolder = () => {
    setOpenEditFolder(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChangeInvite = (event) => {
    setInviteEmail(event.target.value);
  };

  // const handleCopy = () => {
  //   enqueueSnackbar('Copied!');
  //   copy(folder.url);
  // };

  // console.log(noLogo);

  return (
    <Link style={{textDecoration:"none"}} state={data} to={routeTo}>
      <Card
        onMouseEnter={handleShowCheckbox}
        onMouseLeave={handleHideCheckbox}
        sx={{
          p: 2.5,
          width: 1,
          maxWidth: 222,
          boxShadow: 0,
          bgcolor: 'background.secondary',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          // ...((showCheckbox || selected) && {
          //   borderColor: 'transparent',
          //   bgcolor: 'background.paper',
          //   boxShadow: (theme) => theme.customShadows.z20,
          // }),
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          {/* <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorited}
            onChange={handleFavorite}
            sx={{ p: 0.75 }}
          /> */}

          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{mb:10}}>
{        // eslint-disable-next-line no-nested-ternary
}        
{/* {noLogo ? null : ((showCheckbox || selected) && onSelect ? (
          <Checkbox
            checked={selected}
            onClick={onSelect}
            icon={<Iconify icon="eva:radio-button-off-fill" />}
            checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          />
        ) : (
        ))
        } */}
        {/* <Box component="img" src={image} sx={{ width: 40, height: 40 }} /> */}
        <TextMaxLine variant="h6" onClick={handleOpenDetails} sx={{ m:2,mt: 1, mb: 0.5 }}>
          {data}
        </TextMaxLine></Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ typography: 'caption', color: 'text.disabled' }}
        >
          <Box> {type} </Box>

          <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />

          {/* <Box> {} files </Box> */}
        </Stack>
      </Card>

      {/* <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleCopy();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          Copy Link
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleOpenShare();
          }}
        >
          <Iconify icon="eva:share-fill" />
          Share
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleOpenEditFolder();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

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
      </MenuPopover> */}

      {/* <FileDetailsDrawer
        item={folder}
        favorited={favorited}
        onFavorite={handleFavorite}
        onCopyLink={handleCopy}
        open={openDetails}
        onClose={handleCloseDetails}
        onDelete={() => {
          handleCloseDetails();
          onDelete();
        }}
      /> */}

      {/* <FileShareDialog
        open={openShare}
        shared={folder.shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          handleCloseShare();
          setInviteEmail('');
        }}
      /> */}

      <FileNewFolderDialog
        open={openEditFolder}
        onClose={handleCloseEditFolder}
        title="Edit Folder"
        onUpdate={() => {
          handleCloseEditFolder();
          setitemName(itemName);
          console.log('UPDATE FOLDER', itemName);
        }}
        folderName={itemName}
        onChangeFolderName={(event) => setitemName(event.target.value)}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" >
            Delete
          </Button>
        }
      />
    </Link>
  );
}
