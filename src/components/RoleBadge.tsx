import { ROLE_LABELS, type UserRole } from '../constants';
import { colors, fonts, radii } from '../design/tokens';

export default function RoleBadge({
  role,
  name,
}: {
  role: UserRole | null;
  name?: string | null;
}) {
  if (!role) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        background: 'rgba(0,0,0,0.12)',
        borderRadius: radii.full,
        fontFamily: fonts.family.inter,
        fontSize: fonts.size.xs,
        fontWeight: fonts.weight.bold,
        color: colors.text.primary,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: radii.full,
          background: colors.text.primary,
        }}
      />
      {name ? `${name} · ` : ''}
      {ROLE_LABELS[role] ?? role}
    </div>
  );
}
