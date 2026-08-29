import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import PulseRings from '@/components/animal-detail/pulse-rings';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { MinTouchTarget, Space } from '@/constants/theme';
import { useLocateAnimal } from '@/hooks/mutations/use-locate-animal';

export type LocateSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

type LocateSheetProps = {
  animalId: string;
  animalName: string;
};

const LocateSheet = forwardRef<LocateSheetHandle, LocateSheetProps>(function LocateSheet({ animalId, animalName }, ref) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const locateMutation = useLocateAnimal();
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  useEffect(() => () => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
    }
  }, []);

  const snapPoints = useMemo(() => ['65%'], []);

  const handlePlaySound = () => {
    void locateMutation.mutateAsync(animalId).catch(() => {
      setError("Couldn't reach the collar — try again");
    });

    setError(null);
    setPlaying(true);

    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
    }
    playTimerRef.current = setTimeout(() => setPlaying(false), 3200);
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={(props) => <BottomSheetBackdrop {...props} opacity={0.5} pressBehavior="close" />}
      onDismiss={() => {
        setPlaying(false);
        setError(null);
      }}
    >
      <ThemedView type="surfaceElevated" style={styles.sheet}>
        <View style={styles.headerRow}>
          <ThemedText type="heading">Locate by sound and light</ThemedText>
          <AppPressable
            style={styles.closeButton}
            accessibilityLabel="Close"
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Icon name="close" />
          </AppPressable>
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          This plays a sound and flashes the light on {animalName}&apos;s collar.
        </ThemedText>

        <View style={styles.pulseWrap}>
          <PulseRings active={playing} />
        </View>

        <Button
          size="lg"
          fullWidth
          variant="accent"
          iconLeft="speaker"
          label={playing ? 'Playing…' : 'Play the sound'}
          disabled={playing}
          onPress={handlePlaySound}
        />

        {error ? (
          <ThemedText type="small" themeColor="danger">
            {error}
          </ThemedText>
        ) : null}
      </ThemedView>
    </BottomSheetModal>
  );
});

export default LocateSheet;

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    padding: Space.xl,
    gap: Space.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -12,
  },
  pulseWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Space.md,
  },
});
