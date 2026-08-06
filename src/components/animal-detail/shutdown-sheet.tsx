import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import PowerToggle from '@/components/animal-detail/power-toggle';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Icon from '@/components/ui/icon';
import { useShutdownCollar } from '@/hooks/mutations/use-shutdown-collar';

export type ShutdownSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

type ShutdownSheetProps = {
  animalId: string;
  animalName: string;
};

const ShutdownSheet = forwardRef<ShutdownSheetHandle, ShutdownSheetProps>(function ShutdownSheet({ animalId, animalName }, ref) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const shutdownMutation = useShutdownCollar();
  const [isOpen, setIsOpen] = useState(false);
  const [powered, setPowered] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setPowered(true);
    setShowConfirm(false);
    setError(null);
  }, [isOpen]);

  const snapPoints = useMemo(() => ['65%'], []);

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
      onChange={(index) => {
        setIsOpen(index >= 0);
      }}
      onDismiss={() => {
        setPowered(true);
        setShowConfirm(false);
        setError(null);
      }}
    >
      <ThemedView style={styles.sheet}>
        <View style={styles.headerRow}>
          <ThemedText type="subtitle">Shut Down your device</ThemedText>
          <Pressable style={styles.closeButton} onPress={() => sheetRef.current?.dismiss()}>
            <Icon name="close" />
          </Pressable>
        </View>

        <ThemedText type="small">This will power off {animalName}'s collar and stop tracking.</ThemedText>

        <View style={styles.toggleWrap}>
          <PowerToggle value={powered} onChange={(next) => {
            setPowered(next);
            setShowConfirm(!next);
            setError(null);
          }} />
        </View>

        {showConfirm ? (
          <>
            <ThemedText type="small" style={styles.warningText}>
              {animalName} will go offline and stop sending alerts until manually restarted.
            </ThemedText>
            <Pressable
              style={styles.confirmButton}
              disabled={shutdownMutation.isPending}
              onPress={() => {
                shutdownMutation.mutate(animalId, {
                  onSuccess: async () => {
                    await queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
                    sheetRef.current?.dismiss();
                  },
                  onError: () => {
                    setError('Couldn’t shut down the collar — try again');
                  },
                });
              }}
            >
              {shutdownMutation.isPending ? (
                <ActivityIndicator color="#DC2626" />
              ) : (
                <ThemedText type="smallBold" style={styles.confirmButtonText}>Confirm Shutdown</ThemedText>
              )}
            </Pressable>
            {error ? <ThemedText type="small" style={styles.errorText}>{error}</ThemedText> : null}
          </>
        ) : null}
      </ThemedView>
    </BottomSheetModal>
  );
});

export default ShutdownSheet;

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
  toggleWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  warningText: {
    color: '#B45309',
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  confirmButtonText: {
    color: '#DC2626',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
  },
});
