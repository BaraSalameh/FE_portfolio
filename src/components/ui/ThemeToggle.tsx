'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ResponsiveIcon } from './ResponsiveIcon';
import { Paragraph } from './Paragraph';

export const ThemeToggle = ({
    title,
    themeNameIncluded = false,
    className
}: {
    title?: string;
    themeNameIncluded?: boolean;
    className?: string;
}) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';
    const text: string | null =
        title
        ?   themeNameIncluded
            ?   `${title}${theme}`
            :   `${title}`
        :   themeNameIncluded
            ?   `${theme}`
            :   null
        

    return (
        <Paragraph onClick={() => setTheme(isDark ? 'light' : 'dark')} className={className}>
            <ResponsiveIcon
                icon={isDark ? Sun : Moon}
                className='cursor-pointer'
            />
            {text}
        </Paragraph>
    );
};
