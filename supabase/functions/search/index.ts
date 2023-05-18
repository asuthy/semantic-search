import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type'
}

serve(async req => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Search query is passed in request payload
    const { query } = await req.json()

    // OpenAI recommends replacing newlines with spaces for best results
    const input = query.replace(/\n/g, ' ')

    console.log(`Search for: ${input}`)
    console.log(Deno.env.get('OPENAI_API_KEY'))

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY') ?? ''
    })
    const openai = new OpenAIApi(configuration)

    // Generate a one-time embedding for the query itself
    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input
    })

    const [{ embedding }] = embeddingResponse.data.data

    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! }
        }
      }
    )

    const { data: documents } = await supabaseClient.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.78, // Choose an appropriate threshold for your data
      match_count: 10 // Choose the number of matches
    })

    return new Response(JSON.stringify(documents), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.log(error)
  }
})
