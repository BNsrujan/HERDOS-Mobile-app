import BottomSheet, { type BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useImperativeHandle, useRef, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { Surface } from '@/components/ui/surface';
import { MapZ } from '@/constants/map-layout';
import { Colors, Elevation, Radius } from '@/constants/theme';

export type MapSheetHandle = {
  snapToIndex: (index: number) => void;
  expand: () => void;
  collapse: () => void;
};

type MapSheetProps = {
  /** Detents in points from the tab-bar edge; a module constant, never inline. */
  snapPoints: readonly (number | string)[];
  /** Ceiling so the sheet can never rise over the context bar. */
  topInset: number;
  /** gorhom writes the sheet's live y here; the control rail reads it. */
  animatedPosition: SharedValue<number>;
  onIndexChange: (index: number) => void;
  /**
   * Off for the trail sheet: it hosts a Slider and a chip row, has no scrollable at
   * the lower detents, and content panning only fights them. Handle drag still works.
   */
  enableContentPanning?: boolean;
  children: ReactNode;
};

/**
 * The single persistent bottom sheet for the Map screen.
 *
 * Non-modal on purpose: it is always present and never dismissable, and joining the
 * modal stack would let any other modal's backdrop dismiss it and would fight the
 * layers picker for stack order.
 *
 * gorhom's hosting container is `pointerEvents="box-none"`, so this covers the map
 * in layout while staying transparent to touch outside the sheet body — which is
 * what keeps the map tappable underneath for placing fence vertices.
 */
const MapSheet = forwardRef<MapSheetHandle, MapSheetProps>(function MapSheet(
  { snapPoints, topInset, animatedPosition, onIndexChange, enableContentPanning = true, children },
  ref,
) {
  const sheetRef = useRef<BottomSheet>(null);

  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => sheetRef.current?.snapToIndex(index),
    expand: () => sheetRef.current?.expand(),
    collapse: () => sheetRef.current?.collapse(),
  }));

  const renderBackground = useCallback(
    ({ style }: BottomSheetBackgroundProps) => (
      // Pinned light: the sheet floats over satellite imagery, which is dark in both
      // schemes. Every ThemedText inside inherits the light foreground via useSurface.
      <Surface scheme="light" level="surface" style={[style, styles.background]} />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints as (number | string)[]}
      topInset={topInset}
      // The tab bar is a flex sibling; bottom:0 is already above it.
      bottomInset={0}
      animatedPosition={animatedPosition}
      onChange={onIndexChange}
      enablePanDownToClose={false}
      enableOverDrag={false}
      // Claim the vertical pan early and reject horizontal swipes, so the sheet does
      // not race the map or a horizontal list for the gesture.
      activeOffsetY={[-6, 6]}
      failOffsetX={[-12, 12]}
      enableContentPanningGesture={enableContentPanning}
      handleComponent={MapSheetHandleBar}
      backgroundComponent={renderBackground}
      style={styles.sheet}
    >
      {children}
    </BottomSheet>
  );
});

/** Grab handle. Also the tap target that toggles peek/half without a drag. */
function MapSheetHandleBar() {
  return (
    <View style={styles.handleArea}>
      <View style={styles.handleBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    zIndex: MapZ.sheet,
  },
  background: {
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    ...Elevation.raised,
  },
  handleArea: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.borderStrong,
  },
});

export default MapSheet;
