'use client';

import React from 'react';
import { motion, Transition, Variants } from 'framer-motion';

export type TextRollProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  transition?: Transition;
  variants?: {
    enter?: Variants;
    exit?: Variants;
  };
  onAnimationComplete?: () => void;
};

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.03,
  getExitDelay = (i) => i * 0.03,
  className = '',
  transition = { ease: [0.32, 0.72, 0, 1] },
  variants,
  onAnimationComplete,
}: TextRollProps) {
  const defaultVariants: { enter: Variants; exit: Variants } = {
    enter: {
      initial: { y: '0%' },
      hover: { y: '-100%' },
    },
    exit: {
      initial: { y: '100%' },
      hover: { y: '0%' },
    },
  };

  const letters = children.split('');

  return (
    <motion.span
      className={`inline-flex flex-wrap overflow-hidden ${className}`}
      initial="initial"
      whileHover="hover"
      onAnimationComplete={onAnimationComplete}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap">
        {letters.map((letter, i) => (
          <span key={i} className="relative inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              variants={variants?.enter ?? defaultVariants.enter}
              transition={{
                ...transition,
                duration,
                delay: getEnterDelay(i),
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
            <motion.span
              className="absolute left-0 top-0 inline-block"
              variants={variants?.exit ?? defaultVariants.exit}
              transition={{
                ...transition,
                duration,
                delay: getExitDelay(i),
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  );
}
