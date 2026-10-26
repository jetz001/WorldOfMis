import React from 'react';

/**
 * Antique Victorian Corner Flourish SVG
 * Matches antique engraved borders (similar to 19th-century manuscript frames)
 */
export const VintageCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = 'w-9 h-9 text-[#5a3818]' }) => {
  const rotation = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-x-[-1] scale-y-[-1]',
  }[position];

  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      className={`${className} ${rotation} pointer-events-none select-none`}
      aria-hidden="true"
    >
      <path d="M4 4h18c-1.5 2-2 4.5-1.5 7 0.6 3 2.5 5.5 5.5 6.5-3.5 0.5-6.5 2.5-8 5.5-1 2-1 4.5 0 6.5-2-1.5-4.5-2-7-1.5-3 0.6-5.5 2.5-6.5 5.5V4zm4 4v10c1.5-1.5 3.5-2.2 5.5-2-2-2-2.5-5-1.5-7.5 1-2.5 3-4.5 5.5-5.5H8zm24 0c-2 0.5-4 1.5-5.5 3-1.5 1.5-2.5 3.5-3 5.5 2.5-1 5.5-0.5 7.5 1.5 1.5-2 2-4.5 1.5-7-0.1-1-0.3-2-0.5-3zM4 28c0.5 2 1.5 4 3 5.5 1.5 1.5 3.5 2.5 5.5 3-1-2.5-0.5-5.5 1.5-7.5-2-1.5-4.5-2-7-1.5-1 0.1-2 0.3-3 0.5z" />
      <path d="M2 2h44v2H4v42H2V2zm6 6h32v1H9v31H8V8z" opacity="0.6" />
    </svg>
  );
};

/**
 * Antique Ornamental Section Divider (Flourish)
 */
export const VintageDivider: React.FC<{ className?: string }> = ({
  className = 'my-4 text-[#8b5a2b]',
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 select-none ${className}`}>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#8b5a2b]/40 to-[#8b5a2b]" />
      <svg
        className="w-5 h-5 text-[#6e431f] shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2c-.8 2-2 3.8-3.5 5 1.8.8 3.5 2 4.5 3.5 1-1.5 2.7-2.7 4.5-3.5-1.5-1.2-2.7-3-3.5-5zm-5 8c-2 .5-3.5 2-4.5 3.5 1.5 1 3.2 1.5 5 1.5-1-1.2-1-3-.5-5zm10 0c.5 2 .5 3.8-.5 5 1.8 0 3.5-.5 5-1.5-1-1.5-2.5-3-4.5-3.5zm-5 4c-1 1.5-2.7 2.7-4.5 3.5 1.5 1.2 2.7 3 3.5 5 .8-2 2-3.8 3.5-5-1.8-.8-3.5-2-4.5-3.5z" />
      </svg>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#8b5a2b]/40 to-[#8b5a2b]" />
    </div>
  );
};
