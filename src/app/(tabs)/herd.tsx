import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import AnimalCard from '@/components/herd/animal-card';
import FilterChips from '@/components/herd/filter-chips';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, StatusColors } from '@/constants/theme';
import { useHerd } from '@/hooks/queries/use-herd';
import type { AnimalStatus } from '@/types/animal';
import Icon from '@/components/ui/icon';

const initialStatus: AnimalStatus | 'all' = 'all';

export default function HerdScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<AnimalStatus | 'all'>(initialStatus);
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useHerd(status, search);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Herd</ThemedText>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search animals..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          accessibilityLabel="Search animals"
        />
      </View>

      <FilterChips value={status} onChange={setStatus} />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={StatusColors.healthy} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <ThemedText type="small">Unable to load animals. Please try again.</ThemedText>
        </View>
      ) : !data?.length ? (
        <View style={styles.centered}>
          <ThemedText type="small">No animals match your search</ThemedText>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AnimalCard animal={item} onPress={() => router.push(`/animal/${item.id}`)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable style={styles.fab} onPress={() => router.push('/animal/new')}>
        <Icon name="plus" color="#FFFFFF" size={24} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    backgroundColor: 'transparent',
  },
  header: {
    gap: 12,
    marginBottom: Spacing.three,
  },
  searchInput: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  list: {
    // paddingBottom: 120,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.four,
  },
  fab: {
    position: 'absolute',
    right: Spacing.four,
    bottom: Spacing.four,
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: StatusColors.healthy,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: {
    color: '#ffffff',
    lineHeight: 46,
  },
});
