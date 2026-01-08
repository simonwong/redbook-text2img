import type { HeaderBarStyle } from '@/lib/theme';
import { ChevronLeftIcon, MenuCircleIcon, ShareIcon } from './icons';

interface HeaderBarProps {
  config: HeaderBarStyle;
}

/** 装饰性导航栏组件（如 Apple Notes 风格） */
export const HeaderBar: React.FC<HeaderBarProps> = ({ config }) => {
  const { iconColor, background = 'transparent', icons } = config;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background,
      }}
    >
      <div>{icons.backArrow && <ChevronLeftIcon color={iconColor} />}</div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {icons.share && <ShareIcon color={iconColor} />}
        {icons.menu && <MenuCircleIcon color={iconColor} />}
      </div>
    </div>
  );
};
