import { useRoutes } from 'react-router-dom';
import router from 'src/routes/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';

import { SWRConfig } from 'swr';
import { fetcher } from './services/fetcher';



function App() {
  const content = useRoutes(router);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SWRConfig
          value={{
            fetcher,
          }}
        >
          <CssBaseline />
          {content}
        </SWRConfig>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
