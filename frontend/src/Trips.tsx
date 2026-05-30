import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook importieren
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Button,
  Center,
  Box
} from '@mantine/core';
import { IconCalendarEvent, IconPlus } from '@tabler/icons-react';

// TypeScript Typen sind hier in der .tsx-Datei völlig in Ordnung!
type Trip = {
  id: number | string;
  title: string;
  startDate: string; 
  endDate: string; 
};

export function TripPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 2. Den Navigate-Hook initialisieren
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/trips');
        if (!res.ok) throw new Error(`Server antwortete mit ${res.status}`);
        const data = await res.json();
        
        const normalized: Trip[] = (data || []).map((t: any, i: number) => ({
          id: t.id ?? i,
          title: t.title ?? t.name ?? `Trip ${i + 1}`,
          startDate: t.startDate ?? (t.date ? t.date.split(' - ')[0] : ''),
          endDate: t.endDate ?? (t.date ? t.date.split(' - ')[1] : ''),
        }));
        setTrips(normalized);
      } catch (e: any) {
        // console.error('Fehler beim Laden der Trips:', e);
        setError('Trips konnten nicht geladen werden. Zeige Beispiel-Daten.');
        
        // Fallback-Beispieldaten
        setTrips([
          { id: 1, title: 'Sommerurlaub in Italien', startDate: '2026-08-15', endDate: '2026-08-29' },
          { id: 2, title: 'Städtetrip Paris', startDate: '2026-10-02', endDate: '2026-10-05' },
          { id: 3, title: 'Skiurlaub Österreich', startDate: '2027-01-12', endDate: '2027-01-19' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" align="flex-end" mb="xl">
        <Box>
          <Title order={1} fw={800}>Meine Trips</Title>
          <Text c="dimmed" mt="sm">
            Hier findest du eine Übersicht all deiner geplanten und vergangenen Reisen.
          </Text>
        </Box>
      </Group>

      {loading && <Text c="dimmed" style={{ textAlign: 'center' }} mb="md">Lade Trips…</Text>}
      {error && <Text color="red" style={{ textAlign: 'center' }} mb="md">{error}</Text>}

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {trips.map((trip) => (
          <Card key={trip.id} shadow="sm" p="lg" radius="md" withBorder>
            <Text fw={700} size="lg" mt="xs" mb="xs">
              {trip.title}
            </Text>

            <Group gap="xs" mt="sm">
              <IconCalendarEvent size={18} stroke={1.5} />
              <Text size="sm" c="dimmed">
                {trip.startDate ? new Date(trip.startDate).toLocaleDateString('de-DE') : '-'}
                {' '}-{' '}
                {trip.endDate ? new Date(trip.endDate).toLocaleDateString('de-DE') : '-'}
              </Text>
            </Group>

            <Button color="blue" fullWidth mt="md" radius="md" variant="light">
              Details ansehen
            </Button>
          </Card>
        ))}
      </SimpleGrid>

      <Center mt={50}>
        <Button 
          size="md" 
          radius="xl" 
          leftSection={<IconPlus size={20} />}
          onClick={() => {
            // 3. Hier nutzen wir die URL-Weiterleitung zum Formular
            navigate('/trip-form');
          }}
        >
          Neuen Trip erstellen
        </Button>
      </Center>
    </Container>
  );
}