import { Card } from '@mui/material';
import { CryptoOrder } from 'src/models/crypto_order';
import BillsTable from './BillsTable';
import { subDays } from 'date-fns';
import { ElectricityBillAttributes } from '../types/ElectricityBill';

function BillsList() {
  const bills: ElectricityBillAttributes[] = [
    {
      barCode: '23790.123',
      clientNumber: '1',
      installationNumber: '123',
      referenceMonth: 2,
      referenceYear: 2024,
      energyAmount: 100,
      energyTotal: 100,
      dueDate: '23/24',
      energyCompensatedAmount: 0,
      energyCompensatedPrice: 0,
      energyICMSAmount: 0,
      energyICMSTotal: 0,
      publicLightingContribution: 0,
      totalPrice: 100,
      energyCompensatedTotal: 0,
      energyICMSPrice: 0,
      energyPrice: 0,
      pdfText: 'PDF',
      pdfUrl: 'https://www.google.com',
      uuid: '123',
    },
    {
      barCode: '23790.123',
      clientNumber: '2',
      installationNumber: '123',
      referenceMonth: 2,
      referenceYear: 2024,
      energyAmount: 100,
      energyTotal: 100,
      dueDate: '23/24',
      energyCompensatedAmount: 0,
      energyCompensatedPrice: 0,
      energyICMSAmount: 0,
      energyICMSTotal: 0,
      publicLightingContribution: 0,
      totalPrice: 100,
      energyCompensatedTotal: 0,
      energyICMSPrice: 0,
      energyPrice: 0,
      pdfText: 'PDF',
      pdfUrl: 'https://www.google.com',
      uuid: '123',
    }
  ];

  return (
    <Card>
      <BillsTable bills={bills} />
    </Card>
  );
}

export default BillsList;
