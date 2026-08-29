import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import AnimalCard from '@/components/herd/animal-card';
import FilterChips from '@/components/herd/filter-chips';
import ScreenContainer from '@/components/layout/screen-container';
import ScreenHeader from '@/components/layout/screen-header';
import { Fab } from '@/components/ui/fab';
import { Input } from '@/components/ui/input';
import { QueryBoundary } from '@/components/ui/states';
import { Space } from '@/constants/theme';
import { useHerd } from '@/hooks/queries/use-herd';
import type { AnimalStatus } from '@/types/animal';

export default function HerdScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<AnimalStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useHerd(status, search);

  return (
    <ScreenContainer
      hasTabBar
      hasFab
      edges={['top']}
      header={
        <>
          <ScreenHeader title="Herd" />
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search animals..."
            accessibilityLabel="Search animals"
            returnKeyType="search"
            containerStyle={styles.search}
          />
          <FilterChips value={status} onChange={setStatus} />
        </>
      }
    >
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        isEmpty={!data?.length}
        onRetry={refetch}
        error={{ description: 'Unable to load animals. Please try again.' }}
        empty={{ title: 'No animals match your search', description: 'Try a different name or filter.' }}
      >
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AnimalCard animal={item} onPress={() => router.push(`/animal/${item.id}`)} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </QueryBoundary>

      <Fab icon="plus" onPress={() => router.push('/animal/new')} accessibilityLabel="Add animal" hasTabBar />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  search: {
    marginBottom: Space.md,
  },
});
