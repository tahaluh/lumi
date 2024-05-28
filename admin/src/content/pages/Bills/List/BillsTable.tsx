import { FC, ChangeEvent, useState, useEffect } from 'react';
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
import { fetchBills } from '../services/fetchBills';
interface Filters {
  year?: string;
  month?: string;
  clientNumber?: string;
}

function BillsTable() {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(6);
  const [filters, setFilters] = useState<Filters>({
    year: 'all',
    month: 'all',
    clientNumber: null
  });

  useEffect(() => {
    setPage(0);
  }, [filters]);

  const { data: dataBills } = fetchBills({
    clientNumber: filters.clientNumber,
    year: filters.year,
    limit: limit,
    offset: page * limit
  });

  const bills: ElectricityBillAttributes[] = dataBills?.length ? dataBills : [];

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
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
            {(bills).map((bill) => {
              return (
                <TableRow
                  hover
                  key={bill.uuid ?? 'NULL'}
                >
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {bill.clientNumber ?? 'NULL'}
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
                      {bill.referenceMonth ?? 'NULL'}
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
                      {bill.referenceYear ?? 'NULL'}
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
                      {bill.energyAmount ?? 'NULL'}
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
                      {bill.energyTotal ?? 'NULL'}
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
                      {bill.energyICMSAmount ?? 'NULL'}
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
                      {bill.energyICMSTotal ?? 'NULL'}
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
                      {bill.energyCompensatedAmount ?? 'NULL'}
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
                      {bill.energyCompensatedTotal ?? 'NULL'}
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
                      {bill.publicLightingContribution ?? 'NULL'}
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
                      {bill.totalPrice ?? 'NULL'}
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
          count={bills.length == limit ? -1 : (page + 1) * limit + 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[6, 12, 24, 30]}
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
