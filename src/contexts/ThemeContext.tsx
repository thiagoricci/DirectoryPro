import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

interface ThemeContextType {
  theme: ThemeSettings;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: {
    primary_color: '#3b82f6',
    secondary_color: '#1e40af',
    accent_color: '#06b6d4',
  },
  loading: true,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<ThemeSettings>({
    primary_color: '#3b82f6',
    secondary_color: '#1e40af',
    accent_color: '#06b6d4',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTheme();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTheme = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('realtor_settings')
        .select('primary_color, secondary_color, accent_color')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading theme:', error);
        return;
      }

      if (data) {
        const newTheme = {
          primary_color: data.primary_color || '#3b82f6',
          secondary_color: data.secondary_color || '#1e40af',
          accent_color: data.accent_color || '#06b6d4',
        };
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme: ThemeSettings) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS custom properties
    const primaryHsl = hexToHsl(theme.primary_color);
    const secondaryHsl = hexToHsl(theme.secondary_color);
    const accentHsl = hexToHsl(theme.accent_color);
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', theme.primary_color);
    root.style.setProperty('--color-secondary', theme.secondary_color);
    root.style.setProperty('--color-accent', theme.accent_color);
    
    // Apply HSL values for Tailwind
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--secondary', secondaryHsl);
    root.style.setProperty('--accent', accentHsl);
    
    // Calculate contrast colors
    root.style.setProperty('--primary-foreground', getContrastColor(theme.primary_color));
    root.style.setProperty('--secondary-foreground', getContrastColor(theme.secondary_color));
    root.style.setProperty('--accent-foreground', getContrastColor(theme.accent_color));
  };

  const hexToHsl = (hex: string): string => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const getContrastColor = (hexColor: string): string => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '0 0% 0%' : '0 0% 100%';
  };

  return (
    <ThemeContext.Provider value={{ theme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
