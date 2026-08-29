import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipGroup, type ChipOption } from '@/components/ui/chip-group';
import { Input } from '@/components/ui/input';
import { Space, StatusColors, StatusLabels } from '@/constants/theme';
import { useCreateAnimal } from '@/hooks/mutations/use-create-animal';
import type { AnimalStatus } from '@/types/animal';

const STATUS_OPTIONS: ChipOption<AnimalStatus>[] = (
  ['healthy', 'watch', 'alert', 'lame', 'milking', 'pregnant'] as const
).map((value) => ({ value, label: StatusLabels[value], dotColor: StatusColors[value] }));

export default function AddAnimalScreen() {
  const router = useRouter();
  const createAnimal = useCreateAnimal();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [collarId, setCollarId] = useState('');
  const [status, setStatus] = useState<AnimalStatus>('healthy');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!breed.trim()) next.breed = 'Breed is required';

    const age = Number(ageYears);
    if (!ageYears.trim() || !Number.isFinite(age) || age < 0 || age > 40) {
      next.ageYears = 'Enter an age between 0 and 40';
    }
    if (!collarId.trim()) next.collarId = 'Collar ID is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setSubmitError(null);
    if (!validate()) return;

    try {
      await createAnimal.mutateAsync({
        name: name.trim(),
        breed: breed.trim(),
        ageYears: Number(ageYears),
        status,
        collarId: collarId.trim(),
      });
      router.back();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Couldn't add this animal. Please try again.",
      );
    }
  }

  return (
    <ScreenContainer
      scroll
      edges={['top', 'bottom']}
      contentContainerStyle={styles.content}
      header={<ScreenHeader title="Add Animal" back />}
    >
      <Input
        label="Name"
        placeholder="e.g. Rani"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        errorText={errors.name}
      />
      <Input
        label="Breed"
        placeholder="e.g. Boer Goat"
        value={breed}
        onChangeText={setBreed}
        autoCapitalize="words"
        errorText={errors.breed}
      />
      <Input
        label="Age (years)"
        placeholder="e.g. 3"
        value={ageYears}
        onChangeText={setAgeYears}
        keyboardType="decimal-pad"
        errorText={errors.ageYears}
      />
      <Input
        label="Collar ID"
        placeholder="e.g. 8492"
        value={collarId}
        onChangeText={setCollarId}
        autoCapitalize="characters"
        errorText={errors.collarId}
      />

      <ThemedText type="small" themeColor="textSecondary">
        Status
      </ThemedText>
      <ChipGroup options={STATUS_OPTIONS} value={status} onChange={setStatus} />

      {submitError ? (
        <ThemedText type="small" themeColor="danger">
          {submitError}
        </ThemedText>
      ) : null}

      <Button
        size="lg"
        fullWidth
        label="Add animal"
        loading={createAnimal.isPending}
        onPress={handleSubmit}
        style={styles.submit}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space.lg,
  },
  submit: {
    marginTop: Space.sm,
  },
});
