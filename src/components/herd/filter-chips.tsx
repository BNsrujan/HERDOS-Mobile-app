import { ChipGroup, type ChipOption } from '@/components/ui/chip-group';
import { StatusColors } from '@/constants/theme';
import type { AnimalStatus } from '@/types/animal';

type HerdFilter = AnimalStatus | 'all';

const filterOptions: ChipOption<HerdFilter>[] = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy', dotColor: StatusColors.healthy },
  { label: 'Watch', value: 'watch', dotColor: StatusColors.watch },
  { label: 'Alert', value: 'alert', dotColor: StatusColors.alert },
  { label: 'Milking', value: 'milking', dotColor: StatusColors.milking },
  { label: 'Pregnant', value: 'pregnant', dotColor: StatusColors.pregnant },
];

type FilterChipsProps = {
  value: HerdFilter;
  onChange: (value: HerdFilter) => void;
};

export default function FilterChips({ value, onChange }: FilterChipsProps) {
  return <ChipGroup scrollable options={filterOptions} value={value} onChange={onChange} />;
}
