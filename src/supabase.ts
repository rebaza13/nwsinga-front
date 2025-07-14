import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const supabaseUrl = 'https://syhsobpororgvufvaonq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aHNvYnBvcm9yZ3Z1ZnZhb25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjUzMTgsImV4cCI6MjA2NzkwMTMxOH0.bg_57TkKQ2M6iusBuY070p0rbY7ZoBOzxSYXDjOuRM8'

// Create a single supabase client for the whole app
export const supabase = createClient(supabaseUrl, supabaseKey) 