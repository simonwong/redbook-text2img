interface ChevronLeftIconProps {
  color: string;
  size?: number;
}

export const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({ color, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
