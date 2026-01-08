interface MenuCircleIconProps {
  color: string;
  size?: number;
}

export const MenuCircleIcon: React.FC<MenuCircleIconProps> = ({ color, size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="1" fill={color} />
    <circle cx="8" cy="12" r="1" fill={color} />
    <circle cx="16" cy="12" r="1" fill={color} />
  </svg>
);
