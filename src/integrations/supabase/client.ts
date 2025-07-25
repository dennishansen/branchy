// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://apvjxxkbubabhbefxcty.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwdmp4eGtidWJhYmhiZWZ4Y3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NDE3MTcsImV4cCI6MjA2NzUxNzcxN30.DQ_rl-btEqNqFo515j8FfsQbyIZT9tggdqQDG-45ffU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});