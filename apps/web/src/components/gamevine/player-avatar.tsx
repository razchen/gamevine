import { cn } from '@/lib/utils';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * A `PlayerAvatar` wraps the shadcn Avatar primitive with Gamevine
 * conventions:
 *   - Automatic initials fallback derived from `name`.
 *   - Extra sizes (`xs` / `xl`) on top of the primitive's `sm` / `default`
 *     / `lg` — the primitive only reserves data-attributes for those three,
 *     so xs / xl are applied via direct Tailwind sizes instead of
 *     `data-size`.
 *   - Optional presence dot (online / offline / busy).
 *
 * Server-component safe. Use this anywhere a player or creator identity
 * appears; do not reach for `<Avatar>` + manual fallback per surface.
 */
export type PlayerPresence = 'online' | 'offline' | 'busy';

export type PlayerAvatarProps = {
  /**
   * Display name used to derive fallback initials. Required even when an
   * image is supplied so accessibility / fallback cases stay intact.
   */
  name: string;
  /** Image URL. Omitted images fall back to initials. */
  src?: string;
  /** Width/height. Defaults to `md` (32px), matching the primitive's default. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Optional presence dot rendered in the bottom-right corner. */
  presence?: PlayerPresence;
  className?: string;
};

const SIZE_PX: Record<NonNullable<PlayerAvatarProps['size']>, string> = {
  xs: 'size-5 text-[10px]',
  sm: 'size-6 text-xs',
  md: 'size-8 text-sm',
  lg: 'size-10 text-sm',
  xl: 'size-14 text-base',
};

const PRESENCE_CLASSES: Record<PlayerPresence, string> = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  busy: 'bg-destructive',
};

function initialsFrom(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return ((parts[0]![0] ?? '') + (parts[parts.length - 1]![0] ?? '')).toUpperCase();
}

export function PlayerAvatar({ name, src, size = 'md', presence, className }: PlayerAvatarProps) {
  const initials = initialsFrom(name);

  return (
    <Avatar
      data-player-size={size}
      aria-label={name}
      className={cn('relative', SIZE_PX[size], className)}
    >
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback aria-hidden="true">{initials}</AvatarFallback>
      {presence ? (
        <AvatarBadge
          aria-label={`${name} is ${presence}`}
          className={cn('size-2.5 border-0', PRESENCE_CLASSES[presence])}
        />
      ) : null}
    </Avatar>
  );
}
