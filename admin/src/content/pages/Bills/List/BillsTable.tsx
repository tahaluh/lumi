import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  TextField,
  MenuItem,
  CardHeader,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { ElectricityBillAttributes } from '../types/ElectricityBill';

interface RecentOrdersTableProps {
  className?: string;
  bills: ElectricityBillAttributes[];
}
interface Filters {
  year?: string;
  month?: string;
  clientNumber?: string;
}

const BillsTable: FC<RecentOrdersTableProps> = ({ bills }) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    year: 'all',
    month: 'all',
    clientNumber: null
  });


  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const theme = useTheme();

  return (
    <Card>
      <CardHeader
        title="Listagem de Faturas"
        action={
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              id="outlined-select-currency"
              select
              label="Ano de Referência"
              value={filters.year}
              fullWidth
              onChange={(e) =>
                setFilters({
                  ...filters,
                  year: (e.target.value)
                })
              }
            >
              <MenuItem value={'all'}>
                Todos
              </MenuItem>
              <MenuItem value={'2021'}>
                2021
              </MenuItem>
              <MenuItem value={'2022'}>
                2022
              </MenuItem>
              <MenuItem value={'2023'}>
                2023
              </MenuItem>
              <MenuItem value={'2024'}>
                2024
              </MenuItem>
            </TextField>

            <TextField
              id="client-number-input"
              label="Número do cliente"
              placeholder="Número do cliente..."
              fullWidth
              variant="outlined"
              value={filters.clientNumber}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  clientNumber: e.target.value
                })
              }
            />
          </Box>
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{`N° Cliente`}</TableCell>
              <TableCell>{`Mês`}</TableCell>
              <TableCell>{`Ano`}</TableCell>
              <TableCell>{`E. Elétrica (kWh)`}</TableCell>
              <TableCell>{`Valor Elétrica`}</TableCell>
              <TableCell>{`E. SCEEE s/ICMS (kWh)`}</TableCell>
              <TableCell>{`Valor SCEEE s/ICMS`}</TableCell>
              <TableCell>{`E. Compensada (kWh)`}</TableCell>
              <TableCell>{`Valor Compensada`}</TableCell>
              <TableCell>{`Contrib. Ilum. Pública`}</TableCell>
              <TableCell>{`Valor Total`}</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => {
              return (
                <TableRow
                  hover
                  key={bill.uuid}
                >
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.clientNumber}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.referenceMonth}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.referenceYear}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.energyAmount}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.energyTotal}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.energyICMSAmount}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.energyICMSTotal}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.energyCompensatedAmount}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.energyCompensatedTotal}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.publicLightingContribution}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.totalPrice}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Baixar Fatura" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>

                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={bills.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
}

BillsTable.propTypes = {
  bills: PropTypes.array.isRequired
};

BillsTable.defaultProps = {
  bills: []
};

export default BillsTable;
