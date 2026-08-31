'use client';

import { cn } from '@/lib/ui/cn';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

type ThemeSwitchProps = {
    className?: string;
};

export function ThemeSwitch({ className }: ThemeSwitchProps) {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );
    const isDark = mounted && resolvedTheme === 'dark';
    const label = isDark ? 'Use light theme' : 'Use dark theme';

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(
                'grid size-10 place-items-center rounded-full border border-line bg-surface text-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                className,
            )}
            aria-label={label}
            title={label}
            data-testid="theme-toggle-button"
        >
            {isDark ? <Sun className="size-[1.05rem]" aria-hidden="true" /> : <Moon className="size-[1.05rem]" aria-hidden="true" />}
        </button>
    );
}
