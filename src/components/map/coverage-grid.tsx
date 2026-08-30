import { Fragment } from 'react';
import { Platform } from 'react-native';

import { metersToLatDelta, metersToLngDelta } from '@/utils/geo-client';
import type { CoverageCell, LoraCoverage } from '@/types/spatial';

let Polygon: any;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Polygon = require('react-native-maps').Polygon;
}

/**
 * Discrete coloured squares, deliberately NOT a Heatmap.
 *
 * Coverage is a graded engineering answer; a smooth blur would imply confidence
 * about the space between samples that simply does not exist.
 */
const GRADES = [
  { key: 'good', fill: 'rgba(34,197,94,0.35)', stroke: 'rgba(34,197,94,0.8)' },
  { key: 'fair', fill: 'rgba(245,158,11,0.35)', stroke: 'rgba(245,158,11,0.8)' },
  { key: 'weak', fill: 'rgba(239,68,68,0.35)', stroke: 'rgba(239,68,68,0.8)' },
] as const;

export function gradeOf(cell: CoverageCell, thresholds: { good: number; fair: number }) {
  if (cell.avgRssi === null) return GRADES[2];
  if (cell.avgRssi >= thresholds.good) return GRADES[0];
  if (cell.avgRssi >= thresholds.fair) return GRADES[1];
  return GRADES[2];
}

type CoverageGridProps = {
  coverage: LoraCoverage;
};

export default function CoverageGrid({ coverage }: CoverageGridProps) {
  if (Platform.OS === 'web') return null;

  const half = coverage.cellMeters / 2;

  return (
    <>
      {coverage.cells.map((cell, index) => {
        const dLat = metersToLatDelta(half);
        const dLng = metersToLngDelta(half, cell.lat);
        const grade = gradeOf(cell, coverage.gradeThresholds);

        return (
          <Fragment key={`cov-${index}`}>
            <Polygon
              coordinates={[
                { latitude: cell.lat - dLat, longitude: cell.lng - dLng },
                { latitude: cell.lat - dLat, longitude: cell.lng + dLng },
                { latitude: cell.lat + dLat, longitude: cell.lng + dLng },
                { latitude: cell.lat + dLat, longitude: cell.lng - dLng },
              ]}
              fillColor={grade.fill}
              strokeColor={grade.stroke}
              strokeWidth={1}
              tappable={false}
            />
          </Fragment>
        );
      })}
    </>
  );
}
