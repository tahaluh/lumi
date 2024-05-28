import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, Box, CardHeader, FormControl, InputLabel, Select, TextField, Typography, MenuItem } from '@mui/material';
import { useTheme } from '@emotion/react';
import { ClientDashboardResponse, fetchDashboardData } from '../services/fetchDashboard';
import { set } from 'date-fns';

interface Filters {
  year?: string;
  month?: string;
  clientNumber?: string;
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
      noData: {
        text: 'Sem dados...'
      },
      chart: {
        id: 'chart-energy',
        toolbar: {
          show: false,
        },
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
              options={{
                ...baseChartData.options,
                xaxis: {
                  categories
                }
              }}
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
              Total Consumo: {(seriesEnergy.reduce((acc, val) => acc + val, 0)).toFixed(2)} kWh
              <br />
              Total Compensado GD I: {(seriesEnergyCompensated.reduce((acc, val) => acc + val, 0)).toFixed(2)} kWh
              <br />
              Total Resultante: {(seriesEnergy.reduce((acc, val) => acc + val, 0) - seriesEnergyCompensated.reduce((acc, val) => acc + val, 0)).toFixed(2)} kWh
            </Typography>
          </Box>
          <Box flex={1}>
            <Chart
              options={{
                ...baseChartData.options,
                xaxis: {
                  categories
                }
              }}
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
              Total Valor sem GD: R$ {(seriesValue.reduce((acc, val) => acc + val, 0)).toFixed(2)}
              <br />
              Total Economia GD: R$ {(seriesValueCompensated.reduce((acc, val) => acc + val, 0)).toFixed(2)}
              <br />
              Total Resultante: R$ {(seriesValue.reduce((acc, val) => acc + val, 0) - seriesValueCompensated.reduce((acc, val) => acc + val, 0)).toFixed(2)}
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
    };
  }

  const monthYearMap = {};

  data.data.forEach((item) => {
    const key = `${item.referenceYear}-${item.referenceMonth}`;
    if (!monthYearMap[key]) {
      monthYearMap[key] = {
        energy: 0,
        energyICMS: 0,
        energyCompensated: 0,
        energyTotal: 0,
        energyICMSTotal: 0,
        energyCompensatedTotal: 0,
        publicLightingContribution: 0
      };
    }

    monthYearMap[key].energy += item.energyAmount ?? 0;
    monthYearMap[key].energyICMS += item.energyICMSAmount ?? 0;
    monthYearMap[key].energyCompensated += item.energyCompensatedAmount ?? 0;
    monthYearMap[key].energyTotal += item.energyTotal ?? 0;
    monthYearMap[key].energyICMSTotal += item.energyICMSTotal ?? 0;
    monthYearMap[key].energyCompensatedTotal += item.energyCompensatedTotal ?? 0;
    monthYearMap[key].publicLightingContribution += item.publicLightingContribution ?? 0;
  });

  const categories = Object.keys(monthYearMap).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return yearA === yearB ? monthA - monthB : yearA - yearB;
  });

  const seriesEnergy = categories.map((key) => monthYearMap[key].energy + monthYearMap[key].energyICMS);
  const seriesEnergyCompensated = categories.map((key) => monthYearMap[key].energyCompensated);
  const seriesValue = categories.map((key) => monthYearMap[key].energyTotal + monthYearMap[key].energyICMSTotal + monthYearMap[key].publicLightingContribution);
  const seriesValueCompensated = categories.map((key) => -monthYearMap[key].energyCompensatedTotal);

  return {
    categories,
    seriesEnergy,
    seriesEnergyCompensated,
    seriesValue,
    seriesValueCompensated
  };
};
