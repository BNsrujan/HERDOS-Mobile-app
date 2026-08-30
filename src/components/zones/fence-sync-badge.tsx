import { Badge } from '@/components/ui/badge';
import type { ZoneSyncStatus } from '@/types/rotation';

type FenceSyncBadgeProps = {
  sync: ZoneSyncStatus | null;
};

/**
 * Deliberate wording: "sent", never "synced".
 *
 * The base station acks transmission; the collar does not ack that it applied the
 * fence. Claiming "synced" would assert something the protocol cannot tell us.
 */
export default function FenceSyncBadge({ sync }: FenceSyncBadgeProps) {
  if (!sync || sync.total === 0) return null;

  if (sync.failed > 0) {
    return <Badge label={`${sync.failed} failed`} tone="danger" />;
  }
  if (sync.pending > 0) {
    return <Badge label={`${sync.pending} queued`} tone="warning" />;
  }
  return <Badge label={`${sync.sent}/${sync.total} sent`} tone="success" />;
}
