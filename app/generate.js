import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import { supabaseClient } from './lib/supabase.js'
dotenv.config()

async function generateEmbeddings() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })
  const openAi = new OpenAIApi(configuration)

  //const documents = await getDocuments(); // Your custom function to load docs

  const documents = [
    'The cat chases the mouse',
    'The kitten hunts rodents',
    'I like ham sandwiches',
    'Sally ate Swiss cheese'
  ]

  // Assuming each document is a string
  for (const document of documents) {
    // OpenAI recommends replacing newlines with spaces for best results
    const input = document.replace(/\n/g, ' ')

    const embeddingResponse = await openAi.createEmbedding({
      model: 'text-embedding-ada-002',
      input
    })

    const [{ embedding }] = embeddingResponse.data.data

    await supabaseClient.from('documents').insert({
      content: document,
      embedding
    })
  }
}

await generateEmbeddings()
