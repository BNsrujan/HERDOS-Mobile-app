import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import PulseRings from '@/components/animal-detail/pulse-rings';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import IconSymbol from '@/components/ui/icon-symbol';
import Icon from '@/components/ui/icon';
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

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const snapPoints = useMemo(() => ['65%'], []);

  const handlePlaySound = () => {
    void locateMutation.mutateAsync(animalId).catch(() => {
      setError("Couldn't reach the collar — try again");
    });

    setError(null);
    setPlaying(true);
    window.setTimeout(() => setPlaying(false), 3200);
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          pressBehavior="close"
        />
      )}
      onDismiss={() => {
        setPlaying(false);
        setError(null);
      }}
    >
      <ThemedView style={styles.sheet}>
        <View style={styles.headerRow}>
          <ThemedText type="subtitle">Locate by Sound and light</ThemedText>
            <Pressable style={styles.closeButton} onPress={() => sheetRef.current?.dismiss()}>
              <Icon name="close" />
            </Pressable>
        </View>

        <ThemedText type="small">By pressing this you the {animalName} sound will activate</ThemedText>

        <View style={styles.pulseWrap}>
          <PulseRings active={playing} />
        </View>

        <Pressable onPress={handlePlaySound} disabled={playing} style={styles.button}>
          {playing ? (
            <ThemedText type="smallBold" style={styles.buttonText}>Playing...</ThemedText>
          ) : (
            <View style={styles.buttonInner}>
              <IconSymbol name="speaker" color="#FFFFFF" size={18} />
              <ThemedText type="smallBold" style={styles.buttonText}>Play the sound</ThemedText>
            </View>
          )}
        </Pressable>

        {error ? <ThemedText type="small" style={styles.errorText}>{error}</ThemedText> : null}
      </ThemedView>
    </BottomSheetModal>
  );
});

export default LocateSheet;

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pulseWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#22C55E',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
  },
});
