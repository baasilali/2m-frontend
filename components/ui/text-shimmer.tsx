'use client';
import React, { useMemo, type JSX, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type TextShimmerProps = {
  children: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
  duration?: number;
  spread?: number;
  targetClass?: string;
} & HTMLMotionProps<"div">;

const TextShimmer = forwardRef<HTMLDivElement, TextShimmerProps>(
  ({
    children,
    as: Component = 'p',
    className,
    duration = 2,
    spread = 2,
    targetClass,
  }, ref) => {
    const MotionComponent = motion(Component as keyof JSX.IntrinsicElements);

    const dynamicSpread = useMemo(() => {
      return children.length * spread;
    }, [children, spread]);

    return (
      <MotionComponent
        ref={ref}
        className={cn(
          'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
          'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
          '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
          'dark:[--base-color:#e4e4e7] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
          className
        )}
        initial={{ backgroundPosition: '100% center' }}
        animate={{ backgroundPosition: '0% center' }}
        transition={{
          repeat: Infinity,
          duration,
          ease: 'linear',
        }}
        style={
          {
            '--spread': `${dynamicSpread}px`,
            backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
          } as React.CSSProperties
        }
      >
        {children}
      </MotionComponent>
    );
  }
);

TextShimmer.displayName = 'TextShimmer';

export { TextShimmer }; 