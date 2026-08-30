'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { ResponsiveIcon } from './ResponsiveIcon';
import { Paragraph } from './Paragraph';
import { ThemeToggleProps } from './types.ui';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button } from '../forms';
import { ButtonSkeleton } from '../skeletons/home.skeletons';

export const ThemeToggle = ({
    label,
    lightLabel,
    darkLabel,
    className
}: ThemeToggleProps) => {
    
    const { theme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );

    const isDark = theme === 'dark';

    const text = label === undefined
    ?   isDark
        ?   darkLabel === undefined ? null : darkLabel
        :   lightLabel === undefined ? null : lightLabel
    :   label;

    if (!mounted) return <ButtonSkeleton />

    return (
        <Button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={className}
            testId='theme-toggle-button'
        >
            <ResponsiveIcon icon={isDark ? SunIcon : MoonIcon} />
            {!!text && <Paragraph>{text}</Paragraph>}
        </Button>
    );
};
