import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, Box, CardHeader, FormControl, InputLabel, Select, TextField, Typography, MenuItem } from '@mui/material';
import { useTheme } from '@emotion/react';

interface Filters {
  year?: string;
  month?: string;
  clientNumber?: string;
}

function BillDashboardCharts() {
  const theme = useTheme();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    year: 'all',
    month: 'all',
    clientNumber: null
  });

  const [chartEnergyData, setChartEnergyData] = useState({
    options: {
      chart: {
        id: 'chart-energy',
        toolbar: {
          show: false,
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    },
    series: [
      {
        name: 'Consumo de Energia Elétrica (kWh)',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 30)
      },
      {
        name: 'Energia Compensada GD I (kWh)',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 30)
      }
    ]
  });

  const [chartValueData, setChartValueData] = useState({
    options: {
      chart: {
        id: 'chart-value',
        toolbar: {
          show: false,
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    },
    series: [
      {
        name: 'Valor Total sem GD (R$)',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 30)
      },
      {
        name: 'Economia GD (R$)',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 30)
      }
    ]
  });

  return (
    <Card>
      <CardHeader
        title="Análise de Consumo de Energia Elétrica"
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
      <Box display="flex" gap={2} p={2}>
        <Box flex={1}>
          <Chart
            options={chartEnergyData.options}
            series={chartEnergyData.series}
            type="line"
            height={350}
          />
          <Typography variant="subtitle1" align="center">
            Total Consumo: {chartEnergyData.series[0].data.reduce((acc, val) => acc + val, 0)} kWh
            <br />
            Total Compensado GD I: {chartEnergyData.series[1].data.reduce((acc, val) => acc + val, 0)} kWh
            <br />
            Total Resultante: {chartEnergyData.series[0].data.reduce((acc, val) => acc + val, 0) - chartEnergyData.series[1].data.reduce((acc, val) => acc + val, 0)} kWh
          </Typography>
        </Box>
        <Box flex={1}>
          <Chart
            options={chartValueData.options}
            series={chartValueData.series}
            type="line"
            height={350}
          />
          <Typography variant="subtitle1" align="center">
            Total Valor sem GD: R$ {chartValueData.series[0].data.reduce((acc, val) => acc + val, 0)}
            <br />
            Total Economia GD: R$ {chartValueData.series[1].data.reduce((acc, val) => acc + val, 0)}
            <br />
            Total Resultante: R$ {chartValueData.series[0].data.reduce((acc, val) => acc + val, 0) - chartValueData.series[1].data.reduce((acc, val) => acc + val, 0)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default BillDashboardCharts;
