const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GROQ_API_KEY not configured' }) }
  }

  const { messages, model } = JSON.parse(event.body || '{}')

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful AI study assistant. Answer questions clearly and thoroughly. When appropriate, use examples, analogies, and structured explanations. Adapt your response depth to the user\'s apparent knowledge level.' },
          ...(messages || []),
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    const data = await response.json()
    return { statusCode: response.status, body: JSON.stringify(data) }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) }
  }
}
