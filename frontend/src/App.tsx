import { Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { Header } from './Header';
import { TripPage } from './Trips';
import { TripForm } from './TripForm';

function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <div style={{ padding: '40px 20px' }}>
        <Header />

        <Routes>
          <Route path="/" element={<TripPage />} />
          <Route path="/trip-form" element={<TripForm />} />
        </Routes>
      </div>
    </MantineProvider>
  );
}

export default App;