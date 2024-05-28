import { Card } from '@mui/material';
import BillsTable from './BillsTable';
import { useParams, useSearchParams } from 'react-router-dom';

function BillsList() {
  return (
    <Card>
      <BillsTable />
    </Card>
  );
}

export default BillsList;
