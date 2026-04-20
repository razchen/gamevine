import { CheckIcon } from 'lucide-react';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';
import { ComponentExample } from '../_components/component-example';

const USERS = [
  {
    id: 'u-01',
    name: 'Ada Lovelace',
    src: 'https://i.pravatar.cc/80?img=49',
  },
  {
    id: 'u-02',
    name: 'Grace Hopper',
    src: 'https://i.pravatar.cc/80?img=47',
  },
  {
    id: 'u-03',
    name: 'Katherine Johnson',
    src: 'https://i.pravatar.cc/80?img=48',
  },
  {
    id: 'u-04',
    name: 'Barbara Liskov',
    src: 'https://i.pravatar.cc/80?img=45',
  },
];

export default function AvatarPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Avatar</h1>
        <p className="text-muted-foreground text-sm">
          User image with automatic fallback, presence badge, and stacked groups.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample title="Sizes" description="sm · default · lg.">
          <Avatar size="sm">
            <AvatarImage src={USERS[0].src} alt={USERS[0].name} />
            <AvatarFallback>{initials(USERS[0].name)}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src={USERS[1].src} alt={USERS[1].name} />
            <AvatarFallback>{initials(USERS[1].name)}</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src={USERS[2].src} alt={USERS[2].name} />
            <AvatarFallback>{initials(USERS[2].name)}</AvatarFallback>
          </Avatar>
        </ComponentExample>

        <ComponentExample
          title="Fallback"
          description="Initials render when the image fails or is absent. Tinted from --muted."
        >
          <Avatar>
            <AvatarFallback>GV</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>KJ</AvatarFallback>
          </Avatar>
        </ComponentExample>

        <ComponentExample
          title="With badge"
          description="Presence or status indicator anchored bottom-right."
        >
          <Avatar>
            <AvatarImage src={USERS[3].src} alt={USERS[3].name} />
            <AvatarFallback>{initials(USERS[3].name)}</AvatarFallback>
            <AvatarBadge className="bg-success" aria-label="Online" />
          </Avatar>
          <Avatar>
            <AvatarImage src={USERS[0].src} alt={USERS[0].name} />
            <AvatarFallback>{initials(USERS[0].name)}</AvatarFallback>
            <AvatarBadge className="bg-warning" aria-label="Away" />
          </Avatar>
          <Avatar>
            <AvatarImage src={USERS[1].src} alt={USERS[1].name} />
            <AvatarFallback>{initials(USERS[1].name)}</AvatarFallback>
            <AvatarBadge className="bg-primary text-primary-foreground" aria-label="Verified">
              <CheckIcon />
            </AvatarBadge>
          </Avatar>
        </ComponentExample>

        <ComponentExample
          title="Group"
          description="Overlapping stack with a trailing count bubble."
        >
          <AvatarGroup>
            {USERS.slice(0, 3).map((user) => (
              <Avatar key={user.id}>
                <AvatarImage src={user.src} alt={user.name} />
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+4</AvatarGroupCount>
          </AvatarGroup>
        </ComponentExample>
      </div>
    </>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
