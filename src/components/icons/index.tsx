import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9.5a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function TrainIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 8.5v7M17.5 8.5v7" />
      <path d="M3.5 11h1.5M19 11h1.5M3.5 13h1.5M19 13h1.5" />
      <path d="M6.5 12h11" />
    </svg>
  );
}

export function PlansIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" />
      <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
    </svg>
  );
}

export function ProgressIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 19V13M10 19V9M16 19v-6M20 5l-6 6-3-3-6.5 6.5" />
    </svg>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.6 3.13-6 7-6s7 2.4 7 6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function StrengthIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="8.5" width="3" height="7" rx="1" />
      <rect x="18.5" y="8.5" width="3" height="7" rx="1" />
      <path d="M5.5 12h13" />
      <path d="M8.5 9.5v5M15.5 9.5v5" />
    </svg>
  );
}

export function AthleticsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="14.5" cy="5.5" r="1.75" />
      <path d="M6 20 9.5 15.5 8.5 11.5 12 13l2 3 3.5 1" />
      <path d="M9.5 15.5 6.5 13" />
    </svg>
  );
}

export function CyclingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="17" r="3.25" />
      <circle cx="18" cy="17" r="3.25" />
      <path d="M6 17 10 9h4.5l3 8" />
      <path d="M10.5 9H14M9 17h9" />
    </svg>
  );
}

export function SwimmingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="7.5" cy="7" r="1.5" />
      <path d="M9.5 10 12.5 11.5 15.5 9.5 18.5 11" />
      <path d="M3 16c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" />
      <path d="M3 19.5c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" />
    </svg>
  );
}

export function StretchingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="4.5" r="1.75" />
      <path d="M12 7.5v5" />
      <path d="M8 9.5 12 12.5l4-3" />
      <path d="M7 20l5-7.5 5 7.5" />
    </svg>
  );
}
