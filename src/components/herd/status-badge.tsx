import { Badge } from '@/components/ui/badge';
import { StatusLabels, StatusTone } from '@/constants/theme';
import type { AnimalStatus } from '@/types/animal';

type StatusBadgeProps = {
  status: AnimalStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge label={StatusLabels[status]} tone={StatusTone[status]} />;
}
