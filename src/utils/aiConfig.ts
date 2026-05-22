const DEV_GROQ_KEY = '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'
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function callAiApi(messages: { role: string; content: string }[]): Promise<string> {
  const isDev = import.meta.env.DEV
  const systemMsg = { role: 'system', content: 'You are a helpful AI study assistant. Answer questions clearly and thoroughly. When appropriate, use examples, analogies, and structured explanations. Adapt your response depth to the user\'s apparent knowledge level.' }

  const body = {
    model: GROQ_MODEL,
    messages: [systemMsg, ...messages],
    temperature: 0.7,
    max_tokens: 1024,
  }

  let res: Response

  if (isDev) {
    res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEV_GROQ_KEY}`,
      },
      body: JSON.stringify(body),
    })
  } else {
    res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: body.messages }),
    })
  }

  if (!res.ok) {
    const err = await res.text().catch(() => 'Unknown error')
    throw new Error(`API error (${res.status}): ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || 'No response generated.'
}
