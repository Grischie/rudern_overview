import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; // Wichtig für den Kalender!
import { MantineProvider } from '@mantine/core';
import { TripForm } from './TripForm';

function App() {
  return (
      // Der MantineProvider ist Pflicht, damit die Mantine-Styles überall funktionieren
      <MantineProvider defaultColorScheme="auto">
        <div style={{ padding: '40px 20px' }}>
          <TripForm />
        </div>
      </MantineProvider>
  );
}

export default App;
