import type { AiProvider } from './ai-provider.js';

/**
 * endpoint of the OpenAI chat completions API.
 */
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * default model used when the aspect does not configure one.
 */
const DEFAULT_MODEL = 'gpt-4o-mini';

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

/**
 * safely parse the JSON payload returned inside a completion message.
 */
function parseJsonContent(content?: string): any {
  if (!content) return undefined;

  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    if (start === -1 || end <= start) return undefined;

    try {
      return JSON.parse(content.slice(start, end + 1));
    } catch {
      return undefined;
    }
  }
}

/**
 * create the OpenAI backed AI provider. It asks the model for structured JSON
 * output matching the schema passed by the assistant, so analyses and replies
 * always come back in a predictable shape. Returns undefined when no
 * OPENAI_API_KEY is configured, in which case the deterministic mock provider
 * takes over and the app keeps working.
 */
export function createOpenAiProvider(model = DEFAULT_MODEL): AiProvider | undefined {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return undefined;

  return {
    name: 'openai',

    complete: async (prompt: string, schema?: object) => {
      const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: schema
            ? {
                type: 'json_schema',
                json_schema: { name: 'assistant_response', strict: false, schema },
              }
            : { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You are the AI assistant of an email client. Always answer with a single JSON object matching the requested schema. Never add prose outside of the JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`openai request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as ChatCompletionResponse;
      const parsed = parseJsonContent(payload.choices?.[0]?.message?.content);
      if (!parsed) throw new Error('openai returned a non JSON response');

      return parsed;
    },
  };
}
