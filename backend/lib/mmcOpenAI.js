const axios = require('axios');

const base = process.env.MMC_OPENAI_BASE_URL;
const apiKey = process.env.MMC_OPENAI_API_KEY;

if (!base || !apiKey) {
  throw new Error('MMC_OPENAI_BASE_URL or MMC_OPENAI_API_KEY missing. Check .env');
}

const client = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey, // MMC standard header
  },
  timeout: 30000,
});

async function chatCompletion({ deployment, messages, temperature = 0 }) {
  const url = `/deployments/${deployment}/chat/completions`;
  const { data } = await client.post(url, { messages, temperature });
  // Azure/OpenAI compatible shape
  return data?.choices?.[0]?.message?.content?.trim();
}

async function embedTexts({ deployment, inputs }) {
  const url = `/deployments/${deployment}/embeddings`;
  const { data } = await client.post(url, { input: inputs });
  // returns [{ embedding: number[] }, ...]
  return data?.data?.map(d => d.embedding);
}

module.exports = { chatCompletion, embedTexts };
