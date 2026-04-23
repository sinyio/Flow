'use client';

import { Fragment, useEffect, useRef } from 'react';
import { Text } from '@gravity-ui/uikit';

interface ScrollRevealTextProps {
  lines: string[];
  className?: string;
}

export function ScrollRevealText({ lines, className }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>('[data-char]'));

    const update = () => {
      const rect = el.getBoundingClientRect();
      const delay = window.innerHeight * 0.35;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top - delay) / rect.height));
      const gradientWidth = 18;
      const revealed = progress * (chars.length + gradientWidth);

      chars.forEach((span, i) => {
        const charProgress = Math.max(0, Math.min(1, (revealed - i) / gradientWidth));
        const opacity = 0.3 + charProgress * 0.7;
        span.style.color = `rgba(0,0,0,${opacity})`;
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div ref={containerRef}>
      {lines.map((line, lineIdx) => (
        <Fragment key={lineIdx}>
          {lineIdx > 0 && <br />}
          <Text variant="header-1" as="span" className={className}>
            {Array.from(line).map((char, charIdx) => (
              <span key={charIdx} data-char="" style={{ color: 'rgba(0,0,0,0.3)' }}>
                {char}
              </span>
            ))}
          </Text>
        </Fragment>
      ))}
    </div>
  );
}
