import { useForm } from '@mantine/form';
import {
    TextInput,
    Button,
    Group,
    Box,
    Fieldset,
    Select,
    MultiSelect,
    NumberInput,
    Stack,
    Title,
    Text,
    ActionIcon,
    Divider
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { randomId } from '@mantine/hooks';
import { Trash } from 'tabler-icons-react'; // Oder ein anderes Icon-Paket

// Rollen-Optionen für Mantine Selects
const ROLLEN_OPTIONS = [
    { value: 'Ruderer Teilnehmer', label: 'Ruderer Teilnehmer' },
    { value: 'Ruderer Obleute', label: 'Ruderer Obleute' },
    { value: 'Landdienst Fahrer', label: 'Landdienst Fahrer' },
    { value: 'Landdienst Beifahrer', label: 'Landdienst Beifahrer' },
];

export function TripForm() {
    // Mantine Form initialisieren
    const form = useForm({
        mode: 'controlled',
        initialValues: {
            titel: '',
            zeitraum: [null, null] as [Date | null, Date | null],
            verantwortlicher: '',
            notfallkontakt: '',
            teilnehmer: [] as { id: string; vorname: string; nachname: string; rollen: string[] }[],
            boote: [] as { id: string; name: string; plaetze: number }[],
            // Regeln
            landdienstZusammen: [] as { personA: string; personB: string }[],
        },

        // Validierung der notwendigen Felder
        validate: {
            titel: (value) => (value.trim().length < 2 ? 'Der Titel ist zu kurz' : null),
            verantwortlicher: (value) => (!value ? 'Fahrtenleiter wird benötigt' : null),
            zeitraum: (value) => (!value[0] || !value[1] ? 'Bitte den Zeitraum angeben' : null),
            teilnehmer: {
                vorname: (value) => (!value ? 'Vorname ist ein Pflichtfeld' : null),
            }
        },
    });

    // Helfer, um Teilnehmer-Optionen für Dropdowns zu generieren
    const getTeilnehmerOptions = () => {
        return form.values.teilnehmer
            .filter(t => t.vorname)
            .map(t => ({ value: t.id, label: `${t.vorname} ${t.nachname}`.trim() }));
    };

    const handleSubmit = (values: typeof form.values) => {
        console.log('Validierte Trip-Daten:', values);
    };

    return (
        <Box maxWidth={800} mx="auto" p="md">
            <Title order={2} mb="xl">Neuen Ruder-Trip anlegen🚣</Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="xl">

                    {/* ================= NOTWENDIGE INFOS ================= */}
                    <Fieldset legend="Notwendige Informationen (Pflicht)" variant="filled">
                        <Stack gap="md">
                            <TextInput
                                label="Titel (Name des Trips)"
                                placeholder="z. B. Sommertour 2026"
                                required
                                {...form.getInputProps('titel')}
                            />

                            <DatePickerInput
                                type="range"
                                label="Zeitraum"
                                placeholder="Zeitraum auswählen"
                                required
                                clearable
                                {...form.getInputProps('zeitraum')}
                            />

                            <TextInput
                                label="Fahrtenleitung"
                                placeholder="Vorname Nachname"
                                required
                                {...form.getInputProps('verantwortlicher')}
                            />
                        </Stack>
                    </Fieldset>

                    {/* ================= TEILNEHMER (Dynamische Liste) ================= */}
                    <Fieldset legend="Teilnehmer:innen">
                        <Text size="sm" c="dimmed" mb="md">Mindestens der Vorname ist Pflicht.</Text>

                        {form.values.teilnehmer.map((item, index) => (
                            <Group key={item.id} align="flex-end" mb="xs">
                                <TextInput
                                    placeholder="Vorname (Pflicht)"
                                    required
                                    style={{ flex: 2 }}
                                    {...form.getInputProps(`teilnehmer.${index}.vorname`)}
                                />
                                <TextInput
                                    placeholder="Nachname"
                                    style={{ flex: 2 }}
                                    {...form.getInputProps(`teilnehmer.${index}.nachname`)}
                                />
                                <MultiSelect
                                    placeholder="Rollen"
                                    data={ROLLEN_OPTIONS}
                                    style={{ flex: 3 }}
                                    {...form.getInputProps(`teilnehmer.${index}.rollen`)}
                                />
                                <ActionIcon
                                    color="red"
                                    variant="subtle"
                                    size="lg"
                                    onClick={() => form.removeListItem('teilnehmer', index)}
                                >
                                    <Trash size={16} />
                                </ActionIcon>
                            </Group>
                        ))}

                        <Button
                            variant="outline"
                            mt="sm"
                            onClick={() => form.insertListItem('teilnehmer', { id: randomId(), vorname: '', nachname: '', rollen: [] })}
                        >
                            + Teilnehmer hinzufügen
                        </Button>
                    </Fieldset>

                    {/* ================= HINREICHENDE INFOS (Beispiel: Notfall & Boote) ================= */}
                    <Fieldset legend="Hinreichende Informationen (Optional)">
                        <Stack gap="md">
                            <TextInput
                                label="Notfallkontakt (Handynummer)"
                                placeholder="+49 1..."
                                {...form.getInputProps('notfallkontakt')}
                            />

                            <Divider label="Boote" labelPosition="left" my="sm" />

                            {form.values.boote.map((item, index) => (
                                <Group key={item.id} align="flex-end" mb="xs">
                                    <TextInput
                                        placeholder="Bootsname"
                                        style={{ flex: 3 }}
                                        {...form.getInputProps(`boote.${index}.name`)}
                                    />
                                    <NumberInput
                                        placeholder="Plätze"
                                        min={1}
                                        max={8}
                                        style={{ flex: 1 }}
                                        {...form.getInputProps(`boote.${index}.plaetze`)}
                                    />
                                    <ActionIcon
                                        color="red"
                                        variant="subtle"
                                        size="lg"
                                        onClick={() => form.removeListItem('boote', index)}
                                    >
                                        <Trash size={16} />
                                    </ActionIcon>
                                </Group>
                            ))}
                            <Button
                                variant="light"
                                compact
                                onClick={() => form.insertListItem('boote', { id: randomId(), name: '', plaetze: 4 })}
                            >
                                + Boot hinzufügen
                            </Button>
                        </Stack>
                    </Fieldset>

                    {/* ================= REGELN / LANDDIENST ZUSAMMEN ================= */}
                    <Fieldset legend="Logik-Regeln (Landdienst & Trennungen)">
                        <Text size="xs" c="dimmed" mb="md">
                            Hinweis: Du kannst hier nur Personen auswählen, die du oben bereits eingetragen hast.
                        </Text>

                        {form.values.landdienstZusammen.map((item, index) => (
                            <Group key={index} align="flex-end" mb="xs">
                                <Select
                                    label="Person 1"
                                    placeholder="Auswählen"
                                    data={getTeilnehmerOptions()}
                                    style={{ flex: 1 }}
                                    {...form.getInputProps(`landdienstZusammen.${index}.personA`)}
                                />
                                <Select
                                    label="Person 2"
                                    placeholder="Auswählen"
                                    data={getTeilnehmerOptions()}
                                    style={{ flex: 1 }}
                                    {...form.getInputProps(`landdienstZusammen.${index}.personB`)}
                                />
                                <Select
                                    label="Rollen"
                                    placeholder="Rollen"
                                    data={ROLLEN_OPTIONS}
                                    style={{ flex: 1 }}
                                    {...form.getInputProps(`landdienstZusammen.${index}.personA`)}
                                />
                                <ActionIcon
                                    color="red"
                                    variant="subtle"
                                    size="lg"
                                    onClick={() => form.removeListItem('landdienstZusammen', index)}
                                >
                                    <Trash size={16} />
                                </ActionIcon>
                            </Group>
                        ))}

                        <Button
                            variant="outline"
                            color="orange"
                            onClick={() => form.insertListItem('landdienstZusammen', { personA: '', personB: '' })}
                            disabled={form.values.teilnehmer.length < 2}
                        >
                            + Landdienst-Paar festlegen
                        </Button>
                    </Fieldset>

                    {/* ================= ABSCHICKEN ================= */}
                    <Button type="submit" color="blue" size="lg" mt="md">
                        Trip erstellen
                    </Button>

                </Stack>
            </form>
        </Box>
    );
}