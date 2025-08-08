export const ColorCircleIndicator = ({ size, color }: { size?: number; color?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size ?? 8} height={size ?? 8} viewBox="0 0 8 8" fill="none">
      <circle cx="4" cy="4" r="4" fill={color || "#E07D36"} />
    </svg>
  );
};
