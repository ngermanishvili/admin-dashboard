import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
// @mui
import { Collapse, Box, Divider, Button } from '@mui/material';
import { useSelector } from '../../../../redux/store';
// components
import Iconify from '../../../../components/iconify';
//
import FilePanel from '../FilePanel';
import FileCard from '../item/FileCard';
import FileFolderCard from '../item/FileFolderCard';
import FileShareDialog from '../portal/FileShareDialog';
import FileActionSelected from '../portal/FileActionSelected';
import FileNewFolderDialog from '../portal/FileNewFolderDialog';
import ConnectCard from '../item/ConnectCard';

// ----------------------------------------------------------------------

ConnectGridView.propTypes = {
  // data: PropTypes.array,
  table: PropTypes.object,
  onDeleteItem: PropTypes.func,
  dataFiltered: PropTypes.array,
  onOpenConfirm: PropTypes.func,
  title: PropTypes.string,
  twoRow: PropTypes.bool,
  noLogo: PropTypes.bool,
  routeTo:PropTypes.string,
  dataTitle:PropTypes.string
};

export default function ConnectGridView({
  table,
  // data,
  dataTitle,
  dataFiltered,
  onDeleteItem,
  onOpenConfirm,
  title,
  twoRow,
  noLogo = false,
  routeTo=null
}) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const containerRef = useRef(null);

  const [folderName, setFolderName] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');

  const [openShare, setOpenShare] = useState(false);

  const [collapseFiles, setCollapseFiles] = useState(false);

  const [openNewFolder, setOpenNewFolder] = useState(false);

  const [openUploadFile, setOpenUploadFile] = useState(false);

  const [collapseFolders, setCollapseFolders] = useState(false);

  const handleOpenShare = () => {
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setOpenShare(false);
  };

  const handleOpenNewFolder = () => {
    setOpenNewFolder(true);
  };

  const handleCloseNewFolder = () => {
    setOpenNewFolder(false);
  };

  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  };

  const handleChangeInvite = (event) => {
    setInviteEmail(event.target.value);
  };
  const tempColumns = twoRow
    ? { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }
    : {
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      };

    

      return (
    <>
      <Box ref={containerRef}>
        <FilePanel
          title={title}
          onOpen={handleOpenNewFolder}
          collapse={collapseFolders}
          onCollapse={() => setCollapseFolders(!collapseFolders)}
        /> 

        <Collapse in={!collapseFolders} unmountOnExit>
          <Box gap={3} display="grid" gridTemplateColumns={{ ...tempColumns }}>
            {dataFiltered.map((item,key) => (
                <ConnectCard
                routeTo={routeTo}
                  key={key}
                  data={item.Name}
                  type={item.Type}
                  noLogo={noLogo}
                  // selected={selected.includes(folder.id)}
                  // onSelect={() => onSelectItem(folder.id)}
                  // onDelete={() => onDeleteItem(folder.id)}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}

              
          </Box>
        </Collapse>
        {/* <Collapse in={!collapseFolders} unmountOnExit>
          <Box gap={3} display="grid" gridTemplateColumns={{ ...tempColumns }}>
            {data.subCategories
              .map((subcat,key) => (
                <FileFolderCardz
                routeTo={routeTo}
                  mainData={subcat}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}

              
          </Box>
        </Collapse> */}

        {!!selected?.length && (
          <FileActionSelected
            numSelected={selected.length}
            // rowCount={data.length}
            selected={selected}
            onSelectAllItems={(checked) =>
              onSelectAllItems(
                checked,
                // data.map((row) => row.id)
              )
            }
            action={
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  onClick={onOpenConfirm}
                  sx={{ mr: 1 }}
                >
                  Delete
                </Button>

                <Button
                  color="inherit"
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="eva:share-fill" />}
                  onClick={handleOpenShare}
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === 'light' ? 'grey.800' : 'common.white',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                    '&:hover': {
                      color: (theme) =>
                        theme.palette.mode === 'light' ? 'grey.800' : 'common.white',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                    },
                  }}
                >
                  Share
                </Button>
              </>
            }
          />
        )}
      </Box>

      <FileShareDialog
        open={openShare}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => {
          handleCloseShare();
          setInviteEmail('');
        }}
      />

      <FileNewFolderDialog open={openUploadFile} onClose={handleCloseUploadFile} />

      <FileNewFolderDialog
        open={openNewFolder}
        onClose={handleCloseNewFolder}
        title="New Folder"
        onCreate={() => {
          handleCloseNewFolder();
          setFolderName('');
          console.log('CREATE NEW FOLDER', folderName);
        }}
        folderName={folderName}
        onChangeFolderName={(event) => setFolderName(event.target.value)}
      />
    </>
  );
}
