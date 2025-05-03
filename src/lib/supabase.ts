import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://srnvbjxquenjvoicferz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybnZianhxdWVuanZvaWNmZXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNTgyNDQsImV4cCI6MjA2MTgzNDI0NH0.OUMF4OmZbQh-XyNqYhnsg6zmRX5RaaO9Qtg2cgMVNpY'

export const supabase = createClient(supabaseUrl, supabaseKey)
