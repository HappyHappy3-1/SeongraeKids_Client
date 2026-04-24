import { useRef } from 'react';
import { colors, fonts, radii, shadows, space, zIndex } from '../design/tokens';
import type { Notice } from '../api/notices';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function NoticeDetailModal({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
  useEscapeKey(onClose);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef);
  const publishedLabel = (notice.published_at ?? '')
    .slice(0, 10)
    .replace(/-/g, '.');
  const eventLabel = notice.event_date
    ? notice.event_date.slice(0, 10).replace(/-/g, '.')
    : null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 100%)',
          maxHeight: '86vh',
          background: colors.white,
          borderRadius: radii.xl,
          boxShadow: shadows.float,
          padding: `${space[6]}px ${space[8]}px ${space[6]}px`,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: radii.full,
            border: 'none',
            background: 'rgba(0,0,0,0.06)',
            cursor: 'pointer',
            fontSize: 20,
            lineHeight: 1,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.12)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.06)')
          }
        >
          ×
        </button>
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.xs,
            color: colors.primaryDark,
            fontWeight: fonts.weight.semibold,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: space[2],
          }}
        >
          공지
        </div>
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size['2xl'],
            fontWeight: fonts.weight.bold,
            color: colors.text.primary,
            lineHeight: 1.25,
            marginBottom: space[2],
          }}
        >
          {notice.title}
        </div>
        <div
          style={{
            display: 'flex',
            gap: space[3],
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.xs,
            color: colors.text.secondary,
            marginBottom: space[4],
          }}
        >
          {eventLabel && (
            <span style={{ color: colors.primaryDark, fontWeight: fonts.weight.bold }}>
              일정 {eventLabel}
            </span>
          )}
          {publishedLabel && <span>게시 {publishedLabel}</span>}
        </div>
        <div
          style={{
            height: 1,
            background: colors.border.default,
            marginBottom: space[4],
          }}
        />
        <div
          style={{
            fontFamily: fonts.family.pretendard,
            fontSize: fonts.size.base,
            color: colors.text.primary,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.65,
          }}
        >
          {notice.content?.trim() ? notice.content : '내용이 없습니다.'}
        </div>
      </div>
    </div>
  );
}
