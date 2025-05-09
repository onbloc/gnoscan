export const IconCopy = ({ className, size }: { className?: string; size?: number }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : "24"}
      height={size ? size : "24"}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.00391 14.9995H4.00391C3.47347 14.9995 2.96477 14.7888 2.58969 14.4137C2.21462 14.0387 2.00391 13.5299 2.00391 12.9995V3.99951C2.00391 3.46908 2.21462 2.96037 2.58969 2.5853C2.96477 2.21023 3.47347 1.99951 4.00391 1.99951H13.0039C13.5343 1.99951 14.043 2.21023 14.4181 2.5853C14.7932 2.96037 15.0039 3.46908 15.0039 3.99951V4.99951"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
