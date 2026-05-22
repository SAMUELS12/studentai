const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' })
  }

  const { messages, model } = req.body

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
    res.status(response.status).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
