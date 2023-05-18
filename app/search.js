import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
dotenv.config()

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'http://host.docker.internal:54321',
  process.env.SB_ANON_KEY
)

const { data, error } = await supabase.functions.invoke('search', {
  body: { query: process.argv[2] }
})

console.log(data)
