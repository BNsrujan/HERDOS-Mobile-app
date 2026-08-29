import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import PowerToggle from '@/components/animal-detail/power-toggle';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { MinTouchTarget, Space } from '@/constants/theme';
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
      backdropComponent={(props) => <BottomSheetBackdrop {...props} opacity={0.5} pressBehavior="close" />}
      onChange={(index) => {
        setIsOpen(index >= 0);
      }}
      onDismiss={() => {
        setPowered(true);
        setShowConfirm(false);
        setError(null);
      }}
    >
      <ThemedView type="surfaceElevated" style={styles.sheet}>
        <View style={styles.headerRow}>
          <ThemedText type="heading">Shut down your device</ThemedText>
          <AppPressable
            style={styles.closeButton}
            accessibilityLabel="Close"
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Icon name="close" />
          </AppPressable>
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          This will power off {animalName}&apos;s collar and stop tracking.
        </ThemedText>

        <View style={styles.toggleWrap}>
          <PowerToggle value={powered} onChange={(next) => {
            setPowered(next);
            setShowConfirm(!next);
            setError(null);
          }} />
        </View>

        {showConfirm ? (
          <>
            <ThemedText type="small" themeColor="onWarningSubtle">
              {animalName} will go offline and stop sending alerts until manually restarted.
            </ThemedText>
            <Button
              size="lg"
              fullWidth
              variant="dangerOutline"
              label="Confirm Shutdown"
              loading={shutdownMutation.isPending}
              onPress={() => {
                shutdownMutation.mutate(animalId, {
                  onSuccess: async () => {
                    await queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
                    sheetRef.current?.dismiss();
                  },
                  onError: () => {
                    setError("Couldn't shut down the collar — try again");
                  },
                });
              }}
            />
            {error ? (
              <ThemedText type="small" themeColor="danger">
                {error}
              </ThemedText>
            ) : null}
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
  toggleWrap: {
    alignItems: 'center',
    paddingVertical: Space.sm,
  },
});
