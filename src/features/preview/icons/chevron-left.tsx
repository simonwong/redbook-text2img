interface ChevronLeftIconProps {
  color: string;
  size?: number;
}

export const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({
  color,
  size = 24,
}) => (
  <svg
    fill="none"
    height={size}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
    width={size}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
