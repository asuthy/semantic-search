/* eslint-disable import/extensions */
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
dotenv.config()
const supabaseUrl = 'http://host.docker.internal:54321'
const supabaseServiceKey = process.env.SB_SERVICE_KEY

// eslint-disable-next-line import/no-mutable-exports
let supabaseClient

try {
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    db: {
      schema: 'public'
    }
  })
} catch (err) {
  console.error(err)
}

// eslint-disable-next-line import/prefer-default-export
export { supabaseClient }
