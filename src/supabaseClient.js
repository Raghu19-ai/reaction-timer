// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project details
const SUPABASE_URL = "https://jpytaydqmzqmzydhssyc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpweXRheWRxbXpxbXp5ZGhzc3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTAzNDcsImV4cCI6MjA3Mzc4NjM0N30.2Lzhh8urZsCOK_NlFJFgiHBZvcsm7w-DvH9MpAS1yzY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
