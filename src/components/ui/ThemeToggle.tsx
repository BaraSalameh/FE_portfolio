'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { ResponsiveIcon } from './ResponsiveIcon';
import { Paragraph } from './Paragraph';
import { ThemeToggleProps } from './types.ui';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button } from '../forms';

export const ThemeToggle = ({
    label,
    lightLabel,
    darkLabel,
    className
}: ThemeToggleProps) => {
    
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = theme === 'dark';

    const text = label === undefined
    ?   isDark
        ?   darkLabel === undefined ? null : darkLabel
        :   lightLabel === undefined ? null : lightLabel
    :   label;

    return (
        <Button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={className}
            testId='theme-toggle-button'
            disabled={!mounted}
        >
            <ResponsiveIcon icon={isDark ? SunIcon : MoonIcon} />
            {!!text && <Paragraph>{text}</Paragraph>}
        </Button>
    );
};
