import type { IconProps } from './icons/props.ts'

export interface MagpieLogoProps extends IconProps {}

/**
 * Magpie Horch brand mark — geometric abstract magpie in orange-gold and dark.
 * Replaces the former whale mark. Ink rides currentColor for body; #E8920A for
 * the wing accent so the mark stays recognisable in both light and dark themes.
 */
export function MagpieLogo({ size = 32, className }: MagpieLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Body — large rounded diamond, dark */}
      <ellipse cx="13" cy="18" rx="7" ry="9" fill="currentColor" transform="rotate(-10 13 18)" />
      {/* Wing upper — angular, orange-gold accent */}
      <polygon points="16,8 28,6 22,16" fill="#E8920A" />
      {/* Wing lower — dark underlayer */}
      <polygon points="18,14 28,12 24,22" fill="currentColor" opacity="0.75" />
      {/* Tail — long swept triangle */}
      <polygon points="8,22 14,28 20,26" fill="currentColor" />
      {/* Head — small circle */}
      <circle cx="20" cy="11" r="3.5" fill="currentColor" />
      {/* Eye — tiny highlight */}
      <circle cx="21.2" cy="10.2" r="1" fill="#E8920A" />
    </svg>
  )
}
