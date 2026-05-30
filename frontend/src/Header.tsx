import { useState } from 'react';
import { Link } from 'react-router-dom'; // WICHTIG: Link importieren
import { 
  Group, 
  Button, 
  ActionIcon, 
  useMantineColorScheme, 
  useComputedColorScheme,
  Text, 
  Anchor, 
  Box
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Box 
      component="header" 
      p="md" 
      style={(theme) => ({
        borderBottom: `1px solid ${
          computedColorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
      })}
    >
      <Group justify="space-between" align="center">
        
        {/* LINKE SEITE: Logo und Navigation */}
        <Group gap="xl">
          <Text size="xl" fw={700}>
            TravelApp
          </Text>
          
          {/* Wird nur auf der linken Seite angezeigt, wenn angemeldet */}
          {isLoggedIn && (
            <Anchor 
              component={Link} // Überschreibt das normale <a> mit dem React Router Link
              to="/"           // 'to' statt 'href' nutzen
              underline="hover" 
              c="dimmed" 
              fw={500}
            >
              Trips
            </Anchor>
          )}
        </Group>

        {/* RECHTE SEITE: Auth & Theme Toggle */}
        <Group>
          {isLoggedIn ? (
            <Button variant="light" color="red" onClick={() => setIsLoggedIn(false)}>
              Abmelden
            </Button>
          ) : (
            <Button variant="filled" onClick={() => setIsLoggedIn(true)}>
              Login
            </Button>
          )}

          {/* Dark / Light Mode Toggle */}
          <ActionIcon
            onClick={toggleColorScheme}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
          >
            {computedColorScheme === 'dark' ? (
              <IconSun stroke={1.5} />
            ) : (
              <IconMoon stroke={1.5} />
            )}
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
}