'use client';
import React from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { useTabs, type Tab } from '@/hooks/UseTabs';
import { cn } from '@/lib/utils';

interface AnimatedTabsProps {
  tabs: Tab[];
  onTabChange?: (value: string) => void;
}

const transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.15
};

const getHoverAnimationProps = (hoveredRect: DOMRect, navRect: DOMRect) => ({
  x: hoveredRect.left - navRect.left - 10,
  y: hoveredRect.top - navRect.top - 4,
  width: hoveredRect.width + 20,
  height: hoveredRect.height + 10
});

const Tabs = ({
  tabs,
  selectedTabIndex,
  setSelectedTab
}: {
  tabs: Tab[];
  selectedTabIndex: number;
  setSelectedTab: (input: [number, number]) => void;
}): React.ReactElement => {
  const [buttonRefs, setButtonRefs] = React.useState<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    setButtonRefs((prev) => prev.slice(0, tabs.length));
  }, [tabs.length]);

  const navRef = React.useRef<HTMLDivElement>(null);
  const navRect = navRef.current?.getBoundingClientRect();
  const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();

  const [hoveredTabIndex, setHoveredTabIndex] = React.useState<number | null>(null);
  const hoveredRect = buttonRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

  return (
    <nav
      ref={navRef}
      className="flex flex-shrink-0 justify-center items-center relative z-0 py-2"
      onPointerLeave={() => setHoveredTabIndex(null)}
    >
      {tabs.map((item, i) => {
        const isActive = selectedTabIndex === i;

        return (
          <button
            key={item.value}
            className={cn(
              'text-sm font-medium sm:text-base relative rounded-md flex items-center h-8 px-4 z-20 cursor-pointer select-none transition-colors',
              {
                'font-medium': isActive
              }
            )}
            onPointerEnter={() => setHoveredTabIndex(i)}
            onFocus={() => setHoveredTabIndex(i)}
            onClick={() => setSelectedTab([i, i > selectedTabIndex ? 1 : -1])}
          >
            <motion.span
              ref={(el) => {
                buttonRefs[i] = el as HTMLButtonElement;
              }}
              className={cn('block', {
                'text-foreground': !isActive,
                'text-background font-medium': isActive
              })}
            >
              <small className={item.value === 'danger-zone' ? 'text-red-500' : ''}>
                {item.label}
              </small>
            </motion.span>
          </button>
        );
      })}

      <AnimatePresence>
        {hoveredRect && navRect && (
          <motion.div
            key="hover"
            className="absolute z-10 top-0 left-0 rounded-md bg-accent"
            initial={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
            animate={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 1 }}
            exit={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
            transition={transition}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRect && navRect && (
          <motion.div
            className="absolute z-10 top-0 left-0 rounded-md bg-foreground"
            initial={false}
            animate={{ ...getHoverAnimationProps(selectedRect, navRect), opacity: 1 }}
            transition={transition}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export function TabChips({ tabs, onTabChange }: AnimatedTabsProps) {
  const [hookProps] = React.useState(() => {
    const initialTabId = tabs[0].value;
    return {
      tabs: tabs.map(({ label, value, subRoutes }) => ({
        label,
        value,
        subRoutes
      })),
      initialTabId
    };
  });

  const framer = useTabs(hookProps);

  React.useEffect(() => {
    if (onTabChange) {
      onTabChange(framer.selectedTab.value);
    }
  }, [framer.selectedTab, onTabChange]);

  return (
    <div className="w-full">
      <div
        className="relative flex w-full items-center justify-between overflow-x-auto overflow-y-hidden"
        style={{
          scrollbarWidth: "none"
        }}
      >
        <Tabs {...framer.tabProps} />
      </div>
    </div>
  );
}
