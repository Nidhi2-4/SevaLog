import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iibpqavahozriwjtqsne.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpYnBxYXZhaG96cml3anRxc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjY2NzAsImV4cCI6MjA5MDUwMjY3MH0.ka50ktaH7LA7uxcHlbaAlEbfFUQrS3qdTCcTwyfEsfQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
