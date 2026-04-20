import { AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { PageHeader, PlayerAvatar } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

const PLAYERS = [
  { name: 'Anna Lee', src: 'https://i.pravatar.cc/80?img=5' },
  { name: 'Benjamin Osei', src: 'https://i.pravatar.cc/80?img=12' },
  { name: 'Chen Wei', src: 'https://i.pravatar.cc/80?img=32' },
  { name: 'Divya Ramaswamy', src: 'https://i.pravatar.cc/80?img=47' },
];

export default function PlayerAvatarGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Player avatar"
        description="Avatar wrapper that derives initials from a name, supports five sizes, and exposes an optional presence dot. Use this instead of hand-wiring Avatar + fallback per surface."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="Sizes" description="xs · sm · md · lg · xl.">
          <PlayerAvatar name="Anna Lee" src={PLAYERS[0].src} size="xs" />
          <PlayerAvatar name="Anna Lee" src={PLAYERS[0].src} size="sm" />
          <PlayerAvatar name="Anna Lee" src={PLAYERS[0].src} size="md" />
          <PlayerAvatar name="Anna Lee" src={PLAYERS[0].src} size="lg" />
          <PlayerAvatar name="Anna Lee" src={PLAYERS[0].src} size="xl" />
        </ComponentExample>

        <ComponentExample
          title="Automatic initials"
          description="When no image is provided (or it fails to load) the fallback shows initials derived from `name`."
        >
          <PlayerAvatar name="Anna Lee" />
          <PlayerAvatar name="Benjamin Osei" />
          <PlayerAvatar name="Chen" />
          <PlayerAvatar name="Divya Ramaswamy" />
        </ComponentExample>

        <ComponentExample
          title="Presence"
          description="Online · offline · busy. Dot uses the --success / --muted / --destructive tokens."
        >
          <PlayerAvatar name="Anna Lee" src={PLAYERS[0].src} presence="online" />
          <PlayerAvatar name="Benjamin Osei" src={PLAYERS[1].src} presence="offline" />
          <PlayerAvatar name="Chen Wei" src={PLAYERS[2].src} presence="busy" />
          <PlayerAvatar name="Divya Ramaswamy" presence="online" size="lg" />
        </ComponentExample>

        <ComponentExample
          title="Inside an avatar group"
          description="Stack multiple players with the shadcn AvatarGroup + count primitive."
        >
          <AvatarGroup>
            {PLAYERS.map((player) => (
              <PlayerAvatar key={player.name} name={player.name} src={player.src} />
            ))}
            <AvatarGroupCount>+8</AvatarGroupCount>
          </AvatarGroup>
        </ComponentExample>
      </div>
    </>
  );
}
