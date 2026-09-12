'use client';

import React, { createContext, useContext, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  HTMLMotionProps,
} from 'framer-motion';
import { cn } from '@/lib/utils';

interface DockContextProps {
  mouseX: MotionValue<number>;
  magnification: number;
  distance: number;
}

const DockContext = createContext<DockContextProps>({
  mouseX: new MotionValue(Infinity),
  magnification: 60,
  distance: 140,
});

interface DockProps extends HTMLMotionProps<'div'> {
  className?: string;
  magnification?: number;
  distance?: number;
  children: React.ReactNode;
}

export function Dock({
  className,
  magnification = 60,
  distance = 140,
  children,
  ...props
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance }}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          'flex h-16 items-end gap-3 rounded-full bg-black/90 backdrop-blur-2xl border border-zinc-800/90 px-4 pb-2.5 pt-1.5 shadow-2xl',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

interface DockItemContextProps {
  isHovered: boolean;
}

const DockItemContext = createContext<DockItemContextProps>({
  isHovered: false,
});

interface DockItemProps extends HTMLMotionProps<'div'> {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function DockItem({ className, children, onClick, ...props }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseX, magnification, distance } = useContext(DockContext);
  const [isHovered, setIsHovered] = useState(false);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <DockItemContext.Provider value={{ isHovered }}>
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 shadow-md text-slate-200 hover:text-white hover:border-amber-500/50 transition-colors cursor-pointer shrink-0',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </DockItemContext.Provider>
  );
}

interface DockIconProps {
  className?: string;
  children: React.ReactNode;
}

export function DockIcon({ className, children }: DockIconProps) {
  return (
    <div className={cn('flex items-center justify-center w-full h-full p-2.5', className)}>
      {children}
    </div>
  );
}

interface DockLabelProps {
  className?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export function DockLabel({ className, children, position = 'bottom' }: DockLabelProps) {
  const { isHovered } = useContext(DockItemContext);
  const isTop = position === 'top';

  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: isTop ? 10 : -10, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: isTop ? 4 : -4, x: '-50%' }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute left-1/2 rounded-full bg-black/95 border border-zinc-800 px-3 py-1 text-xs font-semibold text-white shadow-xl whitespace-nowrap z-50 pointer-events-none tracking-wide backdrop-blur-md',
            isTop ? '-top-10' : 'top-full mt-2.5',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
