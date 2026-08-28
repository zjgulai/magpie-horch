// Magpie Horch brand wordmark: geometric magpie mark + "Magpie" letterform +
// orange-gold "HORCH" badge plate. Native 200x28. Ink rides currentColor;
// badge text is white so the plate reads in both themes.

import type { IconProps } from './icons/props.ts'

/** Display options for the Magpie Horch brand wordmark. */
export interface BrandWordmarkProps extends IconProps {
  /** Whether to include the leading magpie mark; defaults to true. */
  includeMark?: boolean | undefined
}

/**
 * Render the full Magpie Horch brand wordmark.
 * @param props.size - height in px (default 28; width follows selected artwork).
 * @param props.className - extra class for layout placement.
 * @param props.includeMark - whether to include the leading magpie mark.
 * @returns the wordmark svg (aria-hidden decorative brand art).
 */
export function BrandWordmark({ size = 28, className, includeMark = true }: BrandWordmarkProps) {
  const totalWidth = includeMark ? 200 : 172
  const viewBoxX = includeMark ? 0 : 28

  return (
    <svg
      width={(size * totalWidth) / 28}
      height={size}
      className={className}
      viewBox={`${viewBoxX} 0 ${totalWidth} 28`}
      fill="none"
      aria-hidden="true"
    >
      {/* ── Magpie geometric mark (28×28) ── */}
      {includeMark && (
        <g>
          <ellipse cx="11" cy="17" rx="6" ry="8" fill="currentColor" transform="rotate(-8 11 17)" />
          <polygon points="14,7 25,5 20,15" fill="#E8920A" />
          <polygon points="16,13 25,11 22,20" fill="currentColor" opacity="0.7" />
          <polygon points="6,20 12,26 18,24" fill="currentColor" />
          <circle cx="19" cy="10" r="3" fill="currentColor" />
          <circle cx="20" cy="9.2" r="0.9" fill="#E8920A" />
        </g>
      )}

      {/* ── "Magpie" wordmark text ── */}
      <text
        x={includeMark ? 32 : viewBoxX + 2}
        y="20"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="16"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-0.01em"
      >
        Magpie
      </text>

      {/* ── "HORCH" orange badge ── */}
      <rect
        x={includeMark ? 120 : 92}
        y="6"
        width="52"
        height="16"
        rx="3"
        fill="#E8920A"
      />
      <text
        x={includeMark ? 146 : 118}
        y="18"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        letterSpacing="0.08em"
      >
        HORCH
      </text>
    </svg>
  )
}
