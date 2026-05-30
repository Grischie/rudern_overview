import { useForm } from '@mantine/form';
import {
    TextInput,
    Button,
    Box,
    Fieldset,
    Select,
    MultiSelect,
    NumberInput,
    Stack,
    Title,
    Text,
    ActionIcon,
    Divider,
    Grid,
    Card,
    Textarea,
    TagsInput,
    Group
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { randomId } from '@mantine/hooks';
import { Trash } from 'tabler-icons-react';
import dayjs from 'dayjs';

const ROLLEN_OPTIONS = [
    { value: 'Ruderer Teilnehmer', label: 'Ruderer Teilnehmer' },
    { value: 'Ruderer Obleute', label: 'Ruderer Obleute' },
    { value: 'Landdienst Fahrer', label: 'Landdienst Fahrer' },
    { value: 'Landdienst Beifahrer', label: 'Landdienst Beifahrer' },
];

const TRANSPORT_OPTIONS = [
    { value: 'Auto', label: 'Auto' },
    { value: 'Bahn', label: 'Bahn' },
    { value: 'Flug', label: 'Flug' },
];

export function TripForm() {
    const form = useForm({
        mode: 'controlled',
        initialValues: {
            titel: '',
            zeitraum: [null, null] as [Date | null, Date | null],
            verantwortliche: [] as string[],
            notfallkontakt: '',
            teilnehmer: [] as { id: string; vorname: string; nachname: string; rollen: string[] }[],
            boote: [] as { id: string; name: string; plaetze: number }[],

            // Hinreise / Abreise & Dynamische Sektionen
            anreise: { typ: '', uhrzeit: '', ort: '' },
            abreise: { typ: '', uhrzeit: '', ort: '' },
            unterkuenfte: {} as Record<number, { name: string; adresse: string; ankunftszeit: string }>,
            besonderheiten: {} as Record<number, string>,

            // Logik-Regeln
            landdienstZusammen: [] as { personA: string; personB: string }[],
            mindestensZusammenRudern: [] as { personA: string; personB: string; anzahl: number }[],
            trennen: [] as { personA: string; personB: string }[],
        },

        validate: {
            titel: (value) => (value.trim().length < 2 ? 'Der Titel ist zu kurz' : null),
            zeitraum: (value) => (!value[0] || !value[1] ? 'Bitte den Zeitraum angeben' : null),
            verantwortliche: (value) => (value.length === 0 ? 'Mindestens eine Fahrtenleitung wird benötigt' : null),
        },
    });

    // Berechnet die Anzahl der Tage aus dem ausgewählten Zeitraum
    const getAnzahlTage = () => {
        const [von, bis] = form.values.zeitraum;
        if (!von || !bis) return 0;
        return dayjs(bis).diff(dayjs(von), 'day') + 1;
    };

    const anzahlTage = getAnzahlTage();
    const anzahlNaechte = anzahlTage > 1 ? anzahlTage - 1 : 0;

    const getTeilnehmerOptions = () => {
        return form.values.teilnehmer
            .filter(t => t.vorname)
            .map(t => ({ value: t.id, label: `${t.vorname} ${t.nachname}`.trim() }));
    };

    const handleSubmit = (values: typeof form.values) => {
        console.log('Komplette Trip-Daten bereit zum Speichern:', values);
    };

    return (
        <Box maxWidth={800} mx="auto" p="md">
            <Title order={2} mb="xl">Neuen Ruder-Trip anlegen 🚣</Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="xl">

                    {/* ================= NOTWENDIGE INFOS ================= */}
                    <Fieldset legend="Notwendige Informationen (Pflicht)" variant="filled">
                        <Stack gap="md">
                            <TextInput
                                label="Titel"
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

                            {/* Sauberes Mantine TagsInput für die Fahrtenleitung */}
                            <TagsInput
                                label="Fahrtenleitung"
                                placeholder="Namen eingeben und mit Komma trennen"
                                required
                                value={form.values.verantwortliche}
                                onChange={(value) => form.setFieldValue('verantwortliche', value)}
                                error={form.errors.verantwortliche}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Verhindert das Absenden des Formulars
                                    }
                                }}
                            />
                        </Stack>
                    </Fieldset>

                    {/* ================= TEILNEHMER (Responsive Handydesign) ================= */}
                    <Fieldset legend="Teilnehmer:innen">
                        <Text size="sm" c="dimmed" mb="md">Mindestens der Vorname ist ein Pflichtfeld.</Text>

                        <Stack gap="sm">
                            {form.values.teilnehmer.map((item, index) => (
                                <Card key={item.id} withBorder padding="xs" radius="sm" bg="var(--mantine-color-body)">
                                    <Grid align="flex-end" gutter="xs">
                                        <Grid.Col span={{ base: 12, md: 3 }}>
                                            <TextInput
                                                label={index === 0 ? "Vorname" : undefined}
                                                placeholder="Vorname (Pflicht)"
                                                required
                                                {...form.getInputProps(`teilnehmer.${index}.vorname`)}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 12, md: 3 }}>
                                            <TextInput
                                                label={index === 0 ? "Nachname" : undefined}
                                                placeholder="Nachname"
                                                {...form.getInputProps(`teilnehmer.${index}.nachname`)}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 10, md: 5 }}>
                                            <MultiSelect
                                                label={index === 0 ? "Rollen" : undefined}
                                                placeholder={item.rollen.length > 0 ? "" : "Rollen wählen"}
                                                data={ROLLEN_OPTIONS}
                                                {...form.getInputProps(`teilnehmer.${index}.rollen`)}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ base: 2, md: 1 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                size="lg"
                                                mb={4}
                                                onClick={() => form.removeListItem('teilnehmer', index)}
                                            >
                                                <Trash size={16} />
                                            </ActionIcon>
                                        </Grid.Col>
                                    </Grid>
                                </Card>
                            ))}
                        </Stack>

                        <Button
                            variant="outline"
                            mt="md"
                            fullWidth
                            onClick={() => form.insertListItem('teilnehmer', { id: randomId(), vorname: '', nachname: '', rollen: [] })}
                        >
                            + Teilnehmer:in hinzufügen
                        </Button>
                    </Fieldset>

                    {/* ================= HINREICHENDE INFOS ================= */}
                    <Fieldset legend="Hinreichende Informationen (Optional)">
                        <Stack gap="md">
                            <TextInput
                                label="Notfallkontakt (Handynummer)"
                                placeholder="+49 1..."
                                {...form.getInputProps('notfallkontakt')}
                            />

                            {/* ANREISE & ABREISE */}
                            <Divider label="Logistik & Transport" labelPosition="left" my="sm" />
                            <Grid gutter="md">
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card withBorder padding="xs">
                                        <Text size="sm" fw={500} mb="xs">Anreise</Text>
                                        <Stack gap="xs">
                                            <Select label="Möglichkeit" placeholder="Auto / Bahn / Flug" data={TRANSPORT_OPTIONS} {...form.getInputProps('anreise.typ')} />
                                            <TextInput label="Uhrzeit" placeholder="z.B. 08:00" {...form.getInputProps('anreise.uhrzeit')} />
                                            <TextInput label="Wo" placeholder="Abfahrtsort" {...form.getInputProps('anreise.ort')} />
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 6 }}>
                                    <Card withBorder padding="xs">
                                        <Text size="sm" fw={500} mb="xs">Abreise</Text>
                                        <Stack gap="xs">
                                            <Select label="Möglichkeit" placeholder="Auto / Bahn / Flug" data={TRANSPORT_OPTIONS} {...form.getInputProps('abreise.typ')} />
                                            <TextInput label="Uhrzeit" placeholder="z.B. 16:00" {...form.getInputProps('abreise.uhrzeit')} />
                                            <TextInput label="Wo" placeholder="Ankunftsort" {...form.getInputProps('abreise.ort')} />
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            </Grid>

                            {/* DYNAMISCHE UNTERKÜNFTE PRO NACHT */}
                            {anzahlNaechte > 0 && (
                                <>
                                    <Divider label="Unterkünfte pro Nacht" labelPosition="left" my="sm" />
                                    <Stack gap="sm">
                                        {Array.from({ length: anzahlNaechte }).map((_, i) => (
                                            <Card key={i} withBorder padding="xs" bg="var(--mantine-color-body)">
                                                <Text size="sm" fw={500} mb="xs">Nacht {i + 1}</Text>
                                                <Grid gutter="xs">
                                                    <Grid.Col span={{ base: 12, md: 4 }}>
                                                        <TextInput placeholder="Name der Unterkunft" {...form.getInputProps(`unterkuenfte.${i}.name`)} />
                                                    </Grid.Col>
                                                    <Grid.Col span={{ base: 12, md: 5 }}>
                                                        <TextInput placeholder="Adresse" {...form.getInputProps(`unterkuenfte.${i}.adresse`)} />
                                                    </Grid.Col>
                                                    <Grid.Col span={{ base: 12, md: 3 }}>
                                                        <TextInput placeholder="Ankunftszeit" {...form.getInputProps(`unterkuenfte.${i}.ankunftszeit`)} />
                                                    </Grid.Col>
                                                </Grid>
                                            </Card>
                                        ))}
                                    </Stack>
                                </>
                            )}

                            {/* DYNAMISCHE BESONDERHEITEN PRO TAG */}
                            {anzahlTage > 0 && (
                                <>
                                    <Divider label="Besonderheiten pro Tag (Freitext)" labelPosition="left" my="sm" />
                                    <Grid gutter="xs">
                                        {Array.from({ length: anzahlTage }).map((_, i) => (
                                            <Grid.Col key={i} span={{ base: 12, md: 6 }}>
                                                <Textarea
                                                    label={`Tag ${i + 1}`}
                                                    placeholder="Besonderheiten, Routenabschnitte..."
                                                    autosize
                                                    minRows={2}
                                                    {...form.getInputProps(`besonderheiten.${i}`)}
                                                />
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                </>
                            )}

                            {/* BOOTE */}
                            <Divider label="Boote" labelPosition="left" my="sm" />
                            <Stack gap="xs">
                                {form.values.boote.map((item, index) => (
                                    <Card key={item.id} withBorder padding="xs">
                                        <Grid align="flex-end" gutter="xs">
                                            <Grid.Col span={{ base: 7, md: 8 }}>
                                                <TextInput
                                                    placeholder="Name des Boots"
                                                    {...form.getInputProps(`boote.${index}.name`)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 3, md: 3 }}>
                                                <NumberInput
                                                    placeholder="Plätze"
                                                    min={1}
                                                    {...form.getInputProps(`boote.${index}.plaetze`)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={{ base: 2, md: 1 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <ActionIcon
                                                    color="red"
                                                    variant="subtle"
                                                    size="lg"
                                                    onClick={() => form.removeListItem('boote', index)}
                                                >
                                                    <Trash size={16} />
                                                </ActionIcon>
                                            </Grid.Col>
                                        </Grid>
                                    </Card>
                                ))}
                            </Stack>
                            <Button
                                variant="light"
                                fullWidth
                                onClick={() => form.insertListItem('boote', { id: randomId(), name: '', plaetze: 4 })}
                            >
                                + Boot hinzufügen
                            </Button>
                        </Stack>
                    </Fieldset>

                    {/* ================= LOGIK-REGELN ================= */}
                    <Fieldset legend="Logik-Regeln & Paarungen">
                        <Text size="xs" c="dimmed" mb="md">
                            Hinweis: Personen können ausgewählt werden, sobald sie oben bei den Teilnehmern eingetragen sind.
                        </Text>

                        {/* REGEL 1: LANDDIENST ZUSAMMEN */}
                        <Divider label="Landdienst zusammen (Zwei Personen auswählen)" labelPosition="left" my="sm" />
                        <Stack gap="xs" mb="md">
                            {form.values.landdienstZusammen.map((item, index) => (
                                <Group key={index} gap="xs" grow>
                                    <Select placeholder="Person A" data={getTeilnehmerOptions()} {...form.getInputProps(`landdienstZusammen.${index}.personA`)} />
                                    <Select placeholder="Person B" data={getTeilnehmerOptions()} {...form.getInputProps(`landdienstZusammen.${index}.personB`)} />
                                    <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('landdienstZusammen', index)} style={{ flexGrow: 0 }}>
                                        <Trash size={16} />
                                    </ActionIcon>
                                </Group>
                            ))}
                            <Button variant="outline" color="orange" size="xs" onClick={() => form.insertListItem('landdienstZusammen', { personA: '', personB: '' })} disabled={form.values.teilnehmer.length < 2}>
                                + Landdienst-Paar hinzufügen
                            </Button>
                        </Stack>

                        {/* REGEL 2: MINDESTENS X-MAL ZUSAMMEN RUDERN */}
                        <Divider label="Mindestens X-mal zusammen Rudern" labelPosition="left" my="sm" />
                        <Stack gap="xs" mb="md">
                            {form.values.mindestensZusammenRudern.map((item, index) => (
                                <Grid key={index} align="flex-end" gutter="xs" style={{ width: '100%' }}>
                                    <Grid.Col span={{ base: 5, md: 5 }}><Select placeholder="Person A" data={getTeilnehmerOptions()} {...form.getInputProps(`mindestensZusammenRudern.${index}.personA`)} /></Grid.Col>
                                    <Grid.Col span={{ base: 5, md: 5 }}><Select placeholder="Person B" data={getTeilnehmerOptions()} {...form.getInputProps(`mindestensZusammenRudern.${index}.personB`)} /></Grid.Col>
                                    <Grid.Col span={{ base: 2, md: 1 }}><NumberInput min={1} placeholder="Anzahl" {...form.getInputProps(`mindestensZusammenRudern.${index}.anzahl`)} /></Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 1 }} style={{ display: 'flex', justifyContent: 'flex-end' }}><ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('mindestensZusammenRudern', index)}><Trash size={16} /></ActionIcon></Grid.Col>
                                </Grid>
                            ))}
                            <Button variant="outline" color="blue" size="xs" mt="xs" onClick={() => form.insertListItem('mindestensZusammenRudern', { personA: '', personB: '', anzahl: 1 })} disabled={form.values.teilnehmer.length < 2}>
                                + Ruder-Bedingung hinzufügen
                            </Button>
                        </Stack>

                        {/* REGEL 3: PERSONEN TRENNEN */}
                        <Divider label="Personen trennen (Nicht im selben Boot)" labelPosition="left" my="sm" />
                        <Stack gap="xs">
                            {form.values.trennen.map((item, index) => (
                                <Group key={index} gap="xs" grow>
                                    <Select placeholder="Person A" data={getTeilnehmerOptions()} {...form.getInputProps(`trennen.${index}.personA`)} />
                                    <Select placeholder="Person B" data={getTeilnehmerOptions()} {...form.getInputProps(`trennen.${index}.personB`)} />
                                    <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('trennen', index)} style={{ flexGrow: 0 }}>
                                        <Trash size={16} />
                                    </ActionIcon>
                                </Group>
                            ))}
                            <Button variant="outline" color="red" size="xs" onClick={() => form.insertListItem('trennen', { personA: '', personB: '' })} disabled={form.values.teilnehmer.length < 2}>
                                + Trennung hinzufügen
                            </Button>
                        </Stack>
                    </Fieldset>

                    {/* ================= ABSCHICKEN ================= */}
                    <Button type="submit" color="blue" size="lg" mt="md" fullWidth>
                        Trip erstellen
                    </Button>

                </Stack>
            </form>
        </Box>
    );
}