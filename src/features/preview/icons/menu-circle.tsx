interface MenuCircleIconProps {
  color: string;
  size?: number;
}

export const MenuCircleIcon: React.FC<MenuCircleIconProps> = ({
  color,
  size = 22,
}) => (
  <svg
    fill="none"
    height={size}
    stroke={color}
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" fill={color} r="1" />
    <circle cx="8" cy="12" fill={color} r="1" />
    <circle cx="16" cy="12" fill={color} r="1" />
  </svg>
);
