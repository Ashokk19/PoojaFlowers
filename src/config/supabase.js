import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xulzddxaldzhabymaupe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bHpkZHhhbGR6aGFieW1hdXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTYwOTEsImV4cCI6MjA3NTQ5MjA5MX0.7_Tvf7BVPThcT27U5Mt4O-u7YxVdAbnHa20z5eft2xA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

