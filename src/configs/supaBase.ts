import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { SUPABASE_ANON_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './envConfig';

dotenv.config();

export const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_ANON_API_KEY!
);

export const supabaseAdmin = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
)