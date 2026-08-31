import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Surface } from '@/components/ui/surface';
import { MAP_EDGE } from '@/constants/map-layout';
import { Colors, Radius, Space } from '@/constants/theme';

export type ZoneNameSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

type ZoneNameSheetProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
};

/**
 * Names a new fence before saving it.
 *
 * Replaces a raw `Modal` that had neither keyboard avoidance around its autoFocus
 * input nor a backdrop-tap dismiss. Both come from library props here rather than
 * hand-rolled handling: `keyboardBehavior`, `android_keyboardInputMode`, and
 * `BottomSheetBackdrop pressBehavior="close"`.
 */
const ZoneNameSheet = forwardRef<ZoneNameSheetHandle, ZoneNameSheetProps>(function ZoneNameSheet(
  { value, onChange, onSave, saving },
  ref,
) {
  const sheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView>
        <Surface level="surface" style={styles.content}>
          <ThemedText type="heading">Name this fence</ThemedText>

          <BottomSheetTextInput
            value={value}
            onChangeText={onChange}
            placeholder="e.g. North paddock"
            placeholderTextColor={Colors.light.textTertiary}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => {
              if (value.trim()) onSave();
            }}
            style={styles.input}
            accessibilityLabel="Fence name"
          />

          <View style={styles.actions}>
            <Button
              size="lg"
              fullWidth
              label="Save fence"
              disabled={!value.trim()}
              loading={saving}
              onPress={onSave}
            />
          </View>
        </Surface>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: MAP_EDGE,
    paddingBottom: Space['3xl'],
    gap: Space.md,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Radius.md,
    paddingHorizontal: Space.md,
    fontSize: 16,
    color: Colors.light.textPrimary,
    backgroundColor: Colors.light.surfaceSunken,
  },
  actions: {
    gap: Space.sm,
  },
});

export default ZoneNameSheet;
