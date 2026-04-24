import { useEffect, useState } from 'react';
import { Card } from './ui';
import { colors, fonts, radii, space } from '../design/tokens';
import {
  getMeals,
  getTimetable,
  type MealsResponse,
  type TimetablePeriod,
} from '../api/nice';

const TABS = ['시간표', '조식', '중식', '석식'] as const;
type Tab = (typeof TABS)[number];

interface Props {
  grade?: string;
  classNm?: string;
  style?: React.CSSProperties;
}

export default function SchoolTabs({
  grade = '3',
  classNm = '1',
  style,
}: Props) {
  const [active, setActive] = useState<Tab>('시간표');
  const [timetable, setTimetable] = useState<TimetablePeriod[] | null>(null);
  const [meals, setMeals] = useState<MealsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getTimetable(undefined, grade, classNm), getMeals()])
      .then(([tt, m]) => {
        if (cancelled) return;
        setTimetable(tt);
        setMeals(m);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : '나이스 API 실패');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [grade, classNm]);

  const renderMeal = (items: string[] | undefined) => {
    if (!items || items.length === 0) {
      return (
        <div
          style={{
            padding: space[6],
            textAlign: 'center',
            color: colors.text.secondary,
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
          }}
        >
          오늘 식단이 없어요.
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: space[3],
              padding: `${space[2]}px 0`,
              borderTop: i === 0 ? 'none' : `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: radii.full,
                background: colors.primarySoft,
                color: colors.primaryDark,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.xs,
                fontWeight: fonts.weight.bold,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontFamily: fonts.family.pretendard,
                fontSize: fonts.size.base,
                color: colors.text.primary,
                fontWeight: fonts.weight.semibold,
              }}
            >
              {it}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTimetable = () => {
    if (!timetable || timetable.length === 0) {
      return (
        <div
          style={{
            padding: space[6],
            textAlign: 'center',
            color: colors.text.secondary,
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
          }}
        >
          오늘 시간표가 없어요.
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {timetable.map((p, i) => (
          <div
            key={p.period}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: space[3],
              padding: `${space[2]}px 0`,
              borderTop:
                i === 0 ? 'none' : `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: radii.full,
                background: colors.primarySoft,
                color: colors.primaryDark,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.xs,
                fontWeight: fonts.weight.bold,
                flexShrink: 0,
              }}
            >
              {p.period}
            </div>
            <div
              style={{
                fontFamily: fonts.family.pretendard,
                fontSize: fonts.size.base,
                color: colors.text.primary,
                fontWeight: fonts.weight.semibold,
              }}
            >
              {p.subject || '—'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card
      variant="surface"
      radius="xl"
      elevated
      style={{
        padding: space[4],
        display: 'flex',
        flexDirection: 'column',
        gap: space[3],
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: space[4],
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        {TABS.map((tab) => {
          const on = active === tab;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: `${space[2]}px 0`,
                cursor: 'pointer',
                fontFamily: fonts.family.laundry,
                fontSize: fonts.size.md,
                fontWeight: fonts.weight.bold,
                color: on ? colors.text.primary : colors.text.muted,
                borderBottom: `3px solid ${on ? colors.primary : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: fonts.family.inter,
          fontSize: fonts.size.xs,
          color: colors.text.secondary,
        }}
      >
        {active === '시간표' ? `${grade}학년 ${classNm}반` : '오늘의 급식'}
      </div>
      <div style={{ minHeight: 160 }}>
        {loading ? (
          <div
            style={{
              padding: space[6],
              textAlign: 'center',
              color: colors.text.secondary,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
            }}
          >
            나이스에서 불러오는 중…
          </div>
        ) : error ? (
          <div
            style={{
              padding: space[3],
              background: '#FFE7E7',
              color: colors.state.danger,
              borderRadius: radii.md,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
            }}
          >
            {error}
          </div>
        ) : active === '시간표' ? (
          renderTimetable()
        ) : active === '조식' ? (
          renderMeal(meals?.breakfast)
        ) : active === '중식' ? (
          renderMeal(meals?.lunch)
        ) : (
          renderMeal(meals?.dinner)
        )}
      </div>
    </Card>
  );
}
