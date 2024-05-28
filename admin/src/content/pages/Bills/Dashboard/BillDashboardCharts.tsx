import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, Box, CardHeader, FormControl, InputLabel, Select, TextField, Typography, MenuItem } from '@mui/material';
import { useTheme } from '@emotion/react';
import { ClientDashboardResponse, fetchDashboardData } from './services/fetchDashboard';
import { set } from 'date-fns';

interface Filters {
  year?: string;
  month?: string;
  clientNumber?: string;
}

interface DashboardData {
  referenceYear: string;
  referenceMonth: string;
  energy: number;
  energyICMS: number;
  energyCompensated: number;
  energyTotal: number;
  energyICMSTotal: number;
  energyCompensatedTotal: number;
}

function BillDashboardCharts() {
  const theme = useTheme();
  const [filters, setFilters] = useState<Filters>({
    year: 'all',
    month: 'all',
    clientNumber: null
  });

  const baseChartData = {
    options: {
      chart: {
        id: 'chart-energy',
        toolbar: {
          show: false,
        }
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (+val).toFixed(0);
          },
        },
      }
    },
  }

  const [chartEnergyData, setChartEnergyData] = useState([
    {
      name: 'Consumo de Energia Elétrica (kWh)',
      data: [0]
    },
    {
      name: 'Energia Compensada GD I (kWh)',
      data: [0]
    }
  ]
  );

  const [chartValueData, setChartValueData] = useState([
    {
      name: 'Valor Total sem GD (R$)',
      data: [0]
    },
    {
      name: 'Economia GD (R$)',
      data: [0]
    }
  ]
  );

  const { data, error, isLoading, mutate } = fetchDashboardData({ clientNumber: filters.clientNumber, year: filters.year })
  const { categories, seriesEnergy, seriesEnergyCompensated, seriesValue, seriesValueCompensated } = reducedDashboardData(data);



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
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={350}>
          <Typography variant="body1">Carregando...</Typography>
        </Box>
      ) : (
        <Box display="flex" gap={2} p={2}>
          <Box flex={1}>
            <Chart
              options={baseChartData.options}
              series={[
                {
                  name: 'Consumo de Energia Elétrica (kWh)',
                  data: seriesEnergy
                },
                {
                  name: 'Energia Compensada GD I (kWh)',
                  data: seriesEnergyCompensated
                }
              ]}
              type="line"
              height={350}
            />
            <Typography variant="subtitle1" align="center">
              Total Consumo: {chartEnergyData[0].data.reduce((acc, val) => acc + val, 0)} kWh
              <br />
              Total Compensado GD I: {chartEnergyData[1].data.reduce((acc, val) => acc + val, 0)} kWh
              <br />
              Total Resultante: {chartEnergyData[0].data.reduce((acc, val) => acc + val, 0) - chartEnergyData[1].data.reduce((acc, val) => acc + val, 0)} kWh
            </Typography>
          </Box>
          <Box flex={1}>
            <Chart
              options={baseChartData.options}
              series={[
                {
                  name: 'Valor Total sem GD (R$)',
                  data: seriesValue
                },
                {
                  name: 'Economia GD (R$)',
                  data: seriesValueCompensated
                }
              ]}
              type="line"
              height={350}
            />
            <Typography variant="subtitle1" align="center">
              Total Valor sem GD: R$ {chartValueData[0].data.reduce((acc, val) => acc + val, 0)}
              <br />
              Total Economia GD: R$ {chartValueData[1].data.reduce((acc, val) => acc + val, 0)}
              <br />
              Total Resultante: R$ {chartValueData[0].data.reduce((acc, val) => acc + val, 0) - chartValueData[1].data.reduce((acc, val) => acc + val, 0)}
            </Typography>
          </Box>
        </Box>)}
    </Card>
  );
}

export default BillDashboardCharts;


const reducedDashboardData = (data?: ClientDashboardResponse) => {
  if (!data) {
    return {
      categories: [],
      seriesEnergy: [],
      seriesEnergyCompensated: [],
      seriesValue: [],
      seriesValueCompensated: []
    }
  }
  const reducedData = data.data.reduce((acc, val) => {
    const key = `${val.referenceYear}-${val.referenceMonth}`;

    if (!acc[key]) {
      acc[key] = {
        energy: 0,
        energyICMS: 0,
        energyCompensated: 0,
        energyTotal: 0,
        energyICMSTotal: 0,
        energyCompensatedTotal: 0,
      };
    }

    acc[key].energy += val.energyAmount;
    acc[key].energyICMS += val.energyICMSAmount;
    acc[key].energyCompensated += val.energyCompensatedAmount;
    acc[key].energyTotal += val.energyTotal;
    acc[key].energyICMSTotal += val.energyICMSTotal;
    acc[key].energyCompensatedTotal -= val.energyCompensatedTotal;

    return acc;
  }, {});

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const categories = Object.keys(reducedData)
    .sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    })
    .map(key => {
      const [year, month] = key.split('-').map(Number);
      return `${months[month - 1]}-${year}`;
    });


  const seriesEnergy = Object.values(reducedData).map((val: { energy?: number }) => val.energy ?? 0);
  const seriesEnergyCompensated = Object.values(reducedData).map((val: { energyCompensated?: number }) => val.energyCompensated ?? 0);
  const seriesValue = Object.values(reducedData).map((val: { energyTotal?: number }) => val.energyTotal ?? 0);
  const seriesValueCompensated = Object.values(reducedData).map((val: { energyCompensatedTotal?: number }) => val.energyCompensatedTotal ?? 0);

  return {
    categories,
    seriesEnergy,
    seriesEnergyCompensated,
    seriesValue,
    seriesValueCompensated
  }
}
