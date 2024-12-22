// ThemeContext.tsx
"use client";

import React, { createContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

interface ThemeContextProps {
    theme: string;
    toggleTheme: () => void;
}

const defaultTheme = 'light';

export const ThemeContext = createContext<ThemeContextProps>({
    theme: defaultTheme,
    toggleTheme: () => {},
});

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>(defaultTheme);

    useEffect(() => {
        // Check for saved user preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            setTheme(savedTheme);
            document.documentElement.classList.add(savedTheme);
        } else {
            // If no preference, check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = prefersDark ? 'dark' : 'light';
            setTheme(initialTheme);
            document.documentElement.classList.add(initialTheme);
        }
    }, []);

    const toggleTheme = () => {
        console.log('Toggling theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.remove(theme);
        document.documentElement.classList.add(newTheme);
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Create MUI theme that responds to the current theme
    const muiTheme = createTheme({
        palette: {
            mode: theme as 'light' | 'dark',
        },
    });

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <MuiThemeProvider theme={muiTheme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
