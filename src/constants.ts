export const COLORS = {
  primary: '#FDCB35',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#999',
  darkCard: '#3F3F3F',
  placeholder: '#937725',
  scheduleGray: '#858585',
  dotGray: '#D9D9D9',
  subtleGray: '#757575',
  optionBg: '#D9D9D9',
} as const;

export const FONTS = {
  laundry: "'LaundryGothic', sans-serif",
  pretendard: 'Pretendard, Inter, sans-serif',
  inter: 'Inter, sans-serif',
} as const;

export const ACTIVE_ICON_FILTER =
  'brightness(0) saturate(100%) invert(82%) sepia(45%) saturate(1000%) hue-rotate(355deg) brightness(100%) contrast(95%)';

export const SIDEBAR_ITEMS = [
  { icon: '/icons/home.svg', label: '홈 화면', path: '/home' },
  { icon: '/icons/school.svg', label: '학급', path: '/classroom' },
  { icon: '/icons/business.svg', label: '취업 의뢰', path: '/jobs' },
  { icon: '/icons/profile.svg', label: '마이페이지', path: '/mypage' },
] as const;

export const DESIGN = { width: 1440, height: 1024 } as const;

export type UserRole = 'teacher' | 'president' | 'vice_president' | 'student';

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'teacher', label: '선생님' },
  { value: 'president', label: '반장' },
  { value: 'vice_president', label: '부반장' },
  { value: 'student', label: '학생' },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  teacher: '선생님',
  president: '반장',
  vice_president: '부반장',
  student: '학생',
};
