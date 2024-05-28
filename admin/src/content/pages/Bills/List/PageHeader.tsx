import { Typography, Button, Grid } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useState } from 'react';
import AddBillModal from '../components/AddBillModal';


function PageHeader() {
  const [openAddBillsModal, setOpenAddBillsModal] = useState(false);

  const handleOpenAddBillsModal = () => {
    setOpenAddBillsModal(true);
  };

  const handleCloseAddBillsModal = () => {
    setOpenAddBillsModal(false);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Faturas
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleOpenAddBillsModal}>
          <FileUploadIcon sx={{ marginRight: 1 }} />
          Adicionar fatura
        </Button>
        <AddBillModal open={openAddBillsModal} onClose={handleCloseAddBillsModal} />
      </Grid>
    </Grid>
  );
}

export default PageHeader;
