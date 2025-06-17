'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ResponsiveIcon } from './ResponsiveIcon';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    return (
        <ResponsiveIcon
            icon={isDark ? Sun : Moon}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className='cursor-pointer'
        />
    );
};
