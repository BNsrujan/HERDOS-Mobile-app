import { ChipGroup, type ChipOption } from '@/components/ui/chip-group';

export type AlertFilter = 'all' | 'active' | 'resolved';

const filters: ChipOption<AlertFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
];

type AlertFilterChipsProps = {
  value: AlertFilter;
  onChange: (value: AlertFilter) => void;
};

export default function AlertFilterChips({ value, onChange }: AlertFilterChipsProps) {
  return <ChipGroup options={filters} value={value} onChange={onChange} />;
}
