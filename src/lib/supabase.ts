// Workaround wrapper for Supabase client with fallback values
// This file provides a safety layer when environment variables fail to load
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Fallback values from .env file (for when Vite doesn't load them)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qblrstoeglrvvptortil.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibHJzdG9lZ2xydnZwdG9ydGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzE3MjIsImV4cCI6MjA3Nzc0NzcyMn0.AYauyI1B1KG9X9SKiw0e4WxuQr4fdDysA7p8tBvLvWk';

// Log warning if using fallback values
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('⚠️ VITE_SUPABASE_URL not found in environment, using fallback value');
}
if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn('⚠️ VITE_SUPABASE_PUBLISHABLE_KEY not found in environment, using fallback value');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
