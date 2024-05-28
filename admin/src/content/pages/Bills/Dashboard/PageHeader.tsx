import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useState } from 'react';
import AddBillModal from './AddBillModal';


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
          Dashboard
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleOpenAddBillsModal}>
          Adicionar fatura
        </Button>
        <AddBillModal open={openAddBillsModal} onClose={handleCloseAddBillsModal} />
      </Grid>
    </Grid>
  );
}

export default PageHeader;
