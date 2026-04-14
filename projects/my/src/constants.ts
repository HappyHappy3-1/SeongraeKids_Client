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
  { icon: '/icons/folder.svg', label: '포트폴리오', path: '/portfolio' },
  { icon: '/icons/business.svg', label: '취업 의뢰', path: '/jobs' },
  { icon: '/icons/profile.svg', label: '마이페이지', path: '/mypage' },
] as const;

export const DESIGN = { width: 1440, height: 1024 } as const;
